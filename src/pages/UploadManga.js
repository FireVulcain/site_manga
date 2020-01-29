import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "recompose";
import { withAuthorization } from "./../components/Session";
import * as ROLES from "./../constants/roles";

// firebase
import { withFirebase } from "./../config/Firebase";

//Material-ui
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/Add";

const styles = {
    input: {
        display: "none"
    },
    uploadImg: {
        margin: "10px 0",
        color: "#fff",

        "& > span": {
            marginRight: "10px"
        }
    },
    errors: {
        color: "#f44336"
    }
};
const INITIAL_STATE = {
    manga_name: "",
    synopsis: "",
    image: null,
    loading: false,
    errors: null
};
class UploadManga extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    handleImage = (e) => {
        if (e.target.files[0]) {
            const image = e.target.files;
            this.setState(() => ({ image }));
        }
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleValidation = () => {
        let manga_name = this.state.manga_name;
        let synopsis = this.state.synopsis;
        let image = this.state.image;
        let errors = {};
        let formIsValid = true;

        if (!manga_name) {
            formIsValid = false;
            errors["manga_name"] = "Champ obligatoire";
        }

        if (!synopsis) {
            formIsValid = false;
            errors["synopsis"] = "Champ obligatoire";
        }
        if (!image) {
            formIsValid = false;
            errors["image"] = "Image obligatoire";
        }

        this.setState({ errors: errors });
        return formIsValid;
    };

    handleUpload = () => {
        if (!this.handleValidation()) {
            return;
        }

        const storage = this.props.firebase.storage;
        const firestore = this.props.firebase.firestore;
        const { image } = this.state;
        const promises = [];
        const formatedMangaName = this.state.manga_name
            .split(" ")
            .join("-")
            .toLowerCase();
        let data = {
            resume: this.state.synopsis,
            title: this.state.manga_name,
            lastChapter: 0,
            mangaImage: ""
        };
        this.setState({ loading: true });
        let uploadTask = storage
            .ref(`${formatedMangaName}/${image[0].name}`)
            .put(image[0])
            .then((snap) => {
                return snap.ref.getDownloadURL();
            })
            .then((downloadURL) => {
                return (data.mangaImage = downloadURL);
            });
        promises.push(uploadTask);

        Promise.all(promises).then(() => {
            firestore
                .collection("mangas")
                .doc(formatedMangaName)
                .set(data)
                .then(() => {
                    this.setState({ ...INITIAL_STATE });
                    this.fileInput.value = "";
                });
        });
    };

    render() {
        const { classes } = this.props;
        const { manga_name, synopsis, image, errors, loading } = this.state;
        return (
            <Box className="main">
                <form className="formAdd" noValidate autoComplete="off">
                    <TextField
                        onChange={this.handleChange}
                        name="manga_name"
                        value={manga_name}
                        label="Nom du Manga"
                        error={errors ? !!("manga_name" in errors) : false}
                        helperText={errors ? ("manga_name" in errors ? errors["manga_name"] : "") : false}
                    />
                    <TextField
                        onChange={this.handleChange}
                        name="synopsis"
                        value={synopsis}
                        label="Synopsis"
                        multiline
                        rows={2}
                        error={errors ? !!("synopsis" in errors) : false}
                        helperText={errors ? ("synopsis" in errors ? errors["synopsis"] : "") : false}
                    />
                    <input
                        accept="image/*"
                        onChange={this.handleImage}
                        ref={(ref) => (this.fileInput = ref)}
                        className={classes.input}
                        id="contained-button-file"
                        type="file"
                    />
                    <label className={classes.uploadImg} htmlFor="contained-button-file">
                        <Fab color="primary" component="span">
                            <AddIcon />
                        </Fab>
                        <span className={errors ? ("image" in errors ? classes.errors : "") : null}>
                            {image ? image[0].name : "Ajouter une Image"}
                        </span>
                    </label>
                    <Button variant="contained" color="primary" startIcon={<CloudUploadIcon />} onClick={this.handleUpload}>
                        {loading ? <CircularProgress size={30} color="secondary" /> : "Ajouter un manga"}
                    </Button>
                </form>
            </Box>
        );
    }
}
UploadManga.propTypes = {
    classes: PropTypes.object.isRequired
};
const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];
export default compose(withStyles(styles), withAuthorization(condition), withFirebase)(UploadManga);
