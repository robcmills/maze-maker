import { MazeSquare } from './createMaze';

export type Cardinal = 'north' | 'east' | 'south' | 'west';
export const CARDINALS: Cardinal[] = ['north', 'east', 'south', 'west'];

export function getUnvisitedNeighbors(mazeSquare: MazeSquare): MazeSquare[] {
  const neighbors: MazeSquare[] = [];
  for (const cardinal of CARDINALS) {
    const neighbor = mazeSquare[cardinal];
    if (neighbor && !neighbor.isVisited) {
      neighbors.push(neighbor);
    }
  }
  return neighbors;
}