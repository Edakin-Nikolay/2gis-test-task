import React, {useEffect, useState} from "react";
import Tab from "./components/Tab";
import "./App.css";
import {Book, BookId, Main, setData, Status, Tag} from "./lib/Models";
import {tabValues} from './TabsData';
import {get30000Books, getBooks, loadFromLocalStorage, saveToLocalStorage} from "./lib/api";
import Filter from "./components/Filter";

export default function App() {
    const [mainState, setMainState] = useState<Main>({books: [], activeTab: Status.Toread, tags: []});
    const urlQuery = new URLSearchParams(window.location.search);

    useEffect(() => {
        const booksLS = loadFromLocalStorage();
        getBooks().then(resp => {
            const books = resp.items;
            if (booksLS) {
                return setMainState(prevState =>
                    setData(prevState,{books: books.map(item => {
                        const book = booksLS.find(bookLS => bookLS.id === item.id);
                        return setData(item, {status: book ? book.status : Status.Toread});
                        })}))
            } else {
                return setMainState(prevState =>
                    setData<Main>(prevState, {books: books.map(item =>
                            setData(item, {status: Status.Toread}))}))
            }
        });
        // устанавливаем таб из URL
        const urlTab = urlQuery.get("tab");
        if (tabValues.some(tab => tab.status === urlTab)) {
            setMainState(prevState => setData(prevState, {activeTab: urlTab}));
        }
        // устанавливаем теги из URL
        const urlTags = urlQuery.get("tags");
        if (urlTags) {
            setMainState(prevState => setData(prevState, {tags: urlTags.split(",")}));
        }

        window.onpopstate = function(event) {
            setMainState(prevState => setData(prevState, event.state));
        };

    }, []);

    useEffect(() => setUrl(), [mainState.activeTab, mainState.tags]);

    const isActive = (tabStatus: Status) =>
        mainState.activeTab === tabStatus;

    const booksForTab = (tabStatus: Status): Array<Book> =>
        mainState.books.filter(book => book.status === tabStatus).filter(book => mainState.tags.every(tag => book.tags.includes(tag)));

    const setUrl = () => {
        const tabQuery = `tab=${mainState.activeTab}`;
        const tagsQuery = `tags=${encodeURIComponent(mainState.tags.join())}`;
        if (!(mainState.activeTab === urlQuery.get("tab") && mainState.tags.join() === urlQuery.get("tags"))) {
            history.pushState({
                activeTab: mainState.activeTab,
                tags: mainState.tags
            }, mainState.activeTab, mainState.tags.length > 0 ? `/?${tabQuery}&${tagsQuery}` : `/?${tabQuery}`)
        }
    }

    const changeTab = (tabStatus: Status) =>
        setMainState(prevState => setData(prevState, {activeTab: tabStatus}));

    const changeBookStatus = (status: Status) => (bookId: BookId) => {
        const newBooks = mainState.books.map(book => book.id === bookId ? setData(book, {status}) : book);
        setMainState(prevState => setData(prevState, {books: newBooks}));
        saveToLocalStorage(newBooks);
    }

    const addFilteredTag = (tag: Tag) => {
        if (!mainState.tags.includes(tag)) {
            setMainState(prevState => setData(prevState, {tags: prevState.tags.concat([tag])}));
        }
    }

    const clearFilteredTag = () =>
        setMainState(prevState => setData(prevState, {tags: []}));

    const countBooks = (tabStatus: Status) =>
        mainState.books.filter(book => book.status === tabStatus).length;

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
