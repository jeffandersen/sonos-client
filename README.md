sonos-client
============

Client for [sonos-rest-api](https://github.com/jeffandersen/sonos-rest-api).

### Quickstart Example

```js
var Sonos = require('sonos-client').v1;

// You need to point the Sonos client at your locally hosted REST API
var sonos = new Sonos({
  endpoint: 'http://localhost:5000'
});

// List all available players
sonos.players().list(function(err, players) {
  // Make sure you're running the API server at the end point specified above
  if (err) {
    throw err;
  }

  // For zones, we would use the `uuid` property instead of `roomName`
  var roomName = players[0].roomName;

  // Take an action on a particular player
  sonos.players(roomName).pause(function(err, playerState) {
    // This will fail if this player is a zone coordinator, use zones instead
    if (err) {
      throw err;
    }

    console.log('Player ' + roomName + ' was paused.');

    // Set the volume percentage for a given player
    sonos.players(roomName).volume(40, function(err, playerState) {
      if (err) {
        throw err;
      }

      console.log('Player ' + roomName + '\'s volume was set to 40%');
    });
  });
});
```

### Supported Actions

The following actions are currently zupported for both zones and players:

- play
- pause
- playpause
- mute
- unmute
- volume
- crossfade
- shuffle
- repeat
- playlists
