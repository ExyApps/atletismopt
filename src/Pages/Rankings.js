import React, { useEffect } from 'react';

import Button from 'react-bootstrap/Button';

export default function Rankings() {
	useEffect(() => {
		document.title = 'AtletismoPT - Rankings';
		document.querySelector('.navbar').style.background = `rgba(24, 24, 24, 1)`;
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