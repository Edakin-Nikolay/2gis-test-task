import {Book, LocalStorageBook} from "./Models";

export const getBooks = () => {
    return fetch("https://raw.githubusercontent.com/lastw/test-task/master/data/10-items.json")
        .then((resp: Response) => resp.json())
}


export const get30000Books = () => {
    return fetch("https://raw.githubusercontent.com/lastw/test-task/master/data/30000-items.json")
        .then((resp: Response) => resp.json())
}

export const saveToLocalStorage = (books: Array<Book>) => {
    const localStorageBooks: Array<LocalStorageBook> = books.map(book => ({id: book.id, status: book.status}));
    localStorage.setItem("books", JSON.stringify(localStorageBooks));
}

export const loadFromLocalStorage = (): Array<any> => {
    const parsed = JSON.parse(localStorage.getItem("books"));
    return parsed ? parsed : [];
}
