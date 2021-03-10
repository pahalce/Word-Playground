import { useState } from "react";
import MainPage from "./MainPage";
import Navbar from "./Navbar";

function App() {
  const [user, setUser] = useState(null);
  return (
    <div className="App">
      <Navbar user={user} />
      <div className="container">
        <MainPage />
      </div>
    </div>
  );
}

export default App;
