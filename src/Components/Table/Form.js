import React from 'react';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { isMobile } from 'react-device-detect';

export default class Form extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			parent: props.parent,
			variable: props.variable,
			name: props.name,
			options: props.options,
			minWidth: props.minWidth || '120px',

			selectedOption: '',
		};
	}

	updateOptions = (options) => {
		this.setState({ options: options });
	}

	updateParentVariables = (event) => {
		this.setState({ selectedOption: event.target.value });
		this.state.parent.setState(
			{ [this.state.variable]: event.target.value, page: 0 },
			() => this.state.parent.updateSearchedRows()
		);
	}

	render() {
		return <>
			{
				isMobile
					? <FormControl
						size="small"
						className="form-control-table"
					>
						<InputLabel
							id={`${this.state.variable}-sec-select-label`}
							shrink={true}
						>
							{
								this.state.name
							}
						</InputLabel>

						<NativeSelect
							notched={true}
							sx={{
								minWidth: `${this.state.minWidth}`
							}}
							input={<OutlinedInput />}
							id={`${this.state.variable}-sec-select`}
							value={this.state.selectedOption}
							label={this.state.name}
							onChange={this.updateParentVariables}
						>
							<option value={''}>Todos</option>
							{
								this.state.options.map((option) => {
									return <option
										key={option.name}
										value={option.value}
									>
										{
											option.name
										}
									</option>
								})
							}
						</NativeSelect>
					</FormControl>

					: <FormControl
						size="small"
						className="form-control-table"
					>
						<InputLabel
							id={`${this.state.variable}-sec-select-label`}
							shrink={true}
						>
							{
								this.state.name
							}
						</InputLabel>

						<Select
							notched={true}
							sx={{
								minWidth: `${this.state.minWidth}`
							}}
							id={`${this.state.variable}-sec-select`}
							defaultValue={''}
							value={this.state.selectedOption}
							label={this.state.name}
							onChange={this.updateParentVariables}
						>
							<MenuItem value={''}>Todos</MenuItem>
							{
								this.state.options.map((option) => {
									return <MenuItem
										key={option.name}
										value={option.value}
									>
										{
											option.name
										}
									</MenuItem>
								})
							}
						</Select>
					</FormControl>
			}
		</>
	}
}