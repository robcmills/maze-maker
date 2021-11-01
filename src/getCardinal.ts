import { MazeSquare } from './createMaze';
import { Cardinal } from './getUnvisitedNeighbors';

export function getCardinal(from: MazeSquare, to: MazeSquare): Cardinal | undefined {
  if (from.north === to) {
    return 'north';
  }
  if (from.south === to) {
    return 'south';
  }
  if (from.east === to) {
    return 'east';
  }
  if (from.west === to) {
    return 'west';
  }
}
