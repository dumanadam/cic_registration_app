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
  const [myProps, setMyProps] = useState(props);
  const [noSessions, setNoSessions] = useState(true);
  const [bookingsText, setBookingsText] = useState([]);
  const [buttonDetails, setButtonDetails] = useState(true);

  useEffect(() => {
    console.log("Dashboard body props", props);

    /*  if (props.openSessions !== "" && props.userDetails.jumaDate !== "") {
      console.log(
        "user has jumadate",
        props.openSessions[props.userDetails.jumaDate][
          props.userDetails.jumaSession
        ]
      );
      if (
        typeof props.openSessions[props.userDetails.jumaDate][
          props.userDetails.jumaSession
        ].confirmed === "undefined"
      ) {
        console.log("userdetails jumassession FAILED match");
        // removeUserSession();
      } else {
        if (
          typeof props.openSessions[props.userDetails.jumaDate][
            props.userDetails.jumaSession
          ].confirmed[props.userDetails.sessionHash] == "undefined"
        ) {
          console.log(
            "session hash in confirmed failed",
            props.openSessions[props.userDetails.jumaDate][
              props.userDetails.jumaSession
            ].confirmed[props.userDetails.sessionHash]
          );
          // removeUserSession();
        } else {
          console.log(
            "everything ok in user to db match",
            props.openSessions[props.userDetails.jumaDate][
              props.userDetails.jumaSession
            ].confirmed[props.userDetails.sessionHash]
          );
        }
      }
    } */
    if (props.userDetails !== null) {
      /*       if (
        props.userDetails.jumaDate !== "" &&
        props.myProps.checkUserSession() == null
      ) {
        console.log("remove session dashboard actual");
        removeUserSession();
      } */

      setNoSessions(false);
      setMyProps(props);
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
            props.userDetails.jumaDate !== ""
              ? "Update Session"
              : "Book Session",
          link: "/sessions",
          variant: "primary w-100",
          loading: myProps.loading,
          disabled: noSessions,
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
      });
    } else {
      console.log("wtf");
      props.myProps.setLoading(true);
      setNoSessions(true);
    }
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
    if (buttonDetails !== true) {
      console.log(" buttondewt", buttonDetails);
      setDashboardNavButtons(NavButtons(3, buttonDetails));
    }
  }, [buttonDetails]);

  function removeUserSession() {
    console.log("hit remove session");
    props.myProps.setLoading(true);

    const promises = [];
    promises.push(props.clearUserJumaSession());
    Promise.all(promises)
      .then((res) => {
        console.log("res", res);
      })
      .catch((e) => {
        console.log("delete error=>", error);
        console.log("delete error=>", e);
        // setModalDetails({ bodyText: e.message });
        setTimeout(() => {
          props.myProps.setLoading(false);
          //setModalDetails({ bodyText: TEXTDEFINITION.LOADING_DEFAULT });
        }, 1000);
      })
      .finally(() => {
        props.myProps.setLoading(false);
      });
  }

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
        {props.loading ? (
          printBody()
        ) : (
          <Row className="p-4 justify-content-center ">{noSessionBooked()}</Row>
        )}
      </div>
      <div id="bottom-navigation"> {dashboardNavButtons}</div>
      <button onClick={fbclick}>asdasd</button>
    </>
  );
}

export default MainShell(DashboardBody);
