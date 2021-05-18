export type BookId = String;
type Author = String;
type Title = String;
type Description = String;
export type Tag = String;

export enum Status {
    ToRead = "toread",
    InProgress = "inprogress",
    Done = "done",
}

export interface Book {
    id: BookId,
    author: Author,
    title: Title,
    description: Description,
    tags: Array<Tag>,
    status: Status,
}

export interface LocalStorageBook {
    id: BookId,
    status: Status,
}
