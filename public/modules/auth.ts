import { events } from "@/consts/events";
import { statuses } from "@/consts/statuses";
import EventBus from "./eventBus";
import { eventBus } from "./eventBus";
import { checkAuth, getCurrentUser, logout } from "./connection";
import { authcheckResponse, userData } from "@/types";

/**
 * @description Класс авторизации
 */
class Auth {
    private eventBus: EventBus;
    public user: userData | null; // TSTODO ?
    private lastEvent: string | null;
    /**
     * @description Создаёт модуль авторизации.
     * @param { eventBus } Глобальная шина событий
     */
    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.user = null;
        this.lastEvent = null;
        if (navigator.onLine) {
            this.getUserFromServer().catch((e) => {
                console.log("Unexpected auth error: ", e);
            });
        }


        this.eventBus.on(events.authPage.logRegSuccess, this.getUserFromSubmit);
        this.eventBus.on(events.header.logout, this.logoutUser);
        this.eventBus.on(events.profilePage.render.changedProfile, this.changeUser);
    }

    /**
     * @description Получает данные о пользователе с сервера,
     * запоминает. В случае успеха перенаправляет на следующую
     * страницу.
     */
    getUserFromServer = async () => {
        try {
            const responseCheckAuth = await checkAuth();
            if (!responseCheckAuth) {
                return null;
            }
            const parsed = <authcheckResponse>responseCheckAuth.parsedResponse;
            if (+parsed.status !== statuses.OK && !parsed.ID) {
                window.localStorage.removeItem("user");
                this.eventBus.emit(events.auth.notLoggedIn);
                this.lastEvent = events.auth.notLoggedIn;
                return null;
            }
            const responseCurrentUser = await getCurrentUser(parsed.ID);
            if (!responseCurrentUser) {
                return;
            }
            if (responseCurrentUser?.status === statuses.OK) {
                this.user = <userData>responseCurrentUser.parsedResponse;
                if (this.user) {
                    window.localStorage.setItem("user", JSON.stringify(this.user));
                    this.eventBus.emit(events.auth.gotUser);
                    this.lastEvent = events.auth.gotUser;
                }
            }
        } catch (err) {
            this.eventBus.emit(events.app.errorPage);
        }
    };

    /**
     * @description Обрабатывает и записывает данные о пользователе,
     * полученные из обработанного ответа с сервера.
     * @param { object } parsedResponse Обработанный ответ с сервера
     */
    getUserFromSubmit = (parsedResponse: userData) => {
        if (!parsedResponse) {
            return;
        }
        this.user = parsedResponse;
        if (this.user) {
            window.localStorage.setItem("user", JSON.stringify(this.user));
            this.eventBus.emit(events.auth.gotUser);
            this.lastEvent = events.auth.gotUser;
        }
    };

    /**
     * @description Осуществляет выход пользователя из системы.
     */
    logoutUser = () => {
        logout().then((response) => {
            if (!response) {
                this.eventBus.emit(events.app.errorPage);
            } else if (response.status === statuses.OK) {
                window.localStorage.removeItem("user");
                this.user = null;
                this.lastEvent = events.header.logout;
            }
        }).catch(() => {
            this.eventBus.emit(events.app.errorPage);
        });
        window.location.href = 'http://localhost:3000';
    };

    /**
     * @description Заменяет данные о пользователе.
     * @param { string } user Новые данные о пользователе.
     */
    changeUser = (user: userData) => {
        if (!user) {
            return;
        }
        this.user = user;
        window.localStorage.setItem("user", JSON.stringify(this.user));
        this.eventBus.emit(events.auth.changedUser);
    };
}

export const authModule = new Auth(eventBus);
