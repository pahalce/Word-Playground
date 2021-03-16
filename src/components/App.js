import { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./Navbar";
import MainPage from "./pages/MainPage";
import GamePage from "./pages/GamePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "../contexts/AuthContext";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Navbar />
          <div className="container">
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route exact path="/" component={MainPage} />
            <Route path="/gamepage" render={() => <GamePage letter="あ" adj="おいしい" />} />
          </div>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
