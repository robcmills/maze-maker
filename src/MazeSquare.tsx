import { CSSProperties } from 'react';
import { MazeSquare as MazeSquareInterface } from './createMaze';
import { Cardinal } from './getUnvisitedNeighbors';
import './MazeSquare.css'

interface MazeSquareProps {
  x: number;
  y: number;
  size: number;
  square: MazeSquareInterface;
  renderSolutionPath: boolean;
}

const DEGREES_BY_CARDINAL: { [key in Cardinal]: number } = {
  north: -90,
  east: 0,
  south: 90,
  west: 180,
};

function getPathStyle(cardinal: Cardinal, size: number): CSSProperties {
  return {
    top: `${size / 2}px`,
    left: `${size / 2}px`,
    height: `${size / 4}px`,
    width: `${size / 2}px`,
    transform: `rotate(${DEGREES_BY_CARDINAL[cardinal]}deg) translate(0, -50%)`,
  };
}

function getCardinalOpposite(cardinal: Cardinal): Cardinal {
  return ({
    north: 'south',
    east: 'west',
    south: 'north',
    west: 'east',
  } as Record<Cardinal, Cardinal>)[cardinal];
}

function hasWall(square: MazeSquareInterface, cardinal: Cardinal): boolean {
  return (
    !square[cardinal] ||
    square.pathEntrance !== cardinal &&
    square.pathExit !== cardinal &&
    square[cardinal]?.pathEntrance !== getCardinalOpposite(cardinal)
  );
}

const INVISIBLE_WALL_BORDER = '1px solid transparent';
const WALL_BORDER = '1px solid black';

export function MazeSquare({ x, y, size, square, renderSolutionPath }: MazeSquareProps) {
  const style = {
    backgroundColor: square.isEntrance
      ? '#bdf5bd'
      : square.isExit
      ? '#fad1d1'
      : square.isVisited
      ? 'aliceblue'
      : 'white',
    borderTop: hasWall(square, 'north') ? WALL_BORDER : INVISIBLE_WALL_BORDER,
    borderBottom: hasWall(square, 'south') ? WALL_BORDER : INVISIBLE_WALL_BORDER,
    borderLeft: hasWall(square, 'west') ? WALL_BORDER : INVISIBLE_WALL_BORDER,
    borderRight: hasWall(square, 'east') ? WALL_BORDER : INVISIBLE_WALL_BORDER,
    left: x * (size - 1),
    top: y * (size - 1),
    height: `${size - 2}px`,
    width: `${size - 2}px`,
  };
  const pathEntrance = renderSolutionPath && square.pathEntrance
    ? <div className='square-path' style={getPathStyle(square.pathEntrance, size)} />
    : null;
  const pathExit = renderSolutionPath && square.pathExit
    ? <div className='square-path' style={getPathStyle(square.pathExit, size)} />
    : null;
  return (
    <div className='maze-square' style={style}>
      {pathEntrance}
      {pathExit}
    </div>
  );
}