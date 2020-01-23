import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Firebase
import firebase from "firebase/app";
import "firebase/firestore";
import "../../config/firebaseConfig";

//Material-ui
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

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
        },

        "& a": {
            color: "#fff",
            textDecoration: "none"
        }
    },
    newChapterImg: {
        borderRadius: "100px",
        marginRight: "15px",
        maxWidth: "65px"
    },
    title: {
        color: "#fff",
        margin: "1em 0",
        textTransform: "uppercase"
    },
    containerInfo: {
        position: "relative"
    },
    loadingInfo: {
        position: "absolute",
        left: "50%"
    }
};

class LastestRelease extends Component {
    constructor() {
        super();
        this.state = {
            releases: [],
            loading: true
        };
    }
    componentDidMount = () => {
        const db = firebase.firestore();
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
            .orderBy("chapter", "desc")
            .get()
            .then((docSnaps) => {
                docSnaps.forEach((doc) => {
                    chapters[doc.id] = doc.data();
                    chapters[doc.id].title = mangas[doc.data().mangaId].title;
                    chapters[doc.id].mangaImage = mangas[doc.data().mangaId].mangaImage;
                });
                this.setState({ releases: chapters });
                this.setState({ loading: false });
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
                <Grid item md={12} className={classes.containerInfo}>
                    {this.state.loading ? (
                        <CircularProgress size={30} className={classes.loadingInfo} />
                    ) : (
                        Object.values(this.state.releases).map((release, i) => {
                            return (
                                <Link key={i} to={release.mangaId} className={classes.newChapter}>
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
                        })
                    )}
                </Grid>
            </Box>
        );
    }
}

LastestRelease.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LastestRelease);
