import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Checkbox, Collapse, IconButton } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import { TiKeyOutline } from "react-icons/ti";

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import styled from '@mui/material/styles/styled';
import tableCellClasses from '@mui/material/TableCell/tableCellClasses';

import { makeQueryDB } from '../../Utils/Communication/Communication';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#281e37",
      color: theme.palette.common.white,
      padding: "5px 5px"
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
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
            queryWindow: true,
            queryLoading: false,
            queryComplete: false,
            queryResult: [],

            parent: props.parent,

            mainTable: "",
            mainTableColumns: {},
            mainTableOpen: true,

            tablePage: 0,
            rowsPerPage: 5,
        }
    }

    addTable(table) {
        if (!this.state.queryWindow) return;

        var mainTableColumns = {};
        for (var column in this.state.parent.state.structure[table]) {
            var columnName = this.state.parent.state.structure[table][column]["name"];
            mainTableColumns[columnName] = true;
        }
        this.setState({
            mainTable: table,
            mainTableColumns: mainTableColumns,
        });
    }

    async makeQuery() {
        this.setState({
            queryLoading: true,
        });

        var queryResult = await makeQueryDB(
            this.state.mainTable,
            this.state.mainTableColumns
        );

        this.setState({
            queryLoading: false,
            queryResult: queryResult["data"],
            queryWindow: false,
            tablePage: 0,
            rowsPerPage: 10,
            queryComplete: true
        });
    }

    handleChangePage(event, newPage) {
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

    render() {

        if (!this.state.pageWindow) {
            console.log(this.state.parent.state.structure);
            console.log(this.state.parent.state.structure[this.state.mainTable]);
        }

        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                }}
            >
            {
                this.state.queryLoading
                ? <CircularProgress />
                : this.state.queryWindow
                    ? <Box
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
                            <span>Query:</span>
                            <Box>
                                {
                                    this.state.queryComplete
                                    ? <Button
                                        sx={{
                                            p: 0,
                                            textTransform: "none",
                                            mr: "2rem"
                                        }}
                                        onClick={() => this.setState({queryWindow: false})}
                                    >
                                        Ver Resultados
                                    </Button>
                                    : null
                                }

                                <Button
                                    sx={{
                                        p: 0,
                                        textTransform: "none",
                                    }}
                                    onClick={() => this.makeQuery()}
                                >
                                    Executar
                                </Button>

                            </Box>

                        </Box>
                        <Box
                            sx={{
                                mt: "0.75rem",
                                ml: "1rem",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <span style={{fontSize: "13px"}}>Tabela Principal:</span>
                                <Card
                                    sx={{
                                        m: "0px 0.5rem",
                                        p: "2px 7px",
                                    }}
                                >
                                    <p style={{fontSize: "13px", margin: "0px"}}>{this.state.mainTable}</p>
                                </Card>
                                {
                                    this.state.mainTable === ""
                                    ? null
                                    : <IconButton
                                        onClick={() => {
                                            this.setState({
                                                mainTableOpen: !this.state.mainTableOpen
                                            })
                                        }}
                                    >
                                        {
                                            this.state.mainTableOpen ? <ExpandLess /> : <ExpandMore />
                                        }
                                    </IconButton>
                                }

                            </Box>
                            {
                                this.state.mainTable !== ""
                                ? <Collapse in={this.state.mainTableOpen} timeout="auto" unmountOnExit>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                            ml: "1rem",
                                        }}
                                    >
                                        {
                                            Object.keys(this.state.parent.state.structure[this.state.mainTable]).map((column) => {
                                                var columnDict = this.state.parent.state.structure[this.state.mainTable][column];
                                                return (
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                            mt: "0.5rem",
                                                        }}
                                                    >
                                                        <Checkbox
                                                            disabled={columnDict["primary_key"] === 1}
                                                            checked={this.state.mainTableColumns[columnDict["name"]]}
                                                            onChange={() => {
                                                                var mainTableColumns = this.state.mainTableColumns;
                                                                mainTableColumns[columnDict["name"]] = !mainTableColumns[columnDict["name"]];
                                                                this.setState({
                                                                    mainTableColumns: mainTableColumns,
                                                                });
                                                            }}
                                                            sx={{
                                                                padding: "0px",
                                                                mr: "0.5rem",
                                                            }}
                                                        />
                                                        <span style={{fontSize: "13px"}}>{columnDict["name"]}</span>
                                                        <Card
                                                            sx={{
                                                                ml: "0.5rem",
                                                                p: "2px 7px",
                                                            }}
                                                        >
                                                            <p style={{fontSize: "13px", margin: "0px"}}>{columnDict["type"]}</p>
                                                        </Card>
                                                    </Box>
                                                )
                                            })
                                        }
                                    </Box>
                                </Collapse>
                                : null
                            }
                        </Box>
                    </Box>
                    : <Box
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
                            <span>Resultados:</span>
                            <Button
                                sx={{
                                    p: 0,
                                    textTransform: "none",
                                }}
                                onClick={() => this.setState({queryWindow: true})}
                            >
                                Voltar
                            </Button>
                        </Box>

                        <Paper sx={{ width: '100%', overflow: 'hidden', mt: "0.75rem" }}>
                            <TableContainer sx={{ maxHeight: "100%" }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <StyledTableRow>
                                            {
                                                Object.keys(this.state.mainTableColumns).map((column, index) => {
                                                    if (this.state.mainTableColumns[column]) {
                                                        return (
                                                            <StyledTableCell
                                                                key={column}
                                                                align="center"
                                                            >
                                                                <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                                                                    {column}
                                                                    {
                                                                        this.state.parent.state.structure[this.state.mainTable][index]["primary_key"] === 1
                                                                        ? <TiKeyOutline sx={{ml: "1rem", fontSize: 20}} />
                                                                        : null
                                                                    }
                                                                </Box>
                                                            </StyledTableCell>
                                                        )
                                                    }
                                                    return null;
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
                                                    <StyledTableRow role="checkbox" tabIndex={-1} key={row.id}>
                                                        {
                                                            Object.keys(this.state.mainTableColumns).map((column, index) => {
                                                                if (this.state.mainTableColumns[column]) {
                                                                    return (
                                                                        <StyledTableCell key={column} align="center" sx={{
                                                                            "&:hover": {
                                                                                cursor: this.state.parent.state.structure[this.state.mainTable][index]["primary_key"] !== 1 ? "pointer" : "default",
                                                                                backgroundColor: this.state.parent.state.structure[this.state.mainTable][index]["primary_key"] !== 1 ? "#aaa" : null,
                                                                            },
                                                                        }}>
                                                                            {row[column]}
                                                                        </StyledTableCell>
                                                                    )
                                                                }
                                                                return null;
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
            }</Box>
        )
    }
}