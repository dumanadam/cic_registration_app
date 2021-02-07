import React, { useEffect, useLayoutEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Signup from "../pages/Signup";

import ForgotPassword from "../pages/ForgotPassword";
import Dashboard from "../pages/Dashboard";
import { AuthProvider } from "../contexts/AuthContext";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import UpdateProfile from "../pages/UpdateProfile";
import DeleteProfile from "../pages/DeleteProfile";
import Sessions from "../pages/Sessions";
import SessionConfirmed from "../pages/SessionConfirmed";
import bgImage from "../assets/images/bg.jpg";
import bgImage2 from "../assets/images/bg2.jpg";
import bgImage3 from "../assets/images/bg3.jpg";
import aaa from "../assets/images/aaa.jpg";
import Header from "./Header";
import PrivacyPolicy from "./PrivacyPolicy";
import MediaQuery, { useMediaQuery } from "react-responsive";
import MQuery from "./MQueury";
import GetWindow from "./GetWindow";

import CreateSession from "../pages/CreateSession";
import AdminDashboard from "../pages/AdminDashboard";
import Login from "../pages/Login";

import TestQr from "../pages/TestQr";
import AttendeeScanner from "../pages/AttendeeScanner";

function App() {
  const { height, width } = GetWindow();
  const [screenSize, setScreenSize] = useState("");
  const [errorState, seterrorState] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [orientation, setOrientation] = useState("");
  const [firstRun, setfirstRun] = useState(true);
  const [currentHeight, setcurrentHeight] = useState(height);
  const [currentWidth, setcurrentWidth] = useState(width);
  const [header, setHeader] = useState("XXX");
  const [bgJSON, setbgJSON] = useState({
    /* backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)),url(${bgImage})`,
    backgroundSize: "auto cover",
    backgroundPosition: "center top",
    backgroundRepeat: "no-repeat",
    position: "absolute",
    height: "100vh",
    minWidth: "100%",

    zIndex: -1, */
    //   backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)),url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center top",
    backgroundRepeat: "no-repeat",
    position: "absolute",
    //minHeight: "100vh",
    minWidth: "100%",
    height: "150vh",
  });

  useLayoutEffect(() => {
    if (height < 400 && firstRun === false) {
      setbgJSON({
        ...bgJSON,
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)),url(${bgImage})`,
        height: 700, //178,
      });
    } else {
      setbgJSON({
        ...bgJSON,
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)),url(${bgImage})`,
        height: "105vh",
      });
    }
    firstRun && setfirstRun(false);
  }, [height]);

  function flipErrorState() {
    console.log("errorState", errorState);
    seterrorState(!errorState);
  }

  return (
    <>
      <div style={bgJSON}>
        <Container style={width > 600 ? { width: "25vw" } : { width: "100vw" }}>
          <Header headerTitle={header}></Header>
        </Container>
        <Container
          style={width > 600 ? { width: "25vw" } : { width: "100vw" }}
          // style={{ minHeight: "70vh" }}
        >
          <Router>
            <AuthProvider>
              <Switch>
                <PrivateRoute
                  exact
                  path="/"
                  component={(props) => (
                    <Dashboard {...props} setHeaders={setHeader} />
                  )}
                />

                <PrivateRoute exact path="/admin" component={AdminDashboard} />

                <PrivateRoute
                  exact
                  path="/create-session"
                  component={CreateSession}
                />
                <PrivateRoute
                  path="/update-profile"
                  component={UpdateProfile}
                />
                <PrivateRoute
                  path="/delete-profile"
                  component={DeleteProfile}
                />
                <PrivateRoute
                  path="/Sessions"
                  component={(props) => (
                    <Sessions {...props} setHeaders={setHeader} />
                  )}
                />
                <PrivateRoute
                  path="/session-confirmed"
                  component={SessionConfirmed}
                />
                <PrivateRoute path="/test" component={TestQr} />
                <PrivateRoute path="/scanner" component={AttendeeScanner} />
                <Route
                  path="/signup"
                  render={(props) => (
                    <Signup
                      {...props}
                      flipErrorState={flipErrorState}
                      setHeaders={setHeader}
                      wid={width}
                      hei={height}
                    />
                  )}
                />

                <Route
                  path="/login"
                  render={(props) => (
                    <Login
                      {...props}
                      flipErrorState={flipErrorState}
                      wid={width}
                      hei={height}
                      setHeaders={setHeader}
                    />
                  )}
                />
                <Route path="/forgot-password" component={ForgotPassword} />
                <Route path="/privacy-policy" component={PrivacyPolicy} />
                <Route
                  path="*"
                  component={(props) => (
                    <Dashboard {...props} setHeaders={setHeader} />
                  )}
                />
              </Switch>
            </AuthProvider>
          </Router>
        </Container>
      </div>
    </>
  );
}

export default App;
