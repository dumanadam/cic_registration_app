import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Button,
  ListGroup,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

import SessionList from "../components/SessionList";
import ShowModal from "../components/ShowModal";
import TEXTDEFINITION from "../text/TextDefinition";
import styled from "styled-components";
import FindFriday from "../components/FindFriday";
import WithTemplate from "../components/wrappers/WithTemplate";
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
    globalFridayUnformatted,
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

  useEffect(() => {
    console.log("sessions props", props);
    props.setHeaders(TEXTDEFINITION.BOOKINGS_SESSION_CARD_HEADER);
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
    console.log("session", session);
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
    console.log("sessions handlesubmit loading", loading);
    setModalDetails({
      bodyText: "Booking Session",
    });

    if (!session.jumaSession) {
      setModalDetails({
        bodyText: "Selected Session hasnt changed\n Please try again",
      });
      setTimeout(() => {
        setLoading(false);
        console.log("sessions jumasession loading", loading);
        setModalDetails({ bodyText: TEXTDEFINITION.LOADING_DEFAULT });
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
      setModalDetails({
        bodyText: "Booking Failed, Try again in 5 mins",
      });
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
        setModalDetails({ bodyText: e.message });
        setTimeout(() => {
          console.log("sessions handlecancel promise loading", loading);
          setLoading(false);
          setModalDetails({ bodyText: TEXTDEFINITION.LOADING_DEFAULT });
        }, 1000);
      })
      .finally(() => {
        // setLoading(false);
      });
  }

  function handleClick(time) {
    console.log("time", time);
    console.log("jumadate", globalFridayUnformatted.substring(7));
    let toMD5 = {
      firstname: userDetails.firstname,
      surname: userDetails.surname,
      jumaDate: globalFridayUnformatted.substring(7),
      jumaSession: time,
    };

    setSession({
      jumaSession: time,
      jumaDate: globalFridayUnformatted,
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

  function checkJuma() {
    if (userDetails.jumaDate) {
      return (
        <>
          <Row>
            <Col>
              <div className=" text-center w-100">
                {TEXTDEFINITION.SESSIONS_CONFIRMED_JUMA}
              </div>
              <div className=" text-center w-100"> {session.jumaDate}</div>
            </Col>
            <Col>
              <Button
                disabled={loading}
                variant="danger w-100 border-0 mt-2"
                onClick={handleCancel}
              >
                Cancel Session
              </Button>
            </Col>
          </Row>
        </>
      );
    } else {
      return (
        <>
          <div className=" text-center w-100">
            {TEXTDEFINITION.SESSIONS_NEXT_JUMA}
          </div>
          <div className=" text-center w-100"> {globalFridayUnformatted}</div>
        </>
      );
    }
  }

  function showBody(params) {
    return (
      <>
        {checkJuma()}
        <div className="text-center mb-2 mt-3 text-light">
          <strong>
            <u>Available Sessions</u>
          </strong>
        </div>{" "}
        <ListGroup
          className="d-flex justify-content-between align-items-center w-100 "
          defaultActiveKey={listKey}
        >
          {loading
            ? null
            : SessionList(
                listKey,
                latestSessionTimes,
                handleClick,
                openSessions,
                userDetails,
                globalFridayUnformatted
              )}
        </ListGroup>
        <div className="text-center pb-4">
          <strong className=" mr-2">Selected Session :</strong>
          {session.jumaSession}
        </div>
        {/* {showButtons()} */}
      </>
    );
  }

  function showButtons() {
    return (
      <Container className="p-0 pt-2">
        <Form onSubmit={handleSubmit}>
          <Button disabled={loading} className="w-100" type="submit">
            {checkButton()}
          </Button>
          <Link className="text-light " to="/">
            <Button
              disabled={loading}
              variant="outline-light w-100 mt-2 border-0"
            >
              Dashboard
            </Button>
          </Link>
        </Form>
      </Container>
    );
  }
  function checkButton() {
    if (userDetails.jumaDate) {
      return "Update Session";
    } else {
      return "Book Session";
    }
  }
  return (
    <>
      <WithTemplate
        buttons={showButtons()}
        modal={{ loading: loading, modalText: "sessions text" }}
      >
        {showBody()}
      </WithTemplate>
    </>
  );
}
