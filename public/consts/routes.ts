import { routeList } from "@/types"

export const routes: routeList = {
    homePage: "/",
    collectionsPage: "/collections",
    singleBookmarkPage: "/bookmarks/\\d+",
    rooms: "/collections/\\d+",
    profilePage: "/profile",
    loginPage: "/login",
    registrationPage: "/register",
    patientPage: "/movies/\\d+",
    singleDoctorPage: "/actor/\\d+",
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
    rooms:"^/rooms",
    profilePage:"^/profile/\\d+$",
    loginPage:  "^/login",
    registrationPage: "^/register",
    patientPage:"^/patients/\\d+$",
    singleDoctorPage: "^/doctors/\\d+$",
    genresPage: "^/genres$",
    doctorsPage: "^/doctors",
    premiersPage: "^/premiers$",
    announcedPage: "^/announced/\\d+$",
    search: '^/search/',
}
