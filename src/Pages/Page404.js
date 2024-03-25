import React from 'react';

import Button from 'react-bootstrap/Button';

export default function Page404() {
	return (
		<div className='template-page'>
			<h1>404</h1>
			<p>Ups! Página não encontrada!</p>
			<p>Provavelmente ainda não foi construída, mas se achar que é um erro, informe-nos!</p>

			<Button className="template-page-button" href="/atletismopt">Voltar à Página Inicial</Button>
		</div>
	);
}