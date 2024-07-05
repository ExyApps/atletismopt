import React from 'react';
import { useLocation } from 'react-router-dom';
import './Admin.css';

import Box from '@mui/material/Box';

import getURL from '../../Utils/Requests';

class Admin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			problems: []
		};
	}

	componentDidMount() {
		document.title = 'AtletismoPT - Admin';

		fetch(getURL() + 'backoffice/problems')
			.then(response => response.json())
			.then(data => {
				this.setState({ problems: data["problems"] });
			});

		this.setState({ loading: false });
	}

	render() {
		return (
			<div className='page'>
				{
					!this.state.loading && this.state.problems.length > 0
						? this.state.problems.map((problem, index) => {
							if (problem.text === 0) return null;
							return (
								<Box
									className="info-box"
									key={index}
									onClick={() => {
									}}
								>
									<Box className="info-header">
										<span>{problem.header}</span>
									</Box>

									<Box className="info-text">
										<span>{problem.text}</span>
									</Box>
								</Box>
							);
						})
						: null
				}
			</div>
		);
	}

}

const withLocation = Component => props => {
	const location = useLocation();
	return <Component {...props} location={location} />;
}

export default withLocation(Admin);