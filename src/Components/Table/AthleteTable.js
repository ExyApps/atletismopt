import React from 'react';
import './AthleteTable.css';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';

import SearchIcon from '@mui/icons-material/Search';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import { TbMars } from "react-icons/tb";
import { TbVenus } from "react-icons/tb";


import {
	isMobileDevice,
	isMobileDeviceLandscape,
	isTabletDevice
} from '../../Utils/WindowSizes';

import TableHeader from './TableHeader';
import Form from './Form';
import Table from './Table';
import Escaloes from '../../Utils/Escaloes';

export default class AthleteTable extends Table {
	componentDidMount() {
		window.addEventListener('resize', this.updateDimensions);

		this.setState({
			// Filters
			search: '',
			genderSelected: '',

			clubs: [],
			clubSelected: '',

			nationalities: [],
			nationalitySelected: '',

			ageSelected: '',
		}, () => {
			this.handleRequestSort(null, 'name', true);

			this.getAllClubs();
			this.getAllNationalities();
		});
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateDimensions);
	}

	updateSearchedRows() {
		const name = '.*' + this.state.search.toLowerCase().trim().replace(/\s/g, '.*') + '.*';
		const regExpr = new RegExp(name, 'i');

		var newRows = this.state.rows.filter(row => {
			// Compare the text field text
			return regExpr.test(row.name.toLowerCase())
				// Compare the gender
				&& row.gender.includes(this.state.genderSelected)
				// Compare the club
				&& (this.state.clubSelected === '' || row.club_abbreviation === this.state.clubSelected.split(" ")[0])
				// Compare the nationality
				&& (this.state.nationalitySelected === '' || row.nationality === this.state.nationalitySelected)
				// Compare the age
				&& (this.state.ageSelected === '' || this.isCorrectAge(row.birthdate, this.state.ageSelected));
		});

		newRows = this.stableSort(
			newRows,
			this.getComparator(this.state.order, this.state.orderBy)
		)

		this.setState({ searchedRows: newRows });
	}

	getAllClubs() {
		// Process all the rows and get the stored clubs
		const clubs = this.state.rows.map(row => `${row.club_abbreviation} (${row.club_name})`);
		const uniqueClubs = [...new Set(clubs)];
		uniqueClubs.sort((a, b) => a.localeCompare(b));
		this.setState({ clubs: uniqueClubs });
	}

	getAllNationalities() {
		// Process all the rows and get the stored nationalities
		const nationalities = this.state.rows.map(row => row.nationality);
		const uniqueNationalities = [...new Set(nationalities)];
		uniqueNationalities.sort((a, b) => a.localeCompare(b));
		this.setState({ nationalities: uniqueNationalities });
	}

	isCorrectAge(birthdate, age) {
		// Helper function to determine if the athlete is in the age range selected
		const currentYear = new Date().getFullYear();
		const birthYear = new Date(birthdate).getFullYear();

		const currentAge = currentYear - birthYear;

		var age_number = age.match(/\d+/);
		if (age_number === null) {
			return currentAge >= 23 && currentAge < 35;
		}

		age_number = parseInt(age_number[0]);

		if (age_number === 23) {
			return currentAge >= 20 && currentAge < 23;
		} else if (age_number < 23) {
			return currentAge >= age_number - 2 && currentAge < age_number;
		} else if (age_number >= 35) {
			return currentAge >= age_number && currentAge < age_number + 5;
		}

		return false;
	}

	handleClick = (_, id) => {
		// Redirect the user to the athlete page
		window.location.href = `#/perfis/${id}`;
	};

	handleSearch(value) {
		// Update the state value of the search field
		this.setState({ search: value.toLowerCase(), page: 0 }, () => this.updateSearchedRows());
	}

	renderMobile(rows) {
		const initialRow = Math.min(this.state.page * this.state.rowsPerPage + 1, this.state.searchedRows.length);
		const finalRow = Math.min(this.state.page * this.state.rowsPerPage + this.state.rowsPerPage, this.state.searchedRows.length);
		return (
			<table className="content-table">
				<thead>
					<tr>
						<TableHeader
							key={'Name' + this.state.orderBy + this.state.order}
							parent={this}
							name="Atleta"
							field='name'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>

						<TableHeader
							key={'Birthdate' + this.state.orderBy + this.state.order}
							parent={this}
							name="Nasc."
							field='birthdate'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>

						<TableHeader
							key={'ClubName' + this.state.orderBy + this.state.order}
							parent={this}
							name="Clube"
							field='club_name'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>
					</tr>
				</thead>
				<tbody>
					{
						rows.length === 0
							? <tr>
								<td colSpan={3}>
									<div className="empty-table">
										<span>Não foram encontrados resultados.</span>
									</div>
								</td>
							</tr>
							: rows.map((row, id) => (
								<tr key={id} className="clickable-row" onClick={(event) => this.handleClick(event, row.id)}>
									<td key={id}>
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'row',
												justifyContent: 'space-between',
												alignItems: 'center'
											}}
										>
											<i className={`flag icon-flag-${row.nationality}`} />
											<span style={{
												marginLeft: "4px",
											}}>
												{row.name}
											</span>
											{
												row.gender === 'M'
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
										</Box>
									</td>
									<td>
										{row.birthdate.split('-')[0]}
									</td>
									<td>
										{row.club_abbreviation}
									</td>
								</tr>
							))
					}
				</tbody>
				<tfoot>
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
									{`${initialRow}-${finalRow} de ${this.state.searchedRows.length}`}
								</span>

								<Box>
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

	renderMobileLandscape(rows) {
		const initialRow = Math.min(this.state.page * this.state.rowsPerPage + 1, this.state.searchedRows.length);
		const finalRow = Math.min(this.state.page * this.state.rowsPerPage + this.state.rowsPerPage, this.state.searchedRows.length);
		return (
			<table className="content-table">
				<thead>
					<tr>
						<TableHeader
							key={'Name' + this.state.orderBy + this.state.order}
							parent={this}
							name="Atleta"
							field='name'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>

						<TableHeader
							key={'Birthdate' + this.state.orderBy + this.state.order}
							parent={this}
							name="Nasc."
							field='birthdate'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>

						<TableHeader
							key={'ClubName' + this.state.orderBy + this.state.order}
							parent={this}
							name="Clube"
							field='club_name'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>
					</tr>
				</thead>
				<tbody>
					{
						rows.length === 0
							? <tr>
								<td colSpan={3}>
									<div className="empty-table">
										<span>Não foram encontrados resultados.</span>
									</div>
								</td>
							</tr>
							: rows.map((row, id) => (
								<tr key={id} className="clickable-row" onClick={(event) => this.handleClick(event, row.id)}>
									<td key={id}>
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'row',
												justifyContent: 'space-between',
												alignItems: 'center'
											}}
										>
											<i className={`flag icon-flag-${row.nationality}`} />
											<span style={{
												marginLeft: "4px",
											}}>
												{row.name}
											</span>
											{
												row.gender === 'M'
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
										</Box>
									</td>
									<td>
										{row.birthdate}
									</td>
									<td>
										{row.club_abbreviation}
									</td>
								</tr>
							))
					}
				</tbody>
				<tfoot>
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
									{`${initialRow}-${finalRow} de ${this.state.searchedRows.length}`}
								</span>

								<Box>
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

	renderTablet(rows) {
		const initialRow = Math.min(this.state.page * this.state.rowsPerPage + 1, this.state.searchedRows.length);
		const finalRow = Math.min(this.state.page * this.state.rowsPerPage + this.state.rowsPerPage, this.state.searchedRows.length);
		return (
			<table className="content-table">
				<thead>
					<tr>
						<TableHeader
							key={'Name' + this.state.orderBy + this.state.order}
							parent={this}
							name="Atleta"
							field='name'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>

						<TableHeader
							key={'Birthdate' + this.state.orderBy + this.state.order}
							parent={this}
							name="Data de Nascimento"
							field='birthdate'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>

						<TableHeader
							key={'ClubName' + this.state.orderBy + this.state.order}
							parent={this}
							name="Clube"
							field='club_name'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>
					</tr>
				</thead>
				<tbody>
					{
						rows.length === 0
							? <tr>
								<td colSpan={3}>
									<div className="empty-table">
										<span>Não foram encontrados resultados.</span>
									</div>
								</td>
							</tr>
							: rows.map((row, id) => (
								<tr key={id} className="clickable-row" onClick={(event) => this.handleClick(event, row.id)}>
									<td key={id}>
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'row',
												justifyContent: 'space-between',
												alignItems: 'center'
											}}
										>
											<i className={`flag icon-flag-${row.nationality}`} />
											<span style={{
												marginLeft: "4px",
											}}>
												{row.name}
											</span>
											{
												row.gender === 'M'
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
										</Box>
									</td>
									<td>
										{row.birthdate}
									</td>
									<td>{row.club_abbreviation} ({row.club_name})</td>
								</tr>
							))
					}
				</tbody>
				<tfoot>
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
									{`${initialRow}-${finalRow} de ${this.state.searchedRows.length}`}
								</span>

								<Box>
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
							key={'Name' + this.state.orderBy + this.state.order}
							parent={this}
							name="Nome"
							field='name'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>

						<TableHeader
							key={'Gender' + this.state.orderBy + this.state.order}
							parent={this}
							name="Género"
							field='gender'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>

						<TableHeader
							key={'Birthdate' + this.state.orderBy + this.state.order}
							parent={this}
							name="Data de Nascimento"
							field='birthdate'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>

						<TableHeader
							key={'ClubName' + this.state.orderBy + this.state.order}
							parent={this}
							name="Clube"
							field='club_name'
							orderBy={this.state.orderBy}
							order={this.state.order}
						/>

						<TableHeader
							key={'Nationaliity' + this.state.orderBy + this.state.order}
							parent={this}
							name="Nacionalidade"
							field='nationality'
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
								<tr key={id} className="clickable-row" onClick={(event) => this.handleClick(event, row.id)}>
									<td>{row.name}</td>
									<td>
										{
											row.gender === 'M'
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
									<td>{row.birthdate}</td>
									<td>{row.club_abbreviation} ({row.club_name})</td>
									<td>
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'row',
												justifyContent: 'center',
												alignItems: 'center'
											}}
										>
											<span style={{ marginRight: "4px" }}>
												{row.nationality}
											</span>
											<i className={`flag icon-flag-${row.nationality}`} />
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
			this.state.page * this.state.rowsPerPage + this.state.rowsPerPage
		);

		return (
			<Box sx={{ width: '100%' }}>
				<Box
					sx={{
						boxSizing: 'border-box',
						width: '100%',
					}}
				>
					<Paper
						className="search-bar"
						component="form"
						sx={{
							p: '2px 4px',
							display: 'flex',
							alignItems: 'center',
							width: 250,
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
							placeholder="Procurar Atleta"
							inputProps={{ 'aria-label': 'Procurar Atleta' }}
							onChange={(event) => this.handleSearch(event.target.value)}
						/>
					</Paper>

					<Form
						parent={this}
						formClass="form-control-athlete-table"
						variable="genderSelected"
						name="Género"
						options={[
							{ value: 'M', name: 'Masculino' },
							{ value: 'F', name: 'Feminino' },
						]}
					/>

					<Form
						key={'Club' + this.state.clubs}
						formClass="form-control-athlete-table"
						parent={this}
						variable="clubSelected"
						name="Clube"
						options={
							this.state.clubs !== undefined
								? this.state.clubs.map(club => {
									return { value: club, name: club }
								})
								: []
						}
					/>

					<Form
						key={'Nat' + this.state.nationalities}
						formClass="form-control-athlete-table"
						parent={this}
						variable="nationalitySelected"
						name="Nacionalidade"
						options={
							this.state.nationalities !== undefined
								? this.state.nationalities.map(nat => {
									return { value: nat, name: nat }
								})
								: []
						}
					/>

					<Form
						formClass="form-control-athlete-table"
						parent={this}
						variable="ageSelected"
						name="Escalão"
						options={
							Escaloes.map(age => {
								return { value: age, name: age }
							})
						}
						minWidth="200px"
					/>
				</Box>

				{
					isMobileDevice()
						? this.renderMobile(visibleRows)
						: isMobileDeviceLandscape()
							? this.renderMobileLandscape(visibleRows)
							: isTabletDevice()
								? this.renderTablet(visibleRows)
								: this.renderDesktop(visibleRows)
				}
			</Box>
		);
	}
}