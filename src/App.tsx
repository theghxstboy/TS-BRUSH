import { Sidebar } from './components/sidebar/Sidebar'
import { Canvas } from './components/canvas/Canvas'

export default function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <Canvas />
    </div>
  )
}
