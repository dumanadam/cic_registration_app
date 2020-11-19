import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import PrivacyPolicy from "./PrivacyPolicy";
import { FiSquare, FiCheckSquare } from "react-icons/fi";

const PrivacyModal = (errorDdetails) => {
  const [agreeNewsletter, setAgreeNewsletter] = useState(true);
  const handleAgree = () => {
    setAgreeNewsletter(!agreeNewsletter);
  };
  const handleClose = () => setShow(false);
  const [show, setShow] = useState(true);
  const [agreeColour, setAgreeColour] = useState(
    "outline-primary-* text-primary shadow-none"
  );
  useEffect(() => {
    if (agreeNewsletter === true) {
      setAgreeColour("outline-primary-* text-primary shadow-none");
    } else setAgreeColour(" outline-danger-* text-danger shadow-none");
  }, [agreeNewsletter]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered
      aria-labelledby="example-custom-modal-styling-title"
    >
      <Modal.Header>
        <Modal.Title className="text-center col">
          <div>CIC Covid-19 App</div> <div>Privacy Policy</div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-dialog-scrollable" style={{}}>
        <PrivacyPolicy></PrivacyPolicy>
      </Modal.Body>
      <Modal.Footer>
        <div className="col text-center">
          <div className="col ">
            <Button onClick={handleAgree} variant={agreeColour}>
              CIC and Mosque updates{" "}
              <span className="ml-2 ">
                {agreeNewsletter ? (
                  <FiCheckSquare></FiCheckSquare>
                ) : (
                  <FiSquare></FiSquare>
                )}
              </span>
            </Button>
          </div>

          <div className="mt-2">
            <Button variant="primary w-100" onClick={handleClose}>
              Agree
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default PrivacyModal;
