import * as React from 'react';

export default class EnhancedTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			width: window.innerWidth,

			rows: props.rows,
			searchedRows: [...props.rows],

			order: 'asc',
			orderBy: '',
			page: 0,
			rowsPerPage: 10,
		};
	}

	updateDimensions = () => {
		this.setState({ width: window.innerWidth });
	};

	specialCharacterToNormalCharacter = (string) => {
		if (string === null || string === undefined) return '0.00';
		return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	};

	// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
	// stableSort() brings sort stability to non-modern browsers (notably IE11).
	stableSort(array, comparator) {
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

	descendingComparator(a, b, orderBy) {
		if (this.specialCharacterToNormalCharacter(b[orderBy]) < this.specialCharacterToNormalCharacter(a[orderBy])) {
			return -1;
		}
		if (this.specialCharacterToNormalCharacter(b[orderBy]) > this.specialCharacterToNormalCharacter(a[orderBy])) {
			return 1;
		}
		return 0;
	}

	getComparator(order, orderBy) {
		return order === 'desc'
			? (a, b) => this.descendingComparator(a, b, orderBy)
			: (a, b) => -this.descendingComparator(a, b, orderBy);
	}

	handleRequestSort = (_, property, initial = false) => {
		var isAsc = (this.state.orderBy === property && this.state.order === 'asc');
		if (initial) isAsc = this.state.order === 'asc';
		this.setState({
			order: isAsc ? 'desc' : 'asc',
			orderBy: property,
		}, () => this.setState({
			searchedRows: this.stableSort(this.state.searchedRows, this.getComparator(this.state.order, this.state.orderBy)),
		}));
	};

	handleChangePage = (_, newPage) => {
		this.setState({ page: newPage });
	};

	handleChangeRowsPerPage = (event) => {
		this.setState({
			rowsPerPage: parseInt(event.target.value, 10),
			page: 0,
		});
	};

	// This method needs to be implemented by the child class.
	handleClick = (_, id) => {
		alert('Clicked on row with id:', id);
	};

	// This method needs to be implemented by the child class.
	render() {
		return null;
	}
}
