import React from 'react';

import ImageCarrosel from '../Components/ImageCarousel/ImageCarousel';

export default class Home extends React.Component {
	render() {
		return (
			<div className="page">
				{/* <Navbar /> */}
				<ImageCarrosel />

				<div className="home-contents"></div>
			</div>
		);
	}
}