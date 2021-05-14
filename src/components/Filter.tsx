import React from "react";
import {Tag} from "../lib/Models";

interface FilterProps {
    tags: Array<Tag>,
    clear: () => void,
}

const Filter = (props: FilterProps) => {
    const {tags, clear} = props;
    return (<div>
        <div>Filtered by tags: {tags.map(tag => <span className="tag">#{tag} </span>)}<span onClick={clear}>(clear)</span></div>
    </div>);
}

export default Filter;
