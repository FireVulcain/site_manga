import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import MangaInfo from "./../components/mangas/MangaInfo";

import firebase from "firebase/app";
import "firebase/firestore";
import "../config/firebaseConfig";

//Material-ui
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
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
        marginRight: "15px",
        maxWidth: "65px"
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
            mangaId: this.props.match.params.manga_name,
            mangaInfo: [],
            listChapters: []
        };
    }
    componentDidMount() {
        const db = firebase.firestore();
        let mangas = {};
        let chapters = {};

        db.collection("/mangas/")
            .doc(this.state.mangaId)
            .get()
            .then((results) => {
                mangas[results.id] = results.data();

                this.setState({ mangaInfo: mangas });
                return db
                    .collection("/chapters")
                    .where("mangaId", "==", this.state.mangaId)
                    .get()
                    .then((snapshot) => {
                        snapshot.forEach((doc) => {
                            chapters[doc.id] = doc.data();
                            chapters[doc.id].title = mangas[doc.data().mangaId].title;
                            chapters[doc.id].resume = mangas[doc.data().mangaId].resume;
                            chapters[doc.id].mangaImage = mangas[doc.data().mangaId].mangaImage;
                        });
                        this.setState({ listChapters: chapters });
                    });
            });
    }
    render() {
        const { classes } = this.props;
        return (
            <Box className="main">
                <Container maxWidth="lg">
                    <Grid item md={12}>
                        <Typography variant="h5" component="h3" className={classes.title}>
                            Liste des chapitres
                        </Typography>
                    </Grid>
                    <Grid container spacing={5}>
                        <Grid item md={8}>
                            {Object.values(this.state.listChapters).map((listChapter, i) => {
                                return (
                                    <Link key={i} to={listChapter.mangaId + "/" + listChapter.chapter} className={classes.newChapter}>
                                        <img src={listChapter.mangaImage} alt="" className={classes.newChapterImg} />
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
                        <Grid item md={4}>
                            <MangaInfo mangaInfo={this.state.mangaInfo} />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        );
    }
}
MangaCategory.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(MangaCategory);
