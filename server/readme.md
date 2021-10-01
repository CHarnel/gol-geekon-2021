# Game of Life SERVER

## protocol suggestion

All events are sent from client with these properties:

1. `eventName` - the identifier of the event type.
2. `me` - the identifier of the sender, should be the bluetooth identifier. There's a special `me` which is the server itself (future support for messaging between participants).
3. `payload` - contains specific payload that may vary per event type.

## events

- CLIENT originated: user enters the game

```json
{
    "eventName": "game-enter",
    "me": "my-identifier",
    "payload": null
}
```

- SERVER originated: participants list, used to identify all other BT participants, list of identifiers

```json
{
    "eventName": "participants-list",
    "me": "server",
    "payload": {
        "participants": ["a", "b", "c"]
    }
}
```

- SERVER originated: update color, used to update the color of the player. Each value is a percentage for each color, this means that all 3 combined should equal to 1. if all are 0, all led should be white.

```json
{
    "eventName": "update-color",
    "me": "server",
    "payload": {
        "color": {
            "red": 0,
            "green": 0,
            "blue": 0
        }
    }
}
```

- CLIENT originated: update RSSI

```json
{
    "eventName": "update-rssi",
    "me": "my-identifier",
    "payload": {
        "gps_lat": 1.22222,
        "gps_lon": 2.22222,
        "gps_precision_m": 5.6,
        "rssiList": [
            {"player": "a", "rssi": -20},
            {"player": "b", "rssi": -50},
            {"player": "c", "rssi": -50},
        ]
    }
}
```
