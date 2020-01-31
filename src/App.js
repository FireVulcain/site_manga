import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

//routes
import * as ROUTES from "./constants/routes";

//Components
import { withAuthentication } from "./components/Session";
import Navbar from "./components/layouts/Navbar";
import Home from "./pages/Home";
import Planning from "./pages/Planning";
import MangasList from "./pages/MangasList";
import SignIn from "./components/auth/SignIn/";
import SignUp from "./components/auth/Signup";
import PasswordForgetPage from "./components/auth/PasswordForget";
import AccountPage from "./components/auth/Account";
import AdminPage from "./components/Admin";
import UploadChapter from "./pages/UploadChapter";
import UploadManga from "./pages/UploadManga";
import MangaListChapters from "./pages/MangaListChapters";
import MangaReadChapter from "./pages/MangaReadChapter";

// Material-ui
import Container from "@material-ui/core/Container";

const App = () => (
    <Router>
        <Navbar />
        <Container maxWidth="lg">
            <Switch>
                <Route exact path={ROUTES.HOME} component={Home} />
                <Route exact path={ROUTES.LIST_MANGAS} component={MangasList} />
                <Route exact path={ROUTES.PLANNING} component={Planning} />
                <Route exact path={ROUTES.SIGN_IN} component={SignIn} />
                <Route exact path={ROUTES.SIGN_UP} component={SignUp} />
                <Route exact path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
                <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
                <Route exact path={ROUTES.ADMIN} component={AdminPage} />
                <Route exact path={ROUTES.UPLOAD_CHAPTER} component={UploadChapter} />
                <Route exact path={ROUTES.UPLOAD_MANGA} component={UploadManga} />

                <Route exact path={ROUTES.LIST_MANGA_CHAPTERS} component={MangaListChapters} />
                <Route exact path={ROUTES.READ_MANGA_CHAPTER} component={MangaReadChapter} />
            </Switch>
        </Container>
    </Router>
);

export default withAuthentication(App);
