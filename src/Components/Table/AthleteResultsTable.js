import React from 'react';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

import { isMobile } from 'react-device-detect';

import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import './AthleteTable.css';
import Table from './Table';

export default class AthleteResultsTable extends Table {
	componentDidMount() {
		this.setState({
			orderBy: 'date',
			order: 'desc',

			// Filters
			events: [],
			eventSelected: '',

			years: [],
			yearSelected: '',

			onlyValid: false,
		}, () => {
			this.getAllYears();
			this.getAllEvents();

			this.stableSort(
				this.state.rows,
				this.getComparator(this.state.order, this.state.orderBy)
			)
		});
	}

	getAllYears() {
		const years = this.state.rows.map(row => `${row.date.split('-')[0]}`);
		const uniqueYears = [...new Set(years)];
		uniqueYears.sort((a, b) => -a.localeCompare(b));
		this.setState({ years: uniqueYears });
	}

	getAllEvents() {
		const events = this.state.rows.map(row => row.event_name);
		const uniqueEvents = [...new Set(events)];
		uniqueEvents.sort((a, b) => a.localeCompare(b));
		this.setState({ events: uniqueEvents });
	}

	// handleClick = (event, id) => {
	// 	window.location.href = `#/perfis/${id}`;
	// };

	renderHeader() {
		// if (!isMobile) {
		return (
			<tr>
				<th>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							':hover': {
								cursor: 'pointer',
							}
						}}
						onClick={(event) => this.handleRequestSort(event, 'date')}
					>
						Data
						{
							this.state.orderBy === 'date'
								? this.state.order === 'asc'
									? <ArrowDropUpIcon />
									: <ArrowDropDownIcon />
								: null
						}
					</Box>
				</th>
				<th>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							':hover': {
								cursor: 'pointer',
							}
						}}
						onClick={(event) => this.handleRequestSort(event, 'event_name')}
					>
						Evento
						{
							this.state.orderBy === 'event_name'
								? this.state.order === 'asc'
									? <ArrowDropUpIcon />
									: <ArrowDropDownIcon />
								: null
						}
					</Box>
				</th>
				<th>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							':hover': {
								cursor: 'pointer',
							}
						}}
						onClick={(event) => this.handleRequestSort(event, 'competition_name')}
					>
						Competição
						{
							this.state.orderBy === 'competition_name'
								? this.state.order === 'asc'
									? <ArrowDropUpIcon />
									: <ArrowDropDownIcon />
								: null
						}
					</Box>
				</th>
				<th>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							':hover': {
								cursor: 'pointer',
							}
						}}
						onClick={(event) => this.handleRequestSort(event, 'competition_location')}
					>
						Local
						{
							this.state.orderBy === 'competition_location'
								? this.state.order === 'asc'
									? <ArrowDropUpIcon />
									: <ArrowDropDownIcon />
								: null
						}
					</Box>
				</th>
				<th>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							':hover': {
								cursor: 'pointer',
							}
						}}
						onClick={(event) => this.handleRequestSort(event, 'result')}
					>
						Resultado
						{
							this.state.orderBy === 'result'
								? this.state.order === 'asc'
									? <ArrowDropUpIcon />
									: <ArrowDropDownIcon />
								: null
						}
					</Box>
				</th>
				<th>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							':hover': {
								cursor: 'pointer',
							}
						}}
						onClick={(event) => this.handleRequestSort(event, 'wind')}
					>
						Vento
						{
							this.state.orderBy === 'wind'
								? this.state.order === 'asc'
									? <ArrowDropUpIcon />
									: <ArrowDropDownIcon />
								: null
						}
					</Box>
				</th>
			</tr>
		)
	}
	// return (
	// 	<tr>
	// 		<th>
	// 			<Box
	// 				sx={{
	// 					display: 'flex',
	// 					flexDirection: 'row',
	// 					justifyContent: 'center',
	// 					alignItems: 'center',
	// 					':hover': {
	// 						cursor: 'pointer',
	// 					}
	// 				}}
	// 				onClick={(event) => this.handleRequestSort(event, 'name')}
	// 			>
	// 				Atleta
	// 				{
	// 					this.state.orderBy === 'name'
	// 						? this.state.order === 'asc'
	// 							? <ArrowDropUpIcon />
	// 							: <ArrowDropDownIcon />
	// 						: null
	// 				}
	// 			</Box>
	// 		</th>
	// 		<th>
	// 			<Box
	// 				sx={{
	// 					display: 'flex',
	// 					flexDirection: 'row',
	// 					justifyContent: 'center',
	// 					alignItems: 'center',
	// 					':hover': {
	// 						cursor: 'pointer',
	// 					}
	// 				}}
	// 				onClick={(event) => this.handleRequestSort(event, 'birthdate')}
	// 			>
	// 				Nasc.
	// 				{
	// 					this.state.orderBy === 'birthdate'
	// 						? this.state.order === 'asc'
	// 							? <ArrowDropUpIcon />
	// 							: <ArrowDropDownIcon />
	// 						: null
	// 				}
	// 			</Box>
	// 		</th>
	// 		<th>
	// 			<Box
	// 				sx={{
	// 					display: 'flex',
	// 					flexDirection: 'row',
	// 					justifyContent: 'center',
	// 					alignItems: 'center',
	// 					':hover': {
	// 						cursor: 'pointer',
	// 					}
	// 				}}
	// 				onClick={(event) => this.handleRequestSort(event, 'club_name')}
	// 			>
	// 				Clube
	// 				{
	// 					this.state.orderBy === 'club_name'
	// 						? this.state.order === 'asc'
	// 							? <ArrowDropUpIcon />
	// 							: <ArrowDropDownIcon />
	// 						: null
	// 				}
	// 			</Box>
	// 		</th>
	// 	</tr>
	// )
	// }

	renderTable(rows) {
		// if (!isMobile) {
		return (
			rows.length === 0
				? <tr>
					<td colSpan={6}>
						<div className="empty-table">
							<span>Não foram encontrados resultados.</span>
						</div>
					</td>
				</tr>
				: rows.map((row, id) => (
					<tr key={row.event_id} className="clickable-row" onClick={(event) => this.handleClick(event, row.event_id)}>
						<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{row.date}</Box></td>
						<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{row.event_name}</Box></td>
						<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{row.competition_name}</Box></td>
						<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{row.competition_location}</Box></td>
						<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{row.result}</Box></td>
						<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							{
								row.wind === null || row.wind === undefined
									? '-'
									: row.wind
							}
						</Box></td>
					</tr>
				))
		)
	}

	// 	return (
	// 		rows.length === 0
	// 			? <tr>
	// 				<td colSpan={3}>
	// 					<div className="empty-table">
	// 						<span>Não foram encontrados resultados.</span>
	// 					</div>
	// 				</td>
	// 			</tr>
	// 			: rows.map((row, id) => (
	// 				<tr key={id} className="clickable-row" onClick={(event) => this.handleClick(event, row.id)}>
	// 					<td key={id}>
	// 						<Box
	// 							sx={{
	// 								display: 'flex',
	// 								flexDirection: 'row',
	// 								justifyContent: 'space-between',
	// 								alignItems: 'center'
	// 							}}
	// 						>
	// 							<i className={`flag icon-flag-${row.nationality}`} />
	// 							<span style={{
	// 								marginLeft: "4px",
	// 							}}>
	// 								{row.name}
	// 							</span>
	// 							{
	// 								row.gender === 'M'
	// 									? <Box
	// 										sx={{
	// 											display: 'flex',
	// 											justifyContent: 'center',
	// 											alignItems: 'center'
	// 										}}
	// 									>
	// 										<TbMars className='mars' size={20} />
	// 									</Box>
	// 									: <Box
	// 										sx={{
	// 											display: 'flex',
	// 											justifyContent: 'center',
	// 											alignItems: 'center'
	// 										}}
	// 									>
	// 										<TbVenus className='venus' size={20} />
	// 									</Box>
	// 							}
	// 						</Box>
	// 					</td>
	// 					<td>
	// 						{row.birthdate.split('-')[0]}
	// 					</td>
	// 					<td>
	// 						{row.club_abbreviation}
	// 					</td>
	// 				</tr>
	// 			))
	// 	)
	// }

	renderFooter(rows) {
		const initialRow = Math.min(this.state.page * this.state.rowsPerPage + 1, rows.length);
		const finalRow = Math.min(this.state.page * this.state.rowsPerPage + this.state.rowsPerPage, rows.length);

		if (!isMobile) {
			return (
				<tr>
					<td colSpan={6}>
						<div className="foot-table">
							<span>Linhas por página:</span>

							<FormControl
								sx={{
									marginLeft: '2rem',
									marginRight: '2rem',
								}}
							>
								<NativeSelect
									className='foot-select'
									size="small"
									sx={{
										color: "#fff",
										'& .MuiSvgIcon-root': {
											color: 'white'
										}
									}}
									disableUnderline
									value={this.state.rowsPerPage}
									inputProps={{
										name: 'rowsPerPage',
										id: 'uncontrolled-native',
									}}
									onChange={this.handleChangeRowsPerPage}
								>
									<option value={5}>5</option>
									<option value={10}>10</option>
									<option value={20}>20</option>
								</NativeSelect>
							</FormControl>

							<span>
								{`${initialRow}-${finalRow} de ${rows.length}`}
							</span>

							<IconButton
								sx={{ m: 0, p: 0, marginLeft: '2rem', color: "#fff" }}
								onClick={(event) => this.handleChangePage(event, this.state.page - 1)}
								disabled={this.state.page === 0}
							>
								<KeyboardArrowLeftIcon />
							</IconButton>
							<IconButton
								sx={{ m: 0, p: 0, color: "#fff" }}
								onClick={(event) => this.handleChangePage(event, this.state.page + 1)}
								disabled={this.state.page >= Math.ceil(rows.length / this.state.rowsPerPage) - 1}
							>
								<KeyboardArrowRightIcon />
							</IconButton>
						</div>
					</td>
				</tr>
			)
		}
		return (
			<tr>
				<td colSpan={3}>
					<div className="foot-table">
						<span>Linhas por página:</span>

						<FormControl
							sx={{
								marginLeft: '1rem',
								marginRight: '1rem',
							}}
						>
							<NativeSelect
								className='foot-select'
								size="small"
								sx={{
									color: "#fff",
									'& .MuiSvgIcon-root': {
										color: 'white'
									}
								}}
								disableUnderline
								value={this.state.rowsPerPage}
								inputProps={{
									name: 'rowsPerPage',
									id: 'uncontrolled-native',
								}}
								onChange={this.handleChangeRowsPerPage}
							>
								<option value={5}>5</option>
								<option value={10}>10</option>
								<option value={20}>20</option>
							</NativeSelect>
						</FormControl>

						<span>
							{`${initialRow}-${finalRow} de ${rows.length}`}
						</span>

						<IconButton
							sx={{ m: 0, p: 0, marginLeft: '1rem', color: "#fff" }}
							onClick={(event) => this.handleChangePage(event, this.state.page - 1)}
							disabled={this.state.page === 0}
						>
							<KeyboardArrowLeftIcon />
						</IconButton>
						<IconButton
							sx={{ m: 0, p: 0, color: "#fff" }}
							onClick={(event) => this.handleChangePage(event, this.state.page + 1)}
							disabled={this.state.page >= Math.ceil(rows.length / this.state.rowsPerPage) - 1}
						>
							<KeyboardArrowRightIcon />
						</IconButton>
					</div>
				</td>
			</tr>
		)
	}

	render() {
		const searchedRows = this.state.rows.filter(row => {
			// Compare the text field text
			return (this.state.eventSelected === '' || row.event_name === this.state.eventSelected)
				&& (this.state.yearSelected === '' || row.date.split('-')[0] === this.state.yearSelected)
				&& (this.state.onlyValid === false || row.wind === null || row.wind <= 2)
		});

		const visibleRows = this.stableSort(searchedRows, this.getComparator(this.state.order, this.state.orderBy)).slice(
			this.state.page * this.state.rowsPerPage,
			this.state.page * this.state.rowsPerPage + this.state.rowsPerPage,
		);

		return (
			<Box sx={{ width: '100%' }}>
				<Box
					sx={{
						boxSizing: 'border-box',
						width: '100%',
					}}
				>

					{/* Event Dropdown */}
					{
						!isMobile
							? <FormControl size="small" className="form-control-table left-form">
								<InputLabel id="event-select-label" shrink={true}>Evento</InputLabel>
								<Select
									displayEmpty
									notched={true}
									sx={{
										minWidth: '180px'
									}}
									id="event-select"
									defaultValue={''}
									value={this.state.eventSelected}
									label="Evento"
									onChange={(event) => this.setState({ eventSelected: event.target.value, page: 0 })}
								>
									<MenuItem value={''}>Todos</MenuItem>
									{
										this.state.events !== undefined
											? this.state.events.map((ev, id) => (
												<MenuItem key={id} value={ev}>{ev}</MenuItem>
											))
											: null
									}
								</Select>
							</FormControl>
							: <FormControl size="small" className="form-control-table left-form">
								<InputLabel id="event-sec-select-label" shrink={true}>Evento</InputLabel>
								<NativeSelect
									notched={true}
									sx={{
										minWidth: '180px'
									}}
									input={
										<OutlinedInput />
									}
									id="event-sec-select"
									value={this.state.eventSelected}
									label="Evento"
									onChange={(event) => this.setState({ eventSelected: event.target.value, page: 0 })}
								>
									<option value={''}>Todos</option>
									{
										this.state.events !== undefined
											? this.state.events.map((ev, id) => (
												<option key={id} value={ev}>{ev}</option>
											))
											: null
									}
								</NativeSelect>
							</FormControl>
					}

					{/* Year Dropdown */}
					{
						!isMobile
							? <FormControl size="small" className="form-control-table">
								<InputLabel id="years-select-label" shrink={true}>Ano</InputLabel>
								<Select
									displayEmpty
									notched={true}
									sx={{
										minWidth: '180px'
									}}
									id="year-select"
									defaultValue={''}
									value={this.state.yearSelected}
									label="Ano"
									onChange={(event) => this.setState({ yearSelected: event.target.value, page: 0 })}
								>
									<MenuItem value={''}>Todos</MenuItem>
									{
										this.state.years !== undefined
											? this.state.years.map((year, id) => (
												<MenuItem key={id} value={year}>{year}</MenuItem>
											))
											: null
									}
								</Select>
							</FormControl>
							: <FormControl size="small" className="form-control-table">
								<InputLabel id="year-sec-select-label" shrink={true}>Ano</InputLabel>
								<NativeSelect
									notched={true}
									sx={{
										minWidth: '180px'
									}}
									input={
										<OutlinedInput />
									}
									id="year-sec-select"
									value={this.state.yearSelected}
									label="Ano"
									onChange={(event) => this.setState({ yearSelected: event.target.value, page: 0 })}
								>
									<option value={''}>Todos</option>
									{
										this.state.years !== undefined
											? this.state.years.map((year, id) => (
												<option key={id} value={year}>{year}</option>
											))
											: null
									}
								</NativeSelect>
							</FormControl>
					}
				</Box>

				<table className="content-table">
					<thead>
						{
							this.renderHeader()
						}
					</thead>
					<tbody>
						{
							this.renderTable(visibleRows)
						}
					</tbody>
					<tfoot>
						{
							this.renderFooter(searchedRows)
						}
					</tfoot>
				</table>
			</Box>
		);
	}
}