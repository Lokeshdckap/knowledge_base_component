import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Table from "@editorjs/table";
import InlineCode from "@editorjs/inline-code";
import Underline from '@editorjs/underline';



let DEFAULT_DATA = {}

export const EditorComponents = (props) => {
  // const ejInstance = useRef(null);
  // console.log(props.editorContents.blocks);
  // const initEditor = () => {

  //   if (!ejInstance.current) { // Check if the instance doesn't exist
  //   console.log(datas);

  //     const editor = new EditorJS({
  //       holder: "editorjs",
  //       data: datas,
  //       placeholder: 'Let`s write an awesome story!',

  //       onReady: () => {
  //         ejInstance.current = editor;
  //       },
  //       // ... other options
  //       onChange: async () => {
  //         let content = await editor.saver.save();
  //         props.editorState(content);
  //         console.log(content);
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
  //     initEditor(props.editorValue);

  //   return () => {
  //     ejInstance?.current?.destroy();
  //     ejInstance.current = null;
  //   };
  // }, []);


  // console.log(props.editorContents);
  //Testing

  const ejInstance = useRef();
  // const [state,setState] = useState(props.editorContents)
  const initEditor = () => {
    const editor = new EditorJS({
      holder: "editorjs",

      onReady: () => {
        ejInstance.current = editor;
      },
      autofocus: true,
      onChange: async () => {
        let content = await editor.saver.save();
        props.editorState(content);
      },
      tools: {
        header: Header,
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: "unordered",
          },
        },
        table: {
          class: Table,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3,
          },
        },
        inlineCode: {
          class: InlineCode,
          shortcut: 'CMD+SHIFT+M',
        },
        underline: Underline,
      },
      data:{},
      placeholder: "Type here",
    });
  };

  useEffect(() => {
    // DEFAULT_DATA = props.editorContents
  
    // console.log(props.editorContents);
    // console.log(state);
    if (ejInstance.current === null) {
      initEditor();
    }

    return () => {
      ejInstance?.current?.destroy();
      ejInstance.current = null;
    };
  }, []);

  return <div id="editorjs"></div>;

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
