import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import * as ROUTES from "./../../../constants/routes";
import * as ROLES from "./../../../constants/roles";
import { withFirebase } from "./../../../config/Firebase";

import Head from "./../../layouts/Head";

//Material-ui
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CircularProgress from "@material-ui/core/CircularProgress";

const SignUpPage = () => (
    <Head pageMeta={{ title: "Inscription | ScanNation France" }}>
        <Box className="logs_page">
            <h1>Inscription</h1>
            <SignUpForm />
        </Box>
    </Head>
);
const INITIAL_STATE = {
    username: "",
    email: "",
    passwordOne: "",
    passwordTwo: "",
    isAdmin: false,
    loading: false,
    error: null
};
class SignUpFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }
    onSubmit = (event) => {
        this.setState({ loading: true });
        const { username, email, passwordOne, passwordTwo, isAdmin } = this.state;
        const roles = {};
        if (isAdmin) {
            roles[ROLES.ADMIN] = ROLES.ADMIN;
        }
        if (passwordOne === passwordTwo) {
            this.props.firebase
                .doCreateUserWithEmailAndPassword(email, passwordOne)
                .then((authUser) => {
                    return this.props.firebase.user(authUser.user.uid).set({
                        username,
                        email,
                        roles
                    });
                })
                .then(() => {
                    this.setState({ ...INITIAL_STATE });
                    this.props.history.push(ROUTES.HOME);
                })
                .catch((error) => {
                    this.setState({ error });
                });
        } else {
            this.setState({
                error: { code: "aut/different-password", message: "Mot de passe différent" }
            });
        }

        event.preventDefault();
    };
    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };
    onChangeCheckbox = (event) => {
        this.setState({ [event.target.name]: event.target.checked });
    };
    render() {
        const { username, email, passwordOne, passwordTwo, error, isAdmin, loading } = this.state;
        const isInvalid = passwordOne !== passwordTwo || passwordOne === "" || email === "" || username === "";
        return (
            <form onSubmit={this.onSubmit}>
                <TextField onChange={this.onChange} label="Pseudo" value={username} name="username"></TextField>
                <TextField onChange={this.onChange} label="Adresse email" type="email" value={email} name="email"></TextField>
                <TextField onChange={this.onChange} label="Mot de passe" type="password" value={passwordOne} name="passwordOne"></TextField>
                <TextField
                    onChange={this.onChange}
                    label="Confirmation du mot de passe"
                    type="password"
                    value={passwordTwo}
                    name="passwordTwo"
                ></TextField>
                <FormControlLabel
                    control={<Checkbox name="isAdmin" checked={isAdmin} onChange={this.onChangeCheckbox} color="primary" />}
                    label="Admin"
                />
                <Button type="submit" disabled={isInvalid} variant="contained" color="primary">
                    {loading ? <CircularProgress size={30} /> : "Inscription"}
                </Button>
                {error && <p>{error.message}</p>}
            </form>
        );
    }
}
const SignUpLink = () => (
    <p>
        <Link to={ROUTES.SIGN_UP}>Toujours pas inscrit ? Rejoignez-nous !</Link>
    </p>
);
const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase);
export default SignUpPage;
export { SignUpForm, SignUpLink };
