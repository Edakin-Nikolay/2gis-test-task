import React from 'react';
import {Book as BookModel, BookId, Tab, Tag} from "../lib/models";
import Book from "./Book";

type TabProps = {
    books: Array<BookModel>,
    tab: Tab,
    changeStatus: (bookId: BookId) => void
    addFilteredTag: (tag: Tag) => void,
    nextPage: () => void,
    canNextPage: boolean,
}

const Tab = (props: TabProps) => {
    const {books, tab, changeStatus, addFilteredTag, nextPage, canNextPage} = props;
    return (<div>
        {books.length > 0
            ? <div>{books.map(book =>
                <Book key={book.id.toString()}
                      book={book}
                      buttonLabel={tab.buttonLabel}
                      addFilteredTag={addFilteredTag}
                      changeStatus={() => changeStatus(book.id)}/>)}
                <div className="next-page-button-wrapper">
                    <button disabled={!canNextPage} onClick={nextPage}>
                        Show next 50 books
                    </button>
                </div>
            </div>
            : <div className="empty-tab">List is empty</div>}
    </div>);
}

export default Tab;
