import React, { useState, useEffect } from "react";
import { Button, Card, Alert, Row, Col, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import NavButtons from "../NavButtons";
import TEXTDEFINITION from "../../text/TextDefinition";
import MainShell from "../MainShell";

var QRCode = require("qrcode.react");

function DashboardBody(props) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dashboardNavButtons, setDashboardNavButtons] = useState("");
  const history = useHistory();

  useEffect(() => {
    setDashboardNavButtons(NavButtons(3, buttonDetails));
    console.log("dbody props", props);
  }, [NavButtons]);

  async function handleLogout() {
    console.log("handle logout");
    setError("");

    try {
      await props.logout();
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
      if (rowDetails.title == "Salamu Aleykum") {
        return (
          <>
            <Row className="pb-2">
              <Col
                xl={7}
                xs={6}
                className="text-warning text-left pr-0"
                style={{ fontSize: "18px" }}
              >
                {rowDetails.title}
              </Col>
              <Col
                className="text-light text-right"
                style={{ fontSize: "18px" }}
              >
                {sessionCheck}
              </Col>
            </Row>
          </>
        );
      } else {
        return (
          <Row className="pb-2">
            <Col
              xl={7}
              xs={7}
              className="text-warning text-left"
              style={{ fontSize: "18px" }}
            >
              {rowDetails.title}
            </Col>
            <Col className="text-light text-right" style={{ fontSize: "18px" }}>
              {sessionCheck}
            </Col>
          </Row>
        );
      }
    });

    return result;
  }

  function sessionCheck(params) {
    return props.userDetails.jumaDate ? (
      <div>
        <strong>{TEXTDEFINITION.JUMA_BOOKED_CHECK}</strong>
        {props.userDetails.jumaDate}
      </div>
    ) : (
      <div className="text-light text-center ">
        <div className="">{TEXTDEFINITION.JUMA_BOOKED_CHECK_FAIL1}</div>
        <span className="">{TEXTDEFINITION.JUMA_BOOKED_CHECK_FAIL2}</span>
      </div>
    );
  }

  const bookingsText = [
    {
      title: "Salamu Aleykum",
      detail: props.userDetails.firstname,
    },
    { title: "Confirmed Date:", detail: props.userDetails.jumaDate },
    { title: "Confirmed Session:", detail: props.userDetails.jumaSession },
  ];
  let buttonDetails = {
    b1: {
      buttonText: props.userDetails.jumaDate ? "Update Session" : "Session",
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
      buttonText: "Update Profile",
      classnames: "primary w-100",
      link: "/update-profile",
      loading: loading,
    },
  };

  return (
    <>
      <div style={{ height: "50vh" }}>
        {/*     <Row className="pb-2 justify-content-center pt-4" bg="dark">
          {sessionCheck()}
        </Row> */}
        {printSessionInfo()}

        <Row className="pt-4 text-center " style={{ minHeight: "50vh" }}>
          <Col
          /*  style={{
              padding: 0,
              margin: "auto",
              display: "block",
              width: "400px",
              height: "45vh",
            }} */
          >
            {
              <QRCode
                style={{}}
                renderAs="SVG"
                value={props.userDetails.sessionHash}
                fgColor="#004619"
                //bgColor="#faa61a"
              />
            }
          </Col>
        </Row>
      </div>
      <div id="bottom-navigation"> {dashboardNavButtons}</div>
    </>
  );
}

export default MainShell(DashboardBody);
