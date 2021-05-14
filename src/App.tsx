import React, {useEffect, useState} from "react";
import {
    Switch,
    Route,
    NavLink,
    useLocation
} from "react-router-dom";
import {Book, MainState, TabId, TabModel} from "./lib/Models";
import {getBooks} from "./lib/api";
import Tab from "./Tab";
import "./App.css";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function initState () {
    return new MainState(
        new Map<TabId, TabModel>()
            .set('toRead', new TabModel(null, null))
            .set('inProgress', new TabModel(null, null))
            .set('done', new TabModel(null, null)),
        null)
}

export default function App() {
    let query = useQuery();

    const [mainState, setMainState] = useState<MainState>(initState());

    useEffect(() => {
        const json = getBooks();
        json.then(obj => setMainState(prevState => prevState.setBooks(obj.items)));
    }, [])

    console.log(mainState);
    return (
        <div className="App">
            <div className="Navigation">
                    <NavLink className="Link" activeClassName="ActiveLink"
                             isActive={((match, location) => location.search === "")}
                             exact to="/">To read</NavLink>
                    <NavLink className="Link" activeClassName="ActiveLink"
                             isActive={((match, location) => location.search === "?tab=inProgress")}
                             to="/?tab=inProgress">In progress</NavLink>
                    <NavLink className="Link" activeClassName="ActiveLink"
                             isActive={((match, location) => location.search === "?tab=done")}
                             to="/?tab=done">Done</NavLink>
            </div>

            <Tab key={query.get("tab")} title={query.get("tab")} />
        </div>
    );
}
