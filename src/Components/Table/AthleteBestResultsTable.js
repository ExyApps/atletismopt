import React from 'react';
import './AthleteResultsTable.css';

import Box from '@mui/material/Box';

// import {
// 	isMobileDeviceLandscape,
// 	isTabletDevice
// } from '../../Utils/WindowSizes';

import TableHeader from './TableHeader';
import Table from './Table';
// import Form from './Form';

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
							sortable={false}
						/>
						<TableHeader
							parent={this}
							field='event_name'
							name='Evento'
							orderBy={this.state.orderBy}
							order={this.state.order}
							sortable={false}
						/>
						<TableHeader
							parent={this}
							field='competition_name'
							name='Competição'
							orderBy={this.state.orderBy}
							order={this.state.order}
							sortable={false}
						/>
						<TableHeader
							parent={this}
							field='competition_location'
							name='Local'
							orderBy={this.state.orderBy}
							order={this.state.order}
							sortable={false}
						/>
						<TableHeader
							parent={this}
							field='result'
							name='Resultado'
							orderBy={this.state.orderBy}
							order={this.state.order}
							sortable={false}
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
									<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{row.date}</Box></td>
									<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{row.event_name}</Box></td>
									<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{row.competition_name}</Box></td>
									<td><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{row.competition_location}</Box></td>
									<td>
										<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
							<div className="foot-table"></div>
						</td>
					</tr>
				</tfoot>
			</table>
		)
	}

	render() {
		return <>
			{
				this.renderDesktop(this.state.searchedRows)
			}
		</>
	}
}