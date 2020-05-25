import React, { Component } from 'react';
import { GameEngine } from 'react-native-game-engine';
import { StyleSheet, Button } from 'react-native';

import Square from './Square';
import Hammer from './Hammer';
import GameLoop from './GameLoop';

export interface IContents {
  object: 'up' | 'down' | 'guy';
  movable?: boolean;
}

export interface ILayout {
  [key: number]: IContents
}

export default class App extends Component<{}, { hammerRunning: boolean }> {
  engine: GameEngine | null = null;

  constructor(props: any) {
    super(props);
    this.state = {
      hammerRunning: false,
    };
  }

  onEvent(e: any) {
    if (e.type === 'game-over'){
        this.setState({
          hammerRunning: false,
        });
        this.engine?.swap(this.buildEntities());
    }
  }

  buildEntities() {
    const level1Layout: ILayout = {
      1: {
        object: 'down',
        movable: true,
      },
      3: {
        object: 'up',
      },
      5: {
        object: 'down',
        movable: true,
      },
      8: {
        object: 'guy',
      },
      9: {
        object: 'up',
        movable: true,
      },
    };

    const entities: any = {
      hammer: {
        direction: [0, 1],
        renderer: <Hammer />,
        hammerRunning: this.state.hammerRunning,
        targetSquare: 1,
        positionOffset: [0, 0],
      },
      board: {
        dropZoneSquareNum: null,
        movingSquareNum: null,
      },
    };

    for (let i = 1; i <= 16; i++) {
      entities[`square${i}`] = {
        renderer: <Square />,
        squareNumber: i,
        contents: level1Layout[i],
      };
    }

    return entities;
  }

  handleStartPress() {
    this.setState({hammerRunning: true});
    this.engine?.dispatch({ type: 'start-hammer' });
  };

  render () {
    return (
      <>
        <GameEngine
          entities={this.buildEntities()}
          onEvent={(event: any) => this.onEvent(event)}
          ref={(ref) => { this.engine = ref; }}
          style={styles.container}
          systems={[GameLoop]}
        />
        <Button
          onPress={() => this.handleStartPress()}
          title="Start"
          disabled={this.state.hammerRunning}
          color="#841584"
        />
      </>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
