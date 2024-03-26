import React from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

export default class NavbarComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			menuOpen: false,
			transparencyValue: 0.2
		};
	}

	componentDidMount() {
		window.addEventListener('scroll', (e) => this.handleScroll(e));
		document.querySelector('.navbar').style.background = `rgba(24, 24, 24, ${this.state.transparencyValue})`;
	}

	handleScroll(e) {
		if (window.location.pathname !== '/atletismopt') return;
		var homeContentsDiv = document.querySelector('.home-contents');
		var homeContentsDivOffset = homeContentsDiv.offsetTop;
		var currentScroll = window.scrollY;

		var scrollPercent = Math.min(currentScroll / homeContentsDivOffset, 1);
		var newTransparency = scrollPercent * 0.8 + 0.2;

		document.querySelector('.navbar').style.background = `rgba(24, 24, 24, ${newTransparency})`;
		this.setState({ transparencyValue: newTransparency });
	}

	handleHamburgerClick() {
		if (this.state.menuOpen) {
			document.querySelector('.menu-btn').classList.remove('open');
			document.querySelector('.nav-links-sidebar').classList.remove('open');
			document.querySelector('.navbar').style.background = `rgba(24, 24, 24, ${this.state.transparencyValue})`;
			this.setState({ menuOpen: false });
		} else {
			document.querySelector('.menu-btn').classList.add('open');
			document.querySelector('.nav-links-sidebar').classList.add('open');
			document.querySelector('.navbar').style.background = `rgba(24, 24, 24, 1)`;
			this.setState({ menuOpen: true });
		}
	}

	render() {
		return (
			<>
				<Navbar
					className="navbar fixed-top"
				>
					<Navbar.Brand href="/atletismopt">AtletismoPT</Navbar.Brand>

					<Nav className="me-auto nav-links-container">
						<Nav.Link className="pc-nav-link" href="/atletismopt/#/competicoes">Competições</Nav.Link>
						<Nav.Link className="pc-nav-link" href="/atletismopt/#/perfis">Perfis</Nav.Link>
						<Nav.Link className="pc-nav-link" href="/atletismopt/#/rankings">Rankings</Nav.Link>
					</Nav>

					<Nav.Link className="pc-nav-link" href="/atletismopt/#/sobre">Sobre</Nav.Link>

					<div
						className="menu-btn"
						onClick={() => this.handleHamburgerClick()}
					>
						<div className="menu-btn__burger"></div>
					</div>
				</Navbar>

				<div className="nav-links-sidebar">
					<Nav.Link className="sidebar-nav-link" href="/atletismopt/#/competicoes">Competições</Nav.Link>
					<Nav.Link className="sidebar-nav-link" href="/atletismopt/#/perfis">Perfis</Nav.Link>
					<Nav.Link className="sidebar-nav-link" href="/atletismopt/#/rankings">Rankings</Nav.Link>
					<Nav.Link className="sidebar-nav-link" href="/atletismopt/#/sobre">Sobre</Nav.Link>
				</div>
			</>
		);
	}
}