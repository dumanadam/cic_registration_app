import React, { useState, useEffect, useRef } from "react";
import { Card, Form, Button, Alert, Row } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import MainShell from "../components/MainShell";
import DeleteProfileBody from "../components/contents/DeleteProfileBody";
import TEXTDEFINITION from "../text/TextDefinition.js";

function DeleteProfile(props) {
  const passwordRef = useRef();
  const { currentUser, userDetails, updateEmail } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [myProps, setMyProps] = useState({});

  useEffect(() => {
    if (userDetails.firstname) {
      setMyProps({
        userDetails: userDetails,
        loading: loading,
        headerText: TEXTDEFINITION.DELETE_CARD_HEADER,
        handleDelete: handleDelete,
        passwordRef: passwordRef,
      });

      setLoading(false);
    }
  }, [userDetails]);

  function handleDelete(e) {
    console.log("delete hit");
    e.preventDefault();
    setLoading(true);
    setError("");

    if (passwordRef.current.value) {
      currentUser
        .delete()
        .then(function () {
          // User deleted.
          history.push("/");
        })
        .catch(function (error) {
          // An error happened.
          setError("Failed to Delete Account");
          console.log("delete error=>", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log("password fail");
    }
  }

  return (
    <>
      <div className="justify-content-center">
        <DeleteProfileBody
          loading={loading}
          userDetails={userDetails}
          handleDelete={handleDelete}
          myprops={myProps}
        ></DeleteProfileBody>
      </div>
    </>
  );
}

export default DeleteProfile;
