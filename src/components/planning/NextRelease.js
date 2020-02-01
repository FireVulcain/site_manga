import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// firebase
import { withFirebase } from "./../../config/Firebase";

//Material ui
import { withStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = {
    bar: {
        backgroundColor: "#929292",
        height: "10px",
        borderRadius: "100px"
    },
    awaiting: {
        backgroundColor: "#929292",
        borderRadius: "100px"
    },
    cleaning: {
        backgroundColor: "#E36D63",
        borderRadius: "100px"
    },
    translate: {
        backgroundColor: "#E39565",
        borderRadius: "100px"
    },
    lastCheck: {
        backgroundColor: "#D4E369",
        borderRadius: "100px"
    },
    progressName: {
        color: "#fff",
        fontSize: "18px",
        marginBottom: "5px",
        fontWeight: "bold",

        "& span": {
            color: "#fff",
            fontSize: "14px",
            padding: "2px 10px",
            fontWeight: "normal"
        }
    }
};
class NextRelease extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mangas: {},
            planningManga: {},
            loading: true
        };
    }

    componentDidMount = () => {
        const firestore = this.props.firebase.firestore;
        let planningManga = {};
        let mangas = {};

        firestore
            .collection("/mangas")
            .get()
            .then((results) => {
                results.forEach((doc) => {
                    mangas[doc.id] = doc.data();
                });
            })
            .then(() => {
                firestore
                    .collection("/planning")
                    .get()
                    .then((results) => {
                        results.forEach((doc) => {
                            planningManga[doc.id] = doc.data();
                            planningManga[doc.id].mangaImage = mangas[doc.data().mangaId].mangaImage;
                        });
                        return this.setState({ planningManga, loading: false });
                    });
            });
    };
    render() {
        const { classes } = this.props;

        return (
            <Box>
                <Grid item md={12}>
                    <Typography variant="h5" component="h3" className="titlePage">
                        Les prochaines sorties
                    </Typography>
                </Grid>
                <Grid item md={12} className="containerInfo">
                    {this.state.loading ? (
                        <CircularProgress size={30} className="loadingInfo" />
                    ) : (
                        Object.values(this.state.planningManga).map((planing, i) => {
                            let currentStatus = "";
                            let classStatus = "";
                            switch (planing.status) {
                                case 25:
                                    currentStatus = "Clean des pages";
                                    classStatus = classes.cleaning;
                                    break;
                                case 50:
                                    currentStatus = "Traduction en cours";
                                    classStatus = classes.translate;
                                    break;
                                case 100:
                                    currentStatus = "Dernier check";
                                    classStatus = classes.lastCheck;
                                    break;
                                case 0:
                                default:
                                    currentStatus = "En attente du prochain chapitre";
                                    classStatus = classes.awaiting;
                                    break;
                            }
                            return (
                                <Link key={i} to={planing.mangaId} className="newChapter">
                                    <img src={planing.mangaImage} alt="" className="newChapterImg" />
                                    <Box>
                                        <Typography className={classes.progressName} variant="body1" component="p">
                                            {planing.mangaName} : <span className={classStatus}>{currentStatus}</span>
                                        </Typography>
                                        <LinearProgress
                                            classes={{ colorPrimary: classes.bar, barColorPrimary: classStatus }}
                                            variant="determinate"
                                            value={planing.status}
                                        />
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

NextRelease.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(withFirebase(NextRelease));
