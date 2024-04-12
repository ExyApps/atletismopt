import React from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import AthleteTable from '../Components/Table/AthleteTable';

export default class Perfis extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			rows: []
		};
	}

	componentDidMount() {
		document.title = 'AtletismoPT - Perfis';

		fetch(process.env.REACT_APP_API_URL + '/info/athletes')
			.then(response => response.json())
			.then(data => {
				this.setState({
					loading: false,
					rows: data["athletes"]
				});
			});
	}

	render() {
		return (
			<div className='page'>
				{
					this.state.loading
						? <Box
							className="loader-container"
						>
							<CircularProgress className="loader" />
							<p>Aos seus lugares... Pronto... Vai! 💥</p>
						</Box>
						: <AthleteTable
							rows={this.state.rows}
						/>
				}
			</div>
		);
	}
}