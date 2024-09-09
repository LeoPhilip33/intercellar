import Counter from "./components/Counter";
import Header from "./components/Header";
import { ConnectionProvider } from "./utils/ConnectionProvider";

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
  );
}

export default App;
