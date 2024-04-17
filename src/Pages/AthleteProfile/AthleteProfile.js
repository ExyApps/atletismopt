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

function withParams(Component) {
	return (props) => <Component {...props} params={useParams()} />;
}

const modes = [
	'Resultados',
	'Recordes'
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
						results: data["results"]
					})
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
					<a href="/atletismopt">
						{this.state.athlete.club_abbreviation} ({this.state.athlete.club_name})
					</a>
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
					<a href="/atletismopt">
						{this.state.athlete.club_abbreviation} ({this.state.athlete.club_name})
					</a>
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
					<a href="/atletismopt">
						{this.state.athlete.club_abbreviation} ({this.state.athlete.club_name})
					</a>
				</Box>
			</Box>
		)
	}

	render() {
		var width = window.innerWidth;
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
												this.state.mode === 0
													? <Box>
														<AthleteResultsTable
															rows={this.state.results}
														/>
													</Box>
													: null
											}

											{
												this.state.mode === 1
													? <Box sx={{ display: 'flex', flexDirection: 'column' }}>
														<span>{width}</span>
														{/* <span>{isMobileDevice() ? 'true' : 'false'}</span>
														<span>{isMobileDeviceLandscape() ? 'true' : 'false'}</span>
														<span>{isTabletDevice() ? 'true' : 'false'}</span> */}
														{/* <span>{isSmallDesktopDevice() ? 'true' : 'false'}</span>
														<span>{isLargeDesktopDevice() ? 'true' : 'false'}</span> */}
													</Box>
													: null
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