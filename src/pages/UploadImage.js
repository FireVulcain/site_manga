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
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

const styles = (theme) => ({});
class UploadImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mangas: [],
            images: null,
            url: [],
            selectManga: "",
            selectChapter: null,
            selectTitle: ""
        };
    }

    handleImage = (e) => {
        if (e.target.files[0]) {
            const images = e.target.files;
            this.setState(() => ({ images }));
        }
    };
    handleSelectedManga = (e) => {
        this.setState({ selectManga: e.target.value });
    };
    handleSelectedChapter = (e) => {
        this.setState({ selectChapter: e.target.value });
    };
    handleSelectedTitle = (e) => {
        this.setState({ selectTitle: e.target.value });
    };

    handleUpload = () => {
        const db = firebase.firestore();
        const { images } = this.state;
        const promises = [];
        let url = [];
        let pathUploadImg = this.state.selectManga + "/" + this.state.selectChapter;
        if (this.state.selectManga && this.state.selectChapter) {
            if (this.state.selectManga !== "default") {
                Object.values(images).map((image) => {
                    let uploadTask = firebase
                        .storage()
                        .ref(`${pathUploadImg}/${image.name}`)
                        .put(image)
                        .then((snap) => {
                            return snap.ref.getDownloadURL();
                        })
                        .then((downloadURL) => {
                            url.push(downloadURL);
                        });
                    return promises.push(uploadTask);
                });
            }
        }
        Promise.all(promises).then(() => {
            this.setState({ url: url }, () => {
                let newChapter = db.collection("chapters").doc();
                newChapter.set({
                    chapter: this.state.selectChapter,
                    mangaId: this.state.selectManga,
                    titleChapter: this.state.selectTitle,
                    pageCount: this.state.url.length
                });
            });
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
        return (
            <Box className="main">
                <Box>
                    <Select defaultValue="default" onChange={this.handleSelectedManga}>
                        <MenuItem value="default">Choisir un manga</MenuItem>
                        {Object.entries(this.state.mangas).map((manga, i) => {
                            return (
                                <MenuItem value={manga[0]} key={i}>
                                    {manga[1].title}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </Box>
                <Box>
                    <Input
                        color="primary"
                        type="text"
                        onChange={this.handleSelectedTitle}
                        placeholder="Titre du chapitre"
                    />
                </Box>
                <Box>
                    <Input
                        color="primary"
                        type="text"
                        onChange={this.handleSelectedChapter}
                        placeholder="Numéro du chapitre"
                    />
                </Box>
                <Box>
                    <input type="file" onChange={this.handleImage} multiple />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CloudUploadIcon />}
                        onClick={this.handleUpload}
                    >
                        Upload
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
