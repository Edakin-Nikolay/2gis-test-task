import React from 'react';
import {Book as BookModel, BookId, Tab, Tag} from "../lib/Models";
import Book from "./Book";

type TabProps = {
    books: Array<BookModel>,
    tab: Tab,
    changeStatus: (bookId: BookId) => void
    addFilteredTag: (tag: Tag) => void,
}

const Tab = (props: TabProps) => {
    const {books, tab, changeStatus, addFilteredTag} = props;
    return (<div>
        {books.length > 0
            ? books.map(book =>
                <Book key={book.id.toString()}
                      book={book}
                      buttonLabel={tab.buttonLabel}
                      addFilteredTag={addFilteredTag}
                      changeStatus={() => changeStatus(book.id)}/>)
            : <div className="empty-tab">List is empty</div>}
    </div>);
}

export default Tab;
