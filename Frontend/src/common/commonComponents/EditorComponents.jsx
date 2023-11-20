import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import List from "@editorjs/list";
import Table from "@editorjs/table";
import Header from "@editorjs/header";
import InlineCode from "@editorjs/inline-code";
import Underline from "@editorjs/underline";
import Marker from '@editorjs/marker';
import Checklist from '@editorjs/checklist'
import Quote from '@editorjs/quote';
import Embed from '@editorjs/embed';
import ImageTool from "@editorjs/image";
import axiosClient from "../../axios-client";

export const EditorComponents = (props) => {
  const ejInstance = useRef();
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


  useEffect(() => {
    
    if (props.editorValue) {
      if (props.editorValue.length == 0) {
      } else {
        let isMounted = true;
        const initEditor = async (datas) => {
          if (isMounted && ejInstance.current == null) {
            const editor = new EditorJS({
              holder: "editorjs",
              onChange: async () => {
                if (datas !== null) {
                  try {
                    let content = await editor.saver.save();
                    props.editorState(content);
                  } catch (error) {
                    console.error("Error saving content:", error);
                  }
                } else {
                  if (editor) {
                    let content = await editor.saver.save();
                    props.editorState(content);
                  }
                }
              },
              autofocus: true,
              data: datas,
              tools: {
                list: {
                  class: List,
                  inlineToolbar: true,
                  config: {
                    defaultStyle: "unordered",
                  },
                },
                header: Header,
                checklist: {
                  class: Checklist,
                  inlineToolbar: true,
                },
                Marker: {
                  class: Marker,
                  shortcut: 'CMD+SHIFT+M',
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
                  shortcut: 'CMD+SHIFT+O',
                  config: {
                    quotePlaceholder: 'Enter a quote',
                    captionPlaceholder: 'Quote\'s author',
                  },
                },
                embed: {
                    class: Embed,
                    inlineToolbar: true
                },
                underline: Underline,
              },
              placeholder: "Type here",
            });
            editor.isReady
              .then(() => {
                if (isMounted) {
                  ejInstance.current = editor;
                }
              })
              .catch((error) => {
                console.error("Error initializing editor:", error);
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
      }
    } 
    else {
    let isMounted = true;
    console.log(props.editorValue);

      const initEditor = async (datas) => {
        if (isMounted && ejInstance.current == null) {
          const editor = new EditorJS({
            holder: "editorjs",
            onChange: async () => {
              if (datas !== null) {
                try {
                  let content = await editor.saver.save();
                  props.editorState(content);
                } catch (error) {
                  console.error("Error saving content:", error);
                }
              } else {
                if (editor) {
                  let content = await editor.saver.save();
                  props.editorState(content);
                }
              }
            },
            autofocus: true,
            data: datas,
            tools: {
              list: {
                class: List,
                inlineToolbar: true,
                config: {
                  defaultStyle: "unordered",
                },
              },
              header: Header,
              checklist: {
                class: Checklist,
                inlineToolbar: true,
              },
              Marker: {
                class: Marker,
                shortcut: 'CMD+SHIFT+M',
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
                shortcut: 'CMD+SHIFT+O',
                config: {
                  quotePlaceholder: 'Enter a quote',
                  captionPlaceholder: 'Quote\'s author',
                },
              },
              embed: {
                  class: Embed,
                  inlineToolbar: true
              },
              underline: Underline,
            },
            placeholder: "Type here",
          });
          editor.isReady
            .then(() => {
              if (isMounted) {
                ejInstance.current = editor;
              }
            })
            .catch((error) => {
              console.error("Error initializing editor:", error);
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
  }

}, [props.editorValue]);

  return (
    <>
      <div id="editorjs"></div>
      {/* {imageUrl && <img src={imageUrl} alt="Fetched"/>} */}

      <div></div>
    </>
  );
};






