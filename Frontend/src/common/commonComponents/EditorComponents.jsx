import React, { useEffect, useRef } from 'react';
import EditorJS from "@editorjs/editorjs";
import Header from '@editorjs/header'; 
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Paragraph from '@editorjs/paragraph';

export const EditorComponents = () => {



  const editorRef = useRef(null);

  useEffect(() => {

    editorRef.current = new EditorJS({
      holderId: "editorjs",
  
      tools: {
        header: {
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

    return () => {
      if (editorRef.current) {
        // Remove the editor content from the DOM
        // const editorContainer = document.getElementById('editorjs');
        // editorContainer.innerHTML = '';

        // If you need to recreate the Editor.js instance, you can do so here
        // editorRef.current = new EditorJS({
        //   holder: 'editorjs-container',
        //   tools: { header: Header, list: List, simpleImage: SimpleImage },
        // });
      }
    };
  }, [])

  return (
    <div>
        <div id="editorjs" />
    </div>
  )
}
