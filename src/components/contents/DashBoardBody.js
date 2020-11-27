import React, { useState, useEffect } from "react";
import { Button, Card, Alert, Row, Col, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import NavButtons from "../NavButtons";
import TEXTDEFINITION from "../../text/TextDefinition";
import MainShell from "../MainShell";

var QRCode = require("qrcode.react");

function DashboardBody(props) {
  const [error, setError] = useState("");
  const [dashboardNavButtons, setDashboardNavButtons] = useState("");
  const history = useHistory();
  const [myProps, setMyProps] = useState(props);
  useEffect(() => {
    // console.log("props", props);
    setMyProps(props);
  }, [props]);

  useEffect(() => {
    setDashboardNavButtons(NavButtons(3, buttonDetails));
    // console.log("dbody props", props);
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
              xs={4}
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

  function noSessionBooked() {
    return (
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
    { title: " Date:", detail: props.userDetails.jumaDate },
    { title: "Session:", detail: props.userDetails.jumaSession },
  ];
  let buttonDetails = {
    b1: {
      buttonText: props.userDetails.jumaDate
        ? "Update Session"
        : "Book Session",
      link: "/sessions",
      variant: "primary w-100",
      loading: myProps.loading,
    },
    b2: {
      buttonText: "Update Profile",
      variant: "primary w-100",
      link: "/update-profile",
      loading: myProps.loading,
    },
    b3: {
      buttonText: "Logout",
      variant: "outline-light w-100 border-0 mt-2",
      link: "/",
      loading: myProps.loading,
      handleLogout: handleLogout,
    },
  };

  return (
    <>
      <div style={{ height: "50vh" }}>
        {props.userDetails.jumaDate ? (
          <div className="pt-4"></div>
        ) : (
          <Row className="p-4 justify-content-center ">{noSessionBooked()}</Row>
        )}
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
            {props.userDetails.jumaDate && (
              <QRCode
                style={{}}
                renderAs="SVG"
                value={props.userDetails.sessionHash}
                fgColor="#004619"
                //bgColor="#faa61a"
              />
            )}
          </Col>
        </Row>
      </div>
      <div id="bottom-navigation"> {dashboardNavButtons}</div>
    </>
  );
}

export default MainShell(DashboardBody);
