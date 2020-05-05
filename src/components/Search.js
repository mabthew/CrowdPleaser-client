import React, { Component } from 'react';
import Spotify from 'node-spotify-api'
import { clientId, secret } from '../config';
import SearchResult from "./SearchResult"

export default class Search extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            access_code: props.access_code,
            player: null,
            trackURI: null,
            searchValue: '',
            songs: []
        }
        this.searchSpotify = this.searchSpotify.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getSongUri = this.getSongUri.bind(this);

    }

    searchSpotify() {
      var spotify = new Spotify({
          id: clientId,
          secret: secret
      });
      if (this.state.searchValue === undefined) {
        return;
      }
      spotify.search({ type: 'track', query: this.state.searchValue}, (err, data) => {
          if (err) {
            return console.log(err);
          }
          var songs = []
          for (let i = 0; i < 20; i++) {
            let song = data.tracks.items[i];
            songs.push({"name": song.name, "artist": song.artists[0].name, "uri": song.uri, "duration": song.duration_ms, "image": song.album.images[0].url})
          }
          // this.setState({trackURI, songs});
          this.setState({songs});
      });
    }

    handleChange(event) {
      if (event.target.value === "" ) {
        this.setState({songs: undefined})
        return;
      }
      this.setState({searchValue: event.target.value, songs: []}, this.searchSpotify);

    }

    handleEnter(event) {
      event.preventDefault();
    }

    getSongUri(songInfo) {
      this.setState({trackURI: songInfo.trackURI}, () => this.props.addToQueue(songInfo));
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleEnter}>
                    <label>
                        Song:
                        <input type="text" name="song" onChange={this.handleChange}/>
                    </label>
                </form>
                {this.state.songs !== undefined && this.state.songs.map((song,i) => {
                    return<SearchResult key={i} data={song} getSongUri={this.getSongUri}></SearchResult>
                })}
             </div>
        );
    }
}