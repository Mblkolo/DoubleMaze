declare interface WaitPageModel {
    online_count: number,
    bots: {
        id: string,
        name: string,
        rating: number,
        isAwaible: boolean
    }[]
}