import React from 'react';
import './Home.css';

// import ImageCarrosel from '../Components/ImageCarousel/ImageCarousel';
import { StatusMessage, StatusMessageType } from '../../Components/StatusMessage/StatusMessage.js';

export default class Home extends React.Component {
	render() {
		return (
			<div className="page">

				<StatusMessage
					message="Bem-vindo/a! Este é um projeto que ainda está a ser desenvolvido pelo que vai ter alterações frequentes. Se quiseres ajudar ou dar a tua opinião, podes enviar-nos uma mensagem através do formulário presente na página de Feedback. Também podem seguir a página de Instagram @atletismopt para se manterem a par das novidades!"
					type={StatusMessageType.INFO}
				/>

				{/* <ImageCarrosel /> */}
				<br />
				<span>Consulta as páginas que já estão desenvolvidas:</span>
				<br />
				<span><a href="/atletismopt/#/perfis">Perfis</a> - Pode consultar a lista de atletas armazenada na base de dados.</span>
				<br />
				<span><a href="/atletismopt/#/perfis/123890">Perfil de atletas</a> - Pode consultar os dados acerca de um atleta específico. Se souber o id da federação, basta alterar no URL, senão pode pesquisar pelo nome na página anterior.</span>
				<br />
				<span><a href="/atletismopt/#/feedback">Feedback</a> - Dá-nos a tua opinião ou sugestões de como podemos melhorar o nosso website.</span>
			</div>
		);
	}
}