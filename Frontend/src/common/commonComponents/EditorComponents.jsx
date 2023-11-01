import React, { useCallback, useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
// import Header from "@editorjs/header";
import Header from "@editorjs/header";

import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Paragraph from "@editorjs/paragraph";

export const EditorComponents = (props) => {

  const ejInstance = useRef(null);

  const initEditor = (datas) => {
    if (!ejInstance.current) { // Check if the instance doesn't exist
      const editor = new EditorJS({
        holder: "editorjs",
        onReady: () => {
          ejInstance.current = editor;
        },

        // ... other options

        data: datas,
        onChange: async () => {
          let content = await editor.saver.save();
          props.editorState(content);
          console.log(content);
        },
        tools: {
          header: Header,
          list: List,
          paragraph: Paragraph,
        },
      });
    }
  };

  useEffect(() => {
    if (props.editorValue) {
      initEditor(props.editorValue);
    }

    return () => {
      ejInstance?.current?.destroy();
      ejInstance.current = null;
    };
  }, [props.editorValue]);

  return (
    <div id="editorjs"></div>
  );

  // const ejInstance = useRef(null);

  // const initEditor = (datas) => {
  //   if (!ejInstance.current) { // Check if the instance doesn't exist
  //     const editor = new EditorJS({
  //       holder: "editorjs",
  //       onReady: () => {
  //         ejInstance.current = editor;
  //       },

  //       // ... other options

  //       data: datas,
  //       onChange: async () => {
  //         let content = await editor.saver.save();
  //         props.editorState(content);
  //         localStorage.setItem('editorValue', JSON.stringify(content)); // Store the data in localStorage
  //       },
  //       tools: {
  //         header: Header,
  //         list: List,
  //         paragraph: Paragraph,
  //       },
  //     });
  //   }
  // };

  // useEffect(() => {
  //   // Try to load initial data from localStorage
  //   const storedData = localStorage.getItem('editorValue');
  //   if (props.editorValue) {
  //     initEditor(props.editorValue);
  //   } else if (storedData) {
  //     initEditor(JSON.parse(storedData)); // Initialize with the stored data
  //   }

  //   return () => {
  //     ejInstance?.current?.destroy();
  //     ejInstance.current = null;
  //   };
  // }, [props.editorValue]);
    };


