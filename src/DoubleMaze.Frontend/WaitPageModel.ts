declare interface WaitPageModel {
    online_count: number,
    bots: {
        name: string,
        rating: number
    }[]
}