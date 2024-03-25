import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import ImageCarrosel from '../Components/ImageCarousel/ImageCarousel';

export default class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			menuOpen: false
		};
	}

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
	}

	handleHamburgerClick() {
		if (this.state.menuOpen) {
			document.querySelector('.menu-btn').classList.remove('open');
			this.setState({ menuOpen: false });
		} else {
			document.querySelector('.menu-btn').classList.add('open');
			this.setState({ menuOpen: true });
		}
	}

	render() {
		return (
			<>
				<Navbar
					className="navbar fixed-top"
				>
					<Navbar.Brand href="/">AtletismoPT</Navbar.Brand>

					<Nav className="me-auto nav-links-container">
						<Nav.Link className="pc-nav-link" href="/atletismopt/competicoes">Competições</Nav.Link>
						<Nav.Link className="pc-nav-link" href="/atletismopt/perfis">Perfis</Nav.Link>
						<Nav.Link className="pc-nav-link" href="/atletismopt/rankings">Rankings</Nav.Link>
					</Nav>

					<Nav.Link className="pc-nav-link" href="/atletismopt/sobre">Sobre</Nav.Link>

					<div
						className="menu-btn"
						onClick={() => this.handleHamburgerClick()}
					>
						<div className="menu-btn__burger"></div>
					</div>
				</Navbar>

				<ImageCarrosel />

				<div className="home-contents">

				</div>
			</>
		);
	}
}