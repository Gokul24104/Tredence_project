import Canvas from "./Canvas";
import Sidebar from "./Sidebar";

function App() {
  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      <Sidebar />
      <Canvas />
    </div>
  );
}

export default App;
