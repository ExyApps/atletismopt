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

	calculateAge(date) {
		const today = new Date();
		const birthdate = new Date(date);

		const age = today.getFullYear() - birthdate.getFullYear();
		const m = today.getMonth() - birthdate.getMonth();
		const d = today.getDate() - birthdate.getDate();

		console.log(age, m, d);

		return (m < 0 || (m === 0 && d < 0)) ? age - 1 : age;
	}

	dateToText(date) {
		const months = {
			'01': 'janeiro',
			'02': 'fevereiro',
			'03': 'março',
			'04': 'abril',
			'05': 'maio',
			'06': 'junho',
			'07': 'julho',
			'08': 'agosto',
			'09': 'setembro',
			'10': 'outubro',
			'11': 'novembro',
			'12': 'dezembro'
		};

		const dateArray = date.split('-');
		const age = this.calculateAge(date);

		date = dateArray[2] + ' de ' + months[dateArray[1]] + ' de ' + dateArray[0];
		if (age === 1) {
			date += ' (1 ano)';
		} else {
			date += ' (' + age + ' anos)';
		}

		return date;
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
												<p>{this.dateToText(this.state.athlete.birthdate)}</p>
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