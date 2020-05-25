import { Dimensions } from 'react-native';

const PositionHelper = (squareNumber: number = 0, touchPosition: [number, number] = [0,0]) => {

  const screen = {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
  };

  const margin = 2;
  const topOffset = 50;
  const gridSize = 4;
  const squareDim = screen.width / gridSize;
  const squareDimWithoutMargin = squareDim - (margin * 2);
  const colNumber = squareNumber % gridSize || gridSize;
  const colIndex = colNumber - 1;
  const squareX = colIndex * squareDim;
  const rowNumber = Math.ceil(squareNumber / gridSize);
  const rowIndex = rowNumber - 1;
  const squareY = topOffset + (rowIndex * squareDim);

  const touchX = touchPosition[0];
  const touchY = touchPosition[1];
  const fullBoundsTopLeftX = 0;
  const fullBoundsTopLeftY = topOffset;
  const fullBoundsBottomRightX = screen.width;
  const fullBoundsBottomRightY = topOffset + (squareDim * gridSize);
  const touchPositionIsWithinFullBounds = touchX >= fullBoundsTopLeftX &&
    touchX <= fullBoundsBottomRightX &&
    touchY >= fullBoundsTopLeftY &&
    touchY <= fullBoundsBottomRightY;

  let matchedSquareNum;
  if (touchPositionIsWithinFullBounds) {
    const matchedRowNumber = Math.ceil(((touchY - topOffset) / (squareDim * gridSize)) * gridSize);
    const matchedRowIndex = matchedRowNumber - 1;
    const matchedColNumber = Math.ceil((touchX / (squareDim * gridSize)) * gridSize);
    matchedSquareNum = matchedRowIndex * gridSize + matchedColNumber;
  }

  const hammerWidth = squareDim / 2;
  const hammerHeight = hammerWidth / 1.5;
  const hammerXStart = (squareDim - hammerWidth) / 2;
  const hammerYStart = 20;
  const hammerSpeed = screen.width / 100;

  const hammerOffsetForSquareCenterX = hammerXStart + (colIndex * squareDim) - (hammerWidth / 2);
  const hammerOffsetForSquareCenterY = (rowIndex * squareDim) + (squareDim / 2) + hammerYStart;

  return {
    hammerWidth,
    hammerHeight,
    hammerXStart,
    hammerYStart,
    hammerSpeed,
    hammerOffsetForSquareCenterX,
    hammerOffsetForSquareCenterY,
    margin,
    gridSize,
    colNumber,
    rowNumber,
    squareDim,
    squareDimWithoutMargin,
    squareX,
    squareY,
    touchPositionIsWithinFullBounds,
    matchedSquareNum,
  };
};

export default PositionHelper;
