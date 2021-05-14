import React from "react";
import {Tag} from "../lib/Models";

interface FilterProps {
    tags: Array<Tag>,
    clear: () => void,
}

const Filter = (props: FilterProps) => {
    const {tags, clear} = props;
    return (<div className="tag-filter-wrapper">
        <div className="tag-filter">Filtered by tags: {tags.map(tag => <span className="tag">#{tag} </span>)}
            <span>(<span className="clear-button" onClick={clear}>clear</span>)</span></div>
    </div>);
}

export default Filter;
