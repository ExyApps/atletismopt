export async function performGetRequest(url, params = {}) {
    return await fetch(process.env.REACT_APP_SERVER_IP + url)
    .then(response => response.json())
    .then(data => {
        return data;
    })
}

export async function getResults(req) {
    return await fetch(process.env.REACT_APP_SERVER_IP + "backoffice/get-results", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            req: req
        })
    })
    .then(response => response.json())
    .then(data => {
        return data;
    })
}