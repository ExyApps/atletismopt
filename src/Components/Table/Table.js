import * as React from 'react';

import Box from '@mui/material/Box';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import './Table.css';

import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import IconButton from '@mui/material/IconButton';

import { TbMars } from "react-icons/tb";
import { TbVenus } from "react-icons/tb";


function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11).
function stableSort(array, comparator) {
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

export default class EnhancedTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			headers: props.headers,
			rows: props.rows,
			order: 'asc',
			orderBy: props.headers[0],
			page: 0,
			rowsPerPage: 5,
		};
	}

	handleRequestSort = (event, property) => {
		const isAsc = this.state.orderBy === property && this.state.order === 'asc';
		this.setState({
			order: isAsc ? 'desc' : 'asc',
			orderBy: property,
		});
	};

	handleClick = (event, id) => {
		console.log('Clicked on row with id:', id);
	};

	handleChangePage = (event, newPage) => {
		this.setState({ page: newPage });
	};

	handleChangeRowsPerPage = (event) => {
		this.setState({
			rowsPerPage: parseInt(event.target.value, 10),
			page: 0,
		});
	};

	render() {

		const initialRow = this.state.page * this.state.rowsPerPage + 1;
		const finalRow = Math.min(this.state.page * this.state.rowsPerPage + this.state.rowsPerPage, this.state.rows.length);

		// Avoid a layout jump when reaching the last page with empty rows.
		// const emptyRows = this.state.page > 0
		// 	? Math.max(0, (1 + this.state.page) * this.state.rowsPerPage - rows.length)
		// 	: 0;

		// const visibleRows = React.useMemo(
		// 	() =>
		// 		stableSort(rows, getComparator(this.state.order, this.state.orderBy)).slice(
		// 			this.state.page * this.state.rowsPerPage,
		// 			this.state.page * this.state.rowsPerPage + this.state.rowsPerPage,
		// 		),
		// 	[this.state.order, this.state.orderBy, this.state.page, this.state.rowsPerPage],
		// );

		const visibleRows = stableSort(this.state.rows, getComparator(this.state.order, this.state.orderBy)).slice(
			this.state.page * this.state.rowsPerPage,
			this.state.page * this.state.rowsPerPage + this.state.rowsPerPage,
		);

		return (
			<Box sx={{ width: '100%' }}>
				<table className="content-table">
					<thead>
						<tr>
							{
								this.state.headers.map((header, id) => (
									<th key={id}>
										{header}
									</th>
								))
							}
						</tr>
					</thead>
					<tbody>
						{
							visibleRows.map((row, id) => (
								<tr key={id} onClick={(event) => this.handleClick(event, row.id)}>
									{
										Object.values(row).map((value, id) => {
											const header = this.state.headers[id];
											if (header === 'Género') {
												return (
													<td key={id}>
														{
															value === 'M'
																? <Box
																	sx={{
																		display: 'flex',
																		justifyContent: 'center',
																		alignItems: 'center'
																	}}
																>
																	<TbMars className='mars' size={20} />
																</Box>
																: <Box
																	sx={{
																		display: 'flex',
																		justifyContent: 'center',
																		alignItems: 'center'
																	}}
																>
																	<TbVenus className='venus' size={20} />
																</Box>
														}
													</td>
												);
											} else if (header === 'Nacionalidade') {
												return (
													<td key={id}>
														<Box
															sx={{
																display: 'flex',
																flexDirection: 'row',
																justifyContent: 'center',
																alignItems: 'center'
															}}
														>
															<span style={{ marginRight: "4px" }}>
																{value}
															</span>
															<i className={`icon-flag-${value}`} />
														</Box>
													</td>
												);
											}
											return (
												<td key={id}>
													{value}
												</td>
											);
										})
									}
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
												color: "#fff"
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
										{`${initialRow}-${finalRow} de ${this.state.rows.length}`}
									</span>

									<IconButton
										sx={{ m: 0, p: 0, marginLeft: '2rem' }}
										onClick={(event) => this.handleChangePage(event, this.state.page - 1)}
										disabled={this.state.page === 0}
									>
										<KeyboardArrowLeftIcon />
									</IconButton>
									<IconButton
										sx={{ m: 0, p: 0 }}
										onClick={(event) => this.handleChangePage(event, this.state.page + 1)}
										disabled={this.state.page >= Math.ceil(this.state.rows.length / this.state.rowsPerPage) - 1}
									>
										<KeyboardArrowRightIcon />
									</IconButton>
								</div>
							</td>
						</tr>
					</tfoot>
				</table >
			</Box >
		);
	}
}
