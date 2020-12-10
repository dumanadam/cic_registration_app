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
  } = useAuth();
  const [error, setError] = useState("");
  const [session, setSession] = useState({});
  const [latestSessionTimes, setLatestSessionTimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState("Nada");
  const [listKey, setListKey] = useState("");
  const [bookingAvailability, setBookingAvailability] = useState(0);
  const [attendeeDetails, setAttendeeDetails] = useState({});
  const history = useHistory();
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
    console.log("attendee openSessions", openSessions);
    console.log(
      "attendees",
      openSessions[location.state.selectedDate][location.state.selectedTime]
        .confirmed
    );
  }, [openSessions]);

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
      let sessionConfirmedCheck =
        openSessions[location.state.selectedDate][location.state.selectedTime]
          .confirmed;
      if (sessionConfirmedCheck) {
        console.log(
          "Opensession match is  ",
          openSessions[location.state.selectedDate][location.state.selectedTime]
            .confirmed
        );
        filteredByKey = Object.fromEntries(
          Object.entries(
            openSessions[location.state.selectedDate][
              location.state.selectedTime
            ].confirmed
          ).filter(([key, value]) => key === data)
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

  function handleError(err) {
    console.error(err);
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
