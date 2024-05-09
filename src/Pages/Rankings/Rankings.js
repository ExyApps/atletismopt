import React, { useEffect } from 'react';

import Button from 'react-bootstrap/Button';

export default function Rankings() {
	useEffect(() => {
		document.title = 'AtletismoPT - Rankings';
	});

	return (
		<div className='template-page'>
			<h1>Rankings</h1>
			<p>Ups! Página não terminada!</p>
			<p>Aguarde enquanto acabamos de a desenvolver!</p>

			<Button className="template-page-button" href="/atletismopt">Voltar à Página Inicial</Button>
		</div>
	);
}