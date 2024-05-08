import React from 'react';
import './Resultados.css';

import CircularProgress from '@mui/material/CircularProgress';

import CompetitionTable from '../../Components/Table/CompetitionTable';

import getURL from '../../Utils/Requests';

export default class Resultados extends React.Component {
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
		document.title = 'AtletismoPT - Resultados';
		window.addEventListener('resize', this.updateDimensions);

		fetch(getURL() + 'info/finished-competitions')
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
							<p>Os resultados estão a fazer os últimos alongamentos antes de aparecerem! 💪</p>
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