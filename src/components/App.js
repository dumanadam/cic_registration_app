import React from "react";
import { Container } from "react-bootstrap";
import Signup from "./Signup";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import Dashboard from "./Dashboard";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import UpdateProfile from "./UpdateProfile";
import DeleteProfile from "./DeleteProfile";
import Sessions from "./Sessions";
import SessionConfirmed from "./SessionConfirmed";
import bgImage from "../assets/images/bg.jpg";
import Header from "./Header";

const divStyle = {
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)),url(${bgImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  position: "absolute",
  minHeight: "100%",
  minWidth: "100%",
  height: "100vh",
  zIndex: -1,
};

function App() {
  return (
    <>
      <div style={divStyle}></div>
      <Container
        className="d-flex align-items-center justify-content-center "
        style={{ height: "100vh" }}
      >
        <div className="w-100 " style={{ maxWidth: "400px" }}>
          <div>{Header()}</div>
          <div className="mt-4">
            <Router>
              <AuthProvider>
                <Switch>
                  <PrivateRoute exact path="/" component={Dashboard} />
                  <PrivateRoute
                    path="/update-profile"
                    component={UpdateProfile}
                  />
                  <PrivateRoute
                    path="/delete-profile"
                    component={DeleteProfile}
                  />
                  <PrivateRoute path="/Sessions" component={Sessions} />
                  <PrivateRoute
                    path="/SessionConfirmed"
                    component={SessionConfirmed}
                  />
                  <Route path="/signup" component={Signup} />
                  <Route path="/login" component={Login} />
                  <Route path="/forgot-password" component={ForgotPassword} />
                </Switch>
              </AuthProvider>
            </Router>
          </div>
        </div>
      </Container>
    </>
  );
}

export default App;
