# Demo Recording Commands

|Command|Description|
|---|---|
|record [name]|Starts recording the player’s inputs generating a demo .dem file.|
|stop|Stops the current demo recording.|
|playdemo [name]|Replays a recorded demo.|
|cl_enable_remote_splitscreen|Shows the partner view while replaying a cooperative demo.|

## Example Usage

- `bind [key] "record [name]"` - Binds a key to start recording a demo under a specific file name.
- `bind [key] “stop;restart_level”` - Binds a key to stop the current demo and restart the chamber to start a new run.
