import React from 'react';
import './AthleteResultsTable.css';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

import {
	isMobileDeviceLandscape,
	isTabletDevice
} from '../../Utils/WindowSizes';

import TableHeader from './TableHeader';
import Table from './Table';

export default class AthleteBestResultsTable extends Table {
	componentDidMount() {
		window.addEventListener('resize', this.updateDimensions);

		this.setState({
			orderBy: 'name',

			// Filters
			events: [],
			eventSelected: '',

			years: [],
			yearSelected: '',

			onlyValid: false,
		}, () => {
		});
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateDimensions);
	}

	handleClick = (_, id) => {

	};

	renderMobile(rows) {
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
								name='Recordes'
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
											<span className="mobile-span" style={{ fontSize: '14px' }}>{row.date}</span>
										</Box>
									</tr>
								))
						}
					</tbody>
					<tfoot>
						<tr>
							<td>
								<div className="foot-table">
								</div>
							</td>
						</tr>
					</tfoot>
				</table>
			</>
		)
	}

	renderTablet(rows) {
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
								<tr key={row.event_id} className="clickable-row" onClick={(event) => this.handleClick(event, row.event_id)}>
									<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{row.date}</Box></td>
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
							</div>
						</td>
					</tr>
				</tfoot>
			</table>
		)
	}

	renderDesktop(rows) {
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
								<tr key={row.event_id} className="clickable-row" onClick={(event) => this.handleClick(event, row.event_id)}>
									<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{row.date}</Box></td>
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
							</div>
						</td>
					</tr>
				</tfoot>
			</table>
		)
	}

	render() {
		return <>
			{
				isMobileDeviceLandscape()
					? this.renderMobile(this.state.searchedRows)
					: isTabletDevice()
						? this.renderTablet(this.state.searchedRows)
						: this.renderDesktop(this.state.searchedRows)
			}
		</>
	}
}