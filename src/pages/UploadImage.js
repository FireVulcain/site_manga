import React, { Component } from "react";
import PropTypes from "prop-types";

// firebase
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import "../config/firebaseConfig";

//Material UI
import { withStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = (theme) => ({
    option: {
        cursor: "pointer"
    }
});
class UploadImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mangas: [],
            images: null,
            url: [],
            selectManga: "",
            selectChapter: "",
            selectTitle: "",
            loading: false
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

    handleUpload = () => {
        const db = firebase.firestore();
        const { images } = this.state;
        const promises = [];
        let url = [];
        let pathUploadImg = this.state.selectManga + "/" + this.state.selectChapter;

        if (this.state.selectManga && this.state.selectChapter) {
            this.setState({ loading: true });

            Object.values(images).map((image, i) => {
                let uploadTask = firebase
                    .storage()
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
                    let newChapter = db.collection("chapters").doc();
                    newChapter
                        .set({
                            chapter: parseInt(this.state.selectChapter),
                            mangaId: this.state.selectManga,
                            titleChapter: this.state.selectTitle,
                            pageCount: this.state.url.length,
                            pages: this.state.url
                        })
                        .then(() => {
                            this.resetInput();
                        });
                });
            });
        }
    };

    resetInput = () => {
        this.setState({ images: null, url: [], selectManga: "", selectChapter: "", selectTitle: "", loading: false }, () => {
            this.fileInput.value = "";
        });
    };

    componentDidMount() {
        const db = firebase.firestore();
        let mangas = {};
        db.collection("/mangas")
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
        return (
            <Box className="main">
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="selectManga">Choisir un manga</InputLabel>
                    <Select native value={this.state.selectManga} onChange={this.handleChange} name="selectManga" id="selectManga">
                        <option value=""></option>
                        {Object.entries(this.state.mangas).map((manga, i) => {
                            return (
                                <option value={manga[0]} key={i} className={classes.option}>
                                    {manga[1].title}
                                </option>
                            );
                        })}
                    </Select>
                </FormControl>
                <Box>
                    <Input
                        color="primary"
                        type="text"
                        value={this.state.selectTitle}
                        onChange={this.handleChange}
                        placeholder="Titre du chapitre"
                        name="selectTitle"
                    />
                </Box>
                <Box>
                    <Input
                        color="primary"
                        type="text"
                        value={this.state.selectChapter}
                        onChange={this.handleChange}
                        placeholder="Numéro du chapitre"
                        name="selectChapter"
                    />
                </Box>
                <Box>
                    <input type="file" onChange={this.handleImage} multiple ref={(ref) => (this.fileInput = ref)} />
                    <Button variant="contained" color="primary" startIcon={<CloudUploadIcon />} onClick={this.handleUpload}>
                        {this.state.loading ? <CircularProgress size={30} color="secondary" /> : "Upload"}
                    </Button>
                </Box>
            </Box>
        );
    }
}
UploadImage.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(UploadImage);
