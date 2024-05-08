import React from 'react';
import './Calendario.css';

import CircularProgress from '@mui/material/CircularProgress';

import AthleteTable from '../../Components/Table/AthleteTable';

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
							<AthleteTable
								rows={this.state.rows}
							/>
						</div>
				}
			</>
		);
	}
}