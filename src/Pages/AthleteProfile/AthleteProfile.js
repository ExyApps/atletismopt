import React from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import Button from 'react-bootstrap/Button';

import './AthleteProfile.css';

function withParams(Component) {
	return (props) => <Component {...props} params={useParams()} />;
}

class AthleteProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: false,
			id: null
		};
	}

	componentDidMount() {
		document.title = 'AtletismoPT - Atleta';

		fetch(process.env.REACT_APP_API_URL + '/info/athlete/' + this.props.params.id)
			.then(response => response.json())
			.then(data => {
				// If error occurs, redirect to 404
				if (data["error"]) {
					this.setState({
						error: true,
						loading: false
					});
				} else {
					this.setState({
						loading: false,
						athlete: data["athlete"],
						results: data["results"]
					})
				}

			});
	}

	render() {
		return (
			<>
				{
					this.state.error
						? <div className='template-page'>
							<h1>Atleta não encontrado!</h1>
							<p>Se achar que é um erro do website, por favor informe os administradores <a href="/atletismopt">aqui</a>.</p>

							<Button className="template-page-button" href="/atletismopt">Voltar à Página Inicial</Button>
						</div>
						: <div className='page' >
							{
								this.state.loading
									? <Box
										className="loader-container"
									>
										<CircularProgress className="loader" />
										<p>A calçar os bicos... 👟</p>
									</Box>
									: <Box>
										<Box sx={{
											display: 'flex',
											flexDirection: 'row',
											alignItems: 'center',
										}}>
											<img
												className="profile-pic"
												src="https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg"
												alt='Athlete Profile'
											/>
											<Box sx={{
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'left',
												justifyContent: 'center',
											}}>
												<h1><b>{this.state.athlete.name}</b></h1>
												<h5>{this.state.athlete.birthdate}</h5>
											</Box>
										</Box>
									</Box>
							}
						</div>
				}
			</>
		);
	}
}

export default withParams(AthleteProfile);