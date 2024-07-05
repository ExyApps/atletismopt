import React from 'react';
import './AthleteResultsTable.css';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import {
	isMobileDeviceLandscape,
	isTabletDevice
} from '../../Utils/WindowSizes';

import TableHeader from './TableHeader';
import Table from './Table';
import Form from './Form';

export default class AthleteResultsTable extends Table {
	componentDidMount() {
		window.addEventListener('resize', this.updateDimensions);

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
		});
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateDimensions);
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

	handleClick = (_, id) => {

	};

	updateSearchedRows() {
		var newRows = this.state.rows.filter(row => {
			// Compare the text field text
			return (this.state.eventSelected === '' || row.event_name === this.state.eventSelected)
				&& (this.state.yearSelected === '' || row.date.split('-')[0] === this.state.yearSelected)
				&& (this.state.onlyValid === false || row.wind === null || row.wind <= 2)
		});

		newRows = this.stableSort(
			newRows,
			this.getComparator(this.state.order, this.state.orderBy)
		)

		this.setState({ searchedRows: newRows });
	}

	renderMobile(rows) {
		const initialRow = Math.min(this.state.page * this.state.rowsPerPage + 1, this.state.searchedRows.length);
		const finalRow = Math.min(this.state.page * this.state.rowsPerPage + this.state.rowsPerPage, this.state.searchedRows.length);

		const orderOptions = [
			{ name: 'Data', value: 'date' },
			{ name: 'Evento', value: 'event_name' },
			{ name: 'Competição', value: 'competition_name' },
			{ name: 'Local', value: 'competition_location' },
			{ name: 'Resultado', value: 'result' },
			{ name: 'Vento', value: 'wind' }
		]

		const orderingOptions = [
			{ name: 'Ascendente', value: 'asc' },
			{ name: 'Decrescente', value: 'desc' }
		]

		return (
			<>
				<span className='small-heading'>
					Ordenar
				</span>

				<Box className='ordering-forms'>
					<FormControl
						size="small"
						className='ordering-form'
					>
						<InputLabel
							id={`order-sec-select-label`}
							shrink={true}
						>
							Ordenar por
						</InputLabel>

						<NativeSelect
							notched={true}
							sx={{
								minWidth: `120px`
							}}
							input={<OutlinedInput />}
							id={`order-sec-select`}
							defaultValue={this.state.orderBy}
							value={this.state.orderBy}
							label="Ordenar por"
							onChange={(e) => {
								this.setState(
									{ "orderBy": e.target.value, page: 0 },
									() => this.updateSearchedRows()
								);
							}}
						>
							{
								orderOptions.map((option) => {
									return <option
										key={option.name}
										value={option.value}
									>
										{option.name}
									</option>
								})
							}
						</NativeSelect>
					</FormControl>

					<FormControl
						size="small"
						className='ordering-form'
					>
						<InputLabel
							id={`ordering-sec-select-label`}
							shrink={true}
						>
							Direção
						</InputLabel>

						<NativeSelect
							notched={true}
							sx={{
								minWidth: `120px`
							}}
							input={<OutlinedInput />}
							id={`ordering-sec-select`}
							defaultValue={this.state.order}
							value={this.state.order}
							label="Direção"
							onChange={(e) => {
								this.setState(
									{ "order": e.target.value, page: 0 },
									() => this.updateSearchedRows()
								);
							}}
						>
							{
								orderingOptions.map((option) => {
									return <option
										key={option.name}
										value={option.value}
									>
										{option.name}
									</option>
								})
							}
						</NativeSelect>
					</FormControl>
				</Box>

				<table className="content-table">
					<thead>
						<tr>
							<TableHeader
								parent={this}
								field=''
								name='Resultados'
								sortable={false}
							/>
						</tr>
					</thead>
					<tbody>
						{
							rows.length === 0
								? <tr>
									<td>
										<div className="empty-table">
											<span>Não foram encontrados resultados.</span>
										</div>
									</td>
								</tr>
								: rows.map((row, id) => (
									<tr
										key={row.event_id + " " + row.attempt}
										className="clickable-row"
										onClick={(event) => this.handleClick(event, row.event_id)}
									>
										<Box sx={{
											m: '4px 0',
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
											justifyContent: 'center',
											width: '100%',
										}}>
											<span
												className="mobile-span"
												style={{ fontSize: '15px' }}
											>
												<b>
													{row.event_name} - {row.result}
													{
														row.wind === null || row.wind === undefined
															? ''
															: ` (${row.wind}v)`
													}
												</b>
											</span>
											<span className="mobile-span" style={{ fontSize: '13px' }}>{row.competition_name}</span>
											<span className="mobile-span" style={{ fontSize: '13px' }}>{row.competition_location}</span>
											<span className="mobile-span" style={{ fontSize: '14px' }}>{row.date.split('-').reverse().join('/')}</span>
										</Box>
									</tr>
								))
						}
					</tbody>
					<tfoot>
						<tr>
							<td>
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
										{`${initialRow}-${finalRow} de ${this.state.searchedRows.length}`}
									</span>

									<Box>
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
											disabled={this.state.page >= Math.ceil(this.state.searchedRows.length / this.state.rowsPerPage) - 1}
										>
											<KeyboardArrowRightIcon />
										</IconButton>
									</Box>
								</div>
							</td>
						</tr>
					</tfoot>
				</table>
			</>
		)
	}

	renderTablet(rows) {
		const initialRow = Math.min(this.state.page * this.state.rowsPerPage + 1, this.state.searchedRows.length);
		const finalRow = Math.min(this.state.page * this.state.rowsPerPage + this.state.rowsPerPage, this.state.searchedRows.length);

		return (
			<table className="content-table">
				<thead>
					<tr>
						<TableHeader
							parent={this}
							field='date'
							name='Data'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>
						<TableHeader
							parent={this}
							field='event_name'
							name='Evento'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>
						<TableHeader
							parent={this}
							field='competition_name'
							name='Competição'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>
						<TableHeader
							parent={this}
							field='result'
							name='Resultado'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>
					</tr>
				</thead>
				<tbody>
					{
						rows.length === 0
							? <tr>
								<td colSpan={6}>
									<div className="empty-table">
										<span>Não foram encontrados resultados.</span>
									</div>
								</td>
							</tr>
							: rows.map((row, id) => (
								<tr key={row.event_id + " " + row.attempt} className="clickable-row" onClick={(event) => this.handleClick(event, row.event_id)}>
									<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{row.date.split('-').reverse().join('/')}</Box></td>
									<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{row.event_name}</Box></td>
									<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{row.competition_name}</Box></td>
									<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
										{
											row.result
										}
										{
											row.wind === null || row.wind === undefined
												? ''
												: ` (${row.wind}v)`
										}
									</Box></td>
								</tr>
							))
					}
				</tbody>
				<tfoot>
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
									{`${initialRow}-${finalRow} de ${this.state.searchedRows.length}`}
								</span>

								<Box>
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
										disabled={this.state.page >= Math.ceil(this.state.searchedRows.length / this.state.rowsPerPage) - 1}
									>
										<KeyboardArrowRightIcon />
									</IconButton>
								</Box>
							</div>
						</td>
					</tr>
				</tfoot>
			</table>
		)
	}

	renderDesktop(rows) {
		const initialRow = Math.min(this.state.page * this.state.rowsPerPage + 1, this.state.searchedRows.length);
		const finalRow = Math.min(this.state.page * this.state.rowsPerPage + this.state.rowsPerPage, this.state.searchedRows.length);

		return (
			<table className="content-table">
				<thead>
					<tr>
						<TableHeader
							parent={this}
							field='date'
							name='Data'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>
						<TableHeader
							parent={this}
							field='event_name'
							name='Evento'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>
						<TableHeader
							parent={this}
							field='competition_name'
							name='Competição'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>
						<TableHeader
							parent={this}
							field='competition_location'
							name='Local'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>
						<TableHeader
							parent={this}
							field='result'
							name='Resultado'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>
					</tr>
				</thead>
				<tbody>
					{
						rows.length === 0
							? <tr>
								<td colSpan={6}>
									<div className="empty-table">
										<span>Não foram encontrados resultados.</span>
									</div>
								</td>
							</tr>
							: rows.map((row, id) => (
								<tr key={row.event_id + " " + row.attempt} className="clickable-row" onClick={(event) => this.handleClick(event, row.event_id)}>
									<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{row.date.split('-').reverse().join('/')}</Box></td>
									<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{row.event_name}</Box></td>
									<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{row.competition_name}</Box></td>
									<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{row.competition_location}</Box></td>
									<td>
										<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
											{row.result}
											{
												row.wind === null || row.wind === undefined
													? ''
													: ` (${row.wind}v)`
											}
										</Box>
									</td>
								</tr>
							))
					}
				</tbody>
				<tfoot>
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
									{`${initialRow}-${finalRow} de ${this.state.searchedRows.length}`}
								</span>

								<Box>
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
										disabled={this.state.page >= Math.ceil(this.state.searchedRows.length / this.state.rowsPerPage) - 1}
									>
										<KeyboardArrowRightIcon />
									</IconButton>
								</Box>
							</div>
						</td>
					</tr>
				</tfoot>
			</table>
		)
	}

	render() {
		const visibleRows = this.state.searchedRows.slice(
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

					<Form
						key={"Events" + this.state.events}
						formClass="form-control-athlete-profile-table"
						parent={this}
						variable="eventSelected"
						name="Evento"
						options={
							this.state.events !== undefined
								? this.state.events.map(event => ({ name: event, value: event }))
								: []
						}
						minWidth="180px"
					/>

					<Form
						key={"Years" + this.state.years}
						formClass="form-control-athlete-profile-table"
						parent={this}
						variable="yearSelected"
						name="Ano"
						options={
							this.state.years !== undefined
								? this.state.years.map(year => ({ name: year, value: year }))
								: []
						}
						minWidth="180px"
					/>
				</Box>

				{
					isMobileDeviceLandscape()
						? this.renderMobile(visibleRows)
						: isTabletDevice()
							? this.renderTablet(visibleRows)
							: this.renderDesktop(visibleRows)
				}
			</Box>
		);
	}
}