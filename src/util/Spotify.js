const clientId = '3006aa97c0fe403ca201483bc5ba0295';
const redirectUri = 'http://baa_jam.surge.sh';
let accessToken;
const Spotify = {
  getAccessToken () {
    if(accessToken) {
      // console.log(accessToken);
      return accessToken;
    }
      const tokenMatch = window.location.href.match(/access_token=([^&]*)/);
      const expireMatch = window.location.href.match(/expires_in=([^&]*)/);
      if (tokenMatch && expireMatch) {
        accessToken = tokenMatch[1];
        let expiresIn = Number (expireMatch[1]);
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        // console.log(accessToken);
        return accessToken;
    }  else {
        console.log('Error retrieving spotify API');
        window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
      }
  },
  search(searchTerm) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
      { headers: {Authorization: `Bearer ${accessToken}` }})
      .then(response => {
        if(response.ok) {
          // console.log(response);
          return response.json();
        }
        throw new Error('Request failed!!!!!');
      }, networkError => console.log(networkError.message))
      .then(jsonResponse => {
        // console.log(jsonResponse);
        if(!jsonResponse.tracks.items) {
          return [];
        } else {
            return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }));
        }
      })
    },
      savePlaylist(playlistName, trackURIs) {
        if(!playlistName || !trackURIs) return;
        let access_token = accessToken;
        let headers = { Authorization: `Bearer ${access_token}` };
        let userId = '';
        return fetch('https://api.spotify.com/v1/me', { headers: headers })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Request failed!');
          })
        .then(jsonResponse => {
          userId = jsonResponse.id;
        })
        .then(() => {
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${access_token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: playlistName })
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Request failed!');
        })
        .then(jsonResponse => {
          let playlistId = jsonResponse.id;
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ uris: trackURIs })
          });
        });
    });
  }
}
export default Spotify;
