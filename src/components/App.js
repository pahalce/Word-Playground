import { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./Navbar";
import MainPage from "./pages/MainPage";
// import GamePage from "./pages/GamePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [user, setUser] = useState(null);
  return (
    <div className="App">
      <Router>
        <Navbar user={user} />
        <div className="container">
          <Route exact path="/" component={MainPage} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          {/* <Route path="/gamepage" component={GamePage} /> */}
        </div>
      </Router>
    </div>
  );
}

export default App;
