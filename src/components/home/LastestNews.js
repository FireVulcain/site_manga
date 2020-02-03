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

const styles = {
    homeNews: {
        background: "#283440",
        color: "#fff",
        borderBottom: "1px solid #3e4b5b",
        padding: "3px 20px",
        minHeight: "45px",

        "& p:not(:last-child)": {
            marginRight: "20px"
        }
    },
    title: {
        fontWeight: "bold",
        textOverflow: "ellipsis",
        overflow: "hidden",
        width: "100px",
        flexShrink: "0",
        whiteSpace: "nowrap"
    },
    date: {
        fontWeight: "bold",
        width: "45px"
    }
};

class LastestNews extends Component {
    constructor() {
        super();
        this.state = {
            news: [],
            loading: true,
            noNews: false
        };
    }
    formatDate = (date) => {
        console.log(date);
    };
    componentDidMount = () => {
        const firestore = this.props.firebase.firestore;
        let news = {};
        firestore
            .collection("/news")
            .get()
            .then((results) => {
                if (!results.empty) {
                    results.forEach((doc) => {
                        news[doc.id] = doc.data();
                    });
                } else {
                    this.setState({ noNews: results.empty });
                    return;
                }
            })
            .then(() => {
                this.setState({ news: news, loading: false });
            });
    };

    render() {
        const { classes } = this.props;
        return (
            <Box>
                <Grid item md={12}>
                    <Typography variant="h5" component="h3" className="titlePage">
                        Les dernières actus
                    </Typography>
                </Grid>
                {this.state.noNews ? (
                    <Grid item md={12}>
                        <Typography variant="body1" component="p" color="secondary">
                            Pas de news actuellement sur le site
                        </Typography>
                    </Grid>
                ) : (
                    <Grid item md={12} className="containerInfo">
                        {this.state.loading ? (
                            <CircularProgress size={30} className="loadingInfo" />
                        ) : (
                            Object.values(this.state.news).map((newInfo, i) => {
                                let date = new Date(newInfo.date.seconds * 1000);
                                let day = date.getDate();
                                let month = date.getMonth() + 1;
                                return (
                                    <Box key={i} display="flex" alignItems="center" className={classes.homeNews}>
                                        <Typography className={classes.date}>
                                            {day}/{month}
                                        </Typography>
                                        <Typography className={classes.title}>{newInfo.title}</Typography>
                                        <Typography>{newInfo.actuInfo}</Typography>
                                    </Box>
                                );
                            })
                        )}
                    </Grid>
                )}
            </Box>
        );
    }
}

LastestNews.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withFirebase(LastestNews));
