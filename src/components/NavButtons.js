import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  BsChevronBarRight,
  BsChevronBarLeft,
  BsGearFill,
} from "react-icons/bs";
import {
  Card,
  Alert,
  Form,
  Button,
  Row,
  Col,
  Container,
} from "react-bootstrap";

const NavButtons = (buttonCount, buttonDetails) => {
  const { b1, b2, b3 } = buttonDetails;

  function testclick() {
    console.log("success");
  }

  async function handlePageLogout() {
    const logout = await b3.logout();
  }

  function handleBotButton() {
    if (b3.icon) {
      console.log("buttonDetails 3 icon TRUE!!!!!!!!!!!!!!!!", buttonDetails);
      return (
        <div className="row ">
          <div className="col">
            <Form.Label
              variant="light"
              onClick={b3.openSettings}
              className="text-primary"
            >
              {" "}
              <BsGearFill></BsGearFill>
              {b3.settingsButton ? (
                <BsChevronBarRight></BsChevronBarRight>
              ) : (
                <BsChevronBarLeft></BsChevronBarLeft>
              )}
            </Form.Label>
          </div>
          {b3.settingsButton ? b3.renderDelete : ""}
        </div>
      );
    } else {
      // console.log("buttonDetails FAAAALSSSEEEE", buttonDetails);

      return (
        <Link className="text-light col p-0" to={b3.link}>
          <Button
            disabled={b3.loading}
            variant={b3.variant ? b3.variant : "danger w-100"}
            onClick={b3.handleLogout}
          >
            {b3.buttonText}
          </Button>
        </Link>
      );
    }
  }

  switch (buttonCount) {
    case 1:
      return (
        <>
          <Row>
            <Link className="text-light col p-0  " to={b1.link}>
              <Button
                disabled={b1.loading}
                variant={b1.variant ? b1.variant : "danger w-100"}
                onClick={() => b1.onClick}
              >
                {b1.buttonText}
              </Button>
            </Link>
          </Row>
          <Row>
            <Link className="text-light col p-0 pt-2  " to={b2.link}>
              <Button
                disabled={b2.loading}
                variant={b2.variant ? b2.variant : "danger w-100"}
              >
                {b2.buttonText}
              </Button>
            </Link>
          </Row>
          <div className="row ">
            <div className="col text-center pt-2">
              <Form.Label
                variant="light"
                onClick={b3.openSettings}
                className="text-light"
              >
                {" "}
                <BsGearFill></BsGearFill>
                {b3.settingsButton ? (
                  <BsChevronBarRight></BsChevronBarRight>
                ) : (
                  <BsChevronBarLeft></BsChevronBarLeft>
                )}
              </Form.Label>
            </div>
            {b3.settingsButton ? b3.renderDelete() : ""}
          </div>
        </>
      );

    case 2:
      return (
        <>
          <Row>
            <Link className="text-light col p-0 pb-2 " to={b1.link}>
              <Button
                disabled={b1.loading}
                variant={b1.variant ? b1.variant : "danger w-100"}
              >
                {b1.buttonText}
              </Button>
            </Link>
          </Row>
          <Row>
            <Link className="text-light col p-0" to={b2.link}>
              <Button
                disabled={b1.loading}
                variant={b2.variant ? b2.variant : "danger w-100"}
              >
                {b2.buttonText}
              </Button>
            </Link>
          </Row>
        </>
      );
    case 3:
      return (
        <Container>
          <Row>
            {b1.disabled ? (
              <Button
                className="text-light col p-0 mr-2 "
                disabled={b1.disabled}
                variant={b1.variant ? b1.variant : "w-100"}
              >
                No Sessions
              </Button>
            ) : (
              <Link className="text-light col p-0 mr-2 " to={b1.link}>
                <Button
                  disabled={b1.loading}
                  variant={b1.variant ? b1.variant : "w-100"}
                >
                  {b1.buttonText}
                </Button>
              </Link>
            )}

            <Link className="text-light col p-0" to={b2.link}>
              <Button
                disabled={b1.loading}
                variant={b2.variant ? b2.variant : "danger w-100"}
              >
                {b2.buttonText}
              </Button>
            </Link>
          </Row>
          <Row>{handleBotButton()}</Row>
        </Container>
      );
    default:
      break;
  }
};
export default NavButtons;
