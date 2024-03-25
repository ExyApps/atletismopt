import React from 'react';

import ImageCarrosel from '../Components/ImageCarousel/ImageCarousel';

export default class Home extends React.Component {
	render() {
		return (
			<>
				{/* <Navbar /> */}
				<ImageCarrosel />

				<div className="home-contents"></div>
			</>
		);
	}
}