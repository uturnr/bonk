import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import { IContents } from './App';
import PositionHelper from './PositionHelper';

interface IProps {
  contents?: IContents | undefined;
  screen?: any;
  squareNumber?: number;
}

const Square = ({contents, screen, squareNumber}: IProps) => {

  if (!screen || !squareNumber) {
    return null;
  }

  const borderColors = {
    default: '#d1d1d1',
    movable: '#348ceb',
    fixed: '#000',
  }

  const images = {
    up: require('./img/up.png'),
    down: require('./img/down.png'),
    uplocked: require('./img/uplocked.png'),
    downlocked: require('./img/downlocked.png'),
    guy: require('./img/guy.png'),
  };

  let image;
  let borderColor = borderColors.default;
  if (contents) {
    if (contents.movable) {
      borderColor = borderColors.movable;
      image = contents.object === 'up' ? images.up : images.down;
    } else {
      borderColor = borderColors.fixed;
      if (contents.object === 'guy') {
        image = images.guy;
      } else {
        image = contents.object === 'up' ? images.uplocked : images.downlocked;
      }
    }
  }

  const position = PositionHelper(squareNumber);

  return (
    <View style={[
      styles.square,
      {
        borderColor,
        left: position.squareX,
        top: position.squareY,
        height: position.squareDimWithoutMargin,
        width: position.squareDimWithoutMargin,
        margin: position.margin,
      },
    ]}>
      {
        image &&
        <Image source={image} style={styles.image} />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  square: {
    borderWidth: 2,
    borderRadius: 2,
    backgroundColor: '#fff',
    position: 'absolute',
  },
  image: {
    height: '100%',
    width: '100%',
  }
});

export default Square;
