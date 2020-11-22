import React, { useState, useEffect } from "react";
import { Button, Card, Alert, Row, Col, Spinner } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import TEXTDEFINITION from "../text/TextDefinition.js";
import NavButtons from "../components/NavButtons";
import PageTitle from "../components/PageTitle";
import MainShell from "../components/MainShell";
var QRCode = require("qrcode.react");

function DashboardBody() {
  const [error, setError] = useState("");
  const { currentUser, logout, userDetails } = useAuth();
  const [pageTitle, setpageTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [dashboardNavButtons, setDashboardNavButtons] = useState("");
  const [finishedFetching, setFinishedFetching] = useState(false);
  const history = useHistory();

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

  function printSessionInfo() {
    let result = bookingsText.map((rowDetails) => {
      let sessionCheck =
        rowDetails.detail === "" ? "No Booking" : rowDetails.detail;

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

  const bookingsText = [
    { title: "Salamu Aleykum", detail: userDetails.firstname },
    { title: "Booking Date :", detail: userDetails.jumaDate },
    { title: "Booking Session :", detail: userDetails.jumaSession },
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

  return (
    <div>
      <Row className="pb-2 justify-content-center pt-4" bg="dark">
        {sessionCheck()}
      </Row>
      {printSessionInfo()}

      <div className="pb-2 text-center w-100">
        <QRCode
          style={{}}
          renderAs="SVG"
          value={userDetails.sessionHash}
          fgColor="#004619"
          //bgColor="#faa61a"
        />
      </div>
    </div>
  );
}

export default DashboardBody;
