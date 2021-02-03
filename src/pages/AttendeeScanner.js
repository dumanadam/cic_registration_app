import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Button,
  ListGroup,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
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
  const [sessionBookedHashs, setSessionBookedHashs] = useState({});
  const [attendeeDetails, setAttendeeDetails] = useState({});
  const history = useHistory();
  const [attendeeList, setAttendeeList] = useState([]);
  const [attendeeListDiv, setAttendeeListDiv] = useState([]);
  const [scanErrorMsg, setScanErrorMsg] = useState(undefined);
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
    if (!!superSessions) {
      let userCards = [];
      let bookedHashListArr = [];
      let bookedHashs =
        superSessions[location.state.selectedDate][location.state.selectedTime]
          .booked;
      setSessionBookedHashs(bookedHashs);
      console.log("attendee supersessions bookedHashs", bookedHashs);

      for (const userSessionHash in bookedHashs) {
        if (
          Object.hasOwnProperty.call(bookedHashs, userSessionHash) &&
          bookedHashs[userSessionHash].userCancelBooking !== true
        )
          bookedHashListArr.push(bookedHashs[userSessionHash]);
      }
      bookedHashListArr.forEach((singleUser, index) => {
        console.log("singleUser is", singleUser);
        console.log("singleUser is time", singleUser.entryTime);

        userCards.push(
          <>
            <ListGroup.Item
              // disabled={showSessions}
              action
              className="d-flex justify-content-between align-items-center"
              //  onClick={(clicked) => handleSelectDate(clicked)}
              key={index}
              id={index}
              href={index}
              variant="light"
            >
              <Row className="w-100 text-center">
                <Col xl={5}>
                  <div>
                    {" "}
                    {singleUser.firstname} {singleUser.surname}
                  </div>
                </Col>

                <Col xl={5}>{singleUser.mobileNum}</Col>
                <Col xl={2}>
                  {singleUser.entryTime ? (
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

      console.log("userCards", userCards);
      setAttendeeListDiv(userCards);
    }
  }, [superSessions]);

  function playSuccessAudio() {
    console.log("hit audio play");
    successmp3.play();
  }

  function playFailAudio() {
    console.log("hit audio play");
    failmp3.play();
  }

  function handleScan(data) {
    if (data) {
      console.log("scan is ", data);

      console.log("sessionBookedHashs is ", sessionBookedHashs);

      if (sessionBookedHashs) {
        let scannedUserDetails = Object.fromEntries(
          Object.entries(sessionBookedHashs).filter(
            ([key, value]) => key === data
          )
        );
        //  console.log("scannedUserDetails", scannedUserDetails[data].uid);
        console.log("scannedUserDetails ", scannedUserDetails);
        console.log(
          "scannedUserDetails data type",
          typeof scannedUserDetails.entryTime
        );

        if (scannedUserDetails.entryTime === undefined) {
          let scanResult = updateAttendance(
            {
              jumaDate: location.state.selectedDate,
              jumaSession: location.state.selectedTime,
              sessionHash: data,
              uid: scannedUserDetails[data].uid,
            },
            "entry"
          );
          if (scanResult) {
            playSuccessAudio();
            setResult({
              firstname: scannedUserDetails[data].firstname,
              surname: scannedUserDetails[data].surname,
              mobileNum: scannedUserDetails[data].mobileNum,
            });
          }
        } else {
          let formattedEntryTime = new Date(
            parseInt(scannedUserDetails[data].entryTime)
          ).toLocaleString();

          console.log(formattedEntryTime);
          setScanErrorMsg("User already entered at " + formattedEntryTime);
          setTimeout(() => {
            setScanErrorMsg(undefined);
          }, 5000);
          console.log();
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

  function showBody() {
    let errorMsgCardClass = "mt-2 mb-2 align-items-center";
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
          <div>
            <div>
              <QrReader
                delay={1200}
                onError={handleError}
                onScan={handleScan}
                style={{ width: "100%" }}
              />
            </div>

            <ListGroup.Item
              // disabled={showSessions}
              action
              variant="secondary"
              className="d-flex justify-content-between align-items-center"
              //  onClick={(clicked) => handleSelectDate(clicked)}
              key={1}
              id={1}
              active
            >
              <Row className="w-100 text-center align-items-center ">
                <Col xl={6} xs={6}>
                  Last Entry :{" "}
                </Col>
                <Col xl={6} xs={6}>
                  <p>{result.firstname + " " + result.surname}</p>
                  <div>{result.mobileNum}</div>
                </Col>
              </Row>
            </ListGroup.Item>
          </div>

          <Card
            border={!!scanErrorMsg ? "danger" : "border-0"}
            bg={!!scanErrorMsg ? "danger" : "transparent"}
            className={
              !!scanErrorMsg
                ? errorMsgCardClass
                : errorMsgCardClass + " border-0"
            }
          >
            <Card.Body className="d-flex p-0 ">
              <Card.Text className="">
                {!!scanErrorMsg ? (
                  <div
                    style={{ height: "2rem" }}
                    className="d-flex align-items-center text-center"
                  >
                    {" "}
                    {scanErrorMsg}
                  </div>
                ) : (
                  <div style={{ height: "2rem" }}> </div>
                )}
              </Card.Text>
            </Card.Body>
          </Card>

          <ListGroup.Item
            // disabled={showSessions}
            action
            className="d-flex justify-content-between align-items-center mt-0 mb-0"
            //  onClick={(clicked) => handleSelectDate(clicked)}
            key={1}
            id={1}
            active
          >
            <Row className="w-100 text-center">
              <Col xl={5}>
                <div>Name</div>
              </Col>

              <Col xl={5}>Mobile </Col>
              <Col xl={2}>
                {" "}
                <IconContext.Provider value={{ color: "green" }}>
                  <BsCheck></BsCheck>
                </IconContext.Provider>
              </Col>
            </Row>
          </ListGroup.Item>
          <ListGroup variant="flush">{attendeeListDiv}</ListGroup>
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
