import React from 'react';
// import Navbar from 'react-bootstrap/Navbar';
// import Nav from 'react-bootstrap/Nav';
// import NavDropdown from 'react-bootstrap/NavDropdown';

import ImageCarrosel from '../Components/ImageCarousel/ImageCarousel';
import Navbar from '../Components/Navbar/Navbar';

export default class Home extends React.Component {
	render() {
		return (
			<>
				<Navbar />
				<ImageCarrosel />

				<div className="home-contents"></div>
			</>
		);
	}
}