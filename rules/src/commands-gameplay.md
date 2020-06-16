# Gameplay Commands

|Command|Description|
|---|---|
|restart_level|Restarts the current chamber.|
|taunt|Player taunts when midair in cooperative mode.|
|sv_player_funnel_into_portals|Disabling this will stop the player from curving into nearby portals when falling.|
|developer 1|Allows you to move as soon as the chamber loads instead of being stuck for ~0.5 seconds.|
|contimes|Number of console lines to overlay for debugging, contimes 8 is default, contimes 3 is widely used, contimes 0 removes it from the screen.|
|mat_ambient_light_b/g/b|Changes game's ambient lighting.|
|r_portal_use_pvs_optimization|Disabling this allows the engine to render level structures in out of bounds space.|
|cl_fov|Changes player's field-of-view. Note that values have to be within the [`Command Limitations`].|

## Example Usage

- `bind [key] "taunt"` - Binds a key to achieve fastest taunts.
- `bind [key] “incrementvar cl_fov 50 90 45”` - Binds a key to zoom faster. Useful when playing as P-body.
- `bind [key] "incrementvar mat_ambient_light_r 0 0.1 0.1;incrementvar mat_ambient_light_g 0 0.1 0.1;incrementvar mat_ambient_light_b 0 0.1 0.1"` - Overwrites the game’s lighting and allows you to see in the dark.

[`Command Limitations`]: commands-limitations.md
