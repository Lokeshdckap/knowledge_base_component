
import React from 'react'

const Input = (props) =>{
    return (
      <input id={props.name} name={props.name} type={props.type} onChange={props.event} value={props.value}  placeholder={props.placeholder} className="w-96 h-9 mt-1 rounded-sm border-slate-900 p-2 text-sm outline-none outline-gray-200"    onPaste={(e)=>{
        e.preventDefault()
        return false;
      }} onCopy={(e)=>{
        e.preventDefault()
        return false;
      }} />
    )


}

export default Input