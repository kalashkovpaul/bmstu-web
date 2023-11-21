import { events } from "../consts/events";
import { getDoctor, getDoctors } from "../modules/connection";
import { statuses } from "../consts/statuses";
import { BaseModel } from "./BaseModel";
import EventBus from "@/modules/eventBus";
import { doctorData } from "@/types";

/**
 * @description Класс модели страницы доктора.
 */
export class SingleDoctorModel extends BaseModel {
    /**
     * @description Создаёт модель страницы доктора.
     * @param { EventBus } eventBus Глобальная шина событий
     */
    constructor(eventBus: EventBus) {
        super(eventBus);
    }

    /**
     * @description Получает информацию для контента страницы
     * доктора.
     * @param { object } doctor Информация об докторе:
     * имя, ID, ...
     */
    getContent = (doctor: doctorData) => {
        if (!doctor?.Id) {
            this.eventBus.emit(events.app.errorPage);
            return;
        }
        getDoctor(doctor.Id)
        .then((response) => {
            getDoctors().then(
                (doctors) => {
                    if (!doctors) {
                        this.eventBus.emit(events.app.errorPage);
                    } else if (!response || !response.status) {
                        this.eventBus.emit(events.app.errorPage);
                    } else if (response.status === statuses.OK && response.parsedResponse) {
                        this.eventBus.emit(events.doctorPage.render.content, {
                            ...response.parsedResponse,
                            related: doctors.parsedResponse.filter(
                                (doctor: any) => doctor.Id != response.parsedResponse.Id && doctor.Speciality === response.parsedResponse.Speciality)
                        });
                    }
                }
            ).catch((e) => {
                console.log("Unexpected singleGenreModel error: ", e);
            });

        })
        .catch((e) => {
            console.log("Unexpected error: ", e);
        });
    }
}