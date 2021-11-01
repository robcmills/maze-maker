import { useMemo } from 'react';
import { createMaze } from './createMaze';
import { MazeSquare } from './MazeSquare';
import './Maze.css'

interface MazeProps {
  height: number;
  width: number;
  squareSize: number;
  renderSolutionPath: boolean;
}

export function Maze({ height, width, squareSize, renderSolutionPath }: MazeProps) {
  const maze = useMemo(() => {
    return createMaze({ height, width });
  }, [height, width]);

  console.log({ maze });

  const mazeNodes = [];
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      row.push(
        <MazeSquare
          key={`${x}-${y}`}
          x={x}
          y={y}
          size={squareSize}
          square={maze[y][x]}
          renderSolutionPath={renderSolutionPath}
        />
      );
    }
    mazeNodes.push(row);
  }

  return <div className='maze-container'>{mazeNodes}</div>
}