import { Button } from '@mui/material';
import React from 'react';

export default class HeaderButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parent: props.parent,
            text: props.text,

            selected: false,
        }
    }

    componentDidMount() {
        var normalizedPage = this.state.parent.normalizePage(this.state.text);
        this.setState({
            selected: this.state.parent.getPage() === normalizedPage,
            normalizedPage: normalizedPage,
        });
    }

    changePage() {
        if (this.state.normalizedPage === "home") {
            window.location.href = window.location.href.split("/").slice(0, -1).join("/");
        } else {
            window.location.href = window.location.href.split("/").slice(0, -1).join("/") + "/" + this.state.normalizedPage;
        }
    }

    render() {
        return (
            <Button
                sx={{
                    m: "0 0.5rem",
                    p: "0 5px",
                    textTransform: 'none',
                    color: 'black',
                    borderRadius: '0',
                    fontWeight: '400',
                    borderBottom: (this.state.selected ? "1px" : "0px") + " solid #ff873c",
                    '&:hover': {
                        backgroundColor: 'transparent',
                        borderBottom: '1px solid #ff873c',
                    },
                }}
                onClick={() => this.changePage()}
            >
                {this.state.text}
            </Button>
        )
    }
}