export function updateFields<T>(oldObj: T, newObj: object): T{
    return Object.assign({}, oldObj, newObj);
}

export const getQuery = () => new URLSearchParams(window.location.search);
