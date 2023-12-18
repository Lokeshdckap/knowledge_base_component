import React from "react";
import { ScriptComponents } from "../components/ScriptComponents";
import { useMyContext } from "../../context/AppContext";
import { ScriptEditor } from "../components/ScriptEditor";

export const Scripts = () => {
  const { role } = useMyContext();


  return <>{role == 2 ? <ScriptEditor /> : <ScriptComponents />}{console.log(role)}</>;
};
