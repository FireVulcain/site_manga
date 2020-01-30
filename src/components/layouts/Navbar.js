import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import SignOutButton from "./../auth/SignOut";
import * as ROLES from "./../../constants/roles";

// routes
import * as ROUTES from "./../../constants/routes";

// Auth
import { AuthUserContext } from "./../Session";

//Material-ui stuff
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import AddIcon from "@material-ui/icons/Add";
//img
import logo from "./../../assets/images/logo.png";

const styles = (theme) => ({
    root: {
        "& > * + *": {
            marginLeft: theme.spacing(2)
        }
    },
    container: {
        background: "#1E242C",
        "& *": {
            color: "#fff"
        }
    },
    menu: {
        width: "1325px",
        margin: "0 auto",
        postition: "relative",
        minHeight: "70px"
    },
    fab: {
        background: "transparent",
        boxShadow: "none",
        "&:hover": {
            background: "transparent"
        }
    },
    logo: {
        display: "inline-block",
        width: "95px",
        height: "80px",
        position: "absolute",
        top: "0",
        background: `url(${logo}) no-repeat`,
        backgroundSize: "contain"
    }
});
class Navbar extends Component {
    constructor() {
        super();
        this.state = {
            anchorEl: null
        };
    }
    handleClick = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };
    render() {
        const { classes } = this.props;
        return (
            <AuthUserContext.Consumer>
                {(authUser) => {
                    return (
                        <Box className={classes.container}>
                            <Grid container alignItems="center" className={classes.menu}>
                                <Grid item md={1}>
                                    <Link to={ROUTES.HOME} className={classes.logo}></Link>
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
                                        <Box display="flex">
                                            {!!authUser.roles[ROLES.ADMIN] && (
                                                <Box>
                                                    <Fab className={classes.fab} onClick={this.handleClick} size="small" color="primary">
                                                        <AddIcon />
                                                    </Fab>
                                                    <Menu
                                                        anchorOrigin={{
                                                            vertical: "bottom",
                                                            horizontal: "left"
                                                        }}
                                                        getContentAnchorEl={null}
                                                        anchorEl={this.state.anchorEl}
                                                        open={Boolean(this.state.anchorEl)}
                                                        onClose={this.handleClose}
                                                    >
                                                        <MenuItem component={Link} to={ROUTES.UPLOAD_MANGA} onClick={this.handleClose}>
                                                            Manga
                                                        </MenuItem>
                                                        <MenuItem component={Link} to={ROUTES.UPLOAD_CHAPTER} onClick={this.handleClose}>
                                                            Chapitre
                                                        </MenuItem>
                                                    </Menu>
                                                </Box>
                                            )}
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
