import React, { useRef, useState, useEffect } from "react";

import { Link, useHistory, useLocation } from "react-router-dom";
import CustomLink from "../components/CustomLink";

import {
  Button,
  Card,
  Alert,
  Row,
  Col,
  Form,
  ListGroup,
  Badge,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import TEXTDEFINITION from "../text/TextDefinition";
import ShowModal from "./ShowModal";

function Attendees(props) {
  const { currentUser, logout, userDetails, openSessions } = useAuth();
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [showAttendees, setShowAttendees] = useState("");
  const location = useLocation();
  const [session, setSession] = useState("");
  const sessionTimes = [
    { time: "1:30 pm" },
    { time: "2:30 pm" },
    { time: "3:30 pm" },
  ];
  useEffect(() => {
    console.log("attendee openSessions", openSessions);
  }, [openSessions]);

  useEffect(() => {
    console.log("attendee user details", userDetails);
  }, [userDetails]);

  useEffect(() => {
    console.log("attendee session", session);
    console.log("openSessions[session]", openSessions[session]);
  }, [session]);

  useEffect(() => {
    // console.log(location.pathname); // result: '/secondpage'
    console.log(location.search.substring(1)); // result: '?query=abc'
    console.log(location.state); // result: 'some_value'

    console.log("props.location.state", props.location);
    setSession(location.search.substring(1));
  }, [location]);

  function SessionList() {
    function loopSessions() {
      /*     let sessionDates = Object.keys(openSessions[session]).map(function (
        key,
        index
      ) {
        console.log("key is", key);
        console.log("index is", index);
        return (
          <>
            <ListGroup.Item
              action
              href={"#"}
              className="d-flex justify-content-between align-items-center"
              key={key}
              id={key}
            >
              <Row className="w-100">
                <Col xl={10}>{key}</Col>
                <Col xl={2}>{index}</Col>
              </Row>
            </ListGroup.Item>
          </>
        );
      });
      console.log("sessionDates", sessionDates);
      return sessionDates; */
    }

    return (
      <ListGroup className="pt-3 pb-3 d-flex justify-content-between align-items-center w-100">
        {loopSessions()}
      </ListGroup>
    );
  }

  return (
    <div className="text-light">
      {session == "" ? (
        <ShowModal
          loading={loading}
          modalDetails={{ bodyText: "Connecting to CIC" }}
        ></ShowModal>
      ) : (
        SessionList()
      )}
    </div>
  );
}

export default Attendees;
