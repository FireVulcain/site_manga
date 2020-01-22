import React, { Component } from "react";
import PropTypes from "prop-types";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "../config/firebaseConfig";

//Material-ui
import { withStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

const styles = {
    page: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "20px"
    }
};
class MangaChapter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mangaId: this.props.match.params.manga_name,
            nbChapter: parseInt(this.props.match.params.nb_chapter),
            chapterData: [],
            loading: true
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
    }
    render() {
        const { classes } = this.props;
        return (
            <Box>
                {Object.values(this.state.chapterData).map((datas) => {
                    if (datas.pages) {
                        return datas.pages.map((page, i) => {
                            return (
                                <Box key={i} className={classes.page}>
                                    <img src={page.pageImg} />;
                                </Box>
                            );
                        });
                    }
                })}
            </Box>
        );
    }
}
MangaChapter.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(MangaChapter);
