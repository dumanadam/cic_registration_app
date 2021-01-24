import React, { useState, useEffect } from "react";
import { Card, Form, Button, ListGroup, Row, Col } from "react-bootstrap";
import { useAuth, updateAttendance } from "../contexts/AuthContext";
import { Link, useHistory, useLocation } from "react-router-dom";
import QrReader from "react-qr-reader";
import SessionList from "../components/SessionList";
import ShowModal from "../components/ShowModal";
import TEXTDEFINITION from "../text/TextDefinition";
import styled from "styled-components";
import FindFriday from "../components/FindFriday";
import correct from "../assets/audio/correct.mp3";
import incorrect from "../assets/audio/incorrect.mp3";
import { BsChevronBarRight, BsX, BsCheck } from "react-icons/bs";
import { IconContext } from "react-icons";

var QRCode = require("qrcode.react");
var md5Qr = require("md5");

const CARD = styled(Card)`
  background: #f7f9fa;
  height: auto;
  width: 100%;

  color: snow;
  -webkit-box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);
  box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.4);

  @media (min-width: 786px) {
    width: 100%;
    height: 50vh;
  }

  /*   label {
    color: #24b9b6;
    font-size: 1.2em;
    font-weight: 400;
  } */

  /*   h1 {
    color: #24b9b6;
    padding-top: 0.5em;
  } */

  .form-group {
    margin-bottom: 0;
    padding-bottom: 1.2em;
  }

  .form-label {
    margin-bottom: 0;
  }

  .error {
    border: 2px solid #ff6565;
  }

  .error-message {
    color: #ff6565;
    padding-left: 0.2em;
    height: 1em;
    position: absolute;
    font-size: 0.8em;
    padding-top: 0.2em;
  }
`;

const MYFORM = styled(Form)`
  width: 90%;
  text-align: left;

  @media (min-width: 786px) {
  }
`;

const BUTTON = styled(Button)`
  border: none;
  margin-top: 1vh;
  font-weight: 400;

  &:hover {
    background: #1d3461;
  }
`;

function AttendeeScanner() {
  const {
    openSessions,
    userDetails,
    bookSession,
    globalFriday,
    globalFridayFb,
    updateAttendance,
    getSessionAttendees,
    superSessions,
  } = useAuth();
  const [error, setError] = useState("");
  const [session, setSession] = useState({});
  const [latestSessionTimes, setLatestSessionTimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState("Nada");
  const [listKey, setListKey] = useState("");
  const [bookingAvailability, setBookingAvailability] = useState(0);
  const [sessionAttendees, setSessionAttendees] = useState([]);
  const [attendeeDetails, setAttendeeDetails] = useState({});
  const history = useHistory();
  const [attendeeList, setAttendeeList] = useState([]);
  const [modalDetails, setModalDetails] = useState({
    bodyText: TEXTDEFINITION.LOADING_DEFAULT,
  });
  const location = useLocation();
  const successmp3 = new Audio(correct);
  const failmp3 = new Audio(incorrect);

  useEffect(() => {
    console.log("sessiosn userDetails", userDetails);
    setLoading(false);
  }, [userDetails]);

  useEffect(() => {
    console.log("sessiosn attendeeList", attendeeList);
  }, [attendeeList]);

  useEffect(() => {
    console.log("sessionAttendees", sessionAttendees);
  }, [sessionAttendees]);

  useEffect(() => {
    console.log("attendee getusersess", getSessionAttendees());
    setSessionAttendees(getSessionAttendees());
    console.log("location");
  }, []);

  useEffect(() => {
    if (superSessions) {
      let sessionAttendeeList =
        location.state.superSessionsx[location.state.selectedDate][
          location.state.selectedTime
        ].confirmed;
      setAttendeeDetails(sessionAttendeeList);
      console.log("attendee supersessions", sessionAttendeeList);
    }
  }, [superSessions]);

  useEffect(() => {
    // let sessionAttendeeList = superSessions.cic.openSessions;
    console.log("attendee openSessions", openSessions);
    console.log("attendee location", location);
    //  console.log("attendee supersessions", sessionAttendeeList);

    let spreadArr = [];
    if (openSessions == "") {
      history.push("/admin");
    } else {
      console.log("attendees supersessionssupersessions", attendeeDetails);
      for (const key in attendeeDetails) {
        if (Object.hasOwnProperty.call(attendeeDetails, key)) {
          const element = attendeeDetails[key];
          console.log("element", element);
          spreadArr.push(element);
        }
      }

      console.log("spreafarr", spreadArr);
      setAttendeeList(spreadArr);
    }
  }, [attendeeDetails]);

  function playSuccessAudio() {
    console.log("hit audio play");
    successmp3.play();
  }

  function playFailAudio() {
    console.log("hit audio play");
    failmp3.play();
  }

  function handleScan(data) {
    let filteredByKey;
    if (data) {
      // setResult({ result: data });
      console.log("scan is ", data);
      console.log("location is ", location.state);
      let sessionConfirmedCheck = attendeeDetails;
      if (sessionConfirmedCheck) {
        console.log("attendeeDetails match is  ", attendeeDetails);
        filteredByKey = Object.fromEntries(
          Object.entries(attendeeDetails).filter(([key, value]) => key === data)
        );
        console.log("filteredByKey", filteredByKey);

        let scanResult = updateAttendance(
          {
            jumaDate: location.state.selectedDate,
            jumaSession: location.state.selectedTime,
            sessionHash: data,
          },
          "entry"
        );
        if (scanResult) {
          playSuccessAudio();
          setResult(scanResult.firstname + " " + scanResult.surname);
          confirmAttendance(scanResult);
        } else {
          setResult("No user in this session");
          playFailAudio();
        }
      } else {
        setResult("No users booked for this session");
        playFailAudio();
      }
    }
  }

  function confirmAttendance(user) {}

  function handleError(err) {
    console.error(err);
  }

  const buttonDetails = {
    b1: {
      buttonText: "Attendees",
      link: "/attendees",
      loading: loading,
      variant: "primary w-100",
      // onclick: handleCancel,
    },
    b2: {
      buttonText: "Return To Dashboard",
      link: "/admin",
      dashboard: true,
      variant: "primary-outline w-100 mt-2",
    },
  };
  function arrivedAttendeeList() {
    let arrivedList = [];
    attendeeList.forEach((item, index) => {
      console.log(" handle key is", index);
      console.log("item is", item);
      arrivedList.push(
        <>
          <ListGroup.Item
            // disabled={showSessions}
            action
            className="d-flex justify-content-between align-items-center"
            //  onClick={(clicked) => handleSelectDate(clicked)}
            key={index}
            id={index}
            href={index}
          >
            <Row className="w-100 text-center">
              <Col xl={5}>
                <div>Name:</div> {item.firstname} {item.surname}
              </Col>

              <Col xl={5}>Mobile: {item.mobile}</Col>
              <Col xl={2}>
                {item.entrytime ? (
                  <IconContext.Provider value={{ color: "green" }}>
                    <BsCheck></BsCheck>
                  </IconContext.Provider>
                ) : (
                  <IconContext.Provider value={{ color: "red" }}>
                    <BsX></BsX>
                  </IconContext.Provider>
                )}
              </Col>
            </Row>
          </ListGroup.Item>
        </>
      );
    });

    console.log("arrivedList", arrivedList);
    return arrivedList;
  }

  function showBody() {
    return (
      <CARD
        className=" border-0 "
        bg="transparent"
        style={{
          WebkitBoxShadow: "5px 5px 5px 3px rgba(0, 0, 0, 0.4)",
          MozBoxShadow: "5px 5px 5px 3px rgba(0, 0, 0, 0.4)",
          boxShadow: "5px 5px 5px 3px rgba(0, 0, 0, 0.4)",
        }}
      >
        <CARD.Header className="h3 text-center text-light border-1">
          <div>{TEXTDEFINITION.BOOKINGS_SESSION_CARD_HEADER}</div>
        </CARD.Header>
        <CARD.Body className="mt-0 pt-0 ">
          <div style={{ height: "50vh" }}>
            <div>
              <QrReader
                delay={1200}
                onError={handleError}
                onScan={handleScan}
                style={{ width: "100%" }}
              />
              <p>{result}</p>
            </div>
          </div>
          {arrivedAttendeeList()}

          <Link className="" to="/admin">
            <Button
              //onClick={handleShow}
              variant="outline-primary-* text-primary col shadow-none"
            >
              {buttonDetails.b2.buttonText}
            </Button>
          </Link>
        </CARD.Body>
      </CARD>
    );
  }

  return (
    <>
      {/*       {loading ? (
        <ShowModal loading={loading} modalDetails={modalDetails} />
      ) : (
        showBody()
      )} */}
      {showBody()}
    </>
  );
}

export default AttendeeScanner;
