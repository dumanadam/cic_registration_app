import React, { useRef, useState } from "react";
import { Card, Form, Button, Alert, ListGroup, Badge } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import Moment from "react-moment";
import moment from "moment";

export default function Sessions() {
  const passwordRef = useRef();
  const { currentUser, updatePassword, updateEmail } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (passwordRef.current.value) {
      /* 
        .then(function () {
          // User deleted.
          history.push("/");
        })
        .catch(function (error) {
          // An error happened.
          setError("Failed to Delete Account");
          console.log("delete error=>", error);
        })
        .finally(() => {
          setLoading(false);
        }); */
    }
  }

  const next = moment().day(12);
  const dayINeed = 5;
  const today = moment().isoWeekday();
  var nextFriday;

  if (today <= dayINeed) {
    // then just give me this week's instance of that day
    nextFriday = moment().isoWeekday(dayINeed);
  } else {
    // otherwise, give me *next week's* instance of that same day
    nextFriday = moment().add(1, "weeks").isoWeekday(dayINeed);
  }

  function handleClick(index) {
    console.log("index is ", index);
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">CIC Juma Bookings</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <div>
            <strong className="mt-3 mr-5">Next Juma Date :</strong>{" "}
            <Moment format="DD/MM/YY">{nextFriday}</Moment>
          </div>
          <div>
            <div className="text-center mb-4 mt-4">
              <strong>Sessions Available :</strong>
            </div>{" "}
            <ListGroup
              className="mt-3 mb-5 ml-3 d-flex justify-content-between align-items-center"
              defaultActiveKey="#sessiona"
            >
              <ListGroup.Item
                action
                href="#sessionsa"
                className="d-flex justify-content-between align-items-center"
              >
                1:30 pm
                <Badge variant="warning" pill>
                  14
                </Badge>
              </ListGroup.Item>
              <ListGroup.Item
                variant="danger"
                action
                href="#sessionb"
                className="d-flex justify-content-between align-items-center"
                onClick={() => handleClick("sessionb")}
              >
                2:30 pm
                <Badge variant="warning" pill>
                  6
                </Badge>
              </ListGroup.Item>
              <ListGroup.Item
                variant="warning"
                action
                href="#sessionc"
                className="d-flex justify-content-between align-items-center"
                onClick={() => handleClick("sessionc")}
              >
                3:30 pm
                <Badge variant="warning" pill>
                  25
                </Badge>
              </ListGroup.Item>
            </ListGroup>
          </div>
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
