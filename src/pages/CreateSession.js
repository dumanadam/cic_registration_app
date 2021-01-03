import React, { useRef, useState, useEffect } from "react";
import exports from "../components/styling/CardStyling";
import { Link, useHistory } from "react-router-dom";

import {
  Button,
  Card,
  Alert,
  Row,
  Col,
  Form,
  Tabs,
  Tab,
  Nav,
  ButtonGroup,
  ToggleButton,
  ToggleButtonGroup,
  Dropdown,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import moment from "moment";
import PageTitle from "../components/PageTitle";
import TEXTDEFINITION from "../text/TextDefinition.js";
import NavButtons from "../components/NavButtons";
import PrivacyPolicy from "../components/PrivacyPolicy";
import myStyle from "../components/styling/CardStyling";
import ShowModal from "../components/ShowModal";
import SessionList from "../components/SessionList";
import FindFriday from "../components/FindFriday";
import FormatTimeFirebase from "../components/FormatTimeFirebase";

function CreateSession() {
  const [error, setError] = useState("");
  const { createSessions, logout, userDetails, globalFriday } = useAuth();
  const [checkState, setcheckState] = useState(false);
  const [formPage, setFormPage] = useState(1);
  const [pageTitle, setpageTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const [adminNavButtons, setAdminNavButtons] = useState("");
  const [maxPerSession, setMaxPerSession] = useState(50);

  const history = useHistory();
  const [modalDetails, setModalDetails] = useState({
    bodyText: TEXTDEFINITION.LOADING_DEFAULT,
  });
  const firstJumaSession = [
    "12:00 PM",
    "12:30 PM",
    "13:00 PM",
    "13:30 PM",
    "14:00 PM",
    "14:30 PM",
  ];

  const timeBetwwenSession = ["30 min", "1 hr", "1 hr 30", "2 hrs"];

  const [selectedSessiontime, setSelectedSessiontime] = useState(
    firstJumaSession[0]
  );
  const [selectedSessionInterval, setSelectedSessionInterval] = useState(
    timeBetwwenSession[1]
  );
  const bookingsText = [
    { title: "Next Juma :", detail: userDetails.jumaDate },
    { title: "How many weeks to repeat?", detail: userDetails.jumaSession },
    { title: "How many sessions?", detail: userDetails.jumaSession },
    {
      title: "When does the first session start?",
      detail: userDetails.jumaSession,
    },
    { title: "Time between each session?", detail: userDetails.jumaSession },
    { title: "Max people per session?", detail: userDetails.jumaSession },
  ];

  const sessionOptions = [{ label: "Send QR Code email" }];
  let buttonDetails = {
    b1: {
      buttonText: userDetails.jumaDate ? "Update Session" : "Create Session",
      link: "/create-session",
      variant: "primary w-100",
      loading: loading,
    },
    b2: {
      buttonText: "Update Profile",
      variant: "primary w-100",
      link: "/update-profile",
      loading: loading,
    },
    b3: {
      buttonText: "Logout",
      variant: "outline-light w-100 border-0 mt-2",
      link: "/",
      loading: loading,
    },
  };

  useEffect(() => {
    console.log("formPage", formPage);
  }, [formPage]);

  useEffect(() => {
    console.log("maxPerSession", maxPerSession);
  }, [maxPerSession]);

  useEffect(() => {
    console.log("userDetails", userDetails);
    if (userDetails.firstname) {
      setLoading(false);
    }
  }, [userDetails]);

  useEffect(() => {
    setpageTitle(PageTitle("Dashboard"));
    console.log("Dashboard userDetails", userDetails);
    setAdminNavButtons(NavButtons(3, buttonDetails));
  }, []);

  useEffect(() => {
    setAdminNavButtons(NavButtons(3, buttonDetails));
  }, [NavButtons]);

  function sessionButton() {
    if (userDetails.jumaDate === "") {
      return (
        <Link to="/sessions" className="btn btn-primary  mt-3 mr-1">
          Book Session
        </Link>
      );
    } else {
      return (
        <Link to="/sessionConfirmed" className="btn btn-primary  mt-3 mr-1">
          View QrCode
        </Link>
      );
    }
  }

  function sessionSettings() {
    return sessionOptions.map((option) => (
      <div key={`default-radio`} className="mt-1 text-center">
        <Form.Check type={"radio"} id={option.label} label={option.label} />
      </div>
    ));
  }

  function sessionCheck(params) {
    return (
      <div className="text-light  ">
        <div className="text-center w-100">
          {TEXTDEFINITION.JUMA_BOOKED_CHECK}

          {userDetails.jumaDate}
        </div>
      </div>
    );
  }

  function showBody(params) {
    function checkBackButton() {
      if (formPage == 1) {
        history.push("/admin");
      } else {
        setFormPage(formPage - 1);
      }
    }

    function createUploadObject() {
      let sessionUploadObject = {};

      for (let index = 1; index <= weeksQty; index++) {
        let sessionDateString = FindFriday(index, true);
        sessionUploadObject.openSessions = {
          ...sessionUploadObject.openSessions,

          [sessionDateString]: {},
        };
        console.log("sessionDateString", sessionDateString);
        for (let index = 0; index < sessionQty; index++) {
          let time = FormatTimeFirebase(selectedSessiontime, index);

          console.log("time", time);
          sessionUploadObject.openSessions[sessionDateString] = {
            ...sessionUploadObject.openSessions[sessionDateString],

            [time]: {
              maxPerSession: parseInt(maxPerSession),
              full: false,
              currentBooked: 0,
              confirmed: "",
            },
          };
        }
      }

      return sessionUploadObject;
    }

    function checkNextButton() {
      if (formPage === 3) {
        setModalDetails({ bodyText: "Uploading to server" });
        setLoading(true);

        let formattedSessions = createUploadObject();

        const promises = [];
        promises.push(
          createSessions(formattedSessions, userDetails.company.melbourne.cic)
        );
        Promise.all(promises)
          .then(() => {
            history.push("/admin");
          })
          .catch((e) => {
            console.log("create session return error=>", e);
            setModalDetails({ bodyText: e.message });
            setTimeout(() => {
              setLoading(false);
              setModalDetails({ bodyText: TEXTDEFINITION.LOADING_DEFAULT });
            }, 1000);
          })
          .finally(() => {
            setLoading(false);
            setModalDetails({ bodyText: TEXTDEFINITION.LOADING_DEFAULT });
          });
      } else {
        setFormPage(formPage + 1);
      }
    }

    return (
      <myStyle.CARD
        className=" border-0 "
        bg="transparent"
        style={{
          WebkitBoxShadow: "5px 5px 5px 3px rgba(0, 0, 0, 0.4)",
          MozBoxShadow: "5px 5px 5px 3px rgba(0, 0, 0, 0.4)",
          boxShadow: "5px 5px 5px 3px rgba(0, 0, 0, 0.4)",
        }}
      >
        <myStyle.CARD.Header className="h3 text-center text-light border-1">
          <div>{TEXTDEFINITION.CR_SESSION_CARD_HEADER}</div>
          {console.log("userDetails", userDetails)}
        </myStyle.CARD.Header>
        <myStyle.CARD.Body className="mt-0 pt-0 ">
          <div style={{ height: "50vh" }}>{tabs()}</div>
          <Button
            disabled={loading}
            className="w-100"
            onClick={() => checkNextButton()}
          >
            Next Step
          </Button>

          <Button
            disabled={loading}
            variant="outline-light w-100 border-0 mt-2"
            onClick={() => checkBackButton()}
          >
            Back
          </Button>
        </myStyle.CARD.Body>
      </myStyle.CARD>
    );
  }

  function tabs() {
    return (
      <Tabs
        id="controlled-tab-example"
        activeKey={formPage}
        onSelect={(k) => setFormPage(k)}
        justify
        variant="pills"
      >
        <Tab eventKey="1" title="Step 1" disabled>
          {tab1()}
        </Tab>
        <Tab eventKey="2" title="Step 2" disabled>
          {tab2()}
        </Tab>
        <Tab eventKey="3" title="Step 3" disabled>
          {tab3()}
        </Tab>
      </Tabs>
    );
  }
  const [weeksQty, setWeeksQty] = useState(1);
  const handleWeeks = (weeks) => {
    setWeeksQty(weeks);
    console.log("weeksQty", weeksQty);
  };
  const [sessionQty, setSessionQty] = useState(1);
  const handleSessionQty = (weeks) => {
    setSessionQty(weeks);
    console.log("sessionQty", sessionQty);
  };
  function tab1() {
    return (
      <>
        <Row className="mt-4 mb-4">
          <Col className="text-warning text-left" style={{ fontSize: "18px" }}>
            {bookingsText[0].title}
          </Col>
          <Col
            className="text-light text-center"
            style={{ fontSize: "18px", padding: 0 }}
          >
            {globalFriday}
          </Col>
        </Row>
        <Row className="mt-4 mb-4">
          <Col
            className="text-warning text-left"
            style={{ fontSize: "18px", paddingRight: 0 }}
          >
            {bookingsText[1].title}
          </Col>
          <Col
            className="text-light text-right"
            style={{ fontSize: "18px", padding: 0 }}
          >
            <ToggleButtonGroup
              name="value"
              type="radio"
              value={weeksQty}
              onChange={handleWeeks}
            >
              <ToggleButton value={1}>1</ToggleButton>
              <ToggleButton value={2}>2</ToggleButton>
              <ToggleButton value={3}>3</ToggleButton>
              <ToggleButton value={4}>4</ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Row>
        <Row className="mt-4 mb-4">
          <Col className="text-warning text-left" style={{ fontSize: "18px" }}>
            {bookingsText[2].title}
          </Col>
          <Col
            className="text-light text-right"
            style={{ fontSize: "18px", padding: 0 }}
          >
            <ToggleButtonGroup
              name="value"
              type="radio"
              value={sessionQty}
              onChange={handleSessionQty}
            >
              <ToggleButton value={1}>1</ToggleButton>
              <ToggleButton value={2}>2</ToggleButton>
              <ToggleButton value={3}>3</ToggleButton>
              <ToggleButton value={4}>4</ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Row>
      </>
    );
  }

  function tab2() {
    function dropdownItems(requestedList) {
      return requestedList.map((sessionTime) => (
        <Dropdown.Item
          onSelect={(eventKey, event) => {
            console.log("tab2", eventKey, event);
            requestedList == firstJumaSession
              ? setSelectedSessiontime(eventKey)
              : setSelectedSessionInterval(eventKey);
          }}
          eventKey={sessionTime}
          drop="down"
        >
          {sessionTime}
        </Dropdown.Item>
      ));
    }

    function setMaxPeople(event) {
      setMaxPerSession(event.target.value);
    }

    return (
      <>
        <Row className="mt-4 mb-4">
          <Col className="text-warning text-left" style={{ fontSize: "18px" }}>
            {bookingsText[3].title}
          </Col>
          <Col
            className="text-light text-center"
            style={{ fontSize: "18px", padding: 0 }}
          >
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                {selectedSessiontime}
              </Dropdown.Toggle>

              <Dropdown.Menu>{dropdownItems(firstJumaSession)}</Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        <Row className="mt-4 mb-4">
          <Col className="text-warning text-left" style={{ fontSize: "18px" }}>
            {bookingsText[4].title}
          </Col>
          <Col
            className="text-light text-center"
            style={{ fontSize: "18px", padding: 0 }}
          >
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                {selectedSessionInterval}
              </Dropdown.Toggle>

              <Dropdown.Menu>{dropdownItems(timeBetwwenSession)}</Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        <Row className="mt-4 mb-4">
          <Col
            className="text-warning text-center"
            style={{ fontSize: "18px" }}
          >
            {bookingsText[5].title}
          </Col>
          <Col
            className="text-light text-center"
            style={{ fontSize: "18px", padding: 0 }}
            sm={6}
          >
            <input
              type="tel"
              name="mobile"
              onChange={setMaxPeople}
              placeholder={maxPerSession}
              className="text-center"
              style={{ maxWidth: "20%" }}
            />
          </Col>
        </Row>
      </>
    );
  }
  function tab3() {
    const confirmSessionCreation = [
      { title: "Starting Juma :", detail: globalFriday.substring(6) },
      { title: "Repeating weeks :", detail: weeksQty },
      { title: "Sessions per Juma :", detail: sessionQty },
      { title: "First Session starts :", detail: selectedSessiontime },
      { title: "Between sessions :", detail: selectedSessionInterval },
      { title: "Max per Session :", detail: maxPerSession },
    ];
    function listSessionDetails(params) {
      return confirmSessionCreation.map((rowDetails) => (
        <Row className="mt-3">
          <Col
            xl={6}
            xs={7}
            className="text-warning text-right"
            style={{ fontSize: "18px" }}
          >
            {rowDetails.title}
          </Col>
          <Col className="text-light text-left" style={{ fontSize: "18px" }}>
            {rowDetails.detail}
          </Col>
        </Row>
      ));
    }
    return (
      <Row className="mt-4">
        <Col>{listSessionDetails()}</Col>
      </Row>
    );
  }
  return (
    <>
      {loading === true ? (
        <ShowModal loading={loading} modalDetails={modalDetails} />
      ) : (
        showBody()
      )}
    </>
  );
}

export default CreateSession;
