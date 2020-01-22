import React, { Component } from "react";

//Component
import LastestRelease from "./../components/home/LastestRelease";

//Material-ui stuff
import Grid from "@material-ui/core/Grid";

class Home extends Component {
    render() {
        return (
            <Grid container className="main">
                <Grid item md={12}>
                    <LastestRelease />
                </Grid>
            </Grid>
        );
    }
}

export default Home;
