import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import firebase from "firebase/app";
import "firebase/firestore";
import "../config/firebaseConfig";

//Material-ui
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

const styles = {
    newChapter: {
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
        background: "#3d485a",
        borderRadius: "100px 5px 5px 100px;",
        textDecoration: "none",
        color: "#fff",
        transitionDuration: "0.2s",

        "&:hover": {
            background: "#1e2834"
        }
    },
    newChapterImg: {
        borderRadius: "100px",
        marginRight: "15px"
    },
    title: {
        color: "#fff",
        margin: "1em 0",
        textTransform: "uppercase"
    }
};
class MangaCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listChapters: []
        };
    }
    componentDidMount() {
        const pathName = this.props.location.pathname.substr(1);
        const db = firebase.firestore();
        let mangaId = "";
        let mangas = {};
        let chapters = {};

        db.collection("/mangas")
            .where("path", "==", pathName)
            .get()
            .then((results) => {
                results.forEach((doc) => {
                    mangaId = doc.id;
                    mangas[doc.id] = doc.data();
                });
                return db
                    .collection("/chapters")
                    .where("mangaId", "==", mangaId)
                    .get()
                    .then((snapshot) => {
                        snapshot.forEach((doc) => {
                            chapters[doc.id] = doc.data();
                            chapters[doc.id].title = mangas[doc.data().mangaId].title;
                            chapters[doc.id].path = mangas[doc.data().mangaId].path;
                            chapters[doc.id].mangaImage = mangas[doc.data().mangaId].mangaImage;
                        });
                        this.setState({ listChapters: chapters });
                    });
            });
    }
    render() {
        const { classes } = this.props;
        return (
            <Box>
                <Grid item md={12}>
                    <Typography variant="h5" component="h3" className={classes.title}>
                        Liste des chapitres
                    </Typography>
                </Grid>
                <Grid item md={12}>
                    {Object.values(this.state.listChapters).map((listChapter, i) => {
                        return (
                            <Link
                                key={i}
                                to={listChapter.path + "/" + listChapter.chapter}
                                className={classes.newChapter}
                            >
                                <img
                                    src={listChapter.mangaImage}
                                    alt=""
                                    className={classes.newChapterImg}
                                />
                                <Box>
                                    <Typography variant="body1" component="p">
                                        {listChapter.title} {listChapter.chapter}
                                    </Typography>
                                    <Typography variant="body1" component="p">
                                        {listChapter.titleChapter}
                                    </Typography>
                                </Box>
                            </Link>
                        );
                    })}
                </Grid>
            </Box>
        );
    }
}
MangaCategory.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(MangaCategory);
