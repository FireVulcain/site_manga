import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "recompose";
import { withFirebase } from "../../config/Firebase";
import { withAuthorization } from "../../components/Session";
import Head from "./../../components/layouts/Head";
import * as ROLES from "../../constants/roles";

//material ui
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import ListItem from "@material-ui/core/ListItem";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

const styles = {
    collapse: {
        width: "auto"
    },
    collapsedItem: {
        paddingLeft: "70px"
    },
    deleteIcon: {
        position: "absolute",
        right: "10px"
    }
};

class DeleteData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mangas: {},
            loading: true
        };
    }
    displayChapters = (id) => {
        //[id] => Faire apparaitre / disparaitre les chapitres du manga
        this.setState({ [id]: !this.state[id] });
    };

    removeChapterImg = (chapterInfo) => {
        const storage = this.props.firebase.storage;

        return storage
            .ref()
            .child(`/${chapterInfo.mangaId}/${chapterInfo.chapter}/`)
            .listAll()
            .then((data) => {
                data.items.forEach((fileRef) => {
                    fileRef.delete();
                });
            });
    };
    removeMangaImg = (mangaId) => {
        const storage = this.props.firebase.storage;

        return storage
            .ref()
            .child(`/${mangaId}/`)
            .listAll()
            .then((data) => {
                data.items.forEach((fileRef) => {
                    fileRef.delete();
                });
            });
    };

    handleDeleteChapter = (chapterInfo) => {
        const firestore = this.props.firebase.firestore;

        firestore
            .collection("chapters")
            .doc(chapterInfo.id)
            .delete()
            .then(() => {
                this.removeChapterImg(chapterInfo);
            })
            .then(() => {
                //[chapterInfo.id] => Faire disparaitre le chapitre après supression
                this.setState({ [chapterInfo.id]: true });
            });
    };
    handleDeleteManga = (mangaInfo, i) => {
        const firestore = this.props.firebase.firestore;
        firestore
            .collection("chapters")
            .where("mangaId", "==", mangaInfo.id)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    this.removeChapterImg(doc.data());
                    doc.ref.delete();
                });
            })
            .then(() => {
                firestore
                    .collection("mangas")
                    .doc(mangaInfo.id)
                    .delete()
                    .then(() => {
                        this.removeMangaImg(mangaInfo.id);
                    })
                    .then(() => {
                        firestore
                            .collection("planning")
                            .doc(mangaInfo.id)
                            .delete()
                            .then(() => {
                                //[i] => Faire disparaitre le manga / [mangaInfo.id] => Faire disparaitre les chapitres après supression
                                this.setState({ [i]: !this.state[i], [mangaInfo.id]: false });
                            });
                    });
            });
    };
    componentDidMount = () => {
        const firestore = this.props.firebase.firestore;
        let mangas = {};

        firestore
            .collection("mangas")
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    mangas[doc.id] = doc.data();
                    mangas[doc.id].id = doc.id;
                    mangas[doc.id].listChapter = [];
                    return firestore
                        .collection("chapters")
                        .get()
                        .then((snapshot) => {
                            snapshot.forEach((doc) => {
                                mangas[doc.data().mangaId].listChapter[doc.id] = doc.data();
                                mangas[doc.data().mangaId].listChapter[doc.id].id = doc.id;
                            });
                            this.setState({ mangas: mangas, loading: false });
                        });
                });
            });
    };
    render() {
        const { classes } = this.props;
        return (
            <Head pageMeta={{ title: "Gestion des mangas | ScanNation France " }}>
                <Grid container className="main">
                    <Grid item md={12}>
                        <Typography variant="h5" component="h3" className="titlePage">
                            Gestion des mangas
                        </Typography>
                    </Grid>
                    <Grid item md={12} className="containerInfo">
                        {this.state.loading ? (
                            <CircularProgress size={30} className="loadingInfo" />
                        ) : (
                            Object.values(this.state.mangas).map((manga, i) => {
                                return (
                                    <Box key={i}>
                                        {/* Collapse pour la suppression de manga */}
                                        <Collapse in={!this.state[i]} timeout="auto" unmountOnExit>
                                            <Box className="newChapter">
                                                <Box className="newChapterImg">
                                                    <img src={manga.mangaImage} alt="" />
                                                </Box>
                                                <Box>
                                                    <Typography variant="body1" component="p">
                                                        {manga.title}
                                                    </Typography>
                                                </Box>
                                                <ListItem className={classes.collapse} button onClick={() => this.displayChapters(manga.id)}>
                                                    {this.state[manga.id] ? <ExpandLess /> : <ExpandMore />}
                                                </ListItem>
                                                <IconButton
                                                    className={classes.deleteIcon}
                                                    component="span"
                                                    onClick={() => this.handleDeleteManga(manga, i)}
                                                >
                                                    <DeleteForeverIcon />
                                                </IconButton>
                                            </Box>
                                        </Collapse>

                                        {/* Collapse pour afficher / cacher les chapitres */}
                                        <Collapse in={this.state[manga.id]} timeout="auto" unmountOnExit className={classes.collapsedItem}>
                                            {Object.values(manga.listChapter).map((list, index) => {
                                                return (
                                                    // Collapse pour la suppression de chapitre
                                                    <Collapse in={!this.state[list.id]} key={index}>
                                                        <Box className="newChapter">
                                                            <Box className="newChapterImg">
                                                                <img src={manga.mangaImage} alt="" />
                                                            </Box>
                                                            <Box>
                                                                <Typography variant="body1" component="p">
                                                                    {list.title} {list.chapter}
                                                                </Typography>
                                                                <Typography variant="body1" component="p">
                                                                    {list.titleChapter}
                                                                </Typography>
                                                            </Box>
                                                            <IconButton
                                                                className={classes.deleteIcon}
                                                                component="span"
                                                                onClick={() => this.handleDeleteChapter(list)}
                                                            >
                                                                <DeleteForeverIcon />
                                                            </IconButton>
                                                        </Box>
                                                    </Collapse>
                                                );
                                            })}
                                        </Collapse>
                                    </Box>
                                );
                            })
                        )}
                    </Grid>
                </Grid>
            </Head>
        );
    }
}

DeleteData.propTypes = {
    classes: PropTypes.object.isRequired
};
const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(withStyles(styles), withAuthorization(condition), withFirebase)(DeleteData);
