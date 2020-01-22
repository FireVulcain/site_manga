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

const styles = {};
class MangaChapter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mangaId: this.props.match.params.manga_name,
            nbChapter: parseInt(this.props.match.params.nb_chapter),
            chapterData: []
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
        console.log(this.state.chapterData);
        const { classes } = this.props;
        return <h1>test</h1>;
    }
}
MangaChapter.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(MangaChapter);
