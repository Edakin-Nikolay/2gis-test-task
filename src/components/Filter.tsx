import React from "react";
import {Tag} from "../lib/Models";

interface FilterProps {
    tags: Array<Tag>,
    clear: () => void,
}

const Filter = (props: FilterProps) => {
    const {tags, clear} = props;
    return (<div>
        <hr/>
        <div>Filtered by tags: {tags.map(tag => <span>#{tag} </span>)}<span onClick={clear}>(clear)</span></div>
        <hr/>
    </div>);
}

export default Filter;
