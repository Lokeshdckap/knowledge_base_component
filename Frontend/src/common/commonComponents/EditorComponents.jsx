import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import List from "@editorjs/list";
import Table from "@editorjs/table";
import Header from "@editorjs/header";
import InlineCode from "@editorjs/inline-code";
import Underline from "@editorjs/underline";
import ImageTool from '@editorjs/image';
import axiosClient from "../../axios-client";
import SimpleImage from '@editorjs/simple-image';



export const EditorComponents = (props) => {
  const ejInstance = useRef();
  const [imageUrl, setImageUrl] = useState('');

  // const handleUpload = async (file) => {
  //   console.log(file);
  //   // const formData = new FormData()

  //   // formData.append('image', file);
  //   // console.log(formData);

  //   try {
  //     const response = await axiosClient.post('/uploadImage', file,{
  //       headers:{
  //         "Content-Type":"multipart/form-data",
  //       },
  //     });
  //     // console.log(formData);
  //     console.log(response);
  //     setImageUrl(response.data.imageUrl);
  //   } catch (error) {
  //     console.error('Error uploading image:', error);
  //   }
  // };

  useEffect(() => {
    let isMounted = true;
    const initEditor = async (datas) => {
      if (isMounted && !ejInstance.current) {
        const editor = new EditorJS({
          holder: "editorjs",
          onReady: async () => {
          
            ejInstance.current = editor;

            // let content = await editor.saver.save();
              
            // props.editorState(content);
            // console.log(content);
            // if (datas !== null) {
            //   let content = await editor.saver.save();

            //   props.editorState(content);
            // }
          },
          onChange: async () => {

            if ( datas !== null) {
              console.log(datas,"datas");
              try {
                let content = await editor.saver.save();
                props.editorState(content);
              } catch (error) {
                console.error("Error saving content:", error);
              }
            }
            else{
              if(editor){
                 let content = await editor.saver.save();
              props.editorState(content);
              }
             
            }
          },
          autofocus: true,
          data: datas,
          tools: {
            header: Header,
            list: {
              class: List,
              inlineToolbar: true,
              config: {
                defaultStyle: "unordered",
              },
            },
            image: SimpleImage,
            // image: {
            //   class: ImageTool,
            //   inlineToolbar: true,
            //   config: {
            //     uploader: {
            //       uploadByFile(file) {
            //         return handleUpload(file); // This function should be defined in your component
            //       },
            //     },
            //   },
            // },
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
              shortcut: "CMD+SHIFT+M",
            },
            underline: Underline,
          },
          placeholder: "Type here",
        });
      }
    };

    initEditor(props.editorValue);

    return () => {
      isMounted = false;
      if (ejInstance.current) {
        ejInstance.current.destroy();
        ejInstance.current = null;
      }
    };
  }, [props.editorValue, props.editorState]);

  return <div id="editorjs"></div>;
};






















// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import EditorJS from "@editorjs/editorjs";
// import Header from "@editorjs/header";
// import List from "@editorjs/list";
// import Table from "@editorjs/table";
// import InlineCode from "@editorjs/inline-code";
// import Underline from "@editorjs/underline";

// export const EditorComponents = (props) => {
//   // const ejInstance = useRef();
//   // const memoizedEditorContent = (() => props.editorContent, [props.editorContent]);
//   // const initEditor = (datas) => {

//   //   if (!ejInstance.current) { // Check if the instance doesn't exist

//   //   const editor = new EditorJS({
//   //     holder: "editorjs",

//   //     onReady: () => {
//   //       ejInstance.current = editor;
//   //     },
//   //     autofocus: true,
//   //     onChange: async () => {
//   //       let content = await editor.saver.save();
//   //       props.editorState(content);
//   //     },
//   //     tools: {
//   //       header: Header,
//   //       list: {
//   //         class: List,
//   //         inlineToolbar: true,
//   //         config: {
//   //           defaultStyle: "unordered",
//   //         },
//   //       },
//   //       table: {
//   //         class: Table,
//   //         inlineToolbar: true,
//   //         config: {
//   //           rows: 2,
//   //           cols: 3,
//   //         },
//   //       },
//   //       inlineCode: {
//   //         class: InlineCode,
//   //         shortcut: "CMD+SHIFT+M",
//   //       },
//   //       underline: Underline,
//   //     },
//   //     data: datas,
//   //     placeholder: "Type here",
//   //   });
//   // }

//   //   if (!ejInstance.current) { // Check if the instance doesn't exist

//   //     const editor = new EditorJS({
//   //       holder: "editorjs",
//   //       data: datas,

//   //       onReady: () => {
//   //         ejInstance.current = editor;
//   //       },
//   //       // ... other options
//   //       onChange: async () => {
//   //         let content = await editor.saver.save();
//   //         props.editorState(content);
//   //       },
//   //     autofocus: true,

//   //       tools: {
//   //         header: Header,

//   //         list: List,
//   //         inlineCode: {
//   //           class: InlineCode,
//   //           shortcut: 'CMD+SHIFT+M',
//   //         },
//   //         underline: Underline,
//   //       },
//   //       placeholder: 'Let`s write an awesome story!',

//   //     });
//   //   }
//   // };

//   // useEffect(() => {
//   //   console.log(props.editorContent);
//   //   if (ejInstance.current === null) {
//   //     initEditor(props.editorContent);
//   //   }

//   //   return () => {
//   //     ejInstance?.current?.destroy();
//   //     ejInstance.current = null;
//   //   };
//   //     if (ejInstance.current === null) {
//   //       initEditor(props.editorContent);
//   // }

//   // return () => {
//   //   ejInstance?.current?.destroy();
//   //   ejInstance.current = null;
//   // };
//   // }, []);

//   // console.log(props.editorContents);
//   //Testing

//   // const ejInstance = useRef();
//   // // const [state,setState] = useState(props.editorContents)
//   // const initEditor = () => {
//   //   const editor = new EditorJS({
//   //     holder: "editorjs",

//   //     onReady: () => {
//   //       ejInstance.current = editor;
//   //     },
//   //     autofocus: true,
//   //     onChange: async () => {
//   //       let content = await editor.saver.save();
//   //       props.editorState(content);
//   //     },
//   //     tools: {
//   //       header: Header,
//   //       list: {
//   //         class: List,
//   //         inlineToolbar: true,
//   //         config: {
//   //           defaultStyle: "unordered",
//   //         },
//   //       },
//   //       table: {
//   //         class: Table,
//   //         inlineToolbar: true,
//   //         config: {
//   //           rows: 2,
//   //           cols: 3,
//   //         },
//   //       },
//   //       inlineCode: {
//   //         class: InlineCode,
//   //         shortcut: 'CMD+SHIFT+M',
//   //       },
//   //       underline: Underline,
//   //     },
//   //     data:{},
//   //     placeholder: "Type here",
//   //   });
//   // };

//   // useEffect(() => {

//   //   if (ejInstance.current === null) {
//   //     initEditor();
//   //   }

//   //   return () => {
//   //     ejInstance?.current?.destroy();
//   //     ejInstance.current = null;
//   //   };
//   // }, []);
//   // console.log(props.editorValue);

//   const ejInstance = useRef();

//   const initEditor = (datas) => {
//     if (!ejInstance.current) {
//       const editor = new EditorJS({
//         holder: "editorjs",
//         onReady: () => {
//           ejInstance.current = editor;
//           console.log("isReady");
//         },
//         autofocus: true,
//         data: datas,
//         onChange: async () => {
//           if(editor){
//             if(!datas && datas != null){
//               let content = await editor.saver.save();
//               props.editorState(content);
//             }
//           }
//         },
//         tools: {
//           header: Header,
//           list: List,
//           underline: Underline,
//         },
//         placeholder: "Type here",
//       });
//     } 
//   };
//   useEffect(() => {

//     let data = {};
//     console.log(ejInstance.current);
//     if (ejInstance.current === null) {

//           initEditor(props.editorValue);
     
//     }



//     let isMounted = true;

//     return () => {
//       isMounted = false;
//       if (ejInstance.current) {
//         ejInstance.current.destroy();
//         ejInstance.current = null;
//       }
//     };
//   }, [props.editorValue]);

//   return <div id="editorjs"></div>;
// };





































//     // if (props.editorValue) {
//     //   initEditor(props.editorValue);
//     // } else if (storedData) {
//     //   initEditor(JSON.parse(storedData)); // Initialize with the stored data
//     // }
//     // else{
//     //   let data = {};
//     //   initEditor(data);
//     // }

