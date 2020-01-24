import React, { Component } from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router";

//Firebase
import { withFirebase } from "./../config/Firebase";

//Material-ui
import { withStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

const styles = {
    page: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "20px"
    }
};
class MangaReadChapter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mangaId: this.props.match.params.manga_name,
            nbChapter: parseInt(this.props.match.params.nb_chapter),
            chapterData: [],
            loading: true,
            wrongSearchManga: false
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
                    return this.setState({ wrongSearchManga: !results.exists });
                }
            });
    }
    render() {
        const { classes } = this.props;
        return this.state.wrongSearchManga ? (
            <Redirect to="/" />
        ) : (
            <Box>
                {Object.values(this.state.chapterData).map((datas) => {
                    return datas.pages.map((page, i) => {
                        return (
                            <Box key={i} className={classes.page}>
                                <img src={page.pageImg} alt="page chapitre" />;
                            </Box>
                        );
                    });
                })}
            </Box>
        );
    }
}
MangaReadChapter.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(withFirebase(MangaReadChapter));
