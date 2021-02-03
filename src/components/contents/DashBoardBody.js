import React, { useState, useEffect } from "react";
import { Button, Card, Alert, Row, Col, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import NavButtons from "../NavButtons";
import TEXTDEFINITION from "../../text/TextDefinition";
import MainShell from "../MainShell";
import { fbfunc, functions } from "../../firebase";

var QRCode = require("qrcode.react");

function DashboardBody(props) {
  const [error, setError] = useState("");
  const [dashboardNavButtons, setDashboardNavButtons] = useState("");
  const history = useHistory();
  const [noSessions, setNoSessions] = useState(true);
  const [bookingsText, setBookingsText] = useState([]);
  const [buttonDetails, setButtonDetails] = useState(true);

  useEffect(() => {
    console.log("Dashboard body props", props);

    setBookingsText([
      {
        title: TEXTDEFINITION.DASHBOARD_GREETING,
        detail: props.userDetails.firstname,
      },
      { title: " Date:", detail: props.userDetails.jumaDate },
      { title: "Session:", detail: props.userDetails.jumaSession },
    ]);

    setButtonDetails({
      b1: {
        buttonText:
          props.userDetails.jumaDate == "" ? "Book Session" : "Update Session",
        link: "/sessions",
        variant: "primary w-100",
        loading: !!props.openSessions ? false : true,
        disabled: props.openSessions == null ? false : true,
      },
      b2: {
        buttonText: "Update Profile",
        variant: "primary w-100",
        link: "/update-profile",
        loading: props.loading,
      },
      b3: {
        buttonText: "Logout",
        variant: "outline-light w-100 border-0 mt-2",
        link: "/",
        loading: props.loading,
        handleLogout: handleLogout,
      },
    });
  }, [props]);

  useEffect(() => {
    if (buttonDetails !== true) {
      console.log("NavButtons buttondewt", buttonDetails);
      setDashboardNavButtons(NavButtons(3, buttonDetails));
    }
  }, [NavButtons]);

  useEffect(() => {
    console.log("dbody nosess", noSessions);
    !noSessions && setDashboardNavButtons(NavButtons(3, buttonDetails));
  }, [noSessions]);

  useEffect(() => {
    console.log("props.userDetails.jumaDate", props.userDetails.jumaDate);
    props.myProps.checkUserBooking();
  }, [props.openSessions]);

  useEffect(() => {
    if (buttonDetails !== true) {
      console.log(" buttondewt", buttonDetails);
      setDashboardNavButtons(NavButtons(3, buttonDetails));
    }
  }, [buttonDetails]);

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

  function noSessionBookedPrintMessage() {
    return (
      <div className="text-light text-center ">
        {props.openSessions ? (
          <>
            <div className="">{TEXTDEFINITION.JUMA_BOOKED_CHECK_FAIL1}</div>
            <span className="">{TEXTDEFINITION.JUMA_BOOKED_CHECK_FAIL2}</span>
          </>
        ) : (
          <span className="">{TEXTDEFINITION.NO_SESSIONS_AVAILABLE_USER}</span>
        )}
      </div>
    );
  }

  function fbclick(params) {
    console.log("params", params);
    const sayHello = fbfunc.httpsCallable("testFunc");
    sayHello({ name: "asd" }).then((result) => {
      console.log("res from func  - ", result.data);
    });
  }

  function adminPage() {
    history.push("/admin");
  }

  async function backupDb() {
    let backupdb = fbfunc.httpsCallable("backupDbRef");

    let dbres = await backupdb()
      .then((result) => {
        console.log("res from backupDbRef func  ->>> ", result.data);
        return result.data;
      })
      .catch((e) => {
        console.log("FBfunc backupDbRef error returned >>>", e);
      });
    console.log("res from backupDbRef func  ->>> ", dbres);
  }

  function printBody() {
    return (
      <>
        {printSessionInfo()}

        <Row className="pt-4 text-center " style={{ minHeight: "50vh" }}>
          <Col
            bg="light"
            style={{
              padding: "2vh",
              margin: "5vw",

              alignSelf: "flex-start",

              backgroundColor: props.userDetails.jumaDate
                ? "white"
                : "transparent",
            }}
          >
            <QRCode
              style={{}}
              renderAs="SVG"
              value={props.userDetails.sessionHash}
              fgColor="#000"
              //bgColor="#faa61a"
            />
          </Col>
        </Row>
      </>
    );
  }

  return (
    <>
      <div style={{ height: "50vh" }}>
        {props.userDetails.jumaDate == ""
          ? noSessionBookedPrintMessage()
          : printBody()}
      </div>
      <div id="bottom-navigation"> {dashboardNavButtons}</div>
      <button onClick={fbclick}>add admin</button>
      <button onClick={adminPage}>admin page</button>
      <button onClick={backupDb}>backupDB page</button>
    </>
  );
}

export default MainShell(DashboardBody);
