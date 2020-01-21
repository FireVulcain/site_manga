import React, { Component } from "react";
import PropTypes from "prop-types";

//Component
import LastestRelease from "./../components/home/LastestRelease";

//Material-ui stuff
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";

const styles = {
    main: {
        padding: "40px"
    }
};
class Home extends Component {
    render() {
        const { classes } = this.props;
        return (
            <Grid container className={classes.main}>
                <Grid item md={12}>
                    <LastestRelease />
                </Grid>
            </Grid>
        );
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home);
