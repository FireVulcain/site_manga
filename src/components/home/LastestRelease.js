import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Firebase
import firebase from "firebase/app";
import "firebase/firestore";
import firebaseConfig from "../../config/firebaseConfig";

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

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

class LastestRelease extends Component {
    constructor() {
        super();
        this.state = {
            releases: []
        };
    }
    componentDidMount = () => {
        let mangas = {};
        let chapters = {};
        db.collection("/mangas")
            .get()
            .then((results) => {
                results.forEach((doc) => {
                    mangas[doc.id] = doc.data();
                });
            });

        db.collection("/chapters")
            .limit(20)
            .get()
            .then((docSnaps) => {
                docSnaps.forEach((doc) => {
                    chapters[doc.id] = doc.data();
                    chapters[doc.id].title = mangas[doc.data().mangaId].title;
                    chapters[doc.id].path = mangas[doc.data().mangaId].path;
                    chapters[doc.id].mangaImage = mangas[doc.data().mangaId].mangaImage;
                });
                this.setState({ releases: chapters });
            });
    };

    render() {
        const { classes } = this.props;
        return (
            <Box>
                <Grid item md={12}>
                    <Typography variant="h5" component="h3" className={classes.title}>
                        Les dernières sorties
                    </Typography>
                </Grid>
                <Grid item md={12}>
                    {Object.values(this.state.releases).map((release, i) => {
                        return (
                            <Link key={i} to={release.path} className={classes.newChapter}>
                                <img src={release.mangaImage} alt="" className={classes.newChapterImg} />
                                <Box>
                                    <Typography variant="body1" component="p">
                                        {release.title} {release.chapter}
                                    </Typography>
                                    <Typography variant="body1" component="p">
                                        {release.titleChapter}
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

LastestRelease.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LastestRelease);
