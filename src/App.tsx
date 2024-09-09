import Counter from './Counter'
import Header from './Header/Header'
import { ConnectionProvider } from './ConnectionProvider'

function App() {
  return (
    <>
    <ConnectionProvider>
    <div>
    <Header />
    </div>
      <div>
        <Counter />
      </div>
      </ConnectionProvider>
    </>
  )
}

export default App
