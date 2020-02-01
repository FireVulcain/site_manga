import React, { Component } from "react";
import Head from "./../components/layouts/Head";

//Component
import LastestRelease from "./../components/home/LastestRelease";

//Material-ui stuff
import Grid from "@material-ui/core/Grid";

class Home extends Component {
    render() {
        return (
            <Head pageMeta={{ title: "ScanNation France | Scans de manga en ligne" }}>
                <Grid container className="main" spacing={3}>
                    <Grid item md={12}>
                        <LastestRelease />
                    </Grid>
                </Grid>
            </Head>
        );
    }
}

export default Home;
