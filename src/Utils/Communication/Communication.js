export async function getInformation(url, params = {}) {
    return await fetch(process.env.REACT_APP_SERVER_IP + url)
    .then(response => response.json())
    .then(data => {
        return data;
    })
}

export async function makeQueryDB(database, columns) {
    return await fetch(process.env.REACT_APP_SERVER_IP + "query-db", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            database: database,
            columns: columns
        })
    })
    .then(response => response.json())
    .then(data => {
        return data;
    })
}