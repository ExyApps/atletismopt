import React from 'react';

import HeaderButton from './HeaderButton';

import { Box, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAdmin: false,
            page: "",
        }
    }

    componentDidMount() {
        this.setState({
            page: this.getPage(),
        });
    }
    
    normalizePage(page) {
        page = page.toLowerCase();
        return page === "competições" ? "competicoes" : page;
    }

    getPage() {
        var url = window.location.href.split("//").pop();
        var splitted = url.split("/");
        var page = splitted.length > 1 && splitted[1] !== "" ? splitted[1] : "home";
        return this.normalizePage(page);
    }

    render() {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: "0 1rem",
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <p>Logo</p>
                    <HeaderButton text="Home" parent={this}/>
                    <HeaderButton text="Competições" parent={this}/>
                    <HeaderButton text="Rankings" parent={this}/>
                    <HeaderButton text="Pesquisar" parent={this}/>
                    <HeaderButton text="Backoffice" parent={this}/>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <HeaderButton text="Sobre" parent={this}/>

                    <Button
                        variant="contained"
                        startIcon={<PersonIcon />}
                        sx={{
                            textTransform: 'none',
                            backgroundColor: '#281e37',
                            color: 'white',
                            boxShadow: 'none',
                            "&:hover": {
                                backgroundColor: '#281e37',
                            }
                        }}
                    >
                        Entrar / Registar
                    </Button>
                </Box>
            </Box>
        )
    }
}