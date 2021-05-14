type BookId = String;
type Author = String;
type Title = String;
type Description = String;
type Tag = String;

export type TabId = "toRead" | "inProgress" | "done";

export class Book {
    id: BookId;
    author: Author;
    title: Title;
    description: Description;
    tags: Array<Tag>;

    constructor(
        id: BookId,
        author: Author,
        title: Title,
        description: Description,
        tags: Array<Tag>,
    ) {
       this.id = id;
       this.author = author;
       this.title = title;
       this.description = description;
       this.tags = tags;
    };
}

export class TabModel {
    bookIds: Array<BookId> | null;
    filteredTags: Array<Tag> | null;
    constructor(
        bookIds: Array<BookId> | null,
        filteredTags: Array<Tag> | null,
    ) {
        this.bookIds = bookIds;
        this.filteredTags = filteredTags;
    };
}

export class MainState {
    tabs: Map<TabId, TabModel>;
    books: Array<Book> | null;

    constructor(
       tabs: Map<TabId, TabModel>,
       books: Array<Book> | null,
   ) {
        this.tabs = tabs;
        this.books = books;
    };

   setBooks (newBooks) {
      this.books = newBooks;
      return this;
   }
}
