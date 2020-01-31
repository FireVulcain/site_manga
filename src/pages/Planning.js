import React, { Component } from "react";
import Head from "./../components/layouts/Head";
import NextRelease from "./../components/planning/NextRelease";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

class Planning extends Component {
    render() {
        return (
            <Head pageMeta={{ title: "Les prochaines sorties | ScanNation France" }}>
                <Box className="main">
                    <Typography variant="h5" component="h3" className="titlePage">
                        Les prochaines sorties
                    </Typography>
                    <NextRelease />
                </Box>
            </Head>
        );
    }
}
export default Planning;
