import Counter from "./components/Counter";
import Header from "./components/Header";
import { ConnectionProvider } from "./utils/ConnectionProvider";
import Notes from "./components/Notes/Notes";
import { NotesProvider } from "./context/NotesContext";

function App() {
  return (
    <>
      <div style={{ padding: "1rem" }}>
        <ConnectionProvider>
          <div>
            <Header />
          </div>
          <div>
            <Counter />
          </div>
        </ConnectionProvider>
        <div style={{ marginTop: "5rem" }}>
          <NotesProvider>
            <div>
              <h1>Take Notes</h1>
              <Notes />
            </div>
          </NotesProvider>
        </div>
      </div>
    </>
  );
}

export default App;
