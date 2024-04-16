import React from 'react';
import './Navbar.css';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Accordion from 'react-bootstrap/Accordion';

import { Navigate } from 'react-router-dom';

import {
	isTabletDevice,
} from '../../Utils/WindowSizes';

export default class NavbarComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			width: window.innerWidth,

			menuOpen: false,
		};
	}

	updateDimensions = () => {
		this.setState({ width: window.innerWidth });
	}

	componentDidMount() {
		window.addEventListener('resize', this.updateDimensions);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateDimensions);
	}

	handleHamburgerClick(url = null) {
		if (this.state.menuOpen) {
			document.querySelector('.menu-btn').classList.remove('open');
			document.querySelector('.nav-links-sidebar').classList.remove('open');
			this.setState({ menuOpen: false }, () => <Navigate to={url} />);
		} else {
			document.querySelector('.menu-btn').classList.add('open');
			document.querySelector('.nav-links-sidebar').classList.add('open');
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

					{
						isTabletDevice()
							? <div
								className="menu-btn"
								onClick={() => this.handleHamburgerClick()}
							>
								<div className="menu-btn__burger"></div>
							</div>

							: <>
								<Nav className="me-auto nav-links-container">
									<NavDropdown title="Competições" id="competition-nav-dropdown" className='pc-nav-link'>
										<NavDropdown.Item href="#/competicoes">Calendário</NavDropdown.Item>
										<NavDropdown.Item href="#/competicoes/resultados">Resultados</NavDropdown.Item>
									</NavDropdown>

									<NavDropdown title="Atletas" id="athlete-nav-dropdown" className='pc-nav-link'>
										<NavDropdown.Item href="#/perfis">Perfis</NavDropdown.Item>
										<NavDropdown.Item href="#/perfis/confronto">Confronto Direto</NavDropdown.Item>
									</NavDropdown>

									<Nav.Link className="pc-nav-link" href="/atletismopt/#/rankings">Rankings</Nav.Link>
									<Nav.Link className="pc-nav-link" href="/atletismopt/#/recordes">Recordes</Nav.Link>
									<Nav.Link className="pc-nav-link" href="/atletismopt/#/suporte">Feedback / Suporte</Nav.Link>

								</Nav>
								<Nav.Link className="pc-nav-link" href="/atletismopt/#/sobre">Sobre</Nav.Link>
							</>
					}
				</Navbar>

				{
					isTabletDevice()
						? <div className="nav-links-sidebar">
							<Accordion>
								<Accordion.Item eventKey="0">
									<Accordion.Header>Competições</Accordion.Header>
									<Accordion.Body>
										<Nav.Link
											href="/atletismopt/#/competicoes"
											onClick={() => this.handleHamburgerClick()}
										>
											Calendário
										</Nav.Link>
										<Nav.Link
											href="/atletismopt/#/resultados"
											onClick={() => this.handleHamburgerClick()}
										>
											Resultados
										</Nav.Link>
									</Accordion.Body>
								</Accordion.Item>
								<Accordion.Item eventKey="1">
									<Accordion.Header>Atletas</Accordion.Header>
									<Accordion.Body>
										<Nav.Link
											href="/atletismopt/#/perfis"
											onClick={() => this.handleHamburgerClick()}
										>
											Perfis
										</Nav.Link>
										<Nav.Link
											href="/atletismopt/#/perfis/confronto"
											onClick={() => this.handleHamburgerClick()}
										>
											Confronto Direto
										</Nav.Link>
									</Accordion.Body>
								</Accordion.Item>
							</Accordion>

							<Nav.Link
								className="mobile-nav-link"
								href="/atletismopt/#/rankings"
								onClick={() => this.handleHamburgerClick()}
							>
								Rankings
							</Nav.Link>
							<Nav.Link
								className="mobile-nav-link"
								href="/atletismopt/#/recordes"
								onClick={() => this.handleHamburgerClick()}
							>
								Recordes
							</Nav.Link>
							<Nav.Link
								className="mobile-nav-link"
								href="/atletismopt/#/suporte"
								onClick={() => this.handleHamburgerClick()}
							>
								Feedback / Suporte
							</Nav.Link>
							<Nav.Link
								className="mobile-nav-link"
								href="/atletismopt/#/sobre"
								onClick={() => this.handleHamburgerClick()}
							>
								Sobre
							</Nav.Link>
						</div>
						: null

				}
			</>
		);
	}
}