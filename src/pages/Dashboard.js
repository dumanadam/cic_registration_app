import React, { useState, useEffect } from "react";
import { Button, Card, Alert, Row, Col } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import TEXTDEFINITION from "../text/TextDefinition.js";
import NavButtons from "../components/NavButtons";
import PageTitle from "../components/PageTitle";

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout, userDetails } = useAuth();
  const [pageTitle, setpageTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [dashboardNavButtons, setDashboardNavButtons] = useState("");
  const history = useHistory();
  const bookingsText = [
    { title: "SalamuAleykum", detail: userDetails.firstname },
    { title: "Booked Date :", detail: userDetails.jumaDate },
    { title: "Booked Session :", detail: userDetails.jumaSession },
  ];
  let buttonDetails = {
    b1: {
      buttonText: userDetails.jumaDate ? "Update Session" : "Session",
      link: "/sessions",
      classnames: "primary",
      loading: loading,
    },
    b2: {
      buttonText: "Update Profile",
      classnames: "primary w-100",
      link: "/update-profile",
      loading: loading,
    },
    b3: {
      buttonText: "Logout",
      classnames: "outline-light",
      link: "/",
      logout: handleLogout,
    },
  };

  useEffect(() => {
    setDashboardNavButtons(NavButtons(3, buttonDetails));
  }, [NavButtons]);

  useEffect(() => {
    setpageTitle(PageTitle("Dashboard"));
    console.log("Dashboard userDetails", userDetails);
  }, []);

  async function handleLogout() {
    console.log("logout func");
    setError("");

    try {
      await logout();
      history.push("/login");
    } catch (e) {
      setError("Failed to Logout");
      console.log("error", e);
    }
  }

  function sessionButton() {
    if (userDetails.jumaDate === "") {
      return (
        <Link to="/sessions" className="btn btn-primary  mt-3 mr-1">
          Book Session
        </Link>
      );
    } else {
      return (
        <Link to="/sessionConfirmed" className="btn btn-primary  mt-3 mr-1">
          View QrCode
        </Link>
      );
    }
  }

  function printSessionInfo() {
    let result = bookingsText.map((rowDetails) => {
      let sessionCheck =
        rowDetails.detail === "" ? "No Booking" : rowDetails.detail;

      return (
        <Row className="mt-4 mb-4">
          <Col
            xl={7}
            xs={6}
            className="text-warning text-right"
            style={{ fontSize: "18px" }}
          >
            {rowDetails.title}
          </Col>
          <Col className="text-light text-left" style={{ fontSize: "18px" }}>
            {sessionCheck}
          </Col>
        </Row>
      );
    });

    return result;
  }

  function sessionCheck(params) {
    return userDetails.jumaDate ? (
      <div>
        <strong>{TEXTDEFINITION.JUMA_BOOKED_CHECK}</strong>

        {userDetails.jumaDate}
      </div>
    ) : (
      <div className="text-light text-center ">
        <div className="">{TEXTDEFINITION.JUMA_BOOKED_CHECK_FAIL1}</div>

        <span className="">{TEXTDEFINITION.JUMA_BOOKED_CHECK_FAIL2}</span>
      </div>
    );
  }
  return (
    <>
      <div className="text-light">
        <Card className=" border-0 " bg="transparent">
          <Card.Header className="h3 text-center text-light border-1">
            {TEXTDEFINITION.DASHBOARD_CARD_HEADER}
          </Card.Header>
          <Card.Body className="mt-0 pt-0 ">
            {error && <Alert variant="danger">{error}</Alert>}
            <div style={{ height: "50vh" }}>
              <Row className="mb-4 justify-content-center pt-4" bg="dark">
                {sessionCheck()}
              </Row>
              {printSessionInfo()}
              {/*  <div
              className="text-danger bg-dark mt-4"
              style={{ height: "150px" }}
            ></div> */}
            </div>
            {dashboardNavButtons}
            {/*             <Row className="  ">
              <Col>
                <Link className="text-light text-left" to="/sessions">
                  <Button disabled={loading} className="w-100">
                    {userDetails.jumaDate ? "Update Session" : "Session"}
                  </Button>
                </Link>
              </Col>
              <Col>
                <Link className="text-light text-left" to="/update-profile">
                  <Button disabled={loading} className="w-100">
                    Update Profile
                  </Button>
                </Link>
              </Col>
            </Row>
 */}
            <div id="bottom-navigation">
              {/*     <Link className="" to="/session-confirmed">
                <Button
                  component={Link}
                  to="/session-confirmed"
                  variant="outline-warning w-100 mt-3 text-light "
                >
                  Donate To CIC New Mosque
                </Button>
              </Link> */}
              {/*      <Link className="text-light" onClick={handleLogout}>
                <Button variant="border-0 outline-light w-100 mt-2 text-light ">
                  Logout
                </Button>
              </Link> */}
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
