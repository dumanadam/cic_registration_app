import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Button,
  ListGroup,
  Row,
  Col,
  Container,
  InputGroup,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

import SessionList from "../components/SessionList";
import ShowModal from "../components/ShowModal";
import TEXTDEFINITION from "../text/TextDefinition";
import styled from "styled-components";
import FindFriday from "../components/FindFriday";
import WithTemplate from "../components/wrappers/WithTemplate";
import {
  BsChevronBarRight,
  BsChevronBarLeft,
  BsGearFill,
} from "react-icons/bs";
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

export default function Sessions(props) {
  const {
    openSessions,
    userDetails,
    bookSession,

    globalFridayNF,
  } = useAuth();
  const [error, setError] = useState("");
  const [session, setSession] = useState({});
  const [latestSessionTimes, setLatestSessionTimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [listKey, setListKey] = useState("");
  const history = useHistory();
  const [modalDetails, setModalDetails] = useState({
    bodyText: TEXTDEFINITION.LOADING_DEFAULT,
  });
  const [modalText, setModalText] = useState(undefined);

  useEffect(() => {
    console.log("sessions props", props);
    console.log(" globalFridayNF, ", globalFridayNF);
    props.setHeaders(TEXTDEFINITION.BOOKINGS_SESSION_CARD_HEADER);
    setSession({
      jumaDate: !!userDetails.jumaDate ? userDetails.jumaDate : globalFridayNF,
    });
  }, []);

  useEffect(() => {
    console.log("session userDetails", userDetails);
  }, [userDetails]);

  /*   useEffect(() => {
    console.log("sessiosn listkey", listKey);
  }, [listKey]); */

  /*   useEffect(() => {
    console.log("session obj", session);
  }, [session]); */

  /*   useEffect(() => {
    //  console.log("session", session);
  }, [session]); */

  useEffect(() => {
    console.log("userDetails", userDetails);
    console.log("session+++", session);
  }, [session]);

  useEffect(() => {
    console.log("session loading", loading);
  }, [loading]);

  useEffect(() => {
    console.log("session openSessions", openSessions);
    console.log("session modaldetails", modalDetails);
    console.log("session modaldetails", TEXTDEFINITION.LOADING_DEFAULT);
    if (
      openSessions &&
      modalDetails.bodyText === TEXTDEFINITION.LOADING_DEFAULT
    ) {
      setModalText("Getting latest sessions");
      getSessionTimes();
      setListKey(checkKey());
      setLoading(false);
      console.log("sessions opensessions loading", loading);
    }
  }, [openSessions]);

  function getSessionTimes() {
    let sessionTimes = Object.keys(openSessions);
    console.log("sessionTimes", sessionTimes);
    console.log("Object.keys(openSessions)[0]", Object.keys(openSessions)[0]);
    let friday = FindFriday(1, true);
    console.log("friday", friday);
    let sessionTimes2 = Object.keys(
      openSessions[Object.keys(openSessions)[0]]
    ).map((key) => {
      //console.log("mapkey", key);
      return { time: key };
    });
    //let sessionTimes2 = Object.keys(openSessions[friday]);
    console.log("sessionTimes2", sessionTimes2);
    setLatestSessionTimes(sessionTimes2);
  }

  async function handleSubmit(e) {
    let currentUserSession = {
      jumaDate: userDetails.jumaDate,
      jumaSession: userDetails.jumaSession,
      sessionHash: userDetails.sessionHash,
    };
    e.preventDefault();
    setLoading(true);
    setModalText("Booking Session");

    if (
      !session.jumaSession ||
      session.jumaSession === listKey.substring(1, 8)
    ) {
      setModalText("Selected Session hasnt changed\n Please try again");

      setTimeout(() => {
        setLoading(false);
        console.log("sessions jumasession loading", loading);
        setModalText(TEXTDEFINITION.LOADING_DEFAULT);
      }, 2000);
      return;
    }
    let cancelBooking = false;
    let bookingResult = await bookSession(
      session,
      currentUserSession,
      cancelBooking
    );
    console.log("booksession res", bookingResult);
    if (!!bookingResult) {
      history.push("/session-confirmed");
    } else {
      setLoading(true);
      setModalText("Booking Failed, Try again in 5 mins");

      setTimeout(() => {
        history.push("/");
      }, 1000);
    }
  }

  function handleCancel(e) {
    console.log("hit submit");
    let currentUserSession = {
      jumaDate: userDetails.jumaDate,
      jumaSession: userDetails.jumaSession,
      sessionHash: userDetails.sessionHash,
    };
    e.preventDefault();
    console.log("sessions handlecancel loading", loading);
    setLoading(true);

    const promises = [];
    promises.push(
      bookSession(
        {
          jumaDate: "",
          jumaSession: "",
        },
        currentUserSession,
        true
      )
    );
    Promise.all(promises)
      .then(() => {
        history.push("/");
      })
      .catch((e) => {
        console.log("delete error=>", error);
        console.log("delete error=>", e);
        setModalText(e.message);
        setTimeout(() => {
          console.log("sessions handlecancel promise loading", loading);
          // setLoading(false);
          setModalText(TEXTDEFINITION.LOADING_DEFAULT);
        }, 1000);
      })
      .finally(() => {
        // setLoading(false);
      });
  }

  function handleClick(time) {
    console.log("time+++", time);
    console.log("jumadate+++", globalFridayNF);
    console.log("listke+++", listKey.substring(1, 8));
    let toMD5 = {
      firstname: userDetails.firstname,
      surname: userDetails.surname,
      jumaDate: globalFridayNF,
      jumaSession: time,
    };

    setSession({
      jumaSession: time,
      jumaDate: globalFridayNF,
      sessionHash: md5Qr(JSON.stringify(toMD5)),
    });
  }

  function checkKey() {
    if (userDetails.jumaSession === "") {
      return "#" + "2:30 pm";
    } else {
      return "#" + userDetails.jumaSession;
    }
  }

  function checkUserSession() {
    if (userDetails.jumaDate) {
      return (
        <>
          <Col className="text-light col p-0 mr-2 ">
            <Link to="/">
              <Button
                disabled={loading}
                variant="danger w-100"
                onClick={handleCancel}
              >
                Cancel Booking
              </Button>
            </Link>
          </Col>
        </>
      );
    }
  }

  function showBody(params) {
    return (
      <>
        <div className="text-center mb-2 mt-3 text-light" style={{}}></div>

        <ListGroup
          className="d-flex justify-content-between align-items-center w-100 "
          defaultActiveKey={listKey}
        >
          <div
            style={{
              position: "relative",

              minWidth: "75vw",
              marginBottom: "8vh",
            }}
          ></div>
          {loading
            ? null
            : SessionList(
                listKey,
                latestSessionTimes,
                handleClick,
                openSessions,
                userDetails,
                globalFridayNF
              )}
        </ListGroup>
        {/*         <div className="pb-4 mt-4 text-warning">
          <strong className=" mr-2 ">Selected Session :</strong>
          {session.jumaSession}
        </div> */}
        <Container
          style={{
            minHeight: "7vh",
            marginTop: "6vh",
            borderTop: "1px solid white",
          }}
        >
          <Row>
            <Col>
              <div className="mt-4 mb-2 text-warning">
                <strong>Booking Details</strong>
              </div>
            </Col>
          </Row>
          <Row className="d-flex align-items-center text-light ">
            <Col xs={5}>
              <Card
                style={{
                  border: "0px ",
                  minHeight: "7vh",
                  backgroundColor: "transparent",
                  //border: "1px solid white",
                }}
                className="d-flex align-items-center text-light justify-content-center "
              >
                <div>
                  {userDetails.jumaDate ? userDetails.jumaDate : "No Booking"}
                </div>
                <div>{userDetails.jumaSession}</div>
              </Card>
            </Col>
            <Col xs={2}>
              <BsChevronBarRight
                size={25}
                color="#ffc107 "
                style
              ></BsChevronBarRight>
            </Col>
            <Col xs={5}>
              <Card
                style={{
                  border: "0px ",
                  minHeight: "7vh",
                  backgroundColor: "transparent",
                }}
                className="d-flex align-items-center text-light justify-content-center "
              >
                <div>{session.jumaDate}</div>
                <div>{session.jumaSession}</div>
              </Card>
            </Col>
          </Row>
        </Container>
        {/* {showButtons()} */}
      </>
    );
  }

  function showButtons() {
    return (
      <>
        <Row className="w-100">
          {checkUserSession()}

          <Col className="text-light p-0 ">
            <Button
              disabled={loading}
              variant="primary w-100"
              onClick={(e) => handleSubmit(e)}
            >
              {checkButton()}
            </Button>
          </Col>
        </Row>

        <Link className="text-light " to="/">
          <Button
            disabled={loading}
            variant="outline-light w-100 mt-2 border-0"
          >
            Dashboard
          </Button>
        </Link>
      </>
    );
  }
  function checkButton() {
    if (userDetails.jumaDate) {
      return "Change Session";
    } else {
      return "Book Session";
    }
  }
  return (
    <>
      <WithTemplate
        buttons={showButtons()}
        modal={{ loading: loading, modalText: modalText }}
      >
        {showBody()}
      </WithTemplate>
    </>
  );
}
