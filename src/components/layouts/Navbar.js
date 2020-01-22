import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

//Material-ui stuff
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

//img
import logo from "./../../assets/images/logo.png";

const styles = (theme) => ({
    root: {
        "& > * + *": {
            marginLeft: theme.spacing(2)
        }
    },
    container: {
        background: "#1E242C"
    },
    menu: {
        width: "1325px",
        margin: "0 auto",

        "& a": {
            color: "#fff"
        }
    }
});
class Navbar extends Component {
    render() {
        const { classes } = this.props;
        return (
            <Box className={classes.container}>
                <Grid container alignItems="center" className={classes.menu}>
                    <Grid item md={2}>
                        <Link to="/">
                            <img src={logo} alt="logo" />
                        </Link>
                    </Grid>
                    <Grid item md={6}>
                        <Typography className={classes.root}>
                            <Button component={Link} to="/">
                                Accueil
                            </Button>
                            <Button component={Link} to="/planning">
                                Planning
                            </Button>
                            <Button component={Link} to="/mangas">
                                Mangas
                            </Button>
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}

Navbar.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Navbar);
