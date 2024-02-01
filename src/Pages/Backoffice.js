import React from 'react';

import { Box, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tab, Tabs } from '@mui/material';
import WebRoundedIcon from '@mui/icons-material/WebRounded';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Collapse from '@mui/material/Collapse';

import Header from '../Components/Header/Header';
import Window from '../Components/Backoffice/Window';
import { getInformation } from '../Utils/Communication/Communication';

export default class Backoffice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            structure: {},
            relations: {},
            tablesOpen: true,

            request: {},
            openedWindow: 0,
            windows: ["Janela 1"],
            windowsComponents: [],
            windowsRefs: [],

        }
    }

    async componentDidMount() {
        var structure = await getInformation("backoffice-structure");

        var windowRef = React.createRef();

        this.setState({
            structure: structure["structure"],
            relations: structure["relations"],
            windowsComponents: [
                <Window
                    ref={windowRef}
                    parent={this}
                />
            ],
            windowsRefs: [windowRef]
        });
    }

    toggleTablesView() {
        this.setState({
            tablesOpen: !this.state.tablesOpen
        })
    }

    handleTableClick(table) {
        this.state.windowsRefs[this.state.openedWindow].current.addTable(table);
    }

    render() {
        return (
            <Box>
                <Header />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            padding: "10px",
                            marginRight: "1rem",
                        }}
                    >

                        <List
                            sx={{
                                width: "100%",
                                m: 0,
                                p: 0,
                                minWidth: "12rem",
                            }}
                        >
                            <ListItem
                                secondaryAction={
                                    <IconButton 
                                        edge="end" 
                                        aria-label="expand" 
                                        onClick={() => this.toggleTablesView()}
                                    >
                                        {this.state.tablesOpen ? <ExpandLess /> : <ExpandMore />}
                                    </IconButton>
                                }
                            >
                                <ListItemIcon sx={{minWidth: 0}}>
                                    <WebRoundedIcon sx={{fontSize: "20px"}} />
                                </ListItemIcon>
                                <ListItemText                                        
                                    primary="Tabelas" 
                                    sx={{my:0, pl: "1rem"}}
                                    primaryTypographyProps={{
                                        fontSize: "14px",
                                    }}
                                />
                            </ListItem>
                            <Collapse in={this.state.tablesOpen} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {
                                        Object.keys(this.state.structure).map((table, index) => {
                                            return <ListItemButton sx={{ pl: 5 }} onClick={() => this.handleTableClick(table)}>
                                                <ListItemIcon sx={{minWidth: 0}}>
                                                    <WebRoundedIcon sx={{fontSize: "20px"}} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={table} 
                                                    sx={{my:0, pl: "1rem"}}
                                                    primaryTypographyProps={{
                                                        fontSize: "14px",
                                                    }}
                                                />
                                            </ListItemButton>
                                        })
                                    }
                                </List>
                            </Collapse>
                            <Divider />
                        </List>
                        
                    </Box>

                    <Box
                        sx={{
                            width: "calc(100vw - 16.5rem)",
                        }}
                    >
                        <Tabs
                            value={this.state.openedWindow}
                            onChange={(event, newValue) => {
                                if (newValue === this.state.windows.length) {
                                    var windowRef = React.createRef();
                                    this.setState({
                                        windows: [...this.state.windows, "Janela " + (this.state.windows.length + 1)],
                                        openedWindow: newValue,
                                        windowsComponents: [...this.state.windowsComponents, <Window ref={windowRef} parent={this} />],
                                        windowsRefs: [...this.state.windowsRefs, windowRef],
                                    })
                                } else {
                                    this.setState({
                                        openedWindow: newValue
                                    })
                                }
                            }}
                            variant="scrollable"
                            scrollButtons="auto"
                            allowScrollButtonsMobile
                            aria-label="scrollable auto tabs example"
                        >
                            {
                                this.state.windows.map((window, index) => {
                                    return (
                                        <Tab 
                                            label={window} 
                                            sx={{
                                                textTransform: "none",
                                            }}    
                                        />
                                    );
                                })
                            }
                            <Tab 
                                icon={<AddRoundedIcon />} 
                                iconPosition="start"
                                sx={{
                                    textTransform: "none",
                                    minHeight: "48px",
                                    width: "90px",
                                }} 
                                // label="Nova"
                            />
                        </Tabs>
                        <Box
                            sx={{
                                mt: "0px",
                                width: "100%",
                                height: "calc(100vh - 132px)",
                                mr: "1rem",
                                padding: "10px",
                                borderRadius: "5px",
                                backgroundColor: "#eee",
                                border: "1px solid #bbb",
                            }}
                        >
                            {
                                this.state.windowsComponents.map((window, index) => {
                                    return (
                                        <Box
                                            sx={{
                                                display: this.state.openedWindow === index ? "block" : "none",
                                                width: "100%",
                                                height: "100%",
                                            }}
                                        >
                                            {window}
                                        </Box>
                                    );
                                })
                            }
                        </Box>
                    </Box>
                    
                </Box>
            </Box>
        )
    }
}