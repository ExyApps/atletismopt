import React from 'react';
import { useParams } from 'react-router-dom';
import './AthleteProfile.css';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

import {
	isMobileDevice,
	isMobileDeviceLandscape,
} from '../../Utils/WindowSizes';

import getURL from '../../Utils/Requests';
import AthleteResultsTable from '../../Components/Table/AthleteResultsTable';
import AthleteBestResultsTable from '../../Components/Table/AthleteBestResultsTable';

function withParams(Component) {
	return (props) => <Component {...props} params={useParams()} />;
}

const modes = [
	'Resultados',
	'Recordes da Época',
	'Recordes Pessoais'
]

class AthleteProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			width: window.innerWidth,

			loading: true,
			error: false,
			id: null,

			mode: 0,
		};
	}

	updateDimensions = () => {
		this.setState({ width: window.innerWidth });
	}

	filterRecords(events, results) {
		var personal_bests = [];
		var season_bests = [];

		const no_results = ["x", "sm"];

		for (let i = 0; i < events.length; i++) {
			const event = events[i];
			const matching_events = results.filter(result => result.event_name === event.name);
			const season_matching_events = matching_events.filter(
				result => result.event_name === event.name &&
					((result.date.split('-')[0] === new Date().getFullYear().toString() && parseInt(result.date.split('-')[1]) < 9)
						||
						(result.date.split('-')[0] === (new Date().getFullYear() - 1).toString() && parseInt(result.date.split('-')[1]) >= 9))
			);

			if (event.direction === 1) {
				const best = matching_events.reduce((prev, current) => {
					if (no_results.includes(prev.result.toLowerCase().trim())) return current;
					if (no_results.includes(current.result.toLowerCase().trim())) return prev;

					// TODO: Check the wind

					return ((prev.result > current.result) ? prev : current);
				});

				personal_bests.push(best);

				if (season_matching_events.length !== 0) {
					const season_best = season_matching_events.reduce((prev, current) => {
						if (no_results.includes(prev.result.toLowerCase().trim())) return current;
						if (no_results.includes(current.result.toLowerCase().trim())) return prev;

						// TODO: Check the wind

						return ((prev.result > current.result) ? prev : current);
					});
					season_bests.push(season_best);
				}


			} else {
				const best = matching_events.reduce((prev, current) => {
					if (no_results.includes(prev.result.toLowerCase().trim())) return current;
					if (no_results.includes(current.result.toLowerCase().trim())) return prev;

					// TODO: Check the wind

					return ((prev.result < current.result) ? prev : current);
				});

				personal_bests.push(best);

				if (season_matching_events.length !== 0) {
					const season_best = season_matching_events.reduce((prev, current) => {
						if (no_results.includes(prev.result.toLowerCase().trim())) return current;
						if (no_results.includes(current.result.toLowerCase().trim())) return prev;

						// TODO: Check the wind

						return ((prev.result < current.result) ? prev : current);
					});

					season_bests.push(season_best);
				}
			}
		}

		this.setState({
			personal_bests: personal_bests,
			season_bests: season_bests
		});
	}

	componentDidMount() {
		document.title = 'AtletismoPT - Atleta';
		window.addEventListener('resize', this.updateDimensions);

		// Fetch the 
		fetch(getURL() + 'info/athlete/' + this.props.params.id)
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
						results: data["results"],
					})

					this.filterRecords(data["events"], data["results"]);
				}

			});
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateDimensions);
	}

	calculateAge(date) {
		const today = new Date();
		const birthdate = new Date(date);

		const age = today.getFullYear() - birthdate.getFullYear();
		const m = today.getMonth() - birthdate.getMonth();
		const d = today.getDate() - birthdate.getDate();

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

	/*********************************************************
	 * HEADERS
	 *********************************************************/
	renderMobileHeader() {
		return (
			<Box className='profile-background'
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<img
					className="mobile-profile-pic"
					src="https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg"
					alt='Athlete Profile'
					sx={{
						m: 0
					}}
				/>
				<Box sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
				}}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<h1>
							<b>
								{this.state.athlete.name}
							</b>
						</h1>
					</Box>
					<span>{this.dateToText(this.state.athlete.birthdate)}</span>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<span style={{ marginRight: "4px" }}>
							{this.state.athlete.nationality}
						</span>
						<i className={`flag icon-flag-${this.state.athlete.nationality}`} />
					</Box>
					<span>
						{this.state.athlete.club_abbreviation} ({this.state.athlete.club_name})
					</span>
				</Box>
			</Box>
		)
	}

	renderMobileLandscapeHeader() {
		return (
			<Box className='profile-background'
				sx={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
				}}
			>
				<img
					className="mobile-profile-pic"
					src="https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg"
					alt='Athlete Profile'
					style={{
						marginLeft: '2rem'
					}}
				/>
				<Box sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'left',
					justifyContent: 'center',
					marginLeft: '1rem'
				}}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center'
						}}
					>
						<h1>
							<b>
								{this.state.athlete.name}
							</b>
						</h1>
					</Box>
					<span>{this.dateToText(this.state.athlete.birthdate)}</span>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'left',
							alignItems: 'center'
						}}
					>
						<span style={{ marginRight: "4px" }}>
							{this.state.athlete.nationality}
						</span>
						<i className={`flag icon-flag-${this.state.athlete.nationality}`} />
					</Box>
					<span>
						{this.state.athlete.club_abbreviation} ({this.state.athlete.club_name})
					</span>
				</Box>
			</Box>
		)
	}

	renderHeader() {
		return (
			<Box className='profile-background'
				sx={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
				}}
			>
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
					marginLeft: '5rem'
				}}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center'
						}}
					>
						<h1>
							<b>
								{this.state.athlete.name}
							</b>
						</h1>
					</Box>
					<span>{this.dateToText(this.state.athlete.birthdate)}</span>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'left',
							alignItems: 'center'
						}}
					>
						<span style={{ marginRight: "4px" }}>
							{this.state.athlete.nationality}
						</span>
						<i className={`flag icon-flag-${this.state.athlete.nationality}`} />
					</Box>
					<span>
						{this.state.athlete.club_abbreviation} ({this.state.athlete.club_name})
					</span>
				</Box>
			</Box>
		)
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
						: <>
							{
								this.state.loading
									? <div className='page'>
										<Box
											className="loader-container"
										>
											<CircularProgress className="loader" />
											<p>A calçar os bicos... 👟</p>
										</Box>
									</div>
									: <Box className='profile-page'>
										{
											isMobileDevice()
												? this.renderMobileHeader()
												: isMobileDeviceLandscape()
													? this.renderMobileLandscapeHeader()
													: this.renderHeader()
										}

										<Box
											className="profile-buttons"
										>
											<Box
												sx={{
													display: 'flex',
													flexDirection: 'row',
												}}
											>
												{
													modes.map((mode, index) => {
														return <Button
															key={mode}
															className={(this.state.mode === index ? 'selected mode-button' : 'mode-button') + (index % 2 === 0 ? ' left-button' : '')}
															variant={this.state.mode === index ? 'contained' : 'outlined'}
															onClick={() => this.setState({ mode: index })}
															sx={{
																marginRight: '1rem'
															}}
														>
															{mode}
														</Button>
													})
												}
											</Box>

											{
												{
													0: <AthleteResultsTable
														rows={this.state.results}
													/>,
													1: <AthleteBestResultsTable
														key="season_bests"
														rows={this.state.season_bests}
													/>,
													2: <AthleteBestResultsTable
														key="personal_bests"
														rows={this.state.personal_bests}
													/>
												}[this.state.mode]
											}
										</Box>
									</Box>
							}
						</>
				}
			</>
		);
	}
}

export default withParams(AthleteProfile);