import React from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import AthleteTable from '../Components/Table/AthleteTable';
import getURL from '../Information/Requests';

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

		fetch(getURL() + 'info/athletes')
			.then(response => response.json())
			.then(data => {
				this.setState({
					loading: false,
					rows: data["athletes"]
					// .sort((a, b) => {
					// 	return a["name"].localeCompare(b["name"]);
					// })
				});
			});
	}

	render() {
		return (
			<>
				{
					this.state.loading
						? <div
							className='page loader-container'
						>
							<CircularProgress className="loader" />
							<p>Aos seus lugares... Pronto... Vai! 💥</p>
						</div>
						: <div className='page'>
							<AthleteTable
								rows={this.state.rows}
							/>
						</div>
				}
			</>


		);
	}
}