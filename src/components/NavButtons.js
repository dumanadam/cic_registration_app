import React from "react";

import {
  Card,
  Alert,
  Form,
  Button,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const NavButtons = (buttonCount, buttonDetails) => {
  console.log(buttonDetails.b1.loading);

  switch (buttonCount) {
    case 1:
      return <></>;

    case 2:
      return;
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
                className=" w-100"
                variant="danger"
              >
                {buttonDetails.b2.buttonText}
              </Button>
            </Link>
          </Row>
          <Row>
            <Link className="text-dark w-100" to={buttonDetails.b3.link}>
              <Button variant="outline-dark border-0 w-100 mt-4">
                {buttonDetails.b3.buttonText}
              </Button>
            </Link>
          </Row>
        </Container>
      );
    default:
      break;
  }
};
export default NavButtons;
