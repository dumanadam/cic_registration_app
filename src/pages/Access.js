import React from "react";
import { useHistory } from "react-router-dom";
import { fbfunc, functions } from "../firebase";

function Access() {
  const history = useHistory();
  function fbclick(params) {
    console.log("params", params);
    const sayHello = fbfunc.httpsCallable("testFunc");
    sayHello({ name: "asd" }).then((result) => {
      console.log("res from func  - ", result.data);
    });
  }

  function adminPage() {
    history.push("/admin");
  }

  async function backupDb() {
    let backupdb = fbfunc.httpsCallable("backupDbRef");

    let dbres = await backupdb()
      .then((result) => {
        console.log("res from backupDbRef func  ->>> ", result.data);
        return result.data;
      })
      .catch((e) => {
        console.log("FBfunc backupDbRef error returned >>>", e);
      });
    console.log("res from backupDbRef func  ->>> ", dbres);
  }
  return (
    <>
      <button onClick={fbclick}>add admin</button>
      <button onClick={adminPage}>admin page</button>
      <button onClick={backupDb}>backupDB page</button>
    </>
  );
}

export default Access;
