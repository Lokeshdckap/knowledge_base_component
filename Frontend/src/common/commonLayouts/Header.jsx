import React from 'react'
import Main from './Main'
import { Navigate, useNavigate } from 'react-router-dom';


export default function Header() {


  const navigate = useNavigate();
  const onLogout = () =>{
     localStorage.clear();
     window.location.href = "/signin"

  }
  return (

    <div className='bg-secondary h-[70px] w-screen'>
        <button onClick={onLogout}>Logout</button>
    </div>

  )
}