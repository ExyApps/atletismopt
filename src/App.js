import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home'
import React from 'react';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/atletismopt" element={<Home />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
