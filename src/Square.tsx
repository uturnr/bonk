import React, { useRef, useState } from 'react';
import {StyleSheet, View, Image, PanResponder, Animated} from 'react-native';
import { IContents } from './App';
import PositionHelper from './PositionHelper';

interface IProps {
  contents?: IContents | undefined;
  inDropZone?: boolean;
  positionOverride?: [number, number] | null;
  screen?: any;
  squareNumber?: number;
}

const Square = ({
  contents,
  inDropZone,
  screen,
  squareNumber,
  positionOverride,
}: IProps) => {

  const pan = useRef(new Animated.ValueXY()).current;
  
  // const panResponder = useRef(
  //   PanResponder.create({
  //     onMoveShouldSetPanResponder: () => !!(contents && contents.movable),
  //     // onPanResponderGrant: () => {
  //     //   pan.setOffset({
  //     //     x: (pan.x as any)._value,
  //     //     y: (pan.y as any)._value,
  //     //   });
  //     // },
  //     onPanResponderMove: (event, gestureState) => {
  //       setIsMoving(true);
  //       Animated.event(
  //         [
  //           null,
  //           { dx: pan.x, dy: pan.y },
  //         ],
  //         { useNativeDriver: false }
  //       )(event, gestureState);
  //     },
  //     onPanResponderRelease: (event, gestureState) => {
  //       setIsMoving(false);
  //       // pan.setOffset({
  //       //   x: 0,
  //       //   y: 0,
  //       // });
  //       Animated.event(
  //         [
  //           null,
  //           { x: new Animated.Value(0), y: new Animated.Value(0) },
  //         ],
  //         { useNativeDriver: false }
  //       )(event, gestureState);
  //     },
  //   })
  // ).current;

  if (!screen || !squareNumber) {
    return null;
  }

  const borderColors = {
    default: '#d1d1d1',
    movable: '#348ceb',
    fixed: '#000',
  };

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

  const borderWidth = positionOverride ? 4 :
    inDropZone ? 8 : 2;

  let position = PositionHelper(squareNumber);
  if (positionOverride) {
    position.squareX = positionOverride[0] - (position.squareDim / 2);
    position.squareY = positionOverride[1] - (position.squareDim / 2);
  }
  const zIndex = positionOverride ? 10 : 1;
  const opacity = inDropZone ? 0.4 : 1;

  return (
    <Animated.View
      style={[
        styles.square,
        {
          borderColor,
          borderWidth,
          left: position.squareX,
          top: position.squareY,
          height: position.squareDimWithoutMargin,
          width: position.squareDimWithoutMargin,
          opacity,
          margin: position.margin,
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
          zIndex,
        },
      ]}
    >
      {
        image &&
        <Image source={image} style={styles.image} />
      }
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  square: {
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
