import { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import MainPage from "./MainPage";
import Navbar from "./Navbar";
import Signup from "./form/Signup";

function App() {
  const [user, setUser] = useState(null);
  return (
    <div className="App">
      <Router>
        <Navbar user={user} />
        <div className="container">
          <Route exact path="/" component={MainPage} />
          <Route path="/signup" component={Signup} />
        </div>
      </Router>
    </div>
  );
}

export default App;
