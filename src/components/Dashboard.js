import React, { useState, useEffect } from "react";
import { Button, Card, Alert, Row, Col } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import PageTitle from "./PageTitle";
import TEXTDEFINITION from "./TextDefinition.js";

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout, userDetails } = useAuth();
  const [pageTitle, setpageTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const bookingsText = [
    { title: "As SalamuAleykum", detail: userDetails.firstname },
    { title: "Booked Date :", detail: userDetails.jumaDate },
    { title: "Booked Session :", detail: userDetails.jumaSession },
  ];

  useEffect(() => {
    setpageTitle(PageTitle("Dashboard"));
    console.log("userDetails", userDetails);
    console.log("TEXTDEF", TEXTDEFINITION);
  }, []);

  async function handleLogout(e) {
    setError("");

    try {
      await logout();
      history.push("/login");
    } catch {
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
      console.log("1", rowDetails.detail);
      let sessionCheck =
        rowDetails.detail === "" ? "No Booking" : rowDetails.detail;
      console.log("sessioncheck", sessionCheck);
      return (
        <Row className="mt-4 mb-4">
          <Col
            xl={7}
            xs={7}
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
    console.log("result", result);

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
        <Card
          className=" border-0 h-100"
          bg="transparent"
          style={{ minHeight: "57vh" }}
        >
          <Card.Header className="h3 text-center text-light border-1">
            {TEXTDEFINITION.DASHBOARD_CARD_HEADER}
          </Card.Header>
          <Card.Body className="mt-0 pt-0">
            {error && <Alert variant="danger">{error}</Alert>}
            <Row classname="mb-4" bg="dark">
              {sessionCheck()}
            </Row>
            {printSessionInfo()}

            {/*  <div
              className="text-danger bg-dark mt-4"
              style={{ height: "150px" }}
            ></div> */}
            <Row className="  mt-4 pt-4 ">
              <Col>
                <Link className="text-light text-left" to="/sessions">
                  <Button disabled={loading} className="w-100">
                    {userDetails.jumaDate ? "Session" : "Session"}
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

            <div id="bottom-navigation">
              <Link className="" to="/">
                <Button variant="outline-warning w-100 mt-3 text-light">
                  Donate To CIC New Mosque
                </Button>
              </Link>
              <Link className="text-light" onClick={handleLogout}>
                <Button variant="border-0 outline-light w-100 mt-2 text-light ">
                  Logout
                </Button>
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
