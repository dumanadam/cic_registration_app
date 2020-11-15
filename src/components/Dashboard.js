import React, { useState, useEffect } from "react";
import { Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import PageTitle from "./PageTitle";

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout, userDetails } = useAuth();
  const [pageTitle, setpageTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setpageTitle(PageTitle("Dashboard"));
  }, []);

  async function handleLogout(e) {
    setError("");

    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Failed to Logout");
      console.log("error", e);
    }
  }

  function sessionButton() {
    if (userDetails.jumaDate === "") {
      return (
        <Link to="/sessions" className="btn btn-primary  mt-3 mr-1">
          Book Session
        </Link>
      );
    } else {
      return (
        <Link to="/sessionConfirmed" className="btn btn-primary  mt-3 mr-1">
          View QrCode
        </Link>
      );
    }
  }

  return (
    <>
      <Card>
        <Card.Header className="h3 text-center" style={{ color: "#004619" }}>
          Dashboard
        </Card.Header>
        <Card.Body style={{ minHeight: "57vh" }}>
          {error && <Alert variant="danger">{error}</Alert>}
          <div>
            <strong>As SalamuAleykum </strong> {userDetails.firstname}
          </div>
          {false ? (
            <div>
              <strong>
                You have a reservation for the following Juma session
              </strong>
              {userDetails.jumaDate}
            </div>
          ) : (
            <div>
              <strong>You currently have no Juma sessions booked</strong>
            </div>
          )}

          <div class="container mt-4 " id="navigation">
            <div class="row " id="top-navigation">
              <Link className="text-light col-6 text-left" to="/sessions">
                <Button disabled={loading} variant="outline-dark">
                  Update Session
                </Button>
              </Link>

              <Link
                className="text-light col-6 text-right"
                to="/update-profile"
              >
                <Button disabled={loading} variant="outline-dark">
                  Update Profile
                </Button>
              </Link>
            </div>

            <div id="bottom-navigation">
              <Button variant="warning w-100 mt-4">
                <Link className="text-light" to="/">
                  New Mosque
                </Link>
              </Button>
              <Button variant="dark w-100 mt-4">
                <Link className="text-light" onClick={handleLogout}>
                  Logout
                </Link>
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
