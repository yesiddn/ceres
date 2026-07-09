import { useState } from "react";
import "./App.css";

function App() {
  let [state, setState] = useState(0);
  console.log(state);

  return (
    <>
      <h1 className="text-sky-600">state: {state}</h1>
      <button onClick={() => setState(state + 1)}>Increment</button>
    </>
  );
}

export default App;
