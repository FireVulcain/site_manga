import React, { Component } from "react";
import PasswordChangeForm from "./../PasswordChange";
import { AuthUserContext, withAuthorization } from "./../../Session";
import Head from "./../../layouts/Head";

//Material-ui
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

class AccountPage extends Component {
    render() {
        return (
            <AuthUserContext.Consumer>
                {(authUser) => (
                    <Head pageMeta={{ title: authUser.username + " - Compte | ScanNation France" }}>
                        <Box className="logs_page">
                            <h1>{authUser.username}</h1>
                            <Grid container spacing={5}>
                                <Grid item xs={5}>
                                    <h2>Gestion du compte :</h2>
                                    <PasswordChangeForm />
                                </Grid>
                                <Grid item xs={7}>
                                    <h2>Commentaires :</h2>
                                </Grid>
                            </Grid>
                        </Box>
                    </Head>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

const condition = (authUser) => !!authUser;
export default withAuthorization(condition)(AccountPage);
