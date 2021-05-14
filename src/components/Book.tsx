import React from "react";
import {Book, ButtonLabel, Tag} from "../lib/Models";

interface BookProps {
    book: Book,
    buttonLabel: ButtonLabel,
    changeStatus: () => void,
    addFilteredTag: (tag: Tag) => void,
}

const Book = (props: BookProps) => {
    const {book, buttonLabel, changeStatus, addFilteredTag} = props;

    return (<div>
        <div className="Author">{book.author}</div>
        <div><span className="Title">{book.title}</span><span className="Action" onClick={changeStatus}>{buttonLabel}</span></div>
        <div className="Description">{book.description}</div>
        <div className="Tags">{book.tags.map(tag =>
            <span className="Tag" onClick={() => addFilteredTag(tag)}>{`${tag}, `}</span>)}
        </div>
        <hr/>
    </div>)
}

export default Book;
