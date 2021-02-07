import React, { useEffect, useState } from "react";
import { Alert, Card, Container, Row } from "react-bootstrap";
import ShowModal from "../ShowModal";

const WithTemplate = (WrappedComp) => {
  console.log("WrappedComp", WrappedComp);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalText, setModalText] = useState("Connecting to CiC");

  useEffect(() => {
    setModalText(WrappedComp.modal.modalText);
  }, [WrappedComp.modal.modalText]);

  useEffect(() => {
    setModalText(WrappedComp.errorMessage);
  }, [WrappedComp.errorMessage]);

  function showWrappedComponent() {
    return (
      <Card
        className="d-flex align-items-center w-100 border-0 text-center"
        bg="transparent"
      >
        {/*         <div
          style={{
            height: "0vh",
            marginBottom: "15vh",
            width: "100%",
          }}
        >
          {WrappedComp.errorMessage && (
            <Container>
              <Alert variant="danger" style={{ fontSize: ".9em" }}>
                {WrappedComp.errorMessage}
              </Alert>
            </Container>
          )}
        </div> */}
        <Card.Body
          className="mt-0 pt-0 "
          style={{ height: "70vh", maxHeight: "70vh", overflow: "clip" }}
        >
          {WrappedComp.children}
        </Card.Body>
        {WrappedComp.buttons}
      </Card>
    );
  }

  return WrappedComp.modal.loading || !!WrappedComp.errorMessage ? (
    <ShowModal
      loading={true}
      modalDetails={{
        bodyText: modalText,
        modalType: !!WrappedComp.errorMessage ? "error" : "loading",
      }}
    />
  ) : (
    showWrappedComponent()
  );
};

export default WithTemplate;
