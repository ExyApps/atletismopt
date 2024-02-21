import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Checkbox, Collapse, IconButton, Tooltip } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Divider from '@mui/material/Divider';

import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';

import { VscTextSize } from "react-icons/vsc";
import { MdCalendarMonth } from "react-icons/md";
import { MdAccessTime } from "react-icons/md";
import { Md123 } from "react-icons/md";
import { MdOutlineCheckBox } from "react-icons/md";
import { TiKeyOutline } from "react-icons/ti";

import styled from '@mui/material/styles/styled';
import tableCellClasses from '@mui/material/TableCell/tableCellClasses';

import { getResults } from '../../Utils/Communication/Communication';
import { Notification, NotificationType } from '../Notification/Notification';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: "#281e37",
		color: theme.palette.common.white,
		padding: "5px 5px",
		fontSize: 12,
		fontWeight: "bold",
		cursor: "pointer",
		userSelect: "none",
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 12,
		padding: "5px 5px",
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	'&:nth-of-type(odd)': {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	'&:last-child td, &:last-child th': {
		border: 0,
	},
}));

export default class Window extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			structure: props.structure,
			relations: props.relations,

			preparingRequest: {},
			request: {},


			queryLoading: false,

			queryResult: [],
			completeQueryResult: [],

			tablePage: 0,
			rowsPerPage: 10,

			sortingColumn: "id",
			sortingDirection: 1
		}

		this.notification = React.createRef();
	}

	getIconColumn(columnType) {
		if (columnType.includes("VARCHAR")) {
			return <VscTextSize size={15} color={"#aaa"} />
		} else if (columnType.includes("DATE")) {
			return <MdCalendarMonth size={15} color={"#aaa"} />
		} else if (columnType.includes("TIME")) {
			return <MdAccessTime size={15} color={"#aaa"} />
		} else if (columnType.includes("INT") || columnType.includes("FLOAT") || columnType.includes("DOUBLE")) {
			return <Md123 size={23} color={"#aaa"} />
		} else if (columnType.includes("BOOL")) {
			return <MdOutlineCheckBox size={15} color={"#aaa"} />
		}
		return null;
	}

	handleChangePage(_, newPage) {
		this.setState({
			tablePage: newPage
		});
	}

	handleChangeRowsPerPage(event) {
		this.setState({
			rowsPerPage: +event.target.value,
			page: 0
		});
	}

	sortRows() {
		var queryResult = this.state.queryResult;
		var sortingColumn = this.state.sortingColumn;
		var sortingDirection = this.state.sortingDirection;

		queryResult.sort((a, b) => {
			if (sortingDirection === 1) {
				if (a[sortingColumn] < b[sortingColumn]) return -1;
				if (a[sortingColumn] > b[sortingColumn]) return 1;
				return 0;
			} else {
				if (a[sortingColumn] > b[sortingColumn]) return -1;
				if (a[sortingColumn] < b[sortingColumn]) return 1;
				return 0;
			}
		});

		this.setState({
			queryResult: queryResult,
		});
	}

	handleHeaderClick(column) {
		var previousSortingColumn = this.state.sortingColumn;
		var previousSortingDirection = this.state.sortingDirection;

		var newSortingDirection = 1;
		var newSortingColumn = column;

		if (previousSortingColumn === column) {
			newSortingDirection = previousSortingDirection * -1;
		}

		this.setState({
			sortingColumn: newSortingColumn,
			sortingDirection: newSortingDirection,
		}, () => this.sortRows());
	}

	dropEvent(e) {
		e.preventDefault();
		var data = e.dataTransfer.getData("text/plain");
		var preparingRequest = this.state.preparingRequest;

		if (Object.keys(preparingRequest).includes(data)) {
			this.notification.current.openNotication(NotificationType.Error, "Tabela já adicionada");
			return;
		}

		// Transform the above loops into a one line condition
		if (Object.keys(preparingRequest).filter((key) => this.state.relations[key].filter((rel) => rel['referred_table'] === data).length === 0).length > 0) {
			this.notification.current.openNotication(NotificationType.Error, "Nenhuma das tabelas adicionadas tem relação com esta tabela");
			return;
		}

		var fields = this.state.structure[data].map((field) => {
			return {
				"name": field["name"],
				"type": field["type"],
				"primary_key": field["primary_key"],
				"checked": true,
			}
		});

		preparingRequest[data] = {
			table: data,
			open: false,
			fields: fields
		};

		this.setState({
			preparingRequest: preparingRequest,
		});
	}

	async getTableInfo() {

		this.setState({
			queryLoading: true,
		});

		var data = await getResults(this.state.preparingRequest);
		var results = data["results"];

		var firstPrimaryColumn = null;

		Object.keys(this.state.preparingRequest).map((table, index) => {
			var fields = this.state.preparingRequest[table].fields;
			return fields.map((field, fIndex) => {
				if (field["checked"]) {
					if (field["primary_key"] > 0) {
						firstPrimaryColumn = `${table}$${field["name"]}`;
					}
					return null;
				}
				return null;
			})
		});

		this.setState({
			request: JSON.parse(JSON.stringify(this.state.preparingRequest)),
			completeQueryResult: results,
			queryResult: results,
			queryLoading: false,
			sortingColumn: firstPrimaryColumn,
			sortingDirection: 1,
		});
	}



	render() {
		return (
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					height: "100%",
					width: "100%",
				}}
			>
				<Notification ref={this.notification} />
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
						height: "calc(100vh - 5rem)",
						width: "100%",
						padding: "10px",
						borderRadius: "5px",
						backgroundColor: "#eee",
						border: "1px solid #bbb",
					}}
				>
					<Box
						sx={{
							width: "100%",
							height: "100%",
							display: "flex",
							flexDirection: "column",
						}}
					>
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<Box
								sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
							>
								<span>Resultados:</span>
							</Box>

							<Box
								sx={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								<Tooltip title="Filtros" placement='top'>
									<IconButton
										sx={{
											p: 0,
											m: 0,
											ml: "1rem"
										}}
										onClick={() => alert("Filtros")}
										color="primary"
									>
										<FilterListRoundedIcon />
									</IconButton>
								</Tooltip>

								<Tooltip title="Guardar" placement='top'>
									<IconButton
										disabled
										sx={{
											p: 0,
											m: 0,
											ml: "1rem"
										}}
										onClick={() => alert("Guardar alterações")}
										color="primary"
									>
										<SaveRoundedIcon />
									</IconButton>
								</Tooltip>

							</Box>
						</Box>

						<Paper sx={{ width: '100%', overflow: 'hidden', mt: "0.75rem" }}>
							<TableContainer sx={{ maxHeight: "100%" }}>
								<Table stickyHeader aria-label="sticky table">
									<TableHead>
										<StyledTableRow>
											{
												Object.keys(this.state.request).map((table, index) => {
													var fields = this.state.request[table].fields;
													return fields.map((field, fIndex) => {
														if (field["checked"]) {
															return (
																<StyledTableCell
																	key={field.name}
																	align="center"
																	onClick={() => this.handleHeaderClick(`${table}$${field.name}`)}

																>
																	<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
																		{
																			this.getIconColumn(field.type)
																		}
																		<span style={{ margin: "0px 5px" }}>{field.name}</span>
																		{
																			field["primary_key"] > 0
																				? <TiKeyOutline size={18} color={"#FFD700"} />
																				: null
																		}
																		{
																			this.state.sortingColumn === `${table}$${field.name}`
																				? this.state.sortingDirection === 1
																					? <ArrowDropDownRoundedIcon />
																					: <ArrowDropUpRoundedIcon />
																				: null
																		}
																	</Box>
																</StyledTableCell>
															)
														}
														return null;
													})
												})
											}
										</StyledTableRow>
									</TableHead>
									<TableBody>
										{
											this.state.queryResult
												.slice(this.state.tablePage * this.state.rowsPerPage, this.state.tablePage * this.state.rowsPerPage + this.state.rowsPerPage)
												.map((row) => {
													return (
														<StyledTableRow tabIndex={-1} key={row.id}>
															{
																Object.keys(this.state.request).map((table, index) => {
																	var fields = this.state.request[table].fields;
																	return fields.map((field, fIndex) => {
																		if (field["checked"]) {
																			return <StyledTableCell key={`${row.id} ${field.name}`} align="center">
																				<span>{row[`${table}$${field.name}`]}</span>
																			</StyledTableCell>
																		}
																		return null;
																	})
																})
															}
														</StyledTableRow>
													)
												})
										}
									</TableBody>
								</Table>
							</TableContainer>
							<TablePagination
								rowsPerPageOptions={[10, 20, 30]}
								component="div"
								count={this.state.queryResult.length}
								rowsPerPage={this.state.rowsPerPage}
								page={this.state.tablePage}
								onPageChange={(e, newPage) => this.handleChangePage(e, newPage)}
								onRowsPerPageChange={(e) => this.handleChangeRowsPerPage(e)}
							/>
						</Paper>

					</Box>
				</Box>

				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						padding: "5px",
						pr: "0.5rem",
						borderTop: "2px solid #bbb",
						borderBottom: "2px solid #bbb",
						borderLeft: "2px solid #bbb",
						ml: "0.5rem",

						width: `${this.state.fieldsSize}px`,
						minWidth: "10rem",
						maxWidth: "18rem",
					}}
					onDrop={(e) => {
						this.dropEvent(e);
					}}
					onDragEnter={(e) => e.preventDefault()}
					onDragOver={(e) => e.preventDefault()}
					onDragLeave={(e) => e.preventDefault()}
				>
					<Box
						sx={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<span
							style={{
								fontSize: "13px",
								fontWeight: "bold",
							}}
						>
							Info:
						</span>

						<Button
							sx={{
								textTransform: "none",
								m: 0,
								p: 0,
								fontSize: "13px",
							}}
							onClick={() => this.getTableInfo()}
						>
							Atualizar
						</Button>
					</Box>

					{
						Object.keys(this.state.preparingRequest).map((table, index) => {
							return (
								<Box
									key={table}
								>
									<Divider />

									<Box
										sx={{
											display: "flex",
											flexDirection: "row",
											alignItems: "center",
											justifyContent: "space-between",
										}}
									>
										<Box
											sx={{
												display: "flex",
												flexDirection: "row",
												alignItems: "center",
											}}
										>
											<IconButton
												onClick={() => {
													var preparingRequest = this.state.preparingRequest;
													preparingRequest[table].open = !preparingRequest[table].open;

													this.setState({
														preparingRequest: preparingRequest,
													});
												}}
												sx={{
													m: 0,
													p: 0,
													mr: "5px"
												}}
											>
												{
													this.state.preparingRequest[table].open ?
														<ExpandMoreIcon
															sx={{
																fontSize: "17px",
															}}
														/>
														:
														<ChevronRightIcon
															sx={{
																fontSize: "17px",
															}}
														/>
												}
											</IconButton>

											<span style={{ fontSize: "13px" }}>{table}</span>
										</Box>

										<IconButton
											onClick={() => {
												var preparingRequest = this.state.preparingRequest;
												delete preparingRequest[table];

												this.setState({
													preparingRequest: preparingRequest,
												});
											}}
										>
											<CloseIcon
												sx={{
													fontSize: "13px",
												}}
											/>
										</IconButton>
									</Box>
									<Collapse
										in={this.state.preparingRequest[table].open}
										timeout="auto"
										unmountOnExit
									>
										<Box
											sx={{
												display: "flex",
												flexDirection: "column",
												pl: "25px",
											}}
										>
											{
												this.state.preparingRequest[table].fields.map((field, fIndex) => {
													return <Box
														key={field["name"]}
														sx={{
															display: "flex",
															flexDirection: "row",
															alignItems: "center",
															fontSize: "13px",
														}}
													>
														<Checkbox
															disabled={field["primary_key"] ? true : false}
															checked={field["checked"]}
															onChange={(e) => {
																var preparingRequest = this.state.preparingRequest;
																preparingRequest[table].fields[fIndex].checked = e.target.checked;

																this.setState({
																	preparingRequest: { ...preparingRequest },
																});
															}}
															size="small"
															sx={{
																m: 0,
																p: 0,
															}}
														/>

														<span style={{ marginLeft: "5px", fontSize: "11px" }}>{field["name"]}</span>
													</Box>
												})
											}
										</Box>
									</Collapse>
								</Box>
							)
						})
					}
				</Box>
			</Box>
		)
	}
}