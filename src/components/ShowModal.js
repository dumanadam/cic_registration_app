import React from "react";
import { Card, Button, Modal, Spinner } from "react-bootstrap";

import { FiSquare, FiCheckSquare } from "react-icons/fi";

function ShowModal(props) {
  console.log("modaldets", props);
  const {
    modalDetails = {},
    modalDetails: { modalType } = {},
    modalDetails: { buttonDetails },
    modalDetails: { spinner } = false,
    loading,
  } = props;

  return (
    <>
      <Modal
        show={loading}
        onHide={modalDetails.handleClose}
        backdrop="static"
        keyboard={false}
        centered
        aria-labelledby="example-custom-modal-styling-title"
        className="w-100"
      >
        {modalDetails.titleL1 && (
          <Modal.Header>
            <div
              className={
                modalType === "error"
                  ? "text-center col h5 text-danger"
                  : "text-center col h5 text-primary"
              }
            >
              <div>{modalDetails.titleL1}</div>
              <div>{modalDetails.titleL2}</div>
            </div>
          </Modal.Header>
        )}

        {modalDetails.bodyText && (
          <Modal.Body className="modal-dialog-scrollable text-center">
            <div className="w-100 my-2">
              <Card.Text>
                <div>{modalDetails.bodyText}</div>
                <div>{modalDetails.bodyTextl2}</div>
              </Card.Text>

              {spinner && (
                <Card.Text>
                  <Spinner
                    animation={modalType === "error" ? "grow" : "border"}
                    variant={modalType === "error" ? "danger" : "warning"}
                  />
                </Card.Text>
              )}
            </div>
          </Modal.Body>
        )}

        {modalDetails.handleConfirm && (
          <Modal.Footer>
            <div className="mt-2 w-100">
              <Button
                variant={
                  !!buttonDetails.textAccept.variant
                    ? buttonDetails.textAccept.variant
                    : "primary w-100"
                }
                onClick={(e) => buttonDetails.handleAccept(e)}
              >
                {buttonDetails.textAccept.text}
              </Button>
              {!!buttonDetails.textReject && (
                <Button
                  variant="outline-primary w-100 mt-2"
                  onClick={() => buttonDetails.handleReject()}
                >
                  {buttonDetails.textReject.text}
                </Button>
              )}
            </div>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
}

export default ShowModal;
