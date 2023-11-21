import EventBus from "@/modules/eventBus";
import { bookmarkCreateRequest, bookmarkRequest, bookmarkResponse, patient, ratingRequest, ratingResponse, reviewRequest, reviewResponse, treatment } from "@/types";
import { events } from "../consts/events";
import { statuses } from "../consts/statuses";
import { authModule } from "../modules/auth";
import { addMovieToBookmark, createPatient, deletePatient, getMovie as getPatient, getTreatments, removeMovieFromBookmark, sendUserRating, sendUserReview } from "../modules/connection";
import { BaseModel } from "./BaseModel";

/**
 * @description Класс модели страницы одного фильма.
 */
export class MovieModel extends BaseModel {
    /**
     * @description Создаёт модель страницы одного фильма.
     * @param { EventBus } eventBus Глобальная шина событий
     */
    constructor(eventBus: EventBus) {
        super(eventBus);
    }

    /**
     * @description Получает информацию для контента страницы
     * одного фильма.
     * @param { object } patient Информация о подборке:
     * название, ID, похожие фильмы...
     */
    getContent = (patient: patient) => {
        if (!patient?.Id) {
            this.eventBus.emit(events.app.errorPage);
            return;
        }
        getPatient(patient.Id)
        .then((response) => {
            getTreatments()
            .then((treatments) => {
                console.log(treatments);
                if (!response || !response.status) {
                    this.eventBus.emit(events.app.errorPage);
                } else if (response.status === statuses.OK && response.parsedResponse) {
                    this.eventBus.emit(events.patientPage.render.content, {
                        ...response.parsedResponse,
                        treatments: (treatments?.parsedResponse as Array<treatment>)
                            .filter((element: treatment) => {return `${element.PatientNumber}` == patient.Id})
                            .map((element: treatment) => {
                                return {
                                    ...element,
                                    Tablets: `Лекарства: ${element.Tablets}`,
                                    UpdateAt: `${Intl.DateTimeFormat('ru-RU').format(new Date(element.UpdateAt))}`,
                                    Survey: `Опрос: ${element.Survey}`,
                                    PsychologicalTreatment: `Вывод: ${element.PsychologicalTreatment}`
                                }
                            }),
                    });
                }
                if (response?.status === statuses.NOT_FOUND) {
                    this.eventBus.emit(events.app.errorPageText, "Такого фильма нет :/");
                }
            })
            .catch((e) => {console.log(e);});
        }).catch((e) => {
            console.log("Unexpected error: ", e);
        });
    }

    deletePatient = (patientId: string) => {
        deletePatient({patientId: patientId})
        .then((response) => {

        }).catch((e) => {
            console.log("Unexpected error: ", e);
        });
    }

    /**
     * @description Проверяет, авторизован пользователь или нет, если авторизован,
     * то отправляет оценку пользователя на сервер.
     * @param { string } movieID ID текущего фильма
     * @param { number } rating Оценка пользователя
     */
    sendRating = (movieID: string, rating: string) => {
        if (!movieID || !rating) {
            this.eventBus.emit(events.app.errorPage);
            return;
        }
        if (!authModule.user) {
            this.eventBus.emit(events.patientPage.askToLog, movieID);
            return;
        }
        const request: ratingRequest = {
            rating: rating,
            movieId: movieID,
            userId: authModule.user.Id.toString(),
        }
        sendUserRating(request).then(
            (response) => {
                if (!response) { return; }
                const parsed = <ratingResponse> response.parsedResponse;
                if (response.status == statuses.OK) {
                    this.eventBus.emit(
                        events.patientPage.ratingSuccess,
                        rating,
                        parsed.newrating
                    );
                }
            }
        ).catch((e) => {
            console.log("Unexpected error: ", e);
        });
    }

    sendReview = (inputsData: reviewRequest) => {
        sendUserReview(inputsData).then(
            (response) => {
                if (!response) { return; }
                const parsed = <reviewResponse> response.parsedResponse;
                console.log(parsed);
                if (response.status == statuses.OK) {
                    this.eventBus.emit(events.patientPage.reviewSuccess, parsed);
                }
            }
        ).catch((e) => {
            console.log("Unexpected review error: ", e);
        });
    }

    addCollection = (inputsData: bookmarkRequest) => {
        addMovieToBookmark(inputsData).catch((e) => {
            console.log("Unexpected error: ", e);
        });
    }

    removeCollection = (inputsData: bookmarkRequest) => {
        removeMovieFromBookmark(inputsData).catch((e) => {
            console.log("Unexpected error: ", e);
        });
    }

    createCollection = (inputsData: bookmarkCreateRequest) => {
        createPatient(inputsData).then(
            (response) => {
                if (!response) { return; }
                const parsed = <bookmarkResponse> response.parsedResponse;
                if (response.status == statuses.CREATED) {
                    this.eventBus.emit(events.patientPage.createCollectionSuccess, parsed.ID, parsed.title);
                }
            }
        ).catch((e) => {
            console.log("Unexpected review error: ", e);
        });
    }
}
