import React, { useEffect } from 'react';

import Button from 'react-bootstrap/Button';

export default function Recordes() {
	useEffect(() => {
		document.title = 'AtletismoPT - Recordes';
	});

	return (
		<div className='template-page'>
			<h1>Recordes</h1>
			<p>Ups! Página não terminada!</p>
			<p>Aguarde enquanto acabamos de a desenvolver!</p>

			<Button className="template-page-button" href="/atletismopt">Voltar à Página Inicial</Button>
		</div>
	);
}