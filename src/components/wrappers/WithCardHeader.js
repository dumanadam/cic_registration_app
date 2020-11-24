import React from "react";
import { Card } from "react-bootstrap";
import ErrorHeader from "../ErrorHeader";
import ShowModal from "../ShowModal";

export const WithCardHeader = (WrappedComponent) => (props) => {
  console.log("WithCardHeader props", props);
  function showLoading(props) {
    let modelDetails = {
      bodyText: "Connecting to CIC",
    };
    return (
      <>
        <ShowModal
          loading={props.loading}
          modalDetails={modelDetails}
        ></ShowModal>
        );
      </>
    );
  }

  function mainBody(props) {
    <div className="text-light">
      <Card className=" border-0 " bg="transparent">
        {ErrorHeader({
          headerText: props.myProps.headerText,
          errorMessage: props.myProps.error,
        })}
        <Card.Body className="mt-0 pt-0 ">
          <WrappedComponent {...props} />
        </Card.Body>
      </Card>
    </div>;
  }

  return (props) => {
    return <>{props.loading ? showLoading(props) : mainBody(props)}</>;
  };
};

export default WithCardHeader;
