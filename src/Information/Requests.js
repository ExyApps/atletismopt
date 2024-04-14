function getURL() {
	if (window.location.href.includes('github')) {
		return process.env.REACT_APP_API_URL;
	} else {
		return process.env.REACT_APP_LOCAL_API_URL;
	}
}

export default getURL;