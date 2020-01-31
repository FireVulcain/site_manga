import React, { Component } from "react";

import LinearProgress from "@material-ui/core/LinearProgress";

class NextRelease extends Component {
    constructor(props) {
        super(props);
        this.state = {
            percent: 0
        };
    }
    componentDidMount = () => {
        let lastChapter = new Date("2020-01-24");

        let nextChapter = new Date("2020-01-31");

        let current = new Date();

        let completed = ((current - lastChapter) / (nextChapter - lastChapter)) * 100;

        completed = completed > 100 ? (completed = 100) : completed;

        this.setState({ percent: completed });
    };
    render() {
        return <LinearProgress variant="determinate" value={this.state.percent} />;
    }
}
export default NextRelease;
