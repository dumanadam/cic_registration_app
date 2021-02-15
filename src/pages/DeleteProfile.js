import React, { useState, useEffect, useRef } from "react";
import { Card, Form, Button, Alert, Row } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import MainShell from "../components/MainShell";
import DeleteProfileBody from "../components/contents/DeleteProfileBody";
import TEXTDEFINITION from "../text/TextDefinition.js";

function DeleteProfile(props) {
  const passwordRef = useRef();
  const { currentUser, userDetails, updateEmail, bookSession } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [myProps, setMyProps] = useState({});
  const [modalDetails, setModalDetails] = useState({
    bodyText: TEXTDEFINITION.LOADING_DEFAULT,
  });

  useEffect(() => {
    if (userDetails !== null && userDetails.firstname) {
      setMyProps({
        userDetails: userDetails,
        loading: loading,
        headerText: TEXTDEFINITION.DELETE_CARD_HEADER,
        handleDelete: handleDelete,
        passwordRef: passwordRef,
        error: error,
      });

      setLoading(false);
    }
  }, [userDetails]);

  useEffect(() => {
    console.log(" error changed delete  ");
    setMyProps({
      userDetails: userDetails,
      loading: loading,
      headerText: TEXTDEFINITION.DELETE_CARD_HEADER,
      handleDelete: handleDelete,
      passwordRef: passwordRef,
      error: error,
    });
  }, [error]);

  function handleDelete(e) {
    console.log("delete hit");
    e.preventDefault();
    setLoading(true);
    setError("");
    const promises = [];
    const session = {
      deleted: true,
    };
    //  promises.push(bookSession(session));
    if (passwordRef.current.value) {
      currentUser
        .delete()
        .then(function () {
          history.push("/");
        })
        .catch(function (error) {
          // An error happened.
          setError(error.code);
          console.log("delete error=>", error);
        })
        .finally(() => {
          setLoading(false);
          setTimeout(() => setError(""), 3000);
        });
    } else {
      console.log("password fail");
      setError("Password Empty");
      setTimeout(() => setError(""), 3000);
      setLoading(false);
    }
  }

  return (
    <>
      <div className="justify-content-center">
        <DeleteProfileBody
          loading={loading}
          userDetails={userDetails}
          handleDelete={handleDelete}
          myProps={myProps}
        ></DeleteProfileBody>
      </div>
    </>
  );
}

export default DeleteProfile;
