import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./Navbar";
import MainPage from "./pages/MainPage";
import GamePage from "./pages/GamePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "../contexts/AuthContext";
import Profile from "./pages/Profile";
import PrivateRoute from "./reusables/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import UpdateProfile from "./pages/UpdateProfile";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Navbar />
          <div className="container">
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <PrivateRoute path="/profile" component={Profile} />
            <PrivateRoute path="/update-profile" component={UpdateProfile} />
            <Route exact path="/" component={MainPage} />
            <PrivateRoute path="/gamepage" render={() => <GamePage letter="あ" adj="おいしい" />} />
          </div>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
