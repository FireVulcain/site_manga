import React, { Component } from "react";
import PasswordChangeForm from "./../PasswordChange";
import { AuthUserContext, withAuthorization } from "./../../Session";

class AccountPage extends Component {
    render() {
        return (
            <AuthUserContext.Consumer>
                {(authUser) => (
                    <div>
                        <h1>Account Page : {authUser.email}</h1>
                        <PasswordChangeForm />
                    </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

const condition = (authUser) => !!authUser;
export default withAuthorization(condition)(AccountPage);
