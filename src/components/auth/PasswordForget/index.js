import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withFirebase } from "./../../../config/Firebase";
import * as ROUTES from "./../../../constants/routes";
import Head from "./../../layouts/Head";

//Material ui
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

const PasswordForgetPage = () => (
    <Head pageMeta={{ title: "Mot de passe oublié | ScanNation France" }}>
        <Box className="logs_page">
            <h1>Mot de passe oublié</h1>
            <PasswordForgetForm />
        </Box>
    </Head>
);
const INITIAL_STATE = {
    email: "",
    error: null,
    loading: false
};
class PasswordForgetFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }
    onSubmit = (event) => {
        this.setState({ loading: true });
        const { email } = this.state;
        this.props.firebase
            .doPasswordReset(email)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
            })
            .catch((error) => {
                this.setState({ error, loading: false });
            });
        event.preventDefault();
    };
    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };
    render() {
        const { email, error, loading } = this.state;
        const isInvalid = email === "";
        return (
            <form onSubmit={this.onSubmit}>
                <TextField type="email" onChange={this.onChange} label="Adresse email" value={this.state.email} name="email"></TextField>
                <Button type="submit" disabled={isInvalid} variant="contained" color="primary">
                    {loading ? <CircularProgress size={30} /> : "Réinitialiser"}
                </Button>
                {error && <p>{error.message}</p>}
            </form>
        );
    }
}
const PasswordForgetLink = () => (
    <p>
        <Link to={ROUTES.PASSWORD_FORGET}>Mot de passe oublié ?</Link>
    </p>
);
export default PasswordForgetPage;
const PasswordForgetForm = withFirebase(PasswordForgetFormBase);
export { PasswordForgetForm, PasswordForgetLink };
