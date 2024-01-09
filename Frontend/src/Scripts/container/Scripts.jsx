import React, { useEffect, useState } from "react";
import { ScriptComponents } from "../components/ScriptComponents";
import { useMyContext } from "../../context/AppContext";
import { ScriptEditor } from "../components/ScriptEditor";
import axiosClient from "../../axios-client";
import { useParams } from "react-router-dom";

export const Scripts = () => {
  const { role, hasChanges, setHasChanges } = useMyContext();

  const [published, setPublished] = useState(false);
  const params = useParams();
  useEffect(() => {
    getParticularScript();

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

  const getParticularScript = async () => {
    // setLoading(true);
    let script_uuid = params.slug;
    await axiosClient
      .get(`/api/dashboard/getScriptAndPage/${script_uuid}`)
      .then((res) => {
        if (res.status == 200) {
          if (res.data.getScriptAndPages.is_published) {
            setPublished(true);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        // setLoading(false);
      });
  };

  return (
    <>{role == 2 || published ? <ScriptEditor /> : <ScriptComponents />}</>
  );
};
