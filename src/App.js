import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

//Components
import Navbar from "./components/layouts/Navbar";
import Home from "./pages/Home";
import MangaCategory from "./pages/MangaCategory";
import MangaChapter from "./pages/MangaChapter";
import UploadImage from "./pages/UploadImage";

class App extends Component {
    render() {
        return (
            <Router>
                <Navbar />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/planning" />
                    <Route exact path="/mangas" />
                    <Route exact path="/upload_image" component={UploadImage} />
                    <Route exact path="/:manga_name" component={MangaCategory} />
                    <Route exact path="/:manga_name/:nb_chapter" component={MangaChapter} />
                </Switch>
            </Router>
        );
    }
}

export default App;
