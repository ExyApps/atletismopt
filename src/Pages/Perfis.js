import React, { useEffect } from 'react';

import AthleteTable from '../Components/Table/AthleteTable';

function createData(name, gender, birthdate, club, nationality) {
	return { name, gender, birthdate, club, nationality };
}

const rows = [
	createData('Atleta 1', 'M', '2000-01-01', 'SCP', "POR"),
	createData('Atleta 2', 'F', '2002-01-01', 'SLB', "ESP"),
	createData('Atleta 3', 'M', '2004-01-01', 'JV', "FRA"),
	createData('Atleta 4', 'F', '2006-01-01', 'MAC', "GRE"),
	createData('Atleta 5', 'M', '1980-01-01', 'SCB', "ITA"),
	createData('Atleta 6', 'F', '1975-01-01', 'AJS', "BRA")
];

export default function CustomizedTables() {
	useEffect(() => {
		document.title = 'AtletismoPT - Perfis';
	});

	return (
		<div className='page'>
			<AthleteTable
				headers={['Nome', 'Género', 'Data de Nascimento', 'Clube', 'Nacionalidade']}
				rows={rows}
			/>
		</div>
	);
}