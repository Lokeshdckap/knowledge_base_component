import React from "react";
import { Link } from "react-router-dom";
import errorImg from "../assets/images/Maintance.png";

export default function Error() {
  return (
    <div className="flex justify-center">
        <img src={errorImg} alt=""/>
    </div>
  );
}
