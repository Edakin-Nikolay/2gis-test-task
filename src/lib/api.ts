
export const getBooks = () => {
    return fetch("https://raw.githubusercontent.com/lastw/test-task/master/data/10-items.json")
        .then((resp: Response) => resp.json())
}
