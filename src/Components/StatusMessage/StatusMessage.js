import React from 'react';
import './StatusMessage.css';

import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

const StatusMessageType = {
	SUCCESS: {
		color: '#4CAF50',
		backgroundColor: '#E9F7E1',
		icon: CheckRoundedIcon
	},
	ERROR: {
		color: '#F44336',
		backgroundColor: '#FFE7E7',
		icon: ClearRoundedIcon
	}
}

class StatusMessage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message: props.message || '',
			type: props.type || StatusMessageType.SUCCESS,
		}
	}

	updateMessage(message, type) {
		this.setState({ message: message, type: type })
	}

	render() {
		return (
			<Box
				key={this.state.message + this.state.type.color}
				className='status-message'
				display={this.state.message ? 'flex' : 'none'}
				sx={{
					border: `1px solid ${this.state.type.color}`,
					backgroundColor: this.state.type.backgroundColor,
					color: this.state.type.color
				}}
			>
				<Icon
					sx={{
						p: 0,
						m: '8px 8px',
						color: this.state.type.color,
						fontSize: '25px',
						lineHeight: 0,
					}}
				>
					{
						<this.state.type.icon sx={{ fontSize: '25px' }} />
					}
				</Icon>
				<span>{this.state.message}</span>
			</Box>
		)
	}
}

export { StatusMessage, StatusMessageType };