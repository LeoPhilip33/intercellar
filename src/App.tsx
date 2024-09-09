import Counter from "./components/Counter";
import Header from "./components/Header";
import { NotesProvider } from "./components/Notes/NotesContext";
import { ConnectionProvider } from "./utils/ConnectionProvider";
import Notes from "./components/Notes/Notes";

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
      <div>
        <NotesProvider>
          <div>
            <h1>Notes Part</h1>
            <Notes />
          </div>
        </NotesProvider>
      </div>
    </>
  );
}

export default App;
