import React, { useState, useEffect } from "react";
import {
  Card,
  Alert,
  Form,
  Button,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { FiUserCheck } from "react-icons/fi";
import PageTitle from "../components/PageTitle";
import NavButtons from "../components/NavButtons";
import ShowModal from "../components/ShowModal";
var QRCode = require("qrcode.react");

export default function SessionConfirmed(confirmedSession) {
  const { userDetails, bookSession } = useAuth();
  const [error, setError] = useState("");
  const [session, setSession] = useState({});

  const [pageTitle, setpageTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [modalDetails, setModalDetails] = useState({});
  const sessionOptions = [{ label: "Send QR Code email" }];

  useEffect(() => {
    console.log("userDetails", userDetails);
    if (userDetails.firstname) {
      setLoading(false);
    }
  }, [userDetails]);

  useEffect(() => {
    setModalDetails({
      bodyText: "Connecting to CIC",
    });
  }, []);

  function sessionSettings() {
    return sessionOptions.map((option) => (
      <div key={`default-radio`} className="mt-1 text-center">
        <Form.Check type={"radio"} id={option.label} label={option.label} />
      </div>
    ));
  }

  function formatSessionDetails() {
    let sessionDetails = [
      {
        title: "Confirmed",
        text: <FiUserCheck></FiUserCheck>,
      },
      {
        title: "Session",
        text: userDetails.jumaSession,
      },
      {
        title: "Date",
        text: userDetails.jumaDate.substring(7),
      },
    ];

    return sessionDetails.map((detail) => (
      <div className="row ">
        <div className="col text-right">
          <strong className="ml-5 pl-5   text-primary">{detail.title}</strong>
        </div>
        <div className="col text-left">
          <span className="text-success">{detail.text}</span>
        </div>
      </div>
    ));
  }
  const buttonDetails = {
    b1: {
      buttonText: "Update Session",
      link: "/sessions",
      loading: loading,
      variant: "primary w-100",
      // onclick: handleCancel,
    },
    b2: {
      buttonText: "Return To Dashboard",
      link: "/",
      dashboard: true,
      variant: "primary-outline w-100 mt-2",
    },
    b3: {
      buttonText: "Return To Dashboard",
      link: "/",
      dashboard: true,
      variant: "primary-outline w-100 mt-2",
    },
  };
  return (
    <>
      {loading === true ? (
        <ShowModal loading={loading} modalDetails={modalDetails} />
      ) : (
        <Card>
          <Card.Header className="h3 text-center" style={{ color: "#004619" }}>
            Booking Confirmed
          </Card.Header>
          <Card.Body className="mt-0 pt-0 ">
            <div style={{ height: "50vh" }}>
              <div className="pt-4 text-center w-100">
                <QRCode
                  style={{}}
                  renderAs="SVG"
                  value={userDetails.sessionHash}
                  fgColor="#004619"
                  //bgColor="#faa61a"
                />
              </div>
              <Card.Title className="pt-4 text-left">
                {userDetails.jumaSession}
              </Card.Title>
              <Card.Subtitle className="text-muted text-left">
                {userDetails.jumaDate}
              </Card.Subtitle>
              <Card.Title className="pt-4 text-left">Please Note : </Card.Title>
              <Card.Subtitle className=" text-muted text-left">
                Screenshot or take a photo with your phone. Please show CIC
                staff on arrival.
              </Card.Subtitle>
            </div>
            <Link className="" to="/sessions">
              <Button disabled={loading} variant="primary w-100 ">
                {buttonDetails.b1.buttonText}
              </Button>
            </Link>
            <Link className="" to="/">
              <Button
                //onClick={handleShow}
                variant="outline-primary-* text-primary col shadow-none"
              >
                {buttonDetails.b2.buttonText}
              </Button>
            </Link>
          </Card.Body>
        </Card>
      )}
    </>
  );
}
