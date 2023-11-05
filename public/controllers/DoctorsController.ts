import { BaseController } from "./BaseController";
import { DoctorsView } from "@/views/DoctorsView/DoctorsView";
import { DoctorsModel } from "@/models/DoctorsModel";
import { events } from "@/consts/events";

/**
 * @description Класс контроллера страницы одной подборки.
 */
export class DoctorsController extends BaseController {

    public model: DoctorsModel;
    public view: DoctorsView;

    constructor() {
        super()
        this.model = new DoctorsModel(this.eventBus);
        this.view = new DoctorsView(this.eventBus);
        this.events.push(
            {
                event: events.doctorsPage.getContent,
                handler: this.model.getContent,
            },
            {
                event: events.doctorsPage.render.content,
                handler: this.view.renderContent,
            }
        );
        this.subscribe();
    }
}