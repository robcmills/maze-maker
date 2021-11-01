import { MazeSquare } from './createMaze';
import { CARDINALS } from './getUnvisitedNeighbors';

export function connectSquare(square: MazeSquare): boolean {
  for (const cardinal of CARDINALS) {
    const neighbor = square[cardinal];
    if (neighbor && neighbor.isVisited) {
      square.pathEntrance = cardinal;
      return true;
    }
  }
  return false;
}