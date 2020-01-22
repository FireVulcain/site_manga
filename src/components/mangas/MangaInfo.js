import React, { Component } from "react";
import PropTypes from "prop-types";

//Material-ui
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";

const styles = {
    media: {
        height: 440
    }
};
class MangaInfo extends Component {
    render() {
        const { classes } = this.props;
        return (
            <Card>
                {Object.values(this.props.mangaInfo).map((data, i) => {
                    return (
                        <Box key={i}>
                            <CardMedia className={classes.media} image={data.mangaImage} title="Contemplative Reptile" />
                            <CardContent>
                                <Typography component="h3">{data.title}</Typography>
                                <Typography variant="body1">{data.resume}</Typography>
                            </CardContent>
                        </Box>
                    );
                })}
            </Card>
        );
    }
}
MangaInfo.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(MangaInfo);
