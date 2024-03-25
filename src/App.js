import './App.css';

import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import NavbarComponent from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';

import Home from './Pages/Home';
import Competicoes from './Pages/Competicoes';
import Perfis from './Pages/Perfis';
import Rankings from './Pages/Rankings';
import Sobre from './Pages/Sobre';
// import Page404 from './Pages/Page404'

function App() {
	return (
		<>
			<NavbarComponent />
			<HashRouter>
				<Routes>
					<Route exact path="/" element={<Home />} />
					<Route exact path="/competicoes" element={<Competicoes />} />
					<Route exact path="/perfis" element={<Perfis />} />
					<Route exact path="/rankings" element={<Rankings />} />
					<Route exact path="/sobre" element={<Sobre />} />
					{/* <Route path="/*" element={<Page404 />} /> */}
				</Routes>
			</HashRouter>
			<Footer />
		</>
	);
}

export default App;
