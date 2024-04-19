import React from 'react';
import './Home.css';

// import ImageCarrosel from '../Components/ImageCarousel/ImageCarousel';

export default class Home extends React.Component {
	render() {
		return (
			<div className="page">
				{/* <ImageCarrosel /> */}
				<h1>Esta página ainda está a ser desenvolvida...</h1>
				<p>Mas pode consultar as páginas que já têm conteúdo!</p>

				<span><a href="/atletismopt/#/perfis">Perfis</a> - Pode consultar a lista de atletas armazenada na base de dados.</span>
				<br />
				<span><a href="/atletismopt/#/perfis/123890">Perfil de atletas</a> - Pode consultar os dados acerca de um atleta específico. Se souber o id da federação, basta alterar no URL, senão pode pesquisar pelo nome na página anterior.</span>
			</div>
		);
	}
}