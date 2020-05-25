import PositionHelper from './PositionHelper';
import { Dimensions } from 'react-native';

const runHammer = (entities: any, dispatch: any) => {
  const screen = {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  };

  const hammer = entities.hammer;
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
    console.log(hammer.targetSquare);
    console.log(hammer.continueOffScreen);
  }

  // Moving along
  hammer.positionOffset = [
    hammer.positionOffset[0] + xMove,
    hammer.positionOffset[1] + yMove,
  ];
}

const GameLoop = (entities: any, { touches, dispatch, events }: any) => {
  // const screen = {
  //   width: Dimensions.get('screen').width,
  //   height: Dimensions.get('screen').height,
  // };
  if (events.length) {
    const startEvent = events.find((e: any) => e.type === 'start-hammer');
    if (startEvent) {
      entities.hammer.hammerRunning = true;
    }
  }


  if (entities.hammer.hammerRunning) {
    runHammer(entities, dispatch);
  } else {
    const startTouch = touches.find((t: any) => t.type === 'start');
    const moveTouch = touches.find((t: any) => t.type === 'move');
    const endTouch = touches.find((t: any) => t.type === 'end');

    if (startTouch) {
      const touchPosition = PositionHelper(undefined, [startTouch.event.pageX, startTouch.event.pageY]);
      if (
        touchPosition.matchedSquareNum &&
        entities[`square${touchPosition.matchedSquareNum}`].contents &&
        entities[`square${touchPosition.matchedSquareNum}`].contents.movable
      ) {
        entities.board.movingSquareNum = touchPosition.matchedSquareNum;
        entities[`square${entities.board.movingSquareNum}`].positionOverride = [startTouch.event.pageX, startTouch.event.pageY];
      }
    }
    if (moveTouch && entities.board.movingSquareNum) {
      const touchPosition = PositionHelper(undefined, [moveTouch.event.pageX, moveTouch.event.pageY]);
      if (
        touchPosition.matchedSquareNum &&
        entities.board.dropZoneSquareNum !== touchPosition.matchedSquareNum
      ) {
        // Remove old dropzone
        if (entities.board.dropZoneSquareNum) {
          entities[`square${entities.board.dropZoneSquareNum}`].inDropZone = false;
          entities.board.dropZoneSquareNum = null;
        }
        // Set new dropzone if square is eligible
        if (
          !entities[`square${touchPosition.matchedSquareNum}`].contents || (
            entities[`square${touchPosition.matchedSquareNum}`].contents &&
            entities[`square${touchPosition.matchedSquareNum}`].contents.movable
          )
        ) {
          entities.board.dropZoneSquareNum = touchPosition.matchedSquareNum;
          entities[`square${entities.board.dropZoneSquareNum}`].inDropZone = true;
        }
      }
      entities[`square${entities.board.movingSquareNum}`].positionOverride = [moveTouch.event.pageX, moveTouch.event.pageY];
    }
    if (endTouch && entities.board.movingSquareNum) {

      entities[`square${entities.board.movingSquareNum}`].positionOverride = null;
      if (entities.board.dropZoneSquareNum) {
        entities[`square${entities.board.dropZoneSquareNum}`].inDropZone = false;
        // Swap
        const moving = entities[`square${entities.board.movingSquareNum}`];
        entities[`square${entities.board.movingSquareNum}`] = entities[`square${entities.board.dropZoneSquareNum}`];
        entities[`square${entities.board.movingSquareNum}`].squareNumber = entities.board.movingSquareNum;
        entities[`square${entities.board.dropZoneSquareNum}`] = moving;
        entities[`square${entities.board.dropZoneSquareNum}`].squareNumber = entities.board.dropZoneSquareNum;
      }
      entities.board.movingSquareNum = null;
      entities.board.dropZoneSquareNum = null;
      // swap entities
    }
  }

  return entities;
};

export default GameLoop;
