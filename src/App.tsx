import React, {useEffect, useState} from "react";
import Tab from "./components/Tab";
import "./App.css";
import {Book, BookId, Main, updateFields, Status, Tag} from "./lib/Models";
import {tabValues} from './TabsData';
import {getBooks, loadFromLocalStorage, saveToLocalStorage} from "./lib/api";
import Filter from "./components/Filter";

export default function App() {
    const [mainState, setMainState] = useState<Main>({books: [], activeTab: Status.ToRead, tags: []});
    const urlQuery = new URLSearchParams(window.location.search);

    useEffect(() => {
        getBooks().then(resp => {
            const books = resp.items;
            const booksLS = loadFromLocalStorage();
            setMainState(updateFields(mainState, {books: books.map(book => {
                    const bookFromLS = booksLS.find(bookLS => bookLS.id === book.id);
                    return updateFields(book, {status: bookFromLS ? bookFromLS.status : Status.ToRead});
                })}))
        });
        // устанавливаем таб из URL
        const urlTab = urlQuery.get("tab");
        if (tabValues.some(tab => tab.status === urlTab)) {
            setMainState(updateFields(mainState, {activeTab: urlTab}));
        }
        // устанавливаем теги из URL
        const urlTags = urlQuery.get("tags");
        if (urlTags) {
            setMainState(updateFields(mainState, {tags: urlTags.split(",")}));
        }

        window.onpopstate = function(event) {
            setMainState(prevState => updateFields(prevState, event.state));
        };

    }, []);

    useEffect(() => setUrl(), [mainState.activeTab, mainState.tags]);

    const isActive = (tabStatus: Status) =>
        mainState.activeTab === tabStatus;

    const filterBooksByStatus = (tabStatus: Status): Array<Book> =>
        mainState.books.filter(book => book.status === tabStatus);

    const booksForTab = (tabStatus: Status): Array<Book> =>
        filterBooksByStatus(tabStatus).filter(book => mainState.tags.every(tag => book.tags.includes(tag)));

    const setUrl = () => {
        const queryTab = urlQuery.get("tab") ? urlQuery.get("tab") : "";
        const queryTags = urlQuery.get("tags") ? urlQuery.get("tags") : "";
        if (!(mainState.activeTab === queryTab && mainState.tags.join() === queryTags)) {
            urlQuery.set("tab", mainState.activeTab);
            mainState.tags.length > 0 && urlQuery.set("tags", mainState.tags.join());
            history.pushState({
                activeTab: mainState.activeTab,
                tags: mainState.tags
            }, mainState.activeTab, `/?${urlQuery.toString()}`)
        }
    }

    const changeTab = (tabStatus: Status) =>
        setMainState(prevState => updateFields(prevState, {activeTab: tabStatus}));

    const changeBookStatus = (status: Status) => (bookId: BookId) => {
        const newBooks = mainState.books.map(book => book.id === bookId ? updateFields(book, {status}) : book);
        setMainState(prevState => updateFields(prevState, {books: newBooks}));
        saveToLocalStorage(newBooks);
    }

    const addFilteredTag = (tag: Tag) => {
        if (!mainState.tags.includes(tag)) {
            setMainState(prevState => updateFields(prevState, {tags: prevState.tags.concat([tag])}));
        }
    }

    const clearFilteredTag = () =>
        setMainState(prevState => updateFields(prevState, {tags: []}));

    return (
        <div className="main-wrapper">
            <div className="tab-wrapper">
                {tabValues.map(tab =>
                <div className={`tab-title ${isActive(tab.status) && "active"}`} onClick={() => changeTab(tab.status)}>
                    {`${tab.tabLabel} (${filterBooksByStatus(tab.status).length})`}
                </div>)}
            </div>
            {mainState.tags.length > 0 && <Filter tags={mainState.tags} clear={clearFilteredTag}/>}
            {tabValues.map(tab =>
                isActive(tab.status) &&
                <Tab key={tab.status}
                     books={booksForTab(tab.status)}
                     tab={tab}
                     changeStatus={changeBookStatus(tab.nextStatus)}
                     addFilteredTag={addFilteredTag} />)}
        </div>
    );
}
