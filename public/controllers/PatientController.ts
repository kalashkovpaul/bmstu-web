import { events } from "@/consts/events";
import { MovieModel } from "@/models/PatientModel";
import { PatientView } from "@/views/PatientView/PatientView";
import { BaseController } from "./BaseController";

/**
 * @description Класс контроллера страницы одного фильма.
 */
export class PatientController extends BaseController {
    public model: MovieModel;
    public view: PatientView;

    constructor() {
        super()
        this.model = new MovieModel(this.eventBus);
        this.view = new PatientView(this.eventBus);
        this.events.push(
            {
                event: events.patientPage.getContent,
                handler: this.model.getContent,
            },
            {
                event: events.patientPage.askToLog,
                handler: this.view.askToLog
            },
            {
                event: events.patientPage.sendRating,
                handler: this.model.sendRating,
            },
            {
                event: events.patientPage.ratingSuccess,
                handler: this.view.onRatingSuccess,
            },
            {
                event: events.patientPage.sendReview,
                handler: this.model.sendReview,
            },
            {
                event: events.patientPage.render.content,
                handler: this.view.renderContent,
            },
            {
                event: events.patientPage.render.page,
                handler: this.view.render,
            },
            {
                event: events.patientPage.reviewSuccess,
                handler: this.view.renderReviewSuccess,
            },
            {
                event: events.patientPage.addCollection,
                handler: this.model.addCollection,
            },
            {
                event: events.patientPage.removeCollection,
                handler: this.model.removeCollection,
            },
            {
                event: events.patientPage.createCollection,
                handler: this.model.createCollection,
            },
            {
                event: events.patientPage.createCollectionSuccess,
                handler: this.view.onCreateCollectionSuccess
            },
            {
                event: events.header.logout,
                handler: this.view.onLogout,
            },
            {
                event: events.auth.gotUser,
                handler: this.view.onGotUser,
            },
        );
        this.subscribe();
    }
}
