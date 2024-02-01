import React from 'react';

import Header from '../Components/Header/Header';
import { Box } from '@mui/material';

export default class Home extends React.Component {
    render() {
        return (
            <Box>
                <Header />
                <Box
                    sx={{
                        height: "35px",
                        width: "100%",
                        backgroundColor: "#262626",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <p
                        style={{
                            color: "white",
                            fontSize: "0.85rem",
                        }}
                    >
                        <span className='gold-text'>Update:</span> Algum update que valha a pena ser mostrado
                    </p>
                </Box>
            </Box>
        )
    }
}