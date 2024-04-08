import React, { useEffect } from 'react';

import Table from '../Components/Table/Table';

function createData(name, gender, birthdate, club, protein) {
	return { name, gender, birthdate, club, protein };
}

const rows = [
	createData('Atleta 1', 'M', '1995-01-01', 'SIGLA', "POR"),
	createData('Atleta 2', 'F', '1995-01-01', 'SIGLA', "POR"),
	createData('Atleta 3', 'M', '1995-01-01', 'SIGLA', "POR"),
	createData('Atleta 4', 'F', '1995-01-01', 'SIGLA', "POR"),
	createData('Atleta 5', 'M', '1995-01-01', 'SIGLA', "POR"),
	createData('Atleta 6', 'F', '1995-01-01', 'SIGLA', "POR")
];

export default function CustomizedTables() {
	useEffect(() => {
		document.title = 'AtletismoPT - Perfis';
	});

	return (
		<div className='page'>
			<Table
				headers={['Nome', 'Género', 'Data de Nascimento', 'Clube', 'Nacionalidade']}
				rows={rows}
			/>
		</div>
	);
}