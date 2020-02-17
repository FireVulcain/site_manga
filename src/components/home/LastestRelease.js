import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Firebase
import { withFirebase } from "./../../config/Firebase";

//Material-ui
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = {};

class LastestRelease extends Component {
    constructor() {
        super();
        this.state = {
            releases: [],
            loading: true,
            noManga: false
        };
    }
    componentDidMount = () => {
        const firestore = this.props.firebase.firestore;
        let mangas = {};
        let chapters = {};
        firestore
            .collection("/mangas")
            .get()
            .then((results) => {
                if (!results.empty) {
                    results.forEach((doc) => {
                        mangas[doc.id] = doc.data();
                    });
                } else {
                    this.setState({ noManga: results.empty });
                    return;
                }
            })
            .then(() => {
                firestore
                    .collection("/chapters")
                    .limit(20)
                    .orderBy("createdAt", "desc")
                    .get()
                    .then((docSnaps) => {
                        if (!docSnaps.empty) {
                            docSnaps.forEach((doc) => {
                                chapters[doc.id] = doc.data();
                                chapters[doc.id].title = mangas[doc.data().mangaId].title;
                                chapters[doc.id].mangaImage = mangas[doc.data().mangaId].mangaImage;
                            });
                            this.setState({ releases: chapters, loading: false });
                        } else {
                            this.setState({ noManga: docSnaps.empty, loading: false });
                        }
                    });
            });
    };

    render() {
        return (
            <Box>
                <Grid item md={12}>
                    <Typography variant="h5" component="h3" className="titlePage">
                        Les dernières sorties
                    </Typography>
                </Grid>
                {this.state.noManga ? (
                    <Grid item md={12}>
                        <Typography variant="body1" component="p" color="secondary">
                            Pas de chapitre actuellement sur le site
                        </Typography>
                    </Grid>
                ) : (
                    <Grid item md={12} className="containerInfo">
                        {this.state.loading ? (
                            <CircularProgress size={30} className="loadingInfo" />
                        ) : (
                            Object.values(this.state.releases).map((release, i) => {
                                return (
                                    <Link key={i} to={release.mangaId} className={i < 2 ? "newChapter recentChapter" : "newChapter notRecent"}>
                                        <Box className="newChapterImg">
                                            <img src={release.mangaImage} alt="" />
                                        </Box>
                                        <Box>
                                            <Typography variant="body1" component="p" className="mangaTitle">
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
                )}
            </Box>
        );
    }
}

LastestRelease.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withFirebase(LastestRelease));
