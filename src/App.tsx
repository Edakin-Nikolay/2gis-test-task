import React, {useEffect, useState} from "react";
import Tab from "./components/Tab";
import "./App.css";
import {BookId, Main, setData, Status, Tag} from "./lib/Models";
import {tabValues} from './TabsData';
import {getBooks, loadFromLocalStorage, saveToLocalStorage} from "./lib/api";
import Filter from "./components/Filter";

function useQuery() {
    return new URLSearchParams(window.location.search);
}

export default function App() {
    const [mainState, setMainState] = useState<Main>({books: [], activeTab: "toread", tags: []});

    useEffect(() => {
        const booksLS = loadFromLocalStorage();
        getBooks().then(resp => {
            const books = resp.items;
            if (booksLS) {
                return setMainState(prevState =>
                    setData(prevState,{books: books.map(item =>
                            setData(item, {status: booksLS.find(bookLS => bookLS.id === item.id).status}))}))
            } else {
                return setMainState(prevState =>
                    setData<Main>(prevState, {books: books.map(item =>
                            setData(item, {status: "toread"}))}))
            }
        });
        // устанавливаем таб из URL
        const urlTab = useQuery().get("tab");
        if (tabValues.some(tab => tab.status === urlTab)) {
            setMainState(prevState => setData(prevState, {activeTab: urlTab}));
        }
        // устанавливаем теги из URL
        const urlTags = useQuery().get("tags");
        if (urlTags) {
            setMainState(prevState => setData(prevState, {tags: urlTags.split(",")}));
        }

        window.onpopstate = function(event) {
            setMainState(prevState => setData(prevState, event.state));
        };

    }, []);

    //useEffect(() => setUrl(), [mainState.activeTab, mainState.tags]);

    const isActive = (tabStatus: Status) =>
        mainState.activeTab === tabStatus;

    const booksForTab = (tabStatus: Status) =>
        mainState.books.filter(book => book.status === tabStatus).filter(book => mainState.tags.every(tag => book.tags.includes(tag)));

    const setUrl = (tabStatus: Status, tags: Array<Tag> = mainState.tags) => {
        const tabQuery = `tab=${mainState.activeTab}`;
        const tagsQuery = `tags=${mainState.tags.join()}`;
        history.pushState({
            activeTab: mainState.activeTab,
            tags: mainState.tags
        }, mainState.activeTab, tags.length > 0 ? `/?${tabQuery}&${tagsQuery}` : `/?${tabQuery}`)
    }
    const changeTab = (tabStatus: Status) => {
        setMainState(prevState => setData(prevState, {activeTab: tabStatus}));
        setUrl(tabStatus);
    }

    const changeBookStatus = (status: Status) => (bookId: BookId) => {
        const newBooks = mainState.books.map(book => book.id === bookId ? setData(book, {status}) : book);
        setMainState(prevState => setData(prevState, {books: newBooks}));
        saveToLocalStorage(newBooks);
    }

    const addFilteredTag = (tag: Tag) => {
        if (!mainState.tags.includes(tag)) {
            setMainState(prevState => setData(prevState, {tags: prevState.tags.concat([tag])}));
            setUrl(mainState.activeTab, mainState.tags.concat([tag]));
        }
    }

    const clearFilteredTag = () => {
        setMainState(prevState => setData(prevState, {tags: []}));
        setUrl(mainState.activeTab, []);
    }

    const countBooks = (tabStatus: Status) =>
        mainState.books.filter(book => book.status === tabStatus).length;

    console.log(mainState);
    return (
        <div className="main-wrapper">
            <div className="tab-wrapper">
                {tabValues.map(tab =>
                <div className={`tab-title ${mainState.activeTab === tab.status && "active"}`} onClick={() => changeTab(tab.status)}>
                    {`${tab.tabLabel} (${countBooks(tab.status)})`}
                </div>)}
            </div>
            {mainState.tags.length > 0 && <Filter tags={mainState.tags} clear={clearFilteredTag}/>}
            {tabValues.map(tab =>
            isActive(tab.status) && <Tab key={tab.status}
                     books={booksForTab(tab.status)}
                     tab={tab}
                     changeStatus={changeBookStatus(tab.nextStatus)}
                     addFilteredTag={addFilteredTag} />)}
        </div>
    );
}
