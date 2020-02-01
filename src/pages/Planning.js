import React, { Component } from "react";
import Head from "./../components/layouts/Head";
import NextRelease from "./../components/planning/NextRelease";

import Box from "@material-ui/core/Box";

class Planning extends Component {
    render() {
        return (
            <Head pageMeta={{ title: "Les prochaines sorties | ScanNation France" }}>
                <Box className="main">
                    <NextRelease />
                </Box>
            </Head>
        );
    }
}
export default Planning;
