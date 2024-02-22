import React from 'react';

import { Box, Icon, Tab, Tabs } from '@mui/material';

// import FunctionsIcon from '@mui/icons-material/Functions';
import GridOnIcon from '@mui/icons-material/GridOn';

import Header from '../Components/Header/Header';
import Window from '../Components/Backoffice/Window';
import { performGetRequest } from '../Utils/Communication/Communication';

export default class Backoffice extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			structure: {},
			relations: {},
			request: {},

			openedWindow: 0,
			windowsComponents: [],
			windowsRefs: [],

			fieldsSize: 11 * 16, // 10rem
		}
	}

	async componentDidMount() {
		var structure = await performGetRequest("backoffice/structure");

		var windowRef = React.createRef();

		this.setState({
			structure: structure["structure"],
			relations: structure["relations"],
			windowsComponents: [
				<Window
					structure={structure["structure"]}
					relations={structure["relations"]}
					ref={windowRef}
					parent={this}
				/>
			],
			windowsRefs: [windowRef]
		});

		this.dragImg = new Image(0, 0);
		this.dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
	}

	handleTableClick(table) {
		this.state.windowsRefs[this.state.openedWindow].current.addTable(table);
	}

	resizeFieldsWindow(e) {
		var windowWidth = window.innerWidth;
		var fieldsWidth = windowWidth - e.clientX;

		this.setState({
			fieldsSize: fieldsWidth,
		});
	}



	render() {
		return (
			<Box>
				<Header />
				<Box
					sx={{
						display: "flex",
					}}
				>
					<Box
						sx={{
							ml: "0.5rem",
							// mr: "0.5rem",
							width: "calc(100svw - 10rem)",
						}}
					>
						{/* <Tabs
                            value={this.state.openedWindow}
                            onChange={(event, newValue) => {
                                if (newValue === this.state.windowsComponents.length) {
                                    var windowRef = React.createRef();
                                    this.setState({
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
                            sx={{
                                minHeight: "0px",
                            }}
                        >
                            {
                                this.state.windowsComponents.map((window, index) => {
                                    return (
                                        <Tab 
                                            key={`Janela ${index + 1}`}
                                            label={`Janela ${index + 1}`} 
                                            sx={{
                                                textTransform: "none",
                                                minHeight: "0px",
                                                minWidth: "0px",
                                                p: "5px 10px",
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
                                    minHeight: "0px",
                                    minWidth: "0px",
                                    p: "5px 10px",
                                }} 
                            />
                        </Tabs> */}
						{/* <Box
                            sx={{
                                mt: "0px",
                                height: "calc(100vh - 132px)",
                                padding: "10px",
                                borderRadius: "5px",
                                backgroundColor: "#eee",
                                border: "1px solid #bbb",
                            }}
                        > */}
						{
							this.state.windowsComponents.map((window, index) => {
								return (
									<Box
										key={window}
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
						{/* </Box> */}
					</Box>

					{/* Drag Bar */}
					<Box
						draggable
						onDragStart={(e) => e.dataTransfer.setDragImage(this.dragImg, 0, 0)}
						onDrag={(e) => this.resizeFieldsWindow(e)}
						onDragEnd={(e) => this.resizeFieldsWindow(e)}
						sx={{
							borderLeft: "2px solid #bbb",
							"&:hover": {
								cursor: "e-resize",
							}
						}}
					></Box>

					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							padding: "5px",
							pr: "0.5rem",
							borderTop: "2px solid #bbb",
							borderBottom: "2px solid #bbb",

							width: `${this.state.fieldsSize}px`,
							minWidth: "10rem",
							maxWidth: "18rem",
						}}
					>
						<span
							style={{
								fontSize: "13px",
								fontWeight: "bold",
							}}
						>
							Campos:
						</span>

						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								m: 0,
								p: 0,
							}}
						>
							{
								Object.keys(this.state.structure).map((table, index) => {
									return (
										<Box
											draggable
											key={table}
											onDragStart={(e) => {
												e.dataTransfer.setData("text/plain", table);
											}}
											sx={{
												display: "flex",
												flexDirection: "row",
												alignItems: "center",
												mt: "1px",
												fontSize: "13px",
												borderRadius: "5px",
												padding: "2px",
												"&:hover": {
													backgroundColor: "#281e37",
													color: "#fff",
													cursor: "grab"
												}
											}}
										>
											<Icon
												sx={{
													fontSize: "13px",
												}}
											>
												<GridOnIcon
													sx={{
														fontSize: "13px",
													}}
												/>
											</Icon>
											<span
												style={{
													marginLeft: "5px",
													whiteSpace: "nowrap",
													overflow: "hidden",
													textOverflow: "ellipsis",
												}}
											>
												{table}
											</span>
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