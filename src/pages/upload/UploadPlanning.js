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
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

const styles = {
    select: {
        color: "#fff",

        "& option": {
            cursor: "pointer",
            color: "#000"
        }
    }
};
const INITIAL_STATE = {
    selectManga: "",
    selectStatus: "",
    loading: false,
    errors: null
};
class UploadPlanning extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mangas: [],
            ...INITIAL_STATE
        };
    }

    titleCase = (str) => {
        let splitStr = str.toLowerCase().split(" ");
        for (let i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }

        return splitStr.join(" ");
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleValidation = () => {
        let { selectManga, selectStatus } = this.state;
        let errors = {};
        let formIsValid = true;

        if (!selectManga) {
            formIsValid = false;
            errors["selectManga"] = "Champ obligatoire";
        }
        if (!selectStatus) {
            formIsValid = false;
            errors["selectStatus"] = "Champ obligatoire";
        }

        this.setState({ errors: errors });
        return formIsValid;
    };

    handleUpload = () => {
        if (!this.handleValidation()) {
            return;
        }
        this.setState({ loading: true });
        const { selectManga, selectStatus } = this.state;
        const firestore = this.props.firebase.firestore;

        let newPlanning = firestore.collection("planning").doc(selectManga);
        newPlanning
            .set({
                mangaId: selectManga,
                status: parseInt(selectStatus),
                mangaName: this.titleCase(selectManga.replace(/-/g, " "))
            })
            .then(() => {
                this.setState({ ...INITIAL_STATE });
            });
    };

    componentDidMount = () => {
        const firestore = this.props.firebase.firestore;
        let mangas = {};
        firestore
            .collection("/mangas")
            .get()
            .then((results) => {
                results.forEach((doc) => {
                    mangas[doc.id] = doc.data();
                });
                return this.setState({ mangas: mangas });
            });
    };

    render() {
        const { classes } = this.props;
        const { errors } = this.state;
        return (
            <Head pageMeta={{ title: "Ajouter un planning | ScanNation France " }}>
                <Box className="main">
                    <form className="formAdd" noValidate autoComplete="off">
                        <FormControl className={classes.formControl} error={errors ? !!("selectManga" in errors) : false}>
                            <InputLabel className={classes.select} htmlFor="selectManga">
                                Choisir un manga
                            </InputLabel>
                            <Select
                                className={classes.select}
                                native
                                value={this.state.selectManga}
                                onChange={this.handleChange}
                                name="selectManga"
                                id="selectManga"
                            >
                                <option value=""></option>
                                {Object.entries(this.state.mangas).map((manga, i) => {
                                    return (
                                        <option value={manga[0]} key={i}>
                                            {manga[1].title}
                                        </option>
                                    );
                                })}
                            </Select>
                            {errors ? !!("selectManga" in errors) ? <FormHelperText>{errors["selectManga"]}</FormHelperText> : null : false}
                        </FormControl>

                        <FormControl className={classes.formControl} error={errors ? !!("selectStatus" in errors) : false}>
                            <InputLabel className={classes.select} htmlFor="selectStatus">
                                Statut de la traduction
                            </InputLabel>
                            <Select
                                className={classes.select}
                                native
                                value={this.state.selectStatus}
                                onChange={this.handleChange}
                                name="selectStatus"
                                id="selectStatus"
                            >
                                <option value=""></option>
                                <option value="0">En attente du prochain chapitre</option>
                                <option value="25">Clean des pages</option>
                                <option value="50">Traduction en cours</option>
                                <option value="100">Dernier check</option>
                            </Select>
                            {errors ? !!("selectStatus" in errors) ? <FormHelperText>{errors["selectStatus"]}</FormHelperText> : null : false}
                        </FormControl>
                        <br />
                        <Button variant="contained" color="primary" startIcon={<CloudUploadIcon />} onClick={this.handleUpload}>
                            {this.state.loading ? <CircularProgress size={30} color="secondary" /> : "Upload"}
                        </Button>
                    </form>
                </Box>
            </Head>
        );
    }
}
UploadPlanning.propTypes = {
    classes: PropTypes.object.isRequired
};
const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];
export default compose(withStyles(styles), withAuthorization(condition), withFirebase)(UploadPlanning);
