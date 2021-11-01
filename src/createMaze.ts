import { getCardinal } from './getCardinal';
import { Cardinal, getUnvisitedNeighbors } from './getUnvisitedNeighbors';

export interface MazeSquare {
  isEntrance?: boolean;
  isExit?: boolean;
  isVisited?: boolean;
  north?: MazeSquare;
  south?: MazeSquare;
  east?: MazeSquare;
  west?: MazeSquare;
  pathEntrance?: Cardinal;
  pathExit?: Cardinal;
}

interface CreateMazeArgs {
  height: number;
  width: number;
}

export function createMaze({ height, width }: CreateMazeArgs): MazeSquare[][] {
  const mazeMatrix: MazeSquare[][] = [];

  // create empty matrix
  for (let y = 0; y < height; y++) {
    const row: MazeSquare[] = [];
    for (let x = 0; x < width; x++) {
      row.push({});
    }
    mazeMatrix.push(row);
  }

  // connect all squares
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (y > 0) {
        mazeMatrix[y][x].north = mazeMatrix[y - 1][x];
      }
      if (y < height - 1) {
        mazeMatrix[y][x].south = mazeMatrix[y + 1][x];
      }
      if (x > 0) {
        mazeMatrix[y][x].west = mazeMatrix[y][x - 1];
      }
      if (x < width - 1) {
        mazeMatrix[y][x].east = mazeMatrix[y][x + 1];
      }
    }
  } 

  // mark entrance and exit
  mazeMatrix[0][0].isEntrance = true;
  mazeMatrix[height - 1][width - 1].isExit = true;

  // create solution path
  const MAX_ITERATIONS = 10000;
  let iteration = 0;
  let currentSquare: MazeSquare = mazeMatrix[0][0];
  let previousSquare: MazeSquare = currentSquare;
  let unvisitedNeighbors: MazeSquare[] = [];
  while (!currentSquare.isExit && iteration <= MAX_ITERATIONS) {
    iteration++;
    currentSquare.isVisited = true;
    unvisitedNeighbors = getUnvisitedNeighbors(currentSquare);
    if (unvisitedNeighbors.length > 0) {
      const randomIndex = Math.floor(Math.random() * unvisitedNeighbors.length);
      const nextSquare = unvisitedNeighbors[randomIndex];
      currentSquare.pathExit = getCardinal(currentSquare, nextSquare);
      nextSquare.pathEntrance = getCardinal(nextSquare, currentSquare);
      previousSquare = currentSquare;
      currentSquare = nextSquare;
    } else {
      console.error('Dead end');
      while (unvisitedNeighbors.length === 0) {
        const previousSquare = currentSquare.pathEntrance && currentSquare[currentSquare.pathEntrance];
        if (!previousSquare) {
          console.error('Got lost');
          break;
        }
        // currentSquare.pathEntrance = undefined;
        // previousSquare.pathExit = undefined;
        currentSquare = previousSquare;
        unvisitedNeighbors = getUnvisitedNeighbors(currentSquare);
      }
    }
  }

  if (currentSquare.isExit) {
    currentSquare.isVisited = true;
    console.log(`Maze created in ${iteration} iterations`);
  }

  if (iteration >= MAX_ITERATIONS) {
    console.error('Could not create a solution path');
  }

  return mazeMatrix;
}
