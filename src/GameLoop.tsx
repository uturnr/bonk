import PositionHelper from './PositionHelper';
import { Dimensions } from 'react-native';

const GameLoop = (entities: any, { _touches, dispatch, _events }: any) => {
  const screen = {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  };

  const hammer = entities.hammer;
  hammer.running = true;

  const targetSquare = entities[`square${hammer.targetSquare}`];
  const position = PositionHelper(targetSquare.squareNumber);

  const xDiff = position.hammerOffsetForSquareCenterX - hammer.positionOffset[0];
  const yDiff = position.hammerOffsetForSquareCenterY - hammer.positionOffset[1];

  let xMove = xDiff > 1 ? position.hammerSpeed : 0;
  let yMove = yDiff > 1 ? position.hammerSpeed : 0;

  if (hammer.continueOffScreen) {
    if (
      hammer.positionOffset[0] < -(position.hammerWidth * 2) ||
      hammer.positionOffset[0] > (position.hammerWidth * 2) + screen.width ||
      hammer.positionOffset[1] < -(position.hammerHeight * 2) ||
      hammer.positionOffset[1] > (position.hammerHeight * 2) + screen.height
    ) {
      // Off screen.
      dispatch({ type: 'game-over' });
    }
    xMove = position.hammerSpeed * hammer.direction[0];
    yMove = position.hammerSpeed * hammer.direction[1];
  } else if (xMove === 0 && yMove === 0) {

    let xDirection = hammer.direction[0];
    let yDirection = hammer.direction[1];
    let targetCol = position.colNumber;
    let targetRow = position.rowNumber;

    if (targetSquare.contents && targetSquare.contents.object === 'guy') {
      // bonk! (if the angle is right)
    } else if (targetSquare.contents) {
      // up or down angle
      const negator = targetSquare.contents.object === 'up' ? -1 : 1;
      const oldXDirection = xDirection;
      xDirection = negator * yDirection;
      yDirection = negator * oldXDirection;
      hammer.direction = [xDirection, yDirection];
    }

    // Continue moving to next target or off screen
    if (xDirection === 1) {
      if (targetCol < 4) { targetCol++; }
      else { hammer.continueOffScreen = true; }
    } else if (xDirection === -1) {
      if (targetCol > 1) { targetCol--; }
      else { hammer.continueOffScreen = true; }
    } else if (yDirection === 1) {
      if (targetRow < 4) { targetRow++; }
      else { hammer.continueOffScreen = true; }
    } else if (yDirection === -1) {
      if (targetRow > 1) { targetRow--; }
      else { hammer.continueOffScreen = true; }
    }

    // Set new target
    hammer.targetSquare = targetCol + ((targetRow - 1) * position.gridSize);

  }

  // Moving along
  hammer.positionOffset = [
    hammer.positionOffset[0] + xMove,
    hammer.positionOffset[1] + yMove,
  ];


  return entities;
};

export default GameLoop;
