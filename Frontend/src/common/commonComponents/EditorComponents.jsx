import React, { useEffect, useRef, useState } from 'react';
import EditorJS from "@editorjs/editorjs";
import Header from '@editorjs/header'; 
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Paragraph from '@editorjs/paragraph';

export const EditorComponents = (props) => {



  const editorRef = useRef(null);
  const editorInstance = useRef(null);
  const [editor, setEditor] = useState(null);

  const handleSave = async () => {
    // editorInstance.save().then((outputData) => {

    //     console.log('Article data: ', outputData)

    //     props.getValue(outputData)
    //   }).catch((error) => {
    //     console.log('Saving failed: ', error)
    //   });

    if (editorInstance.current) {
      const savedData = await editorInstance.current.save();
      console.log(savedData);
    }
  };

  useEffect(() => {
    
    if(editorRef.current && !editorInstance.current){
    editorInstance.current = new EditorJS({
      holderId: "editorjs",
  
      tools: {
        Header: {
          class: Header,
          inlineToolbar: true,
        },
        list: List,
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: 'http://localhost:4000/uploadFile', // Your backend file uploader endpoint
              byUrl: 'http://localhost:4000/fetchUrl', // Your endpoint that provides uploading by Url
            }
          }
        },
        paragraph: {
            class: Paragraph,
          },
      },
      onReady: () => {
        console.log("Editor.js is ready to work!");
      },
      autofocus: true,
      placeholder: "Type here!",
  
      /**
       * Previously saved data that should be rendered
       */
      data: {},
    });
    setEditor(editorInstance)
}
  }, [])

  return (
    <div>
        <div ref={editorRef} id="editorjs" data-gramm="false"/>
        <button onClick={handleSave}>Save</button>
        
    </div>
  )
}
