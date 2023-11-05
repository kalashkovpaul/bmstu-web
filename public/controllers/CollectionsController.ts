import { BaseController } from "./BaseController";
import { events } from "../consts/events";
import {CollectionsModel} from "@/models/CollectionsModel"
import {MainPageView} from "../views/MainPageView/MainPageView"

/**
 * @description Класс контроллера страницы подборок
 */
 export class CollectionsController extends BaseController {
    public model: CollectionsModel;
    public view: MainPageView;

    constructor() {
        super()
        this.model = new CollectionsModel(this.eventBus);
        this.view = new MainPageView(this.eventBus);
        this.events.push(
            {
                event: events.collectionsPage.getContent,
                handler: this.model.getContent,
            },
            {
                event: events.collectionsPage.render.content,
                handler: this.view.renderContent,
            }
        );
        this.subscribe();
    }
}
