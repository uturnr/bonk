import React from 'react';
import {StyleSheet, Image} from 'react-native';
import * as Animatable from 'react-native-animatable';
import PositionHelper from './PositionHelper';

interface IProps {
  direction: [number, number];
  running?: boolean;
  screen?: any;
  targetSquare: number;
  positionOffset: [number, number];
}

const Hammer = ({running, screen, targetSquare, positionOffset}: IProps) => {

  if (!screen) {
    return null;
  }

  const position = PositionHelper(targetSquare);
  const x = position.hammerXStart + positionOffset[0];
  const y = position.hammerYStart + positionOffset[1];

  return (
    <Animatable.View
      animation={running ? 'rotate' : undefined}
      duration={300}
      easing="linear"
      iterationCount="infinite"
      style={[
        styles.hammer,
        {
          left: x,
          top: y,
          width: position.hammerWidth,
          height: position.hammerHeight,
        },
      ]}
    >
      <Image source={require('./img/hammer.png')} style={styles.image} />
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  hammer: {
    position: 'absolute',
    zIndex: 1,
  },
  image: {
    height: '100%',
    width: '100%',
  }
});

export default Hammer;
