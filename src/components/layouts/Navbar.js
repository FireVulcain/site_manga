import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import SignOutButton from "./../auth/SignOut";

// routes
import * as ROUTES from "./../../constants/routes";

// Auth
import { AuthUserContext } from "./../Session";

//Material-ui stuff
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

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
            <AuthUserContext.Consumer>
                {(authUser) => {
                    return (
                        <Box className={classes.container}>
                            <Grid container alignItems="center" className={classes.menu}>
                                <Grid item md={2}>
                                    <Link to={ROUTES.HOME}>
                                        <img src={logo} alt="logo" />
                                    </Link>
                                </Grid>
                                <Grid container justify="space-between" item md={10}>
                                    <Box className={classes.root}>
                                        <Button component={Link} to={ROUTES.HOME}>
                                            Accueil
                                        </Button>
                                        <Button component={Link} to={ROUTES.PLANNING}>
                                            Planning
                                        </Button>
                                        <Button component={Link} to={ROUTES.LIST_MANGAS}>
                                            Mangas
                                        </Button>
                                    </Box>
                                    {!authUser ? (
                                        <Box>
                                            <Button component={Link} to={ROUTES.SIGN_IN}>
                                                Connexion
                                            </Button>
                                            <Button component={Link} to={ROUTES.SIGN_UP}>
                                                Inscription
                                            </Button>
                                        </Box>
                                    ) : (
                                        <Box>
                                            <Button component={Link} to={ROUTES.ACCOUNT}>
                                                Compte
                                            </Button>
                                            <SignOutButton />
                                        </Box>
                                    )}
                                </Grid>
                            </Grid>
                        </Box>
                    );
                }}
            </AuthUserContext.Consumer>
        );
    }
}

Navbar.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Navbar);
