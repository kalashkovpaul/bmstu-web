import EventBus from "@/modules/eventBus";
import { bookmarkCreateRequest, bookmarkRequest, bookmarkResponse, patient, moviePageData, ratingRequest, ratingResponse, reviewRequest, reviewResponse } from "@/types";
import { events } from "../consts/events";
import { statuses } from "../consts/statuses";
import { authModule } from "../modules/auth";
import { addMovieToBookmark, createBookmark, getMovie as getPatient, removeMovieFromBookmark, sendUserRating, sendUserReview } from "../modules/connection";
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
            if (!response || !response.status) {
                this.eventBus.emit(events.app.errorPage);
            } else if (response.status === statuses.OK && response.parsedResponse) {
                const parsed = response.parsedResponse as moviePageData;
                this.eventBus.emit(events.patientPage.render.content, response.parsedResponse);
            }
            if (response?.status === statuses.NOT_FOUND) {
                this.eventBus.emit(events.app.errorPageText, "Такого фильма нет :/");
            }
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
                if (response.status == statuses.OK) {
                    this.eventBus.emit(events.patientPage.reviewSuccess, parsed.review);
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
        createBookmark(inputsData).then(
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
