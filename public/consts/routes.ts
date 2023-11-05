import { routeList } from "@/types"

export const routes: routeList = {
    homePage: "/",
    collectionsPage: "/collections",
    singleBookmarkPage: "/bookmarks/\\d+",
    singleCollectionPage: "/collections/\\d+",
    profilePage: "/profile",
    loginPage: "/login",
    registrationPage: "/register",
    patientPage: "/movies/\\d+",
    actorPage: "/actor/\\d+",
    genresPage: "/genres",
    doctorsPage: "/doctors/",
    premiersPage: "/permiers",
    announcedPage: "/announced/\\d+",
    search: '/search',
}

export const regularRoutes: routeList = {
    homePage: "^/$",
    collectionsPage: "^/collections$",
    singleBookmarkPage:"^/bookmarks/\\d+$",
    singleCollectionPage:"^/collections/\\d+$",
    profilePage:"^/profile/\\d+$",
    loginPage:  "^/login",
    registrationPage: "^/register",
    patientPage:"^/patients/\\d+$",
    actorPage: "^/actors/\\d+$",
    genresPage: "^/genres$",
    doctorsPage: "^/doctors",
    premiersPage: "^/premiers$",
    announcedPage: "^/announced/\\d+$",
    search: '^/search/',
}
