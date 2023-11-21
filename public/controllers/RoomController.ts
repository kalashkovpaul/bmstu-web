import { BaseController } from "./BaseController";
import { RoomView } from "@/views/RoomView/RoomView";
import { RoomModel } from "@/models/RoomModel";
import { events } from "@/consts/events";

/**
 * @description Класс контроллера страницы одной подборки.
 */
export class RoomController extends BaseController {

    public model: RoomModel;
    public view: RoomView;

    constructor() {
        super()
        this.model = new RoomModel(this.eventBus);
        this.view = new RoomView(this.eventBus);
        this.events.push(
            {
                event: events.singleCollectionPage.getContent,
                handler: this.model.getContent,
            },
            {
                event: events.singleCollectionPage.render.content,
                handler: this.view.renderContent,
            }
        );
        this.subscribe();
    }
}
