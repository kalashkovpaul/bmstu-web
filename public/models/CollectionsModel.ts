import EventBus from "@/modules/eventBus";
import { events } from "../consts/events";
import { BaseModel } from "./BaseModel";

/**
 * @description Класс модели подборок фильмов.
 */
export class CollectionsModel extends BaseModel {
    /**
     * @description Создаёт экземляр модели подборок фильмов.
     * @param { EventBus } eventBus Глобальная шина событий
     */
    constructor(eventBus: EventBus) {
        super(eventBus);
    }

    /**
     * @description Получает информацию для контента страницы
     * подборок.
     */
    getContent = () => {
        this.eventBus.emit(
            events.collectionsPage.render.content
        );
    }
}
