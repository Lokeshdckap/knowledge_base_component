import React, { useCallback, useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
// import Header from "@editorjs/header";
import Header from "@editorjs/header";

import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Paragraph from "@editorjs/paragraph";

export const EditorComponents = (props) => {
  console.log(props.editorValue);
  // const editorRef = useRef(null);
  // const editorInstance = useRef(null);

  // console.log(props.editorValue);
  // const [editor, setEditor] = useState(null);

  // const [save, setSave] = useState([]);

  // useEffect(() => {
  //   // console.log(content,"hello");
  //   console.log(editorRef.current);
  //   console.log(editorInstance.current);
  //   if (editorRef.current && !editorInstance.current) {
  //   //     console.log(props.editorValue,"jjj");

  //     editorInstance.current = new EditorJS({
  //       holderId: "editorjs",
  //       tools: {
  //         header: Header,
  //         list: List,
  //         paragraph: Paragraph,
  //         image: {
  //           class: ImageTool,
  //           config: {
  //             endpoints: {
  //               byFile: "http://localhost:4000/uploadFile",
  //               byUrl: "http://localhost:4000/fetchUrl",
  //             },
  //           },
  //         },
  //       },
  //       onReady: () => {
  //         console.log("Editor.js is ready to work!");
  //       },
  //       placeholder: "Type here!",
  //       onChange: () => {
  //         editorInstance.current.save().then((outputData) => {
  //           // Handle changes here
  //           props.editorState(outputData);
  //         });
  //       },
  //       data: content, // Pass the blocks directly from props
  //     });
  //     setEditor(editorInstance);
  //     // console.log(content);
  //   }
  // },[editor,props.editorValue]);

  // Include props.editorValue in the dependency array

  // useEffect(() => {
  //   if (editorInstance.current) {
  //     console.log('props.editorValue:', props.editorValue);
  //     editorInstance.current.isReady.then(() => {
  //       editorInstance.current.render(props.editorValue);
  //     });
  //   }
  // }, [props.editorValue]);
  // const DEFAULT_INITIAL_DATA =  props.editorValue

  // const editorRef = useRef(null);

  // const ejInstance = useRef();

  // const initEditor = () => {
  //   const editor = new EditorJS({
  //     holder: editorRef.current,
  //     onReady: () => {
  //       ejInstance.current = editor;
  //     },
  //     autofocus: true,
  //     data: DEFAULT_INITIAL_DATA, // Set your initial data here
  //     onChange: async () => {
  //       editor.save().then((outputData) => {
  //         props.editorState(outputData);
  //       });
  //     },
  //     tools: {
  //       header: Header,
  //     },
  //   });
  // };

  // // This will run only once
  // useEffect(() => {
  //   if (ejInstance.current === null) {
  //     initEditor();
  //   }

  //   return () => {
  //     ejInstance.current?.destroy();
  //     ejInstance.current = null;
  //   };
  // }, []);

  // return (
  //   <div>
  //     <div ref={editorRef}></div>
  //   </div>
  // );

  // const editorRef = useRef(null);
  // const ejInstance = useRef();

  // const initEditor = () => {
  //   const editor = new EditorJS({
  //     holder: editorRef.current,
  //     onReady: () => {
  //       ejInstance.current = editor;
  //     },
  //     autofocus: true,
  //     data: props.editorValue, // Set your initial data from props
  //     onChange: async () => {
  //       editor.save().then((outputData) => {
  //         props.editorState(outputData);
  //       });
  //     },
  //     tools: {
  //       header: Header,
  //     },
  //   });
  // };

  // // This will run only once
  // useEffect(() => {
  //   if (ejInstance.current === null) {
  //     initEditor();
  //   }

  //   return () => {
  //     ejInstance.current?.destroy();
  //     ejInstance.current = null;
  //   };
  // }, [props]);

  // return (
  //   <div>
  //     <div ref={editorRef}></div>
  //   </div>
  // );

  // const editorRef = useRef(null);
  // const ejInstance = useRef();
  // const [scrollPosition, setScrollPosition] = useState(0);

  // const initEditor = () => {
  //   const editor = new EditorJS({
  //     holder: editorRef.current,
  //     onReady: () => {
  //       ejInstance.current = editor;
  //       // Restore the scroll position after initialization
  //       editorRef.current.scrollTop = scrollPosition;
  //     },
  //     autofocus: true,
  //     data: props.editorValue, // Set your initial data from props
  //     onChange: async () => {
  //       editor.save().then((outputData) => {
  //         props.editorState(outputData);
  //       });
  //     },
  //     tools: {
  //       header: Header,
  //     },
  //   });
  // };

  // // This will run only once
  // useEffect(() => {
  //   // Save the scroll position before reinitializing the editor
  //   setScrollPosition(editorRef.current.scrollTop);

  //   if (ejInstance.current === null) {
  //     initEditor();
  //   }

  //   return () => {
  //     ejInstance.current?.destroy();
  //     ejInstance.current = null;
  //   };
  // }, [props.editorValue]);

  // return (
  //   <div>
  //     <div ref={editorRef}></div>
  //   </div>
  // );

  // const editorRef = useRef(null);
  // const ejInstance = useRef();
  // const [scrollPosition, setScrollPosition] = useState(0);
  // const [cursorPosition, setCursorPosition] = useState(null);

  // const initEditor = () => {
  //   const editor = new EditorJS({
  //     holder: editorRef.current,
  //     onReady: () => {
  //       ejInstance.current = editor;

  //       // Restore the scroll position after initialization
  //       editorRef.current.scrollTop = scrollPosition;

  //       if (cursorPosition) {
  //         editor.selection.setCursor(cursorPosition);
  //       }
  //     },
  //     autofocus: true,
  //     data: props.editorValue, // Set your initial data from props
  //     onChange: async () => {
  //       editor.save().then((outputData) => {
  //         // Save the cursor position
  //         const selection = editor.selection.save();
  //         setCursorPosition(selection);

  //         // props.editorState(outputData);
  //       });
  //     },
  //     tools: {
  //       header: Header,
  //     },
  //   });

  // };

  // // This will run only once
  // useEffect(() => {
  //   // Save the scroll position and cursor position before reinitializing the editor
  //   setScrollPosition(editorRef.current.scrollTop);

  //   if (ejInstance.current === null) {
  //     initEditor();
  //   }

  //   return () => {
  //     ejInstance.current?.destroy();
  //     ejInstance.current = null;
  //   };
  // }, [props.editorValue]);

  // return (
  //   <div>
  //     <div ref={editorRef}></div>
  //   </div>
  // );

  // const editorRef = useRef(null);
  // const ejInstance = useRef();
  // const [scrollPosition, setScrollPosition] = useState(0);
  // const [cursorPosition, setCursorPosition] = useState({ blockIndex: 0, startIndex: 0 }); // Initial cursor position

  // const initEditor = () => {
  //   const editor = new EditorJS({
  //     holder: editorRef.current,
  //     onReady: () => {
  //       ejInstance.current = editor;

  //       // Restore the scroll position after initialization
  //       editorRef.current.scrollTop = scrollPosition;

  //       // Restore the cursor position
  //       if (cursorPosition) {
  //         editor.selection.setRange(cursorPosition);
  //       }
  //     },
  //     autofocus: true,
  //     data: props.editorValue, // Set your initial data from props
  //     onChange: async () => {
  //       editor.save().then((outputData) => {
  //         // Save the cursor position
  //         const range = editor.selection.getRange();
  //         setCursorPosition(range);

  //         props.editorState(outputData);
  //       });
  //     },
  //     tools: {
  //       header: Header,
  //     },
  //   });
  // };

  // // This will run only once
  // useEffect(() => {
  //   // Save the scroll position before reinitializing the editor
  //   setScrollPosition(editorRef.current.scrollTop);

  //   if (ejInstance.current === null) {
  //     initEditor();
  //   }

  //   return () => {
  //     ejInstance.current?.destroy();
  //     ejInstance.current = null;
  //   };
  // }, [props.editorValue]);

  // return (
  //   <div>
  //     <div ref={editorRef}></div>
  //   </div>
  // );

  // const editorRef = useRef(null);
  // const ejInstance = useRef();
  // const [scrollPosition, setScrollPosition] = useState(0);

  // const initEditor = () => {
  //   const editor = new EditorJS({
  //     holder: editorRef.current,
  //     onReady: () => {
  //       ejInstance.current = editor;

  //       // Defer setting the scroll position until after the next render cycle
  //       requestAnimationFrame(() => {
  //         editorRef.current.scrollTop = scrollPosition;
  //       });
  //     },
  //     autofocus: true,
  //     data: props.editorValue, // Set your initial data from props
  //     onChange: async () => {
  //       editor.save().then((outputData) => {
  //         props.editorState(outputData);
  //       });

  //     },
  //     tools: {
  //       header: Header,
  //     },
  //   });
  // };

  // // This will run only once
  // useEffect(() => {
  //   // Save the scroll position before reinitializing the editor
  //   setScrollPosition(editorRef.current.scrollTop);
  //   // props.editorState(props.editorValue)

  //   if (ejInstance.current === null) {
  //     initEditor();
  //   }

  //   return () => {
  //     ejInstance.current?.destroy();
  //     ejInstance.current = null;
  //   };
  // }, [props.editorValue]);

  // return (
  //   <div>
  //     <div ref={editorRef}></div>
  //   </div>
  // );

  // const editorRef = useRef(null);
  // const ejInstance = useRef(null);
  // const [scrollPosition, setScrollPosition] = useState(0);

  // // Function to initialize the editor
  // const initializeEditor = () => {
  //   if (ejInstance.current === null) {
  //     const editor = new EditorJS({
  //       holder: editorRef.current,
  //       onReady: () => {
  //         ejInstance.current = editor;

  //         // Defer setting the scroll position until after the next render cycle
  //         requestAnimationFrame(() => {
  //           editorRef.current.scrollTop = scrollPosition;
  //         });
  //       },
  //       autofocus: true,
  //       data: props.editorValue, // Set your initial data from props
  //       onChange: async () => {
  //         editor.save().then((outputData) => {
  //           props.editorState(outputData);
  //         });
  //       },
  //       tools: {
  //         header: Header,
  //       },
  //     });
  //   }
  // };

  // // Initialize the editor when the component mounts
  // useEffect(() => {
  //   // Save the scroll position before reinitializing the editor
  //   setScrollPosition(editorRef.current.scrollTop);

  //   // Initialize the editor instance
  //   initializeEditor();
  //   console.log('lokk');

  //   // Clean up the editor when the component unmounts
  //   return () => {
  //     ejInstance.current?.destroy();
  //     ejInstance.current = null;
  //   };
  // }, [props.editorValue]); // Provide an empty dependency array to run this effect only once

  // return (
  //   <div>
  //     <div ref={editorRef}></div>
  //   </div>
  // );

  const DEFAULT_INITIAL_DATA = props.editorValue;
  // const ejInstance = useRef();

  // const initEditor = () => {
  //   const editor = new EditorJS({
  //     holder: "editorjs",
  //     onReady: () => {
  //       ejInstance.current = editor;
  //     },
  //     autofocus: true,
  //     data: DEFAULT_INITIAL_DATA,
  //     onChange: async () => {
  //       const content = await editor.saver.save();
  //         props.editorState(content);

  //     },
  //     tools: {
  //       header: Header,
  //       list: List,
  //       paragraph: Paragraph,
  //       image: {
  //         class: ImageTool,
  //         config: {
  //           endpoints: {
  //             byFile: "http://localhost:4000/uploadFile",
  //             byUrl: "http://localhost:4000/fetchUrl",
  //           },
  //         },
  //       },
  //     },
  //   });
  // };

  // // This will run only once
  // useEffect(() => {
  //   if (ejInstance.current === null) {
  //     initEditor();
  //   }

  //   return () => {
  //     ejInstance?.current?.destroy();
  //     ejInstance.current = null;
  //     // useEffect(() => {
  //       // props.editorState(props.editorValue)
  //   // }, [props.editorValue]);
  //   };
  // }, [props.editorValue]);

  // return (
  //   <>
  //     <div id="editorjs"></div>
  //   </>
  // )

  const editorRef = useRef(null);
  const ejInstance = useRef();
  // const [scrollPosition, setScrollPosition] = useState(0);
  const [editorValue, setEditorValue] = useState(DEFAULT_INITIAL_DATA);


      const initEditor = () => {
        const editor = new EditorJS({
          holder: "editorjs",
          onReady: () => {
            ejInstance.current = editor;
          },
          readOnly: true,
          autofocus: false,
          placeholder: 'Let`s write an awesome story!',
          data: DEFAULT_INITIAL_DATA,
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
      };

      // This will run only once
      useEffect(() => {
        if (ejInstance.current === null) {
          initEditor();
        }

        return () => {
          ejInstance?.current?.destroy();
          ejInstance.current = null;
        };
      }, [props.editorValue]);

      return (
        <>
          <div id="editorjs"></div>
        </>
      );
    };

