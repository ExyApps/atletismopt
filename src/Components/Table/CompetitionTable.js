import React from 'react';
import './CompetitionTable.css';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { ptBR } from '@mui/x-date-pickers/locales';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

import {
	isMobileDeviceLandscape,
	isTabletDevice
} from '../../Utils/WindowSizes';

import TableHeader from './TableHeader';
import Table from './Table';
import Form from './Form';

export default class CompetitionTable extends Table {
	componentDidMount() {
		window.addEventListener('resize', this.updateDimensions);

		// Get all start_date and end_date of the rows into a list
		const dates = this.state.rows.map(row => row.start_date).concat(this.state.rows.map(row => row.end_date));
		const uniqueDates = [...new Set(dates)];
		const sortedDates = uniqueDates.sort((a, b) => a.localeCompare(b));

		// Get the initial date
		const initialDate = sortedDates[0];
		// Get the current date
		const finalDate = dayjs().format('YYYY-MM-DD');

		this.setState({
			orderBy: 'start_date',
			order: 'desc',

			// Filters
			search: '',

			organizations: [],
			organizationSelected: '',

			initialDate: initialDate,
			finalDate: finalDate,

		}, () => {
			this.getOrganizations();
		});
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateDimensions);
	}

	getOrganizations() {
		const orgs = this.state.rows.map(row => `${row.organization_abbreviation} (${row.organization_name})`);
		const uniqueOrgs = [...new Set(orgs)];
		uniqueOrgs.sort((a, b) => a.localeCompare(b));
		this.setState({ organizations: uniqueOrgs });
	}

	handleClick = (_, id) => {

	};

	updateSearchedRows() {
		var newRows = this.state.rows.filter(row => {
			// Compare the text field text
			return (row.name.toLowerCase().includes(this.state.search.toLowerCase())
				&& (this.state.organizationSelected === '' || `${row.organization_abbreviation} (${row.organization_name})` === this.state.organizationSelected));
			// && (this.state.yearSelected === '' || row.date.split('-')[0] === this.state.yearSelected)
			// && (this.state.onlyValid === false || row.wind === null || row.wind <= 2)
		});

		newRows = this.stableSort(
			newRows,
			this.getComparator(this.state.order, this.state.orderBy)
		)

		this.setState({ searchedRows: newRows });
	}

	handleSearch(value) {
		// Update the state value of the search field
		this.setState({ search: value.toLowerCase(), page: 0 }, () => this.updateSearchedRows());
	}

	renderMobile(rows) {
		const initialRow = Math.min(this.state.page * this.state.rowsPerPage + 1, this.state.searchedRows.length);
		const finalRow = Math.min(this.state.page * this.state.rowsPerPage + this.state.rowsPerPage, this.state.searchedRows.length);

		const orderOptions = [
			{ name: 'Data de Início', value: 'start_date' },
			{ name: 'Data de Fim', value: 'end_date' },
			{ name: 'Local', value: 'location' },
			{ name: 'Organização', value: 'organization_abbreviation' },
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
										key={row.event_id}
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
													{row.name}
												</b>
											</span>
											<span className="mobile-span" style={{ fontSize: '13px' }}>
												{
													row.start_date === row.end_date
														? <span>{row.start_date.split('-').reverse().join('/')}</span>
														: <span>{row.start_date.split('-').reverse().join('/')} - {row.end_date.split('-').reverse().join('/')}</span>
												}
											</span>
											<span className="mobile-span" style={{ fontSize: '13px' }}>
												{row.location}
											</span>
											<span className="mobile-span" style={{ fontSize: '13px' }}>
												{row.organization_abbreviation} ({row.organization_name})
											</span>
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
							field='name'
							name='Nome'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>
						<TableHeader
							parent={this}
							field='start_date'
							name='Data'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>
						<TableHeader
							parent={this}
							field='location'
							name='Local'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>
						<TableHeader
							parent={this}
							field='organization_abbreviation'
							name='Organização'
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
								<tr key={row.event_id} className="clickable-row" onClick={(event) => this.handleClick(event, row.event_id)}>
									<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
										{row.name}
									</Box></td>
									<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
										{
											row.start_date === row.end_date
												? <span>{row.start_date.split('-').reverse().join('/')}</span>
												: <span>{row.start_date.split('-').reverse().join('/')} - {row.end_date.split('-').reverse().join('/')}</span>
										}
									</Box></td>
									<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{row.location}</Box></td>
									<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{row.organization_abbreviation}</Box></td>
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
							field='name'
							name='Nome'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>
						<TableHeader
							parent={this}
							field='start_date'
							name='Data'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>
						<TableHeader
							parent={this}
							field='location'
							name='Local'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>
						<TableHeader
							parent={this}
							field='organization_abbreviation'
							name='Organização'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>
					</tr>
				</thead>
				<tbody>
					{
						rows.length === 0
							? <tr>
								<td colSpan={4}>
									<div className="empty-table">
										<span>Não foram encontrados resultados.</span>
									</div>
								</td>
							</tr>
							: rows.map((row, id) => (
								<tr key={row.event_id} className="clickable-row" onClick={(event) => this.handleClick(event, row.event_id)}>
									<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
										{row.name}
									</Box></td>
									<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
										{
											row.start_date === row.end_date
												? <span>{row.start_date.split('-').reverse().join('/')}</span>
												: <span>{row.start_date.split('-').reverse().join('/')} - {row.end_date.split('-').reverse().join('/')}</span>
										}
									</Box></td>
									<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{row.location}</Box></td>
									<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{row.organization_abbreviation} ({row.organization_name})</Box></td>
								</tr>
							))
					}
				</tbody>
				<tfoot>
					<tr>
						<td colSpan={4}>
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

	weekdayTranslation(weekday) {
		const day = weekday.format('dd');

		switch (day) {
			case 'Mo':
				return 'S';
			case 'Tu':
				return 'T';
			case 'We':
				return 'Q';
			case 'Th':
				return 'Q';
			case 'Fr':
				return 'S';
			case 'Sa':
				return 'S';
			case 'Su':
				return 'D';
			default:
				return '';
		}
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
						// display: 'flex',
						// flexDirection: 'row',
						boxSizing: 'border-box',
						width: '100%',
					}}
				>
					<Paper
						className="search-bar-competition"
						component="form"
						sx={{
							p: '2px 4px',
							display: 'flex',
							alignItems: 'center',
							width: 300,
							backgroundColor: '#edeff3',
							marginBottom: '0.5rem',
							height: "39px",
						}}
					>
						<SearchIcon
							className="search-icon"
						/>

						<InputBase
							sx={{ ml: 1, flex: 1 }}
							placeholder="Procurar Competição"
							inputProps={{ 'aria-label': 'Procurar Competição' }}
							onChange={(event) => this.handleSearch(event.target.value)}
						/>
					</Paper>

					<Form
						key={"Organization" + this.state.organizations}
						formClass="form-control-competitions-table full-form"
						parent={this}
						variable="organizationSelected"
						name="Organização"
						options={
							this.state.organizations !== undefined
								? this.state.organizations.map(event => ({ name: event, value: event }))
								: []
						}
						minWidth="180px"
					/>

					<LocalizationProvider
						dateAdapter={AdapterDayjs}
						adapterLocale={"en-gb"}
						localeText={ptBR.components.MuiLocalizationProvider.defaultProps.localeText}
					>
						<MobileDatePicker
							className="date-picker"
							inputFormat="dd/MM/yyyy"
							label="Desde"
							value={dayjs(this.state.initialDate)}
							onChange={(newValue) => this.setState({ initialDate: newValue })}
							slotProps={{ textField: { size: 'small' } }}
							dayOfWeekFormatter={(weekday) => this.weekdayTranslation(weekday)}
						/>
					</LocalizationProvider>

					<LocalizationProvider
						dateAdapter={AdapterDayjs}
						adapterLocale={"en-gb"}
						localeText={ptBR.components.MuiLocalizationProvider.defaultProps.localeText}
					>
						<MobileDatePicker
							className="date-picker"
							inputFormat="dd/MM/yyyy"
							label="Até"
							value={dayjs(this.state.finalDate)}
							onChange={(newValue) => this.setState({ finalDate: newValue })}
							slotProps={{ textField: { size: 'small' } }}
							dayOfWeekFormatter={(weekday) => this.weekdayTranslation(weekday)}
						/>
					</LocalizationProvider>
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