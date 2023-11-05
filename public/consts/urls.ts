import { urlsList } from "../types";

// eslint-disable-next-line no-unused-vars
const localUrl = "http://localhost";

// eslint-disable-next-line no-unused-vars
export const deployUrl = "https://park-akino.ru";

export const currentUrl = localUrl;

const version = "/api/v1";

export const urls: urlsList = {
    api: {
        csrf: `${currentUrl}${version}/csrf`,
        checkAuth: `${currentUrl}${version}/authcheck`,
        getUser: `${currentUrl}${version}/doctors`,
        changeProfile:`${currentUrl}${version}/user/update`,
        changeAvatar:`${currentUrl}${version}/user/update/avatar`,
        changePrivateSettings: `${currentUrl}${version}/playlist/alterPublic`,
        changeTitleSettings: `${currentUrl}${version}/playlist/changeTitle`,
        patients: `${currentUrl}${version}/patients`,
        reviews: `${currentUrl}${version}/user/reviews`,
        logout: `${currentUrl}${version}/logout`,
        login: `${currentUrl}${version}/login`,
        register: `${currentUrl}${version}/signup`,
        singleBookmark: `${currentUrl}${version}/collections`,
        singleCollection: `${currentUrl}${version}/collections`,
        collections: `${currentUrl}${version}/collections/feed`,
        patient: `${currentUrl}${version}/patients`,
        actor: `${currentUrl}${version}/actors`,
        sendRating: `${currentUrl}${version}/ratings/set`,
        sendReviews: `${currentUrl}${version}/comments/set`,
        addMovieToBookmark: `${currentUrl}${version}/playlist/addMovie`,
        removeMovieFromBookmark: `${currentUrl}${version}/playlist/deleteMovie`,
        deleteBookmark: `${currentUrl}${version}/playlist/deletePlaylist`,
        createPatient: `${currentUrl}${version}/patients`,
        genres: `${currentUrl}${version}/genres`,
        doctors: `${currentUrl}${version}/doctors`,
        premiers: `${currentUrl}${version}/announced`,
        announced: `${currentUrl}${version}/announced`,
        search: `${currentUrl}${version}/search`,
    }
}
