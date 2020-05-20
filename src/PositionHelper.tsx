import { Dimensions } from 'react-native';

const PositionHelper = (squareNumber: number) => {

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
  };
};

export default PositionHelper;
