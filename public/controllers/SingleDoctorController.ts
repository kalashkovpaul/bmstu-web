import { events } from "@/consts/events";
import { DoctorView } from "@/views/SingleDoctorView/SingleDoctorView";
import { SingleDoctorModel } from "@/models/SingleDoctorModel";
import { BaseController } from "./BaseController";

/**
 * @description Класс контроллера страницы доктора.
 */
export class SingleDoctorController extends BaseController {

    public model: SingleDoctorModel;
    public view: DoctorView;

    constructor() {
        super()
        this.model = new SingleDoctorModel(this.eventBus);
        this.view = new DoctorView(this.eventBus);
        this.events.push(
            {
                event: events.doctorPage.getContent,
                handler: this.model.getContent,
            },
            {
                event: events.doctorPage.render.content,
                handler: this.view.renderContent,
            },
            {
                event: events.doctorPage.render.page,
                handler: this.view.render,
            },
        );
    }
}