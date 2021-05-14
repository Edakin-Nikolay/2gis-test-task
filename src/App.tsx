import React, {useEffect, useState} from "react";
import Tab from "./components/Tab";
import "./App.css";
import {BookId, Main, setData, Status, Tag} from "./lib/Models";
import {ToRead, Done, InProgress} from './TabsData';
import {getBooks, loadFromLocalStorage, saveToLocalStorage} from "./lib/api";
import Filter from "./components/Filter";

function useQuery() {
    return new URLSearchParams(window.location.search);
}

export default function App() {
    const [mainState, setMainState] = useState<Main>({books: [], activeTab: "toRead", tags: []});
    useEffect(() => {
        getBooks().then(resp => {
            const booksLS = loadFromLocalStorage();
            const books = resp.items;
            if (booksLS) {
                return setMainState(prevState =>
                    setData(prevState,{books: books.map(item =>
                            setData(item, {status: booksLS.find(bookLS => bookLS.id === item.id).status}))}))
            } else {
                return setMainState(prevState =>
                    setData<Main>(prevState, {books: books.map(item =>
                            setData(item, {status: "toRead"}))}))
            }
        })
    }, [])

    const isActive = (tabStatus: Status) =>
        mainState.activeTab === tabStatus;

    const booksForTab = (tabStatus: Status) =>
        mainState.books.filter(book => book.status === tabStatus).filter(book => mainState.tags.every(tag => book.tags.includes(tag)));

    const changeTab = (tabStatus: Status) =>
        setMainState(prevState => setData(prevState, {activeTab: tabStatus}))

    const changeBookStatus = (status: Status) => (bookId: BookId) => {
        const newBooks = mainState.books.map(book => book.id === bookId ? setData(book, {status}) : book);
        setMainState(prevState => setData(prevState, {books: newBooks}));
        saveToLocalStorage(newBooks);
    }

    const addFilteredTag = (tag: Tag) => {
        if (!mainState.tags.includes(tag)) {
            setMainState(prevState => {
                return setData(prevState, {tags: prevState.tags.concat([tag])})
            })
        }
    }

    const clearFilteredTag = () =>
        setMainState(prevState => setData(prevState, {tags: []}));

    const countBooks = (tabStatus: Status) =>
        mainState.books.filter(book => book.status === tabStatus).length;

    return (
        <div className="App">
            <div>
                <span className="TabButton" onClick={() => changeTab(ToRead.status)}>
                    {`${ToRead.tabLabel} (${countBooks(ToRead.status)})`}
                </span>
                <span className="TabButton" onClick={() => changeTab(InProgress.status)}>
                    {`${InProgress.tabLabel} (${countBooks(InProgress.status)})`}
                </span>
                <span className="TabButton" onClick={() => changeTab(Done.status)}>
                    {`${Done.tabLabel} (${countBooks(Done.status)})`}
                </span>
            </div>
            {mainState.tags.length > 0 && <Filter tags={mainState.tags} clear={clearFilteredTag}/>}
            {isActive(ToRead.status) &&
            <Tab key={ToRead.status}
                 books={booksForTab(ToRead.status)}
                 tab={ToRead}
                 addFilteredTag={addFilteredTag}
                 changeStatus={changeBookStatus(ToRead.nextStatus)}/>}
            {isActive(InProgress.status) &&
            <Tab key={InProgress.status}
                 books={booksForTab(InProgress.status)}
                 tab={InProgress}
                 addFilteredTag={addFilteredTag}
                 changeStatus={changeBookStatus(InProgress.nextStatus)} />}
            {isActive(Done.status) &&
            <Tab key={Done.status}
                 books={booksForTab(Done.status)}
                 tab={Done}
                 addFilteredTag={addFilteredTag}
                 changeStatus={changeBookStatus(Done.nextStatus)}/>}
        </div>
    );
}
