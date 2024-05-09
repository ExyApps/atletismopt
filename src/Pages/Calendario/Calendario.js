import React from 'react';
import './Calendario.css';

import CircularProgress from '@mui/material/CircularProgress';

import CompetitionTable from '../../Components/Table/CompetitionTable';

import getURL from '../../Utils/Requests';

export default class Calendario extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			width: window.innerWidth,

			loading: true,
			rows: []
		};
	}

	updateDimensions = () => {
		this.setState({ width: window.innerWidth });
	}

	componentDidMount() {
		document.title = 'AtletismoPT - Calendário';
		window.addEventListener('resize', this.updateDimensions);

		fetch(getURL() + 'info/next-competitions')
			.then(response => response.json())
			.then(data => {
				this.setState({
					loading: false,
					rows: data["competitions"]
				});
			});
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateDimensions);
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
							<p>A carregar as próximas competições... 🕒</p>
						</div>
						: <div className='page'>
							<CompetitionTable
								rows={this.state.rows}
							/>
						</div>
				}
			</>
		);
	}
}