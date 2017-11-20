export interface IArea {
    enter(): void;
    leave(): void;
    process(data: any): void;
}
