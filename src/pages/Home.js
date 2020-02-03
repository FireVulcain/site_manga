import React, { Component } from "react";
import Head from "./../components/layouts/Head";

//Component
import LastestRelease from "./../components/home/LastestRelease";
import LastestNews from "./../components/home/LastestNews";

//Material-ui stuff
import Grid from "@material-ui/core/Grid";

class Home extends Component {
    render() {
        return (
            <Head pageMeta={{ title: "ScanNation France | Scans de manga en ligne" }}>
                <Grid container spacing={2} className="main">
                    <Grid item md={6}>
                        <LastestRelease />
                    </Grid>
                    <Grid item md={6}>
                        <LastestNews />
                    </Grid>
                </Grid>
            </Head>
        );
    }
}

export default Home;
