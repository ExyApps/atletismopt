import React from 'react';

import CircularProgress from '@mui/material/CircularProgress';

import AthleteTable from '../Components/Table/AthleteTable';
import getURL from '../Utils/Requests';

export default class Perfis extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			windowWidth: window.innerWidth,

			loading: true,
			rows: []
		};
	}

	updateDimensions = () => {
		this.setState({ width: window.innerWidth });
	}

	componentDidMount() {
		document.title = 'AtletismoPT - Perfis';
		window.addEventListener('resize', this.updateDimensions);

		fetch(getURL() + 'info/athletes')
			.then(response => response.json())
			.then(data => {
				this.setState({
					loading: false,
					rows: data["athletes"]
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