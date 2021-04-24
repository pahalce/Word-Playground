import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
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
import CreateRoom from "./pages/CreateRoom";
import Rooms from "./pages/Rooms";
import { RoomProvider } from "../contexts/RoomContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <RoomProvider>
            <Navbar />
            <div className="container">
              <Switch>
                <Route path="/signup" component={Signup} />
                <Route path="/login" component={Login} />
                <Route path="/forgot-password" component={ForgotPassword} />
                <PrivateRoute path="/profile" component={Profile} />
                <PrivateRoute
                  path="/update-profile"
                  component={UpdateProfile}
                />
                <Route exact path="/" component={MainPage} />
                <PrivateRoute path="/create-room" component={CreateRoom} />
                <PrivateRoute path="/rooms" render={() => <Rooms />} />
                <PrivateRoute path="/gamepage" render={() => <GamePage />} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </RoomProvider>
        </AuthProvider>
      </Router>
      <ToastContainer position="bottom-right" autoClose={5000} newestOnTop />
    </div>
  );
}

export default App;
