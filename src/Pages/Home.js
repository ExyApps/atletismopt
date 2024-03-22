import React from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';

import ImageCarrosel from '../Components/ImageCarousel/ImageCarousel';

export default class Home extends React.Component {
	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
	}

	handleScroll(e) {
		var homeContentsDiv = document.querySelector('.home-contents');
		var homeContentsDivOffset = homeContentsDiv.offsetTop;
		var currentScroll = window.scrollY;

		var scrollPercent = Math.min(currentScroll / homeContentsDivOffset, 1);
		var newTransparency = scrollPercent * 0.8 + 0.2;

		document.querySelector('.navbar').style.background = `rgba(24, 24, 24, ${newTransparency})`;
		// this.navbar.current.style.background = `rgba(0, 0, 0, ${newTransparency})`;
	}

	render() {
		return (
			<>
				<Navbar
					className="navbar fixed-top navbar-dark"
				>
					<Container>
						<Navbar.Brand href="/">AtletismoPT</Navbar.Brand>
						{/* <Nav className="me-0">
							<Nav.Link href="/">Link 1</Nav.Link>
							<Nav.Link href="/">Link 2</Nav.Link>
							<Nav.Link href="/">Link 3</Nav.Link>
						</Nav> */}
					</Container>
				</Navbar>

				<ImageCarrosel />

				<div className="home-contents">

				</div>
			</>
		);
	}
}