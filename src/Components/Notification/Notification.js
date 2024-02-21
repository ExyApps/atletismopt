import React from 'react';

import { Alert, Snackbar } from '@mui/material';
import Slide from '@mui/material/Slide';

function SlideTransition(props) {
	return <Slide {...props} direction="up" />;
}

const NotificationType = Object.freeze({
	Error: 'error',
	Success: 'success',
	Info: 'info',
	Warning: 'warning'
});

class Notification extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			severity: null,
			message: ""
		}
	}

	openNotication(severity, message) {
		this.setState({
			open: true,
			severity: severity,
			message: message
		});
	}

	render() {
		return (
			<Snackbar
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				open={this.state.open}
				autoHideDuration={4000}
				onClose={() => this.setState({ open: false })}
				TransitionComponent={SlideTransition}

			>
				<Alert onClose={() => this.setState({ open: false })} severity={this.state.severity} variant='filled'>
					{this.state.message}
				</Alert>
			</Snackbar>
		)
	}
}

export { Notification, NotificationType };