declare interface WelcomePageModel {
    ratings: {
        place: number,
        name: string,
        rating: string,
        isCurrent: boolean
    }[]
}