import { useState } from "react";
import Navbar from "./Navbar";

function App() {
  const [user, setUser] = useState(null);
  return (
    <div className="App">
      <Navbar user={user} />
      <div className="container"></div>
    </div>
  );
}

export default App;
