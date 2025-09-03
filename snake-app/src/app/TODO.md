// TODO

Multiplayer:

!! create server then host an online multiplayer

Session Class should: 
    - update snake locations
    - update food locations
    - check for collisions
    - send data to client
    - only start game when there are two clients connected and end once one of them leaves, will not start with only one player
useOnlineGame should:
    - send dirs
    - receive state changes?
    - states should be changed


Goals:
    - finish backend logic
        *garbage collection: when a player leaves a session the other player is also kicked out
    - finish frontend 

issues: 
    - arrow keys move the page