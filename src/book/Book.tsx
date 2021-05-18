import React from "react";
import {ButtonLabel} from "../tab/models";
import {Book, Tag} from "./models";

interface BookProps {
    book: Book,
    buttonLabel: ButtonLabel,
    changeStatus: () => void,
    addFilteredTag: (tag: Tag) => void,
}

const Book = (props: BookProps) => {
    const {book, buttonLabel, changeStatus, addFilteredTag} = props;

    return (<div className="book">
        <p>{book.author}</p>
        <div className="book-title-wrapper">
            <p className="book-title">{book.title}</p>
            <p className="action-button" onClick={changeStatus}>{buttonLabel}</p>
        </div>
        <p>{book.description}</p>
        <div className="tag-wrapper">{book.tags.map(tag =>
            <div className="tag" onClick={() => addFilteredTag(tag)}>#{tag}</div>)}
        </div>
    </div>);
}

export default Book;
