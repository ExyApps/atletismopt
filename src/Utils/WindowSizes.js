function isMobileDevice() {
	return window.innerWidth < 480;
}

function isMobileDeviceLandscape() {
	return window.innerWidth < 768;
}

function isTabletDevice() {
	return window.innerWidth < 1024;
}

function isSmallDesktopDevice() {
	return window.innerWidth < 1440;
}

function isLargeDesktopDevice() {
	return window.innerWidth >= 1440;
}

export {
	isMobileDevice,
	isMobileDeviceLandscape,
	isTabletDevice,
	isSmallDesktopDevice,
	isLargeDesktopDevice
};