import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import List from "@editorjs/list";
import Table from "@editorjs/table";
import Underline from "@editorjs/underline";
import Marker from "@editorjs/marker";
import Quote from "@editorjs/quote";
import Embed from "@editorjs/embed";
import ImageTool from "@editorjs/image";
import BreakLine from "editorjs-break-line";
import axiosClient from "../../axios-client";
import AttachesTool from "@editorjs/attaches";
import Header from "@editorjs/header";
import { useMyContext } from "../../context/AppContext";

export const EditorComponents = (props) => {

  const {
    screenHeight,
    setScreenHeight,
    hasChanges,
    setHasChanges,
    handleLinkClick,
  } = useMyContext();


  const ejInstance = useRef();


  const initEditor = () => {
    const editor = new EditorJS({
      holder: "editorjs",
      onReady: () => {
        ejInstance.current = editor;
      },
      autofocus: true,
      readOnly: false,
      data: props.editorValue,
      onChange: async () => {
        try {
          // Check if editor is defined before calling save method
          if (editor) {
            const content = await editor.saver.save();
            setHasChanges(true);
            props.setEditorContent(content);
          }
        } catch (error) {
          console.error("Error saving content:", error);
        }
      },
      tools: {
        header: {
          class: Header,
          config: {
            placeholder: "Enter a header",
            levels: [2, 3, 4],
            defaultLevel: 3,
          },
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: "unordered",
          },
        },
        Marker: {
          class: Marker,
          shortcut: "CMD+SHIFT+M",
        },
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file) {
                const formData = new FormData();

                formData.append("image", file);

                const response = await axiosClient.post(
                  `/api/dashboard/uploadImage`,
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                    withCredentials: false,
                  }
                );
                if (response.data.success === true) {
                  return Promise.resolve({
                    success: 1,
                    file: {
                      url: response?.data?.image?.filename,
                    },
                  });
                }
              },

              async uploadByUrl(url) {
                const response = await axiosClient.post(
                  `http://localhost:4001/api/uploadImage/createByUrl`,
                  {
                    url,
                  }
                );

                if (response.data.success === 1) {
                  return response.data;
                }
              },
            },
            inlineToolbar: true,
          },
        },
        attaches: {
          class: AttachesTool,
          config: {
            uploader: {
              async uploadByFile(file) {
                const formData = new FormData();

                formData.append("image", file);

                const response = await axiosClient.post(
                  `/api/dashboard/uploadImage`,
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                    withCredentials: false,
                  }
                );
                if (response.data.success === true) {
                  return Promise.resolve({
                    success: 1,
                    file: {
                      url: response?.data?.image?.filename,
                    },
                  });
                }
              },
            },
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
        quote: {
          class: Quote,
          inlineToolbar: true,
          shortcut: "CMD+SHIFT+O",
          config: {
            quotePlaceholder: "Enter a quote",
            captionPlaceholder: "Quote's author",
          },
        },
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
              coub: true,
              facebook: true,
              instagram: true,
            },
          },
        },
        breakLine: {
          class: BreakLine,
          inlineToolbar: true,
          shortcut: "CMD+SHIFT+ENTER",
        },
        underline: Underline,
      },
      placeholder: "Type here",
    });
  };
  // This will run only once
  useEffect(() => {
    if (ejInstance.current === null && !ejInstance.current) {
      initEditor();
    }

    return async () => {
      ejInstance?.current?.destroy();

      ejInstance.current = null;
    };
  }, [props.editorValue]);
  return (
    <>
      <div id="editorjs" className="z-0 2xl:mr-1240px" ></div>
    </>
  );
};
