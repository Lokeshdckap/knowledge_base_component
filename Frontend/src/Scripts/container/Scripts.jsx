import React, { useEffect, useState } from "react";
import { ScriptComponents } from "../components/ScriptComponents";
import { useMyContext } from "../../context/AppContext";
import { ScriptEditor } from "../components/ScriptEditor";
import axiosClient from "../../axios-client";
import { useParams } from "react-router-dom";

export const Scripts = () => {
  const { role, hasChanges, setHasChanges, setLoading } = useMyContext();

  const params = useParams();
  const [published, setPublished] = useState(false);

  useEffect(() => {
    // getParticularScript();

    const handleBeforeUnload = (event) => {
      if (hasChanges) {
        const message =
          "You have unsaved changes. Are you sure you want to leave?";
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasChanges]);



  // const getParticularScript = async () => {
  //   console.log("here");
  //   setLoading(true);
  //   let script_uuid = params.slug;
  //   await axiosClient
  //     .get(`/api/dashboard/getScriptAndPage/${script_uuid}`)
  //     .then((res) => {
  //       if (res.status == 200) {
  //         if (res.data.getScriptAndPages.is_published) {
  //           setPublished(res.data.getScriptAndPages);
  //         } else {
  //           setPublished(false);
  //         }
  //       }
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setLoading(false);
  //     });
  // };
  // console.log("Welcome");
  return (
    <>
      {/* <div>
      script
      {console.log(published?.is_published)}
    </div> */}
      {role == 2  ? <ScriptEditor /> : <ScriptComponents />}
    {/* //role has pending in this page please remember  */}
{/* 
      {published?.is_published ? <ScriptEditor /> : <ScriptComponents />}
      {console.log(published?.is_published)} */}
    </>
  );
};
