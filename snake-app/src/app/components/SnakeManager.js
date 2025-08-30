import React from 'react';

import ConnectionManager from '../utils/connectionManager';
import Events from '../utils/events';

export default class SnakeManager extends React.Component {

    constructor() {
        super();
        this.state = {
            players: new Map()
        }
    }

    componentDidMount() {
        this.createPlayer();
        this.connectionManager = new ConnectionManager(this);
        this.connectionManager.connect("ws://localhost:3000"); //uncomment this if you want to play locally
        //this.connectionManager.connect("https://multiplayer-tetris-bd80c58c0ffa.herokuapp.com/"); //uncomment this if you want to play globally
    }

    sendDataToServer = data => {
        if (this.connectionManager) {
            this.connectionManager.send(data);
        }
    };

    createPlayer = (playerId = "localPlayer" ) => {
        const events = new Events();
        const isLocalPlayer = this.state.players.size === 0 ? true : false;
        const gameState = {oppSnake, foodLocation, score};
        this.setState(prev => 
            prev.players.set(playerId, { events, isLocalPlayer, gameState})
        );
    }

    removePlayer = id => {
        this.setState(prev => prev.players.delete(id));
        // this.setState(prev => {
        //     const updatedPlayers = new Map(prev.players);
        //     updatedPlayers.delete(id);
        //     return { players: updatedPlayers };
        // });
    }

    sortPlayers = players => {
        this.setState(prevState => {
            const sortedMap = new Map(
                players.map(key => [key, prevState.players.get(key)])
            );
            return { players: sortedMap };
        });
    };

    updateSnakeState = (id, newState) => {
        const player = this.state.players.get(id);
        try {
            player.gameState = {
                ...player.gameState, 
                [newState.prop]: newState.value
            } 
        } catch (error) {
                console.log("Undefined object");
            }   
        this.setState(prev => prev.players.set(id, player));
    }

    render() {
        return (<></>);
    }

}

