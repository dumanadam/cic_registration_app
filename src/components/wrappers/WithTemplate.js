import React, { useEffect, useState } from "react";
import { Alert, Card, Container, Row } from "react-bootstrap";
import ShowModal from "../ShowModal";

const WithTemplate = (WrappedComp) => {
  console.log("WrappedComp", WrappedComp);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalText, setModalText] = useState("Connecting to CiC");

  useEffect(() => {
    setModalText(WrappedComp.modal.modalText);
    console.log("with modaltext", WrappedComp.modal.modalText);
  }, [WrappedComp.modal.modalText]);

  useEffect(() => {
    setModalText(WrappedComp.errorMessage);
    console.log("with errormsg", WrappedComp.errorMessage);
  }, [WrappedComp.errorMessage]);

  function showWrappedComponent() {
    return (
      <Card
        className="d-flex align-items-center w-100 border-0 text-center"
        bg="transparent"
      >
        <Card.Body
          className="mt-0 pt-0 "
          style={{ minHeight: "70vh", maxHeight: "70vh", overflow: "clip" }}
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
