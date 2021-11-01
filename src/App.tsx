import './App.css'
import { Maze } from './Maze'

export default function App() {
  return (
    <div className="app">
      <Maze height={10} width={10} squareSize={30} renderSolutionPath={false} />
    </div>
  )
}
