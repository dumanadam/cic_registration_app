import React from "react";
import { Card, Form, Button, Alert, Modal, Spinner } from "react-bootstrap";

import { FiSquare, FiCheckSquare } from "react-icons/fi";

function ShowModal(props) {
  const { modalDetails, loading } = props;

  return (
    <>
      <Modal
        show={loading}
        onHide={modalDetails.handleClose}
        backdrop="static"
        keyboard={false}
        centered
        aria-labelledby="example-custom-modal-styling-title"
        size="sm"
      >
        {modalDetails.titleL1 && (
          <Modal.Header>
            <Modal.Title className="text-center col">
              <div>{modalDetails.titleL1}</div>{" "}
              <div>{modalDetails.titleL2}</div>
            </Modal.Title>
          </Modal.Header>
        )}

        {modalDetails.bodyText && (
          <Modal.Body className="modal-dialog-scrollable text-center">
            <div className="w-100">
              <Card.Text>{modalDetails.bodyText} </Card.Text>

              <Card.Text>
                <Spinner animation="border" variant="warning" />
              </Card.Text>
            </div>
          </Modal.Body>
        )}

        {modalDetails.handleAgree && (
          <Modal.Footer>
            <div className="col text-center">
              <div className="col ">
                <Button
                  onClick={modalDetails.handleAgree}
                  variant={modalDetails.agreeColour}
                >
                  CIC and Mosque updates{" "}
                  <span className="ml-2 ">
                    {modalDetails.agreeNewsletter ? (
                      <FiCheckSquare></FiCheckSquare>
                    ) : (
                      <FiSquare></FiSquare>
                    )}
                  </span>
                </Button>
              </div>

              <div className="mt-2">
                <Button
                  variant="primary w-100"
                  onClick={modalDetails.handleClose}
                >
                  Agree
                </Button>
              </div>
            </div>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
}

export default ShowModal;
