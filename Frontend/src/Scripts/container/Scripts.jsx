import React, { useEffect } from "react";
import { ScriptComponents } from "../components/ScriptComponents";
import { useMyContext } from "../../context/AppContext";
import { ScriptEditor } from "../components/ScriptEditor";

export const Scripts = () => {
  const { role, hasChanges, setHasChanges } = useMyContext();
  useEffect(() => {
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

  return <>{role == 2 ? <ScriptEditor /> : <ScriptComponents />}</>;
};
