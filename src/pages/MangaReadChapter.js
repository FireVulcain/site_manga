import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Head from "./../components/layouts/Head";
import * as ROUTES from "./../constants/routes";
import ScrollTop from "../components/helpers/ScrollTop";

import Img from "react-image";

//Firebase
import { withFirebase } from "./../config/Firebase";

//Material-ui
import { withStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fab from "@material-ui/core/Fab";
import Toolbar from "@material-ui/core/Toolbar";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardBackspace from "@material-ui/icons/KeyboardBackspace";

const styles = {
    container: {
        maxWidth: "975px",
        margin: "0 auto",
        "& a, & a:hover": {
            background: "transparent",
            boxShadow: "none",
            color: "#fff",
            paddingLeft: "0",
            paddingBottom: "20px"
        }
    },
    page: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "20px",

        "& img": {
            width: "100%"
        }
    }
};

class MangaReadChapter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mangaId: this.props.match.params.manga_name,
            titleChapter: "",
            nbChapter: parseInt(this.props.match.params.nb_chapter),
            chapterData: [],
            loading: true,
            isImgLoaded: false
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
                    this.setState({ titleChapter: results.data().title });
                    this.setState({ mangaInfo: mangas }, () => {
                        return firestore
                            .collection("/chapters")
                            .where("mangaId", "==", this.state.mangaId)
                            .where("chapter", "==", this.state.nbChapter)
                            .get()
                            .then((snapshot) => {
                                snapshot.forEach((doc) => {
                                    chapters[doc.id] = doc.data();
                                    chapters[doc.id].title = mangas[doc.data().mangaId].title;
                                });
                                this.setState({ chapterData: chapters });
                            });
                    });
                } else {
                    return this.props.history.push(ROUTES.HOME);
                }
            });
    }
    render() {
        const { titleChapter, nbChapter } = this.state;
        const { classes } = this.props;
        console.log(this.props);
        return (
            <Head pageMeta={{ title: "Chapitre " + nbChapter + " de " + titleChapter + " | ScanNation France" }}>
                <Toolbar id="back-to-top-anchor" />
                <Box className={classes.container}>
                    <Button
                        variant="contained"
                        className={classes.button}
                        startIcon={<KeyboardBackspace />}
                        component={Link}
                        to={"/" + this.props.match.params.manga_name}
                    >
                        Liste des chapitres
                    </Button>
                    {Object.values(this.state.chapterData).map((datas) => {
                        return datas.pages.map((page, i) => {
                            return (
                                <Box key={i} className={classes.page}>
                                    <Img loader={<CircularProgress size={30} />} src={page.pageImg} alt="page chapitre" />
                                </Box>
                            );
                        });
                    })}
                </Box>
                <ScrollTop>
                    <Fab size="medium" aria-label="scroll back to top">
                        <KeyboardArrowUpIcon />
                    </Fab>
                </ScrollTop>
            </Head>
        );
    }
}
MangaReadChapter.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(withFirebase(MangaReadChapter));
