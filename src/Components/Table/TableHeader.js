import React from 'react';

import Box from '@mui/material/Box';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function TableHeader(props) {
	return (
		<th>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
					':hover': {
						cursor: 'pointer',
					}
				}}
				onClick={(event) => props.parent.handleRequestSort(event, props.field)}
			>
				{
					props.name
				}
				{
					props.orderBy === props.field
						? props.order === 'asc'
							? <ArrowDropUpIcon />
							: <ArrowDropDownIcon />
						: null
				}
			</Box>
		</th>
	)
}