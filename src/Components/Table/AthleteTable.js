import React from 'react';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

import { isMobile } from 'react-device-detect';

// import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import SearchIcon from '@mui/icons-material/Search';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import { TbMars } from "react-icons/tb";
import { TbVenus } from "react-icons/tb";

import './AthleteTable.css';
import Table from './Table';
import Escaloes from '../../Information/Escaloes';

export default class AthleteTable extends Table {
	componentDidMount() {
		this.setState({
			search: '',
			genderSelected: '',

			clubs: [],
			clubSelected: '',

			nationalities: [],
			nationalitySelected: '',

			ageSelected: '',
		}, () => {
			this.getAllClubs();
			this.getAllNationalities();
		});
	}

	getAllClubs() {
		const clubs = this.state.rows.map(row => row.club);
		const uniqueClubs = [...new Set(clubs)];
		uniqueClubs.sort((a, b) => a.localeCompare(b));
		this.setState({ clubs: uniqueClubs });
	}

	getAllNationalities() {
		const nationalities = this.state.rows.map(row => row.nationality);
		const uniqueNationalities = [...new Set(nationalities)];
		uniqueNationalities.sort((a, b) => a.localeCompare(b));
		this.setState({ nationalities: uniqueNationalities });
	}

	isCorrectAge(birthdate, age) {
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

	handleClick = (event, id) => {
		// window.location.href = `#/perfil/${id}`;
	};

	handleSearch(value) {
		this.setState({ search: value.toLowerCase() });
	}

	renderHeader() {
		if (!isMobile) {
			return (
				<tr>
					{
						this.state.headers.map((header, id) => (
							<th key={id}>
								{header}
							</th>
						))
					}
				</tr>
			)
		}
		return (
			<tr>
				<th>Atleta</th>
				<th>Nasc.</th>
				<th>Clube</th>
			</tr>
		)
	}

	renderTable(rows) {
		if (!isMobile) {
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
			)
		}

		return (
			rows.length === 0
				? <tr>
					<td colSpan={3}>
						<div className="empty-table">
							<span>Não foram encontrados resultados.</span>
						</div>
					</td>
				</tr>
				: rows.map((row, id) => (
					<tr key={id} onClick={(event) => this.handleClick(event, row.id)}>
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
							{row.club}
						</td>
					</tr>
				))
		)
	}

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
			return Object.values(row)[0].toString().toLowerCase().includes(this.state.search)
				// Compare the gender
				&& Object.values(row)[1].includes(this.state.genderSelected)
				// Compare the club
				&& (this.state.clubSelected === '' || Object.values(row)[3] === this.state.clubSelected)
				// Compare the nationality
				&& (this.state.nationalitySelected === '' || Object.values(row)[4] === this.state.nationalitySelected)
				// Compare the age
				&& (this.state.ageSelected === '' || this.isCorrectAge(Object.values(row)[2], this.state.ageSelected));
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
					<Paper
						className="search-bar"
						component="form"
						sx={{
							p: '2px 4px',
							display: 'flex',
							alignItems: 'center',
							width: 400,
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

					{/* Gender Dropdown */}
					{
						!isMobile
							? <FormControl size="small" className="form-control-table">
								<InputLabel id="gender-select-label" shrink={true}>Género</InputLabel>
								<Select
									displayEmpty
									notched={true}
									sx={{
										minWidth: '120px'
									}}
									labelId="gender-select-label"
									id="gender-select"
									defaultValue={''}
									value={this.state.genderSelected}
									label="Género"
									onChange={(event) => this.setState({ genderSelected: event.target.value })}
								>
									<MenuItem value={''}>Todos</MenuItem>
									<MenuItem value={'M'}>Masculino</MenuItem>
									<MenuItem value={'F'}>Feminino</MenuItem>
								</Select>
							</FormControl>
							: <FormControl size="small" className="form-control-table">
								<InputLabel id="gender-sec-select-label" shrink={true}>Género</InputLabel>
								<NativeSelect
									notched={true}
									sx={{
										minWidth: '120px'
									}}
									input={
										<OutlinedInput />
									}
									labelId="gender-sec-select-label"
									id="gender-sec-select"
									value={this.state.genderSelected}
									label="Género"
									onChange={(event) => this.setState({ genderSelected: event.target.value })}
								>
									<option value={''}>Todos</option>
									<option value={'M'}>Masculino</option>
									<option value={'F'}>Feminino</option>
								</NativeSelect>
							</FormControl>
					}

					{/* Club Dropdown */}
					{
						!isMobile
							? <FormControl size="small" className="form-control-table">
								<InputLabel id="club-select-label" shrink={true}>Clube</InputLabel>
								<Select
									displayEmpty
									notched={true}
									sx={{
										minWidth: '120px'
									}}
									labelId="club-select-label"
									id="club-select"
									defaultValue={''}
									value={this.state.clubSelected}
									label="Clube"
									onChange={(event) => this.setState({ clubSelected: event.target.value })}
								>
									<MenuItem value={''}>Todos</MenuItem>
									{
										this.state.clubs !== undefined
											? this.state.clubs.map((club, id) => (
												<MenuItem key={id} value={club}>{club}</MenuItem>
											))
											: null
									}
								</Select>
							</FormControl>
							: <FormControl size="small" className="form-control-table">
								<InputLabel id="club-sec-select-label" shrink={true}>Clube</InputLabel>
								<NativeSelect
									notched={true}
									sx={{
										minWidth: '120px'
									}}
									input={
										<OutlinedInput />
									}
									labelId="club-sec-select-label"
									id="club-sec-select"
									value={this.state.clubSelected}
									label="Clube"
									onChange={(event) => this.setState({ clubSelected: event.target.value })}
								>
									<option value={''}>Todos</option>
									{
										this.state.clubs !== undefined
											? this.state.clubs.map((club, id) => (
												<option key={id} value={club}>{club}</option>
											))
											: null
									}
								</NativeSelect>
							</FormControl>
					}

					{/* Nationality Dropdown */}
					{
						!isMobile
							? <FormControl size="small" className="form-control-table">
								<InputLabel id="nationality-select-label" shrink={true}>Nacionalidade</InputLabel>
								<Select
									displayEmpty
									notched={true}
									sx={{
										minWidth: '120px'
									}}
									labelId="nationality-select-label"
									id="nationality-select"
									defaultValue={''}
									value={this.state.nationalitySelected}
									label="Nacionalidade"
									onChange={(event) => this.setState({ nationalitySelected: event.target.value })}
								>
									<MenuItem value={''}>Todos</MenuItem>
									{
										this.state.nationalities !== undefined
											? this.state.nationalities.map((nationality, id) => (
												<MenuItem key={id} value={nationality}>{nationality}</MenuItem>
											))
											: null
									}
								</Select>
							</FormControl>
							: <FormControl size="small" className="form-control-table">
								<InputLabel id="nationality-sec-select-label" shrink={true}>Nacionalidade</InputLabel>
								<NativeSelect
									notched={true}
									sx={{
										minWidth: '120px'
									}}
									input={
										<OutlinedInput />
									}
									labelId="nationality-sec-select-label"
									id="nationality-sec-select"
									value={this.state.nationalitySelected}
									label="Nacionalidade"
									onChange={(event) => this.setState({ nationalitySelected: event.target.value })}
								>
									<option value={''}>Todos</option>
									{
										this.state.nationalities !== undefined
											? this.state.nationalities.map((nationality, id) => (
												<option key={id} value={nationality}>{nationality}</option>
											))
											: null
									}
								</NativeSelect>
							</FormControl>
					}

					{/* Age Dropdown */}
					{
						!isMobile
							? <FormControl size="small" className="form-control-table">
								<InputLabel id="age-select-label" shrink={true}>Escalão</InputLabel>
								<Select
									displayEmpty
									notched={true}
									sx={{
										minWidth: '200px'
									}}
									labelId="age-select-label"
									id="age-select"
									defaultValue={''}
									value={this.state.ageSelected}
									label="Escalão"
									onChange={(event) => this.setState({ ageSelected: event.target.value })}
								>
									<MenuItem value={''}>Todos</MenuItem>
									{
										Escaloes.map((escalao, id) => (
											<MenuItem key={id} value={escalao}>{escalao}</MenuItem>
										))
									}
								</Select>
							</FormControl>
							: <FormControl size="small" className="form-control-table">
								<InputLabel id="age-sec-select-label" shrink={true}>Escalão</InputLabel>
								<NativeSelect
									notched={true}
									sx={{
										minWidth: '200px'
									}}
									input={
										<OutlinedInput />
									}
									labelId="age-sec-select-label"
									id="age-sec-select"
									value={this.state.ageSelected}
									label="Escalão"
									onChange={(event) => this.setState({ ageSelected: event.target.value })}
								>
									<option value={''}>Todos</option>
									{
										Escaloes.map((escalao, id) => (
											<option key={id} value={escalao}>{escalao}</option>
										))
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