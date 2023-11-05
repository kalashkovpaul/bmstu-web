export const events = {
    pathChanged: "pathChanged",
    redirectBack: "redirectBack",
    redirectForward: "redirectForward",

    app: {
        start: "app:start",
        errorPage: "app:errorPage",
        noAccess: "app:noAccess",
        errorPageText: "app:errorPageText",
    },
    router: {
        go: "router:go",
    },
    header: {
        render: {
            content: "header:renderContent",
            header: "header:renderHeader",
        },
        changeActiveButton: "header:changeActiveButton",
        logout: "header:logout",
    },
    auth: {
        notLoggedIn: "auth:notLoggedIn",
        gotUser: "auth:gotUser",
        changedUser: "auth:changedUser",
    },

    authPage: {
        render: {
            page: "authPage:renderPage",
            content: "authPage:renderContent",
        },
        getContent: "authPage:getContent",
        redirect: "authPage:redirect",
        logRegSuccess: "authPage:logRegSuccess",
        validate: "authPage:validate",
        submitLogin: "authPage:submitLogin",
        submitRegister: "authPage:submitRegister",
        submitError: "authPage:submitError",
        wrongInput: "authPage:wrongInput",
        deleteValidationError: "authPage:deleteValidationError",
        addValidationError: "authPage:addValidationError",
        deleteAllErrors: "authPage:deleteAllErrors",
    },

    collectionsPage: {
        render: {
            content: "collectionsPage:renderContent",
        },
        getContent: "collectionsPage:getContent",
    },

    singleCollectionPage: {
        render: {
            content: "singleCollectionPage:renderContent",
        },
        getContent: "singleCollectionPage:getContent",
    },

    singleBookmarkPage: {
        render: {
            content: "singleBookmarkPage:renderContent",
        },
        getContent: "singleBookmarkPage:getContent",
        showNotify: "singleBookmarkPage:notify",
        changePrivate: "signleBookmarkPage:changePrivate",
        changeTitle: "singleBookmarkPage:changeTitle",
        setTitle: "singleBookmarkPage:setTitle",
        delete: {
            bookmark: "singleBookmarkPage:deleteBookmark",
            movie: "singleBookmarkPage:deleteMovie",
        }

    },

    patientPage: {
        render: {
            content: "patientPage:renderContent",
            page: "patientPage:renderPage",
        },
        getContent: "patientPage:getContent",
        sendReview: "patientPage:sendReview",
        sendRating: "patientPage:sendRating",
        ratingSuccess: "patientPage:ratingSuccess",
        reviewSuccess: "patientPage:reviewSuccess",
        addCollection: "patientPage:addCollection",
        removeCollection: "patientPage:removeCollection",
        createCollection: "patientPage:createCollection",
        askToLog: "patientPage:askToLog",
        createCollectionSuccess: "patientPage:createCollectionSuccess",
    },

    actorPage: {
        render: {
            content: "actorPage:renderContent",
            page: "actorPage:renderPage",
        },
        getContent: "actorPage:getContent",
        getJobContent: "actorPage:getJobContent",
    },

    profilePage: {
        render: {
            content: "profilePage:renderContent",
            bookmarks: "profilePage:renderBookmarks",
            reviews: "profilePage:renderReviews",
            profileInfo: "profilePage:renderProfileInfo",
            changedProfile: "profilePage:renderChangedProfile",
            newBookmark: "profilePage:renderNewBookmark",
        },
        getContent: "profilePage:getContent",
        getReviews: "profilePage:getReviews",
        getBookmarks: "profilePage:getBookmarks",
        getProfileInfo: "profilePage:getProfileInfo",

        sendChanges: "profilePage:sendSettingsChanges",
        createBookmark: "profilePage:createBookmark",
        sendAvatar: "profilePage:sendAvatarChanges",

        validate: "profilePage:validate",
        addValidationError: "profilePage:addValidationError",
        deleteValidationError: "profilePage:deleteValidationError",
        onSuccessSubmit: "profilePage:successSumbit",
        onGotUser: "profilePage:onGotUser",
    },

    genresPage: {
        render: {
            content: "genresPage:renderContent",
        },
        getContent: "genresPage:getContent",
    },

    doctorsPage: {
        render: {
            content: "doctorsPage:renderContent",
        },
        getContent: "doctorsPage:getContent",
    },

    premiersPage: {
        render: {
            content: "premiersPage:renderContent",
        },
        getContent: "premiersPage:getContent",
    },

    announcedPage: {
        render: {
            content: "announcedPage:renderContent",
            page: "announcedPage:renderPage",
        },
        getContent: "announcedPage:getContent",
    },

    searchPage: {
        render: {
            content: "searchPage:renderContent",
            films: "searchPage:renderFilms",
            persons: "searchPage:renderPersons",
            emptyPage: "searchPage:renderEmptyPage",
        },
        getContent: "searchPage:getContent",
    }
};
