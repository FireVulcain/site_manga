import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "recompose";
import { withAuthorization } from "../../components/Session";
import * as ROLES from "../../constants/roles";
import Head from "../../components/layouts/Head";

// firebase
import { withFirebase } from "../../config/Firebase";

//Material-ui
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = {};
const INITIAL_STATE = {
    title: "",
    actu_info: "",
    loading: false,
    errors: null
};
class UploadNews extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        };
    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleValidation = () => {
        const { title, actu_info } = this.state;
        let errors = {};
        let formIsValid = true;

        if (!title) {
            formIsValid = false;
            errors["title"] = "Champ obligatoire";
        }

        if (!actu_info) {
            formIsValid = false;
            errors["actu_info"] = "Champ obligatoire";
        }

        this.setState({ errors: errors });
        return formIsValid;
    };

    handleUpload = () => {
        if (!this.handleValidation()) {
            return;
        }
        const { title, actu_info } = this.state;
        const firestore = this.props.firebase.firestore;
        let data = {
            date: new Date(),
            title: title,
            actuInfo: actu_info
        };
        this.setState({ loading: true });
        firestore
            .collection("news")
            .doc()
            .set(data)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
            });
    };
    render() {
        const { loading, errors, title, actu_info } = this.state;
        return (
            <Head pageMeta={{ title: "Ajouter une actualité | ScanNation France " }}>
                <Box className="main">
                    <form className="formAdd" noValidate autoComplete="off">
                        <TextField
                            onChange={this.handleChange}
                            name="title"
                            value={title}
                            label="Titre de l'actu"
                            error={errors ? !!("title" in errors) : false}
                            helperText={errors ? ("title" in errors ? errors["title"] : "") : false}
                        />
                        <TextField
                            onChange={this.handleChange}
                            name="actu_info"
                            value={actu_info}
                            label="Info de l'actu"
                            multiline
                            rows={2}
                            error={errors ? !!("actu_info" in errors) : false}
                            helperText={errors ? ("actu_info" in errors ? errors["actu_info"] : "") : false}
                        />
                        <br />
                        <Button variant="contained" color="primary" startIcon={<CloudUploadIcon />} onClick={this.handleUpload}>
                            {loading ? <CircularProgress size={30} color="secondary" /> : "Ajouter une actualité"}
                        </Button>
                    </form>
                </Box>
            </Head>
        );
    }
}

UploadNews.propTypes = {
    classes: PropTypes.object.isRequired
};
const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];
export default compose(withStyles(styles), withAuthorization(condition), withFirebase)(UploadNews);
