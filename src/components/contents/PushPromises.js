import React from "react";

function PushPromises(promises, setModalDetails, setLoading, setIsSubmitting) {
  Promise.all(promises)
    .then((fbreturn) => {
      console.log("fbreturn", fbreturn);
      setModalDetails({
        bodyText: "Success",
      });
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
      }, 1000);
      // history.push("/");
    })
    .catch((e) => {
      console.log("promise erroe", e);
      console.log(e.message);
      if (e.code == "auth/requires-recent-login") {
        setModalDetails({
          bodyText:
            "Password & email change requires recent authentication. Log in again before retrying this request.",
        });
        setLoading(true);

        setTimeout(() => {
          setLoading(false);
        }, 3500);
      }
    })
    .finally(() => {
      setIsSubmitting(false);
    });
}

export default PushPromises;
