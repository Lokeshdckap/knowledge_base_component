import React from 'react'

export const MyTextareaComponent = (props) => {
    console.log(props.textareaValue);
  return (
    <>
        <textarea>{props.textareaValue}</textarea>
    </>
  )
}
