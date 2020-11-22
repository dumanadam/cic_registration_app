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
  const { headerText, loading, userDetails } = buttonDetails;

  console.log("buttonDetails", buttonDetails);

  async function handlePageLogout() {
    console.log(" nav logout func");
    const logout = await buttonDetails.b3.logout();
    console.log("return of call to dashboard logout", logout);
  }

  function handleBotButton() {
    if (buttonDetails.b3.icon) {
      console.log("buttonDetails 3 icon TRUE!!!!!!!!!!!!!!!!", buttonDetails);
      return (
        <div className="row ">
          <div className="col">
            <Form.Label
              variant="light"
              onClick={() => buttonDetails.b3.openSettings()}
              className="text-primary"
            >
              {" "}
              <BsGearFill></BsGearFill>
              {buttonDetails.b3.settingsButton ? (
                <BsChevronBarRight></BsChevronBarRight>
              ) : (
                <BsChevronBarLeft></BsChevronBarLeft>
              )}
            </Form.Label>
          </div>
          {buttonDetails.b3.settingsButton
            ? buttonDetails.b3.renderDelete()
            : ""}
        </div>
      );
    } else {
      console.log("buttonDetails FAAAALSSSEEEE", buttonDetails);

      return (
        <Link className="text-light w-100" to={buttonDetails.b3.link}>
          <Button
            onClick={buttonDetails.b3.logout}
            variant={
              buttonDetails.b3.classnames
                ? buttonDetails.b3.classnames + " border-0 w-100 mt-4"
                : "outline-dark border-0 w-100 mt-4"
            }
          >
            {buttonDetails.b3.buttonText}
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
            <Link className="text-light col p-0  " to={buttonDetails.b1.link}>
              <Button disabled={buttonDetails.b1.loading} className=" w-100">
                {buttonDetails.b1.buttonText}
              </Button>
            </Link>
          </Row>
          <Row>
            <Link
              className="text-light col p-0 pt-2  "
              to={buttonDetails.b2.link}
            >
              <Button disabled={buttonDetails.b2.loading} className=" w-100">
                {buttonDetails.b2.buttonText}
              </Button>
            </Link>
          </Row>
          <div className="row ">
            <div className="col">
              <Form.Label
                variant="light"
                onClick={() => buttonDetails.b3.openSettings()}
                className="text-primary"
              >
                {" "}
                <BsGearFill></BsGearFill>
                {buttonDetails.b3.settingsButton ? (
                  <BsChevronBarRight></BsChevronBarRight>
                ) : (
                  <BsChevronBarLeft></BsChevronBarLeft>
                )}
              </Form.Label>
            </div>
            {buttonDetails.b3.settingsButton
              ? buttonDetails.b3.renderDelete()
              : ""}
          </div>
        </>
      );

    case 2:
      return (
        <>
          <Row>
            <Link
              className="text-light col p-0 pb-2 "
              to={buttonDetails.b1.link}
            >
              <Button disabled={buttonDetails.b1.loading} className=" w-100">
                {buttonDetails.b1.buttonText}
              </Button>
            </Link>
          </Row>
          <Row>
            <Link className="text-light col p-0" to={buttonDetails.b2.link}>
              <Button
                disabled={buttonDetails.b1.loading}
                variant={
                  buttonDetails.b2.classnames
                    ? buttonDetails.b2.classnames
                    : "danger w-100"
                }
              >
                {buttonDetails.b2.buttonText}
              </Button>
            </Link>
          </Row>
        </>
      );
    case 3:
      return (
        <Container>
          <Row>
            <Link
              className="text-light col p-0 mr-2 "
              to={buttonDetails.b1.link}
            >
              <Button disabled={buttonDetails.b1.loading} className=" w-100">
                {buttonDetails.b1.buttonText}
              </Button>
            </Link>

            <Link className="text-light col p-0" to={buttonDetails.b2.link}>
              <Button
                disabled={buttonDetails.b1.loading}
                variant={
                  buttonDetails.b2.classnames
                    ? buttonDetails.b2.classnames
                    : "danger w-100"
                }
              >
                {buttonDetails.b2.buttonText}
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
