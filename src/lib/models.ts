import {ReactElement} from "react";

export type BookId = String;
type Author = String;
type Title = String;
type Description = String;
export type Tag = String;
type Label = String;
export type ButtonLabel = ReactElement;

export enum Status {
    ToRead = "toread",
    InProgress = "inprogress",
    Done = "done",
}

export enum QueryFields {
    Tab = "tab",
    Tags = "tags",
}

export interface Book {
    id: BookId,
    author: Author,
    title: Title,
    description: Description,
    tags: Array<Tag>,
    status: Status,
}

export interface Tab {
    status: Status,
    tabLabel: Label,
    buttonLabel: ButtonLabel,
    nextStatus: Status,
}

export interface Main {
    books: Array<Book>,
    activeTab: Status,
    tags: Array<Tag>,
    booksCount: number,
}

export interface LocalStorageBook {
    id: BookId,
    status: Status,
}

export function updateFields<T>(oldObj: T, newObj: object): T{
    return Object.assign({}, oldObj, newObj);
}