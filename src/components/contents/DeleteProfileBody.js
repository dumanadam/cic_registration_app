import React, { useRef } from "react";
import { Button, Row, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import MainShell from "../MainShell";

function DeleteProfileBody(props) {
  console.log("del body props.myprops", props);
  return (
    <>
      <Row className="pt-1 text-left " style={{ minHeight: "50vh" }}>
        <Form
          onSubmit={props.handleDelete}
          className="w-100 justify-content-center"
        >
          <Form.Group id="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              ref={props.myprops.passwordRef}
              placeholder="Enter password to confirm"
              className=""
            />
            <Button
              disabled={props.myprops.loading}
              className="w-100 "
              variant="danger"
              type="submit"
              style={{ marginTop: "43vh" }}
            >
              Delete Profile
            </Button>
          </Form.Group>
        </Form>
      </Row>

      <Form.Group>
        <Link className="text-light " to="/">
          <Button
            disabled={props.myprops.loading}
            className="w-100 mt-2  "
            variant="outline-light"
          >
            Cancel
          </Button>
        </Link>
      </Form.Group>
    </>
  );
}

export default MainShell(DeleteProfileBody);
