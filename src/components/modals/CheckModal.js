import React from "react";
import { Button, Card, Modal } from "react-bootstrap";

function CheckModal(props) {
  console.log("hit modal");
  return (
    <Modal
      show={props.show}
      backdrop="static"
      keyboard={true}
      centered
      aria-labelledby="example-custom-modal-styling-title"
      className="d-flex align-items-center text-dark justify-content-center "
      size="sm"
    >
      <Modal.Body className="text-center">
        <div className="w-100">
          <Card.Text>
            <div>{props.text1}</div>
            <div className="text-danger">{props.text2}</div>
          </Card.Text>
          <div className="mt-2">
            <Button
              variant="danger w-100"
              onClick={(e) => props.handleConfirm(e)}
            >
              Yes
            </Button>
            <Button
              variant="outline-primary w-100 mt-2"
              onClick={() => props.handleReject()}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default CheckModal;
