import React, { Component } from "react";
import { Link } from "react-router-dom";
import Head from "./../components/layouts/Head";

import { withFirebase } from "./../config/Firebase";

//Material-ui
// import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

class MangasList extends Component {
    constructor() {
        super();
        this.state = {
            mangas: {},
            loading: true
        };
    }
    componentDidMount = () => {
        let mangas = {};
        let firestore = this.props.firebase.firestore;
        firestore
            .collection("mangas")
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    mangas[doc.id] = doc.data();
                });
            })
            .then(() => {
                this.setState({ mangas, loading: false });
            });
    };
    render() {
        return (
            <Head pageMeta={{ title: "Liste de nos mangas | ScanNation France " }}>
                <Grid container className="main">
                    <Grid item md={12}>
                        <Typography variant="h5" component="h3" className="titlePage">
                            Liste des mangas sur le site
                        </Typography>
                    </Grid>
                    <Grid item md={12} className="containerInfo">
                        {this.state.loading ? (
                            <CircularProgress size={30} className="loadingInfo" />
                        ) : (
                            Object.entries(this.state.mangas).map((manga, i) => {
                                return (
                                    <Link key={i} to={manga[0]} className="newChapter">
                                        <Box className="newChapterImg">
                                            <img src={manga[1].mangaImage} alt="" />
                                        </Box>
                                        <Box>
                                            <Typography variant="body1" component="p">
                                                {manga[1].title}
                                            </Typography>
                                            <Typography variant="body1" component="span">
                                                {manga[1].lastChapter === 0 ? "À venir" : "Dernier chapitre : " + manga[1].lastChapter}
                                            </Typography>
                                        </Box>
                                    </Link>
                                );
                            })
                        )}
                    </Grid>
                </Grid>
            </Head>
        );
    }
}

export default withFirebase(MangasList);
