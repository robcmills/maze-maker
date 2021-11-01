import './App.css'
import { Maze } from './Maze'

export default function App() {
  return (
    <div className="app">
      <Maze height={25} width={25} squareSize={20} renderSolutionPath={false} />
    </div>
  )
}
