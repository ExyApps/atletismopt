import * as React from 'react';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import IconButton from '@mui/material/IconButton';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import {
	isMobileDevice,
	isMobileDeviceLandscape,
	isTabletDevice,
	isSmallDesktopDevice,
} from '../../Utils/WindowSizes';

import TableHeader from './TableHeader';

export default class EnhancedTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			width: window.innerWidth,

			rows: props.rows,
			searchedRows: [...props.rows],

			order: 'asc',
			orderBy: '',
			page: 0,
			rowsPerPage: 10,
		};
	}

	updateDimensions = () => {
		this.setState({ width: window.innerWidth });
	};

	specialCharacterToNormalCharacter = (string) => {
		if (string === null || string === undefined) return '0.00';
		return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	};

	// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
	// stableSort() brings sort stability to non-modern browsers (notably IE11).
	stableSort(array, comparator) {
		const stabilizedThis = array.map((el, index) => [el, index]);
		stabilizedThis.sort((a, b) => {
			const order = comparator(a[0], b[0]);
			if (order !== 0) {
				return order;
			}
			return a[1] - b[1];
		});
		return stabilizedThis.map((el) => el[0]);
	}

	descendingComparator(a, b, orderBy) {
		if (this.specialCharacterToNormalCharacter(b[orderBy]) < this.specialCharacterToNormalCharacter(a[orderBy])) {
			return -1;
		}
		if (this.specialCharacterToNormalCharacter(b[orderBy]) > this.specialCharacterToNormalCharacter(a[orderBy])) {
			return 1;
		}
		return 0;
	}

	getComparator(order, orderBy) {
		return order === 'desc'
			? (a, b) => this.descendingComparator(a, b, orderBy)
			: (a, b) => -this.descendingComparator(a, b, orderBy);
	}

	handleRequestSort = (_, property, initial = false) => {
		var isAsc = (this.state.orderBy === property && this.state.order === 'asc');
		if (initial) isAsc = this.state.order === 'asc';
		this.setState({
			order: isAsc ? 'desc' : 'asc',
			orderBy: property,
		}, () => this.setState({
			searchedRows: this.stableSort(this.state.searchedRows, this.getComparator(this.state.order, this.state.orderBy)),
		}));
	};

	handleChangePage = (_, newPage) => {
		this.setState({ page: newPage });
	};

	handleChangeRowsPerPage = (event) => {
		this.setState({
			rowsPerPage: parseInt(event.target.value, 10),
			page: 0,
		});
	};

	// This method needs to be implemented by the child class.
	handleClick = (_, id) => {
		alert('Clicked on row with id:', id);
	};

	renderMobile() {
		const initialRow = Math.min(this.state.page * this.state.rowsPerPage + 1, this.state.searchedRows.length);
		const finalRow = Math.min(this.state.page * this.state.rowsPerPage + this.state.rowsPerPage, this.state.searchedRows.length);

		return (
			<table className="content-table">
				<thead>
					<tr>
						<TableHeader
							parent={this}
							field=''
							name='Cabeçalho de telefone.'
							sortable={false}
						/>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<div className="empty-table">
								<span>Linha de tabela para telefone.</span>
							</div>
						</td>
					</tr>
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
		)
	}

	renderMobileLandscape() {
		const initialRow = Math.min(this.state.page * this.state.rowsPerPage + 1, this.state.searchedRows.length);
		const finalRow = Math.min(this.state.page * this.state.rowsPerPage + this.state.rowsPerPage, this.state.searchedRows.length);

		return (
			<table className="content-table">
				<thead>
					<tr>
						<TableHeader
							parent={this}
							field=''
							name='Cabeçalho de telefone horizontal.'
							sortable={false}
						/>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<div className="empty-table">
								<span>Linha de tabela para telefone horizontal.</span>
							</div>
						</td>
					</tr>
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
		)
	}

	renderTablet() {
		const initialRow = Math.min(this.state.page * this.state.rowsPerPage + 1, this.state.searchedRows.length);
		const finalRow = Math.min(this.state.page * this.state.rowsPerPage + this.state.rowsPerPage, this.state.searchedRows.length);

		return (
			<table className="content-table">
				<thead>
					<tr>
						<TableHeader
							parent={this}
							field=''
							name='Cabeçalho de tablet.'
							sortable={false}
						/>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<div className="empty-table">
								<span>Linha de tabela para tablet.</span>
							</div>
						</td>
					</tr>
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
		)
	}

	renderSmallDesktop() {
		const initialRow = Math.min(this.state.page * this.state.rowsPerPage + 1, this.state.searchedRows.length);
		const finalRow = Math.min(this.state.page * this.state.rowsPerPage + this.state.rowsPerPage, this.state.searchedRows.length);

		return (
			<table className="content-table">
				<thead>
					<tr>
						<TableHeader
							parent={this}
							field=''
							name='Cabeçalho de PC.'
							sortable={false}
						/>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<div className="empty-table">
								<span>Linha de tabela para PC.</span>
							</div>
						</td>
					</tr>
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
		)
	}

	renderLargeDesktop() {
		const initialRow = Math.min(this.state.page * this.state.rowsPerPage + 1, this.state.searchedRows.length);
		const finalRow = Math.min(this.state.page * this.state.rowsPerPage + this.state.rowsPerPage, this.state.searchedRows.length);

		return (
			<table className="content-table">
				<thead>
					<tr>
						<TableHeader
							parent={this}
							field=''
							name='Cabeçalho de ecrã.'
							sortable={false}
						/>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<div className="empty-table">
								<span>Linha de tabela para ecrã.</span>
							</div>
						</td>
					</tr>
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
		)
	}

	// This method needs to be implemented by the child class.
	render() {
		return <>
			{
				isMobileDevice()
					? this.renderMobile()
					: isMobileDeviceLandscape()
						? this.renderMobileLandscape()
						: isTabletDevice()
							? this.renderTablet()
							: isSmallDesktopDevice()
								? this.renderSmallDesktop()
								: this.renderLargeDesktop()
			}
		</>
	}
}
