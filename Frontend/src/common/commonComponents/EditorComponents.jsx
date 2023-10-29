import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
// import Header from '@editorjs/header';
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Paragraph from "@editorjs/paragraph";

export const EditorComponents = (props) => {

//   useEffect(() => {
//     props.editorState(props.editorValue)
// }, [props.editorValue])

  const editorRef = useRef(null);
  const editorInstance = useRef(null);

  // console.log(props.render.content);
  const [editor, setEditor] = useState(null);

  const [save, setSave] = useState([]);

  const [content, setContent] = useState(null);

  useEffect(() => {
    if (editorRef.current && !editorInstance.current) {
      editorInstance.current = new EditorJS({
        holderId: "editorjs",
        tools: {
          header: Header,
          list: List,
          paragraph: Paragraph,
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: "http://localhost:4000/uploadFile",
                byUrl: "http://localhost:4000/fetchUrl",
              },
            },
          },
        },
        onReady: () => {
          console.log("Editor.js is ready to work!");
        },
        placeholder: "Type here!",
        onChange: () => {
          editorInstance.current.save().then((outputData) => {
            // Handle changes here
            props.editorState(outputData);
          });
        },
        data: {
          blocks:props.editorValue.blocks
        }, // Pass the blocks directly from props
      });
      setEditor(editorInstance);
    }
  },[editor]);

  return (
    <div>
      <div ref={editorRef} id="editorjs" data-gramm="false" />
      {/* <button onClick={handleSave}>Save</button> */}
    </div>
  );
};
