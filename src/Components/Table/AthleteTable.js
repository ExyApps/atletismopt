import React from 'react';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import IconButton from '@mui/material/IconButton';

// import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import SearchIcon from '@mui/icons-material/Search';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import { TbMars } from "react-icons/tb";
import { TbVenus } from "react-icons/tb";

import Table from './Table';
import { InputBase, Paper } from '@mui/material';

export default class AthleteTable extends Table {
	componentDidMount() {
		this.setState({
			search: ''
		})
	}

	handleClick = (event, id) => {

	};

	handleSearch(value) {
		this.setState({ search: value.toLowerCase() });
	}

	render() {
		const searchedRows = this.state.rows.filter(row => {
			return Object.values(row).some(value => {
				return value.toString().toLowerCase().includes(this.state.search);
			});
		});

		const initialRow = this.state.page * this.state.rowsPerPage + 1;
		const finalRow = Math.min(this.state.page * this.state.rowsPerPage + this.state.rowsPerPage, searchedRows.length);


		const visibleRows = this.stableSort(searchedRows, this.getComparator(this.state.order, this.state.orderBy)).slice(
			this.state.page * this.state.rowsPerPage,
			this.state.page * this.state.rowsPerPage + this.state.rowsPerPage,
		);

		return (
			<Box sx={{ width: '100%' }}>

				<Paper
					component="form"
					sx={{
						p: '2px 4px',
						display: 'flex',
						alignItems: 'center',
						width: 400,
						backgroundColor: '#edeff3',
						marginBottom: '0.5rem'
					}}
				>
					<InputBase
						sx={{ ml: 1, flex: 1 }}
						placeholder="Procurar Atleta"
						inputProps={{ 'aria-label': 'Procurar Atleta' }}
						onChange={(event) => this.handleSearch(event.target.value)}
					/>
				</Paper>

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
							visibleRows.length === 0
								? <tr>
									<td colSpan={6}>
										<div className="empty-table">
											<span>Não foram encontrados resultados.</span>
										</div>
									</td>
								</tr>
								: visibleRows.map((row, id) => (
									<tr key={id} onClick={(event) => this.handleClick(event, row.idid)}>
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
																<i className={`flag icon-flag-${value}`} />
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
										{`${initialRow}-${finalRow} de ${this.state.rows.length}`}
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
										disabled={this.state.page >= Math.ceil(this.state.rows.length / this.state.rowsPerPage) - 1}
									>
										<KeyboardArrowRightIcon />
									</IconButton>
								</div>
							</td>
						</tr>
					</tfoot>
				</table>
			</Box>
		);
	}
}