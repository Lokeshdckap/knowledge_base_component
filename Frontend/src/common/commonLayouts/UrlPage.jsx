import React, { useEffect, useRef, useState } from 'react';
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Paragraph from "@editorjs/paragraph";

export const UrlPage = () => {



    // const editorRef = useRef(null);
    const ejInstance = useRef();
  const DEFAULT_INITIAL_DATA = {
    time: 1635191810022, // Timestamp
    blocks: [
      {
        type: "header",
        data: {
          text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          level: 2,
        },
      },
      {
        type: "paragraph",
        data: {
          text: "This is a simple example of Editor.js data.",
        },
      },
      {
        type: "list",
        data: {
          style: "unordered",
          items: ["Item 1", "Item 2", "Item 3"],
        },
      },
      {
        type: "paragraph",
        data: {
          text: "You can add and structure content as blocks.",
        },
      },
    ],
    version: "2.22.2", // Editor.js version
  };
  ;

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
            //   props.editorState(content);
            //   console.log(content);
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
        }, []);
  return (
    <div className=''>
        <div className='flex justify-between w-[1200px] m-auto  mt-6 mb-6 items-center'>
            <p className='font-bold text-2xl'>R&D</p>

            <input type="text"  placeholder='Search' className='bg-gray-200 rounded-md w-48 h-10 pl-2 focus:outline-primary' />
        </div>
        <hr className='' />
        <div className='flex '>
            <div className='w-[250px] ml-12'>
                <h3 className='text-3xl mt-5'>Pages</h3>
                
            </div>  
            <div className='bg-gray-300 h-[543px] w-px'>

            </div>

            <div className='h-[520px] overflow-auto pt-12 pl-14 w-[1000px]'>
                <h1 className='text-3xl font-bold mb-5'>Page Name</h1>
                <h4 className='text-xl mb-5'>Page description</h4>
                <div id="editorjs" className='mr-64'></div>
            </div>
        </div>
    </div>
  )
}
