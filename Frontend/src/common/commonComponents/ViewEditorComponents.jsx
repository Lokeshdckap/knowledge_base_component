import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import List from "@editorjs/list";
import Table from "@editorjs/table";
import Header from '@editorjs/header';
import Underline from "@editorjs/underline";
import Marker from "@editorjs/marker";
import Quote from "@editorjs/quote";
import Embed from "@editorjs/embed";
import ImageTool from "@editorjs/image";
import BreakLine from 'editorjs-break-line';
import axiosClient from "../../axios-client";
import AttachesTool from "@editorjs/attaches";
export const ViewEditorComponents = (props) => {
    const [imageUrl, setImageUrl] = useState("");
    const handleUpload = async (file) => {
      const formData = new FormData();
  
      formData.append("image", file);
  
      try {
        axiosClient
          .post("/uploadImage", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })  
          .then((res) => {
            setImageUrl(res.data.image.filename);
          });
      } catch (error) {
        console.error("Error parsing JSON or response undefined:", error);
      }
      try {
        axiosClient.get("/fetchImage").then((res) => {
          setImageUrl(res.data.image.filename);
        });
      } catch (error) {
        console.error("Error parsing JSON or response undefined:", error);
      }
    };
  
    const ejInstance = useRef();
  
    const initEditor = () => {
      const editor = new EditorJS({
        holder: "editorjs",
        onReady: () => {
          ejInstance.current = editor;
        },
        autofocus: false,
        data: props.editorValue,
        readOnly:true,
        onChange: async () => {
          try {
            // Check if editor is defined before calling save method
            if (editor) {
              const content = await editor.saver.save();
              props.setEditorContent(content);
            }
          } catch (error) {
            console.error("Error saving content:", error);
          }
        },
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
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
            inlineToolbar: true,
            config: {
              uploader: {
                uploadByFile(file) {
                  return handleUpload(file);
                },
              },
              byUrl: imageUrl, // Make sure imageUrl contains a valid URL
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
            inlineToolbar: true,
          },
          breakLine: {
            class: BreakLine,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+ENTER',
          },
          attaches: {
            class: AttachesTool,
          },
          underline: Underline,
        },
        placeholder: "Type here",
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