import React from "react";
import { withFirebase } from "./../../../config/Firebase";

//Material UI
import Button from "@material-ui/core/Button";

const SignOutButton = ({ firebase }) => <Button onClick={firebase.doSignOut}>Déconnexion</Button>;
export default withFirebase(SignOutButton);
