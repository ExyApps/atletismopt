import './App.css';
import './Flags.css';

import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import NavbarComponent from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';

import Home from './Pages/Home/Home';
import Perfis from './Pages/Perfis/Perfis';
import Rankings from './Pages/Rankings/Rankings';
import Sobre from './Pages/Sobre/Sobre';
import AthleteProfile from './Pages/AthleteProfile/AthleteProfile';
import Feedback from './Pages/Feedback/Feedback';
import Calendario from './Pages/Calendario/Calendario';
import Resultados from './Pages/Resultados/Resultados';
import Recordes from './Pages/Recordes/Recordes';
import Admin from './Pages/Admin/Admin';

function App() {
	return (
		<div className="app-body">
			<NavbarComponent />
			<HashRouter>
				<Routes>
					<Route exact path="/" element={<Home />} />
					<Route exact path="/perfis" element={<Perfis />} />
					<Route exact path="/rankings" element={<Rankings />} />
					<Route exact path="/sobre" element={<Sobre />} />
					<Route exact path="/feedback" element={<Feedback />} />
					<Route exact path="/calendario" element={<Calendario />} />
					<Route exact path="/resultados" element={<Resultados />} />
					<Route exact path="/recordes" element={<Recordes />} />
					<Route exact path="/admin-tools" element={<Admin />} />

					{/* Route that catches all the routes that end in /perfis/<id> */}
					<Route exact path="/perfis/:id" element={<AthleteProfile />} />
				</Routes>
			</HashRouter>
			<Footer />
		</div>
	);
}

export default App;
