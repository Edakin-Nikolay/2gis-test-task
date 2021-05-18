import {Book, Status, Tag} from "../book/models";

export interface App {
    books: Array<Book>,
    activeTab: Status,
    tags: Array<Tag>,
    booksCount: number,
}

export enum QueryFields {
    Tab = "tab",
    Tags = "tags",
}
