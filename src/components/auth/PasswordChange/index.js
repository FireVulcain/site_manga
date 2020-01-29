import React, { Component } from "react";
import { withFirebase } from "./../../../config/Firebase";

//Material-ui
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

const INITIAL_STATE = {
    passwordOne: "",
    passwordTwo: "",
    loading: false,
    error: null
};
class PasswordChangeForm extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }
    onSubmit = (event) => {
        this.setState({loading: true})
        const { passwordOne } = this.state;
        this.props.firebase
            .doPasswordUpdate(passwordOne)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
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
        const { passwordOne, passwordTwo, error, loading } = this.state;
        const isInvalid = passwordOne !== passwordTwo || passwordOne === "";
        return (
            <form onSubmit={this.onSubmit}>
                <TextField onChange={this.onChange} name="passwordOne" value={passwordOne} type="password" label="Nouveau mot de passe" />
                <TextField onChange={this.onChange} name="passwordTwo" value={passwordTwo} type="password" label="Confirmation du mot de passe" />
                <Button type="submit" disabled={isInvalid} variant="contained" color="primary">
                    {loading ? <CircularProgress size={30} /> : "Changer de mot de passe"}
                </Button>
                {error && <p>{error.message}</p>}
            </form>
        );
    }
}
export default withFirebase(PasswordChangeForm);
