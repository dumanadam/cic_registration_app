import React, { useRef, useState, useEffect } from "react";
import { Card, Form, Button, Alert, ListGroup, Badge } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";
var QRCode = require("qrcode.react");

export default function Sessions() {
  const passwordRef = useRef();
  const { currentUser, userDetails, bookSession } = useAuth();
  const [error, setError] = useState("");
  const [session, setSession] = useState({});
  const [latestQr, setLatestQr] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const sessionTimes = [
    { time: "1:30 pm" },
    { time: "2:30 pm" },
    { time: "3:30 pm" },
  ];

  useEffect(() => {
    console.log("session", session);
  }, [session]);

  useEffect(() => {
    setSession(findFriday());
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const promises = [];
    promises.push(bookSession(session));
    Promise.all(promises)
      .then(() => {
        history.push("/");
      })
      .catch(() => {
        setError("Failed to Update Account");
        console.log("delete error=>", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function findFriday() {
    const dayINeed = 5;
    const today = moment().isoWeekday();
    let nextFriday;

    if (today <= dayINeed) {
      // then just give me this week's instance of that day
      nextFriday = moment().isoWeekday(dayINeed).format("dddd DD/MM/YYYY");
    } else {
      // otherwise, give me *next week's* instance of that same day
      nextFriday = moment()
        .add(1, "weeks")
        .isoWeekday(dayINeed)
        .format("dddd DD/MM/YYYY");
    }

    return {
      jumaDate: nextFriday,
      jumaSession: "1:30 pm",
    };
  }

  function handleClick(index) {
    //console.log("index is ", index);
    setSession({
      ...session,
      jumaSession: sessionTimes[index].time,
    });
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">CIC Juma Bookings</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <div>
            <strong className="mt-3 mr-5">Next Juma Date :</strong>{" "}
            {session.jumaDate}
          </div>
          <div>
            <div className="text-center mb-4 mt-4 text-">
              <strong>
                <u>Available Sessions</u>
              </strong>
            </div>{" "}
            <ListGroup
              className="mt-3 mb-5 ml-3 d-flex justify-content-between align-items-center"
              defaultActiveKey="#130"
            >
              <ListGroup.Item
                action
                href="#130"
                className="d-flex justify-content-between align-items-center"
                onClick={() => handleClick(0)}
              >
                1:30 pm
                <Badge variant="warning" pill>
                  14
                </Badge>
              </ListGroup.Item>
              <ListGroup.Item
                action
                href="#230"
                className="d-flex justify-content-between align-items-center"
                onClick={() => handleClick(1)}
              >
                2:30 pm
                <Badge variant="warning" pill>
                  6
                </Badge>
              </ListGroup.Item>
              <ListGroup.Item
                action
                href="#sessionc"
                className="d-flex justify-content-between align-items-center"
                onClick={() => handleClick(2)}
              >
                3:30 pm
                <Badge variant="warning" pill>
                  25
                </Badge>
              </ListGroup.Item>
            </ListGroup>
          </div>
          <div className="text-center mb-4 mt-4">
            <strong className="mt-3 mr-2">Selected Session :</strong>
            {session.jumaSession}
          </div>{" "}
          <Form onSubmit={handleSubmit}>
            <Button disabled={loading} className="w-100" type="submit">
              Book Session
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link to="/">Cancel</Link>
      </div>
    </>
  );
}
