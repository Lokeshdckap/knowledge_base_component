
import React from 'react'

const Input = (props) =>{
    return (
      <input id={props.name} name={props.name} type={props.type}  onChange={props.event} value={props.value}  placeholder={props.placeholder} className="w-96 phone:w-[296px] h-10 rounded-lg border-slate-900 p-2 text-sm outline-none outline-gray-200" />
    )


}

export default Input