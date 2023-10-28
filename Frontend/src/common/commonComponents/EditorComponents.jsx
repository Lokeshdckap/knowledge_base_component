import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
// import Header from '@editorjs/header';
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Paragraph from "@editorjs/paragraph";

export const EditorComponents = (props) => {


  const editorRef = useRef(null);
  const editorInstance = useRef(null);

  // console.log(props.render.content);
  const [editor, setEditor] = useState(null);
  const [save, setSave] = useState([]);
  const [content,setContent] = useState(null);

  // console.log(props.render.title);


  //  {blocks: [
//     {
//       type: 'list',
//       data: {
//         style: 'ordered', // 'ordered' for numbered list, 'unordered' for bulleted list
//         items: ['Item 1', 'Item 2', 'Item 3'],
//       },
//     },
//   ]
// }
// console.log(props.render.title);

  // setContent(props.render);
  useEffect(() => {
   


  // let renderEditor = props.render;
    if (editorRef.current && !editorInstance.current) {
      editorInstance.current = new EditorJS({
        holderId: "editorjs",

        tools: {
          // header: {
          //   class: Header,
          //   config: {
          //     placeholder: 'Enter a header',
          //     levels: [2, 3, 4],
          //     defaultLevel: 3
          //   }
          // },
          header: Header,
          list: List,
          paragraph: Paragraph,
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: "http://localhost:4000/uploadFile", // Your backend file uploader endpoint
                byUrl: "http://localhost:4000/fetchUrl", // Your endpoint that provides uploading by Url
              },
            },
          },
        },
        onReady: () => {
          console.log("Editor.js is ready to work!");
        },

        // autofocus: true,
        placeholder: "Type here!",

        onChange: () => {
          editorInstance.current.save().then((outputData) => {
            // Handle changes here
            props.editorState(outputData);
          });
        },

        /**
         * Previously saved data that should be rendered
         */
        data: {},     
      });
      setEditor(editorInstance);
      
    }
  }, [editor]);

  return (
    <div>
      <div ref={editorRef} id="editorjs" data-gramm="false" />
      {/* <button onClick={handleSave}>Save</button> */}
    </div>
  );
};
