import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import MangaInfo from "../components/mangas/MangaInfo";
import * as ROUTES from "./../constants/routes";

import { withFirebase } from "./../config/Firebase";

//Material-ui
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = {
    noChapter: {
        color: "#fff"
    }
};

class MangaListChapters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mangaId: this.props.match.params.manga_name,
            mangaInfo: [],
            listChapters: [],
            loading: true
        };
    }
    componentDidMount() {
        const firestore = this.props.firebase.firestore;
        let mangas = {};
        let chapters = {};

        firestore
            .collection("/mangas/")
            .doc(this.state.mangaId)
            .get()
            .then((results) => {
                if (results.exists) {
                    mangas[results.id] = results.data();
                    this.setState({ mangaInfo: mangas }, () => {
                        return firestore
                            .collection("/chapters")
                            .where("mangaId", "==", this.state.mangaId)
                            .orderBy("chapter", "desc")
                            .get()
                            .then((snapshot) => {
                                snapshot.forEach((doc) => {
                                    chapters[doc.id] = doc.data();
                                    chapters[doc.id].title = mangas[doc.data().mangaId].title;
                                    chapters[doc.id].resume = mangas[doc.data().mangaId].resume;
                                    chapters[doc.id].mangaImage = mangas[doc.data().mangaId].mangaImage;
                                });
                                this.setState({ listChapters: chapters, loading: false });
                            });
                    });
                } else {
                    return this.props.history.push(ROUTES.HOME);
                }
            });
    }
    render() {
        const { listChapters } = this.state;
        const { classes } = this.props;
        return (
            <Box className="main">
                <Grid item md={12}>
                    <Typography variant="h5" component="h3" className="titlePage">
                        Liste des chapitres
                    </Typography>
                </Grid>
                <Grid container spacing={5}>
                    <Grid item md={8} className="containerInfo">
                        {this.state.loading ? (
                            <CircularProgress size={30} className="loadingInfo" />
                        ) : Object.entries(listChapters).length === 0 ? (
                            <Typography variant="body1" component="p" className={classes.noChapter}>
                                Pas de chapitres encore disponibles sur le site
                            </Typography>
                        ) : (
                            Object.values(this.state.listChapters).map((listChapter, i) => {
                                return (
                                    <Link key={i} to={listChapter.mangaId + "/" + listChapter.chapter} className="newChapter">
                                        <img src={listChapter.mangaImage} alt="" className="newChapterImg" />
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
                            })
                        )}
                    </Grid>
                    <Grid item md={4}>
                        <MangaInfo mangaInfo={this.state.mangaInfo} />
                    </Grid>
                </Grid>
            </Box>
        );
    }
}
MangaListChapters.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(withFirebase(MangaListChapters));
