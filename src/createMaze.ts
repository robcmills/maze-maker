import { connectSquare } from './connectSquare';
import { getCardinal } from './getCardinal';
import { Cardinal, getUnvisitedNeighbors } from './getUnvisitedNeighbors';

export interface MazeSquare {
  isEntrance?: boolean;
  isExit?: boolean;
  isSecondary?: boolean;
  isVisited?: boolean;
  north?: MazeSquare;
  south?: MazeSquare;
  east?: MazeSquare;
  west?: MazeSquare;
  pathEntrance?: Cardinal;
  pathExit?: Cardinal;
  x: number;
  y: number;
}

interface CreateMazeArgs {
  height: number;
  width: number;
}

export function createMaze({ height, width }: CreateMazeArgs): MazeSquare[][] {
  const mazeMatrix: MazeSquare[][] = [];
  const unvisitedSquares = new Set<MazeSquare>();

  // create empty matrix
  for (let y = 0; y < height; y++) {
    const row: MazeSquare[] = [];
    for (let x = 0; x < width; x++) {
      row.push({ x, y });
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

  // add all squares to unvisited set
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      unvisitedSquares.add(mazeMatrix[y][x]);
    }
  }

  // create primary and solution paths
  const MAX_ITERATIONS = 1000;
  let iteration = 0;
  let currentSquare: MazeSquare = mazeMatrix[0][0];
  let previousSquare: MazeSquare = currentSquare;
  let nextSquare: MazeSquare = currentSquare;
  let unvisitedNeighbors: MazeSquare[] = [];
  while (!currentSquare.isExit && iteration <= MAX_ITERATIONS) {
    iteration++;
    currentSquare.isVisited = true;
    unvisitedSquares.delete(currentSquare);
    unvisitedNeighbors = getUnvisitedNeighbors(currentSquare);
    if (unvisitedNeighbors.length > 0) {
      const randomIndex = Math.floor(Math.random() * unvisitedNeighbors.length);
      nextSquare = unvisitedNeighbors[randomIndex];
      currentSquare.pathExit = getCardinal(currentSquare, nextSquare);
      nextSquare.pathEntrance = getCardinal(nextSquare, currentSquare);
      previousSquare = currentSquare;
      currentSquare = nextSquare;
    } else {
      // Dead end. Retrace path until we find a square that has unvisited neighbors.
      while (unvisitedNeighbors.length === 0) {
        const previousSquare = currentSquare.pathEntrance && currentSquare[currentSquare.pathEntrance];
        if (!previousSquare) {
          console.error('Got lost');
          break;
        }
        currentSquare = previousSquare;
        unvisitedNeighbors = getUnvisitedNeighbors(currentSquare);
      }
    }
  }

  if (currentSquare.isExit) {
    currentSquare.isVisited = true;
    unvisitedSquares.delete(currentSquare);
  }

  // Fill in the unvisited squares
  iteration = 0;
  let isConnected = false;
  while (unvisitedSquares.size > 0 && iteration < MAX_ITERATIONS) {
    iteration++;
    let startSquare = unvisitedSquares.values().next().value;
    startSquare.isVisited = true;
    startSquare.isSecondary = true;
    unvisitedSquares.delete(startSquare);
    isConnected = connectSquare(startSquare);
    previousSquare = startSquare;
    unvisitedNeighbors = getUnvisitedNeighbors(startSquare);
    if (!unvisitedNeighbors.length) {
      continue;
    }
    const randomIndex = Math.floor(Math.random() * unvisitedNeighbors.length);
    currentSquare = unvisitedNeighbors[randomIndex];
    startSquare.pathExit = getCardinal(startSquare, currentSquare);
    currentSquare.pathEntrance = getCardinal(currentSquare, startSquare);
    while (currentSquare !== startSquare && iteration <= MAX_ITERATIONS) {
      iteration++;
      currentSquare.isVisited = true;
      currentSquare.isSecondary = true;
      unvisitedSquares.delete(currentSquare);
      if (!isConnected) {
        isConnected = connectSquare(currentSquare);
      }
      previousSquare = currentSquare;
      unvisitedNeighbors = getUnvisitedNeighbors(currentSquare);
      if (unvisitedNeighbors.length > 0 && iteration <= MAX_ITERATIONS) {
        const randomIndex = Math.floor(Math.random() * unvisitedNeighbors.length);
        nextSquare = unvisitedNeighbors[randomIndex];
        currentSquare.pathExit = getCardinal(currentSquare, nextSquare);
        nextSquare.pathEntrance = getCardinal(nextSquare, currentSquare);
        previousSquare = currentSquare;
        currentSquare = nextSquare;
        if (!isConnected) {
          isConnected = connectSquare(currentSquare);
        }
      } else {
        // Dead end. Retrace path until we find a square that has unvisited neighbors
        // or until we reach the start square.
        while (unvisitedNeighbors.length === 0 && currentSquare !== startSquare) {
          const previousSquare = currentSquare.pathEntrance && currentSquare[currentSquare.pathEntrance];
          if (!previousSquare) {
            console.error('Got lost');
            break;
          }
          currentSquare = previousSquare;
          unvisitedNeighbors = getUnvisitedNeighbors(currentSquare);
        }
      }
    }
  }

  if (iteration >= MAX_ITERATIONS) {
    console.error(`Failed to create maze within ${MAX_ITERATIONS} iterations`);
  }

  return mazeMatrix;
}
