import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { SignUpLink } from "./../Signup";
import { PasswordForgetLink } from "./../PasswordForget";
import { withFirebase } from "./../../../config/Firebase";
import * as ROUTES from "./../../../constants/routes";

// Material-ui
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

const SignInPage = () => (
    <Box className="logs_page">
        <h1>Connexion</h1>
        <SignInForm />
        <PasswordForgetLink />
        <SignUpLink />
    </Box>
);
const INITIAL_STATE = {
    email: "",
    password: "",
    error: null,
    loading: false
};
class SignInFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }
    onSubmit = (event) => {
        this.setState({ loading: true });
        const { email, password } = this.state;
        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
            })
            .catch((error) => {
                this.setState({ error });
            });
        event.preventDefault();
    };
    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };
    render() {
        const { email, password, error, loading } = this.state;
        const isInvalid = password === "" || email === "";
        return (
            <form onSubmit={this.onSubmit}>
                <TextField onChange={this.onChange} name="email" value={email} label="Adresse email" />
                <TextField onChange={this.onChange} name="password" value={password} label="Mot de passe" type="password" />
                <Button type="submit" disabled={isInvalid} variant="contained" color="primary">
                    {loading ? <CircularProgress size={30} /> : "Connexion"}
                </Button>
                {error && <p>{error.message}</p>}
            </form>
        );
    }
}
const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);
export default SignInPage;
export { SignInForm };
