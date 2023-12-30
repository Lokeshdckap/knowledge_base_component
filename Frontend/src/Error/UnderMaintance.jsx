import React from "react";
import { Link } from "react-router-dom";
import errorImg from "../assets/images/Maintance.png";


export const UnderMaintance = () => {
    return (
        <div className="flex justify-center">
            <img src={errorImg} alt=""/>
        </div>
      );
}

