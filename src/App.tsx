import React, {useEffect, useState} from "react";
import Tab from "./components/Tab";
import "./App.css";
import {Book, BookId, Main, updateFields, Status, Tag, QueryFields} from "./lib/models";
import {tabValues} from './tabViewParams';
import {get30000Books, loadFromLocalStorage, saveToLocalStorage} from "./lib/api";
import Filter from "./components/Filter";

const getQuery = () => new URLSearchParams(window.location.search);

export default function App() {
    const [mainState, setMainState] = useState<Main>({books: [], activeTab: Status.ToRead, tags: [], booksCount: 50});

    useEffect(() => {
        get30000Books().then(resp => {
            const books = resp.items;
            const booksLS = loadFromLocalStorage();
            setMainState(updateFields(mainState, {books: books.map(book =>
                    updateFields(book,
                        {status: booksLS.find(bookLS => bookLS.id === book.id)?.status || Status.ToRead})
                )}))
        });
        const urlQuery = getQuery();

        const urlTab = urlQuery.get(QueryFields.Tab);
        const urlTags = urlQuery.get(QueryFields.Tags);
        setMainState(updateFields(mainState,
            {
                activeTab: tabValues.some(tab => tab.status === urlTab) ? urlTab : mainState.activeTab, // устанавливаем таб из URL
                tags:  urlTags?.split(",") || mainState.tags, // устанавливаем теги из URL
            }))

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
        filterBooksByStatus(tabStatus).filter(book => mainState.tags.every(tag => book.tags.includes(tag))).slice(0, mainState.booksCount);

    const nextPage = () =>
        setMainState(prevState => updateFields(prevState, {booksCount: prevState.booksCount + 50}));

    const setUrl = () => {
        const urlQuery = getQuery();
        const urlTab = urlQuery.get(QueryFields.Tab) || "";
        const urlTags = urlQuery.get(QueryFields.Tags) || "";
        const tagsString = mainState.tags.join();
        if (!(mainState.activeTab === urlTab && tagsString === urlTags)) {
            urlQuery.set(QueryFields.Tab, mainState.activeTab);
            mainState.tags.length > 0 ? urlQuery.set(QueryFields.Tags, tagsString) : urlQuery.delete(QueryFields.Tags);
            history.pushState({
                activeTab: mainState.activeTab,
                tags: mainState.tags
            }, mainState.activeTab, `/?${urlQuery.toString()}`)
        }
    }

    const setTab = (tabStatus: Status) =>
        setMainState(prevState => updateFields(prevState, {activeTab: tabStatus}));

    const setBookStatus = (status: Status) => (bookId: BookId) => {
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

    return (<div className="main-wrapper">
        <div className="tab-wrapper">
            {tabValues.map(tab =>
                <div className={`tab-title ${isActive(tab.status) && "active"}`} onClick={() => setTab(tab.status)}>
                    {`${tab.tabLabel} (${filterBooksByStatus(tab.status).length})`}
                </div>)}
            </div>
            {mainState.tags.length > 0 && <Filter tags={mainState.tags} clear={clearFilteredTag}/>}
            {tabValues.map(tab =>
                isActive(tab.status) &&
                <Tab key={tab.status}
                     books={booksForTab(tab.status)}
                     tab={tab}
                     changeStatus={setBookStatus(tab.nextStatus)}
                     nextPage={nextPage}
                     canNextPage={filterBooksByStatus(tab.status).length > mainState.booksCount}
                     addFilteredTag={addFilteredTag} />)}
    </div>);
}
