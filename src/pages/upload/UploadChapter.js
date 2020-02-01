import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "recompose";
import { withAuthorization } from "../../components/Session";
import * as ROLES from "../../constants/roles";
import Head from "../../components/layouts/Head";

// firebase
import { withFirebase } from "../../config/Firebase";

//Material UI
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

const styles = {
    option: {
        cursor: "pointer",
        color: "#000"
    },
    select: {
        color: "#fff"
    },
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
    },
    checkbox: {
        "& svg": {
            color: "#fff"
        }
    }
};
const INITIAL_STATE = {
    images: null,
    url: [],
    selectManga: "",
    selectChapter: "",
    selectTitle: "",
    isLastChapter: false,
    loading: false,
    errors: null
};
class UploadChapter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mangas: [],
            ...INITIAL_STATE
        };
    }

    handleImage = (e) => {
        if (e.target.files[0]) {
            const images = e.target.files;
            this.setState(() => ({ images }));
        }
    };
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };
    handleChecked = (e) => {
        this.setState({ [e.target.value]: e.target.checked });
    };

    handleValidation = () => {
        let { selectManga, selectChapter, selectTitle, images } = this.state;
        let errors = {};
        let formIsValid = true;

        if (!selectManga) {
            formIsValid = false;
            errors["selectManga"] = "Champ obligatoire";
        }
        if (!selectChapter) {
            formIsValid = false;
            errors["selectChapter"] = "Champ obligatoire";
        } else if (isNaN(selectChapter)) {
            formIsValid = false;
            errors["selectChapter"] = "Chiffres uniquement";
        }

        if (!selectTitle) {
            formIsValid = false;
            errors["selectTitle"] = "Champ obligatoire";
        }
        if (!images) {
            formIsValid = false;
            errors["images"] = "Image obligatoire";
        }

        this.setState({ errors: errors });
        return formIsValid;
    };

    handleUpload = () => {
        if (!this.handleValidation()) {
            return;
        }

        const firestore = this.props.firebase.firestore;
        const { images } = this.state;
        const promises = [];
        let url = [];
        let pathUploadImg = this.state.selectManga + "/" + this.state.selectChapter;

        this.setState({ loading: true });

        Object.values(images).map((image, i) => {
            let uploadTask = this.props.firebase.storage
                .ref(`${pathUploadImg}/${image.name}`)
                .put(image)
                .then((snap) => {
                    return snap.ref.getDownloadURL();
                })
                .then((downloadURL) => {
                    url.push({ pageImg: downloadURL, pageNumber: i + 1 });
                });
            return promises.push(uploadTask);
        });

        Promise.all(promises).then(() => {
            url.sort((a, b) => (a.pageImg > b.pageImg ? 1 : b.pageImg > a.pageImg ? -1 : 0));
            this.setState({ url: url }, () => {
                let newChapter = firestore.collection("chapters").doc();
                newChapter
                    .set({
                        chapter: parseInt(this.state.selectChapter),
                        mangaId: this.state.selectManga,
                        titleChapter: this.state.selectTitle,
                        pageCount: this.state.url.length,
                        pages: this.state.url,
                        createdAt: new Date()
                    })
                    .then(() => {
                        if (this.state.isLastChapter) {
                            const mangaRef = firestore.collection("mangas").doc(this.state.selectManga);
                            mangaRef.update({ lastChapter: parseInt(this.state.selectChapter) });
                        }
                    })
                    .then(() => {
                        this.setState({ ...INITIAL_STATE });
                        this.fileInput.value = "";
                    });
            });
        });
    };

    componentDidMount() {
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
    }
    render() {
        const { classes } = this.props;
        const { images, errors } = this.state;
        return (
            <Head pageMeta={{ title: "Ajouter un chapitre | ScanNation France " }}>
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
                                        <option value={manga[0]} key={i} className={classes.option}>
                                            {manga[1].title}
                                        </option>
                                    );
                                })}
                            </Select>
                            {errors ? !!("selectManga" in errors) ? <FormHelperText>{errors["selectManga"]}</FormHelperText> : null : false}
                        </FormControl>
                        <TextField
                            value={this.state.selectTitle}
                            onChange={this.handleChange}
                            label="Titre du chapitre"
                            name="selectTitle"
                            error={errors ? !!("selectTitle" in errors) : false}
                            helperText={errors ? ("selectTitle" in errors ? errors["selectTitle"] : "") : false}
                        />
                        <TextField
                            value={this.state.selectChapter}
                            onChange={this.handleChange}
                            label="Numéro du chapitre"
                            name="selectChapter"
                            error={errors ? !!("selectChapter" in errors) : false}
                            helperText={errors ? ("selectChapter" in errors ? errors["selectChapter"] : "") : false}
                        />
                        <input
                            accept="image/*"
                            id="contained-button-file"
                            type="file"
                            onChange={this.handleImage}
                            multiple
                            className={classes.input}
                            ref={(ref) => (this.fileInput = ref)}
                        />
                        <label className={classes.uploadImg} htmlFor="contained-button-file">
                            <Fab color="primary" component="span">
                                <AddIcon />
                            </Fab>
                            <span className={errors ? ("images" in errors ? classes.errors : "") : null}>
                                {images ? images.length + " fichiers" : "Ajouter des images"}
                            </span>
                        </label>

                        <FormControlLabel
                            control={<Checkbox className={classes.checkbox} onChange={this.handleChecked} value="isLastChapter" color="primary" />}
                            label="Définir comme chapitre le plus récent"
                        />

                        <Button variant="contained" color="primary" startIcon={<CloudUploadIcon />} onClick={this.handleUpload}>
                            {this.state.loading ? <CircularProgress size={30} color="secondary" /> : "Upload"}
                        </Button>
                    </form>
                </Box>
            </Head>
        );
    }
}
UploadChapter.propTypes = {
    classes: PropTypes.object.isRequired
};
const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];
export default compose(withStyles(styles), withAuthorization(condition), withFirebase)(UploadChapter);
