import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import "../config/firebaseConfig";

class UploadImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mangas: [],
            images: null,
            url: "",
            selectManga: "",
            selectChapter: null
        };
    }

    handleImage = (e) => {
        if (e.target.files[0]) {
            const images = e.target.files;
            this.setState(() => ({ images }));
        }
    };
    handleSelectedManga = (e) => {
        this.setState({ selectManga: e.target.value });
    };
    handleSelectedChapter = (e) => {
        this.setState({ selectChapter: e.target.value });
    };

    handleUpload = () => {
        const { images } = this.state;
        let pathUploadImg = this.state.selectManga + "/" + this.state.selectChapter;
        Object.values(images).map((image) => {
            firebase
                .storage()
                .ref(`${pathUploadImg}/${image.name}`)
                .put(image);
        });
    };
    componentDidMount() {
        const db = firebase.firestore();
        let mangas = {};
        db.collection("/mangas")
            .get()
            .then((results) => {
                results.forEach((doc) => {
                    mangas[doc.id] = doc.data();
                });
                return this.setState({ mangas: mangas });
            });
    }
    render() {
        return (
            <div className="center">
                <div>
                    <select name="mangas" id="mangas" onChange={this.handleSelectedManga}>
                        <option value="" defaultValue>
                            Choisir un manga
                        </option>
                        {Object.entries(this.state.mangas).map((manga, i) => {
                            return (
                                <option value={manga[0]} key={i}>
                                    {manga[1].title}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div>
                    <input type="text" onChange={this.handleSelectedChapter} />
                </div>
                <div className="file-field input-field">
                    <div className="btn">
                        <span>File</span>
                        <input type="file" onChange={this.handleImage} multiple />
                    </div>
                </div>
                <button onClick={this.handleUpload} className="waves-effect waves-light btn">
                    Upload
                </button>
            </div>
        );
    }
}

export default UploadImage;
