import { statuses } from "@/consts/statuses";
import { urls } from "@/consts/urls";
import { bookmarkCreateRequest, bookmarkRequest, loginData, personalData, ratingRequest, registerData, requestParams, requestParamsData, reviewRequest, patientDeleteRequest, bookmarkChangePrivateRequest,
bookmarkChangeTitleRequest } from "@/types";

let CSRFToken: string | null = null;

export const csrf = async () => {
    if (CSRFToken === null) {
        const headers = {
            "Content-Type": 'application/json',
        }
        const response = await fetch(urls.api.csrf, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-store',
            credentials: 'include',
            headers: headers,
        });
        CSRFToken = response.headers.get('X-Csrf-Token');
    }
};

/**
 * @description Отправляет асинхронный запрос на сервер.
 * @param { object } params Параметры для запроса
 * @returns { object } Статус и обработанный ответ
 */
const sendRequest = async (params: requestParams) => {
    // await csrf();
    let headers = {
        "Content-Type": "application/json",
    };
    if (CSRFToken != null) {
        headers = { ...headers, ...{ "X-CSRF-Token": CSRFToken } };
    }
    const response = await fetch(params.url, {
        method: params.method,
        headers: headers,
        body: params.body,
        mode: "cors",
        credentials: "include",
    });
    try {
        const parsedResponse = await response?.json();
        if (response.status !== statuses.OK && response.status !== statuses.CREATED) {
            console.log("err");
            return null;
        }
        return {
            status: response.status,
            parsedResponse,
        };
    } catch (e) {
        return {
            status: response.status,
        };
    }
};

/**
 * @description Отправляет асинхронный запрос на сервер.
 * @param { object } params Параметры для запроса
 * @returns { object } Статус и обработанный ответ
 */
export const sendRequestAvatar = async (params: requestParamsData) => {
    // await csrf();
    let headers = {};
    if (CSRFToken != null) {
        headers = { ...headers, ...{ "X-CSRF-Token": CSRFToken } };
    }
    const response = await fetch(params.url, {
        method: params.method,
        headers: headers,
        body: params.body,
        mode: "cors",
        credentials: "include",
    });
    try {
        const parsedResponse = await response?.json();
        if (response.status !== statuses.OK && response.status !== statuses.CREATED) {
            console.log("err");
            return null;
        }
        return {
            status: response.status,
            parsedResponse,
        };
    } catch {
        return {
            status: response.status,
        };
    }
};

/**
 * @description Проверяет, авторизован ли пользователь.
 * @returns { object } Ответ с сервера
 */
export const checkAuth = async () => {
    // const params: requestParams = {
    //     url: urls.api.checkAuth,
    //     method: "GET",
    //     credentials: "include",
    //     body: null,
    // };

    try {
        // return await sendRequest(params);
        return {
            status: 200,
            parsedResponse: {
                status: '200',
                ID: '1',
            }
        }
    } catch (error) {
        return null;
    }
};

/**
 * @description Получает данные о текущем пользователе посредством
 * запроса на сервер.
 * @param { string } id ID пользователя
 * @returns { object } Данные о текущем пользователе
 */
export const getCurrentUser = async (id: string) => {
    if (!id) {
        return;
    }
    const params: requestParams = {
        url: urls.api.getUser.concat('/').concat(id),
        method: "GET",
        credentials: "include",
        body: null,
    };
    try {
        return await sendRequest(params);
    } catch (error) {
        return null;
    }
};

/**
 * @description Производит выход пользователя из системы.
 * @returns { object } Ответ с сервера
 */
export const logout = async () => {
    const params: requestParams = {
        url: urls.api.logout,
        method: "POST",
        credentials: null,
        body: null,
    };

    try {
        return await sendRequest(params);
    } catch (error) {
        return null;
    }
};

/**
 * @description Производит авторизацию пользователя в системе.
 * @param { object } user Данные о пользователе
 * @returns { object } Ответ с сервера
 */
export const login = async (user: loginData) => {
    const params: requestParams = {
        url: urls.api.login,
        method: "POST",
        credentials: null,
        body: JSON.stringify(user),
    };

    try {
        return await sendRequest(params);
    } catch (error) {
        return null;
    }
}

/**
 * @description Производит регистрацию пользователя в системе.
 * @param { object } user Данные о пользователе
 * @returns { object } Ответ с сервера
 */
export const register = async (user: registerData) => {
    const params: requestParams = {
        url: urls.api.register,
        method: "POST",
        credentials: null,
        body: JSON.stringify(user),
    };

    try {
        return await sendRequest(params);
    } catch (error) {
        return null;
    }
};

/**
 * @description Получает с сервера данные о палатах.
 * @returns { object } Ответ с сервера
 */
export const getSingleCollection = async () => {
    const params: requestParams = {
        url: `${urls.api.rooms}`,
        method: "GET",
        credentials: null,
        body: null,
    };

    try {
        return await sendRequest(params);
    } catch (error) {
        return null;
    }
}

/**
 * @description Получает с сервера данные о конкретной закладки фильмов.
 * @param { string } bookmarkID ID запрашиваемой закладки
 * @returns { object } Ответ с сервера
 */
export const getSingleBookmark = async (bookmarkID: string) => {
    const params: requestParams = {
        url: `${urls.api.rooms}/${bookmarkID}`,
        method: "GET",
        credentials: null,
        body: null,
    };

    try {
        return await sendRequest(params);
    } catch (error) {
        return null;
    }
}

/**
 * @description Получает с сервера данные о конкретной подборке фильмов.
 * @param { string } movieID ID запрашиваемой подборки
 * @returns { object } Ответ с сервера
 */
export const getMovie = async (movieID: string) => {
    const params: requestParams = {
        url: `${urls.api.patient}/${movieID}`,
        method: "GET",
        credentials: null,
        body: null,
    };

    try {
        return await sendRequest(params);
    } catch (error) {
        return null;
    }
}

/**
 * @description Отправляет оценку фильма пользователем на сервер.
 * @param { string } rating Данные о рейтинге
 * @returns { object } Ответ с сервера
 */
export const sendUserRating = async (rating: ratingRequest) => {
    const params: requestParams = {
        url: `${urls.api.sendRating}`,
        method: "POST",
        credentials: null,
        body: JSON.stringify(rating),
    };

    try {
        return await sendRequest(params);
    } catch (error) {
        return null;
    }
};

/**
 * @description Отправляет оценку фильма пользователем на сервер.
 * @param { string } movieID Данные о пользователе
 * @param { number } rating Оставленная оценка
 * @returns { object } Ответ с сервера
 */
export const sendUserReview = async (review: reviewRequest) => {
    const params: requestParams = {
        url: `${urls.api.sendReviews}`,
        method: "POST",
        credentials: null,
        body: JSON.stringify(review),
    };

    try {
        return await sendRequest(params);
    } catch (error) {
        return null;
    }
};

/**
 * @description Получает с сервера данные о пользователе.
 * @param { string } id ID запрашиваемого пользователя
 * @returns { object } Ответ с сервера
 */
export const getProfile = async (id: string) => {
    if (!id) {
        return;
    }
    const params: requestParams = {
        url: `${urls.api.getUser}/${id}`,
        method: "GET",
        credentials: "include",
        body: null,
    };
    try {
        return await sendRequest(params);
    } catch (error) {
        return null;
    }
}

/**
 * @description Получает с сервера данные о пациентах врача.
 * @param { string } id ID врача
 * @returns { object } Ответ с сервера
 */
export const getPatients = async (id: string) => {
    const params: requestParams = {
        url: `${urls.api.patients}`,
        method: "GET",
        credentials: "include",
        body: null,
    };

    try {
        return await sendRequest(params);
    } catch (error) {
        return null;
    }
}

/**
 * @description Получает с сервера данные о оценках и отзывах пользователя.
 * @param { string } id ID запрашиваемого пользователя
 * @returns { object } Ответ с сервера
 */
export const getTreatments = async () => {
    const params: requestParams = {
        url: `${urls.api.treatments}`,
        method: "GET",
        credentials: "include",
        body: null,
    };

    try {
        return await sendRequest(params);
    } catch (error) {
        return null;
    }
}

/**
 * @description Отправляет обновленные данные пользователя на сервер.
 * @param { string } userID ID пользователя
 * @param { object } personalData Новые данные
 * @returns { object } Ответ с сервера
 */
export const sendSettingsChanges = async (personalData: personalData, userID: string) => {
    const params: requestParams = {
        url: `${urls.api.changeProfile}/${userID}`,
        method: "POST",
        credentials: null,
        body: JSON.stringify(personalData),
    };

    try {
        return await sendRequest(params);
    } catch (error) {
        return null;
    }
}

/**
 * @description Отправляет обновленные данные пользователя на сервер.
 * @param { object } formData Новые данные
 * @returns { object } Ответ с сервера
 */
export const sendAvatar = async (formData: FormData, userID: string) => {
    const params: requestParamsData = {
        url: `${urls.api.changeAvatar}/${userID}`,
        method: "POST",
        credentials: null,
        body: formData,
    };

    try {
        return await sendRequestAvatar(params);
    } catch (error) {
        return null;
    }
}

/**
 * @description Получает с сервера данные о конкретной подборке фильмов.
 * @param { string } doctorID ID запрашиваемой подборки
 * @returns { object } Ответ с сервера
 */
export const getDoctor = async (doctorID: string) => {
    const params: requestParams = {
        url: `${urls.api.doctor}/${doctorID}`,
        method: "GET",
        credentials: null,
        body: null,
    };

    try {
        return await sendRequest(params);
    } catch (error) {
        return null;
    }
};

export const addMovieToBookmark = async (bookmarkRequest: bookmarkRequest) => {
    const params: requestParams = {
        url: `${urls.api.addMovieToBookmark}`,
        method: "POST",
        credentials: null,
        body: JSON.stringify(bookmarkRequest),
    };

    try {
        return await sendRequest(params);
    } catch (error) {
        return null;
    }
};

export const removeMovieFromBookmark = async (bookmarkRequest: bookmarkRequest) => {
    const params: requestParams = {
        url: `${urls.api.removeMovieFromBookmark}`,
        method: "POST",
        credentials: null,
        body: JSON.stringify(bookmarkRequest),
    };

    try {
        return await sendRequest(params);
    } catch (error) {
        return null;
    }
};

export const createPatient = async (bookmarkCreateRequest: bookmarkCreateRequest) => {
    const params: requestParams = {
        url: `${urls.api.createPatient}`,
        method: "POST",
        credentials: null,
        body: JSON.stringify(bookmarkCreateRequest),
    };

    try {
        return await sendRequest(params);
    } catch (error) {
        return null;
    }
};

export const deletePatient = async (patientDeleteRequest: patientDeleteRequest) => {
    const params: requestParams = {
        url: `${urls.api.deletePatient}/${patientDeleteRequest.patientId}`,
        method: "DELETE",
        credentials: null,
        body: JSON.stringify(patientDeleteRequest),
    };

    try {
        return await sendRequest(params);
    } catch (error) {
        return null;
    }
};
export const changePrivateSettings = async (bookmarkChangePrivateRequest: bookmarkChangePrivateRequest) => {
    const params: requestParams = {
        url: `${urls.api.changePrivateSettings}`,
        method: "POST",
        credentials: null,
        body: JSON.stringify(bookmarkChangePrivateRequest),
    };

    try {
        return await sendRequest(params);
    } catch (error) {
        return null;
    }
};

export const changeTitle = async (bookmarkChangeTitleRequest: bookmarkChangeTitleRequest) => {
    const params: requestParams = {
        url: `${urls.api.changeTitleSettings}`,
        method: "POST",
        credentials: null,
        body: JSON.stringify(bookmarkChangeTitleRequest),
    };

    try {
        return await sendRequest(params);
    } catch (error) {
        return null;
    }
};

/**
 * @description Получает с сервера данные о подборках фильмов.
 * @returns { object } Ответ с сервера
 */
export const getGenres = async () => {
    const params: requestParams = {
        url: `${urls.api.genres}`,
        method: "GET",
        credentials: null,
        body: null,
    };

    try {
        return await sendRequest(params);
    } catch (error) {
        return null;
    }
}

export const getDoctors = async () => {
    const params: requestParams = {
        url: `${urls.api.doctors}`,
        method: "GET",
        credentials: null,
        body: null,
    };

    try {
        return await sendRequest(params);
    } catch (error) {
        return null;
    }
}

export const getPremiers = async () => {
    const params: requestParams = {
        url: `${urls.api.premiers}`,
        method: "GET",
        credentials: null,
        body: null,
    };

    try {
        return await sendRequest(params);
    } catch (error) {
        return null;
    }
}

export const getAnnounced = async (movieID: string) => {
    const params: requestParams = {
        url: `${urls.api.announced}/${movieID}`,
        method: "GET",
        credentials: null,
        body: null,
    };

    try {
        return await sendRequest(params);
    } catch (error) {
        return null;
    }
}

export const getSearch = async (query: string) => {
    const params: requestParams = {
        url: `${urls.api.search}/${query}`,
        method: "GET",
        credentials: null,
        body: null,
    };

    try {
        return await sendRequest(params);
    } catch (error) {
        return null;
    }
}
