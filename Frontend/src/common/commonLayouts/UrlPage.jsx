import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Paragraph from "@editorjs/paragraph";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { PageTree } from "../commonComponents/PageTree";

export const UrlPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [script, setScript] = useState(null);
  const [page, setPages] = useState([]);
  const { slug, "*": wildcardValue } = useParams();

  const [url, setUrl] = useState(null);
  const [loadPage, setLoadPage] = useState({});

  useEffect(() => {
    if (wildcardValue) {
      axiosClient
        .get(`/pages/${slug}/${wildcardValue}`)
        .then((res) => {
          // setPages(res.data);
          // setScript(res.data.script);
          setLoadPage(res.data.publicUrl);
          setEditorValue(res.data.publicUrl.content);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    axiosClient
      .get(`/documents/${slug}`)
      .then((res) => {
        setPages(res.data.hierarchy);
        setScript(res.data.script);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [wildcardValue]);
  // console.log(loadPage.title);

  // const editorRef = useRef(null);
  const ejInstance = useRef();

  // const DEFAULT_INITIAL_DATA = "";

  // const [scrollPosition, setScrollPosition] = useState(0);
  const [editorValue, setEditorValue] = useState(null);

  const contentPage = (e) => {
    let path = e.target.dataset.set;
    navigate(`${path}`);
  };

  const initEditor = () => {
    const editor = new EditorJS({
      holder: "editorjs",
      onReady: () => {
        ejInstance.current = editor;
      },
      readOnly: true,
      autofocus: false,
      placeholder: "Let`s write an awesome story!",
      data: editorValue,
      onChange: async () => {
        let content = await editor.saver.save();
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
    setEditorValue(page.length == 0 ? "" : page[0].content);

    if (ejInstance.current === null && editorValue) {
      initEditor();
      console.log("editor is ready");
    }

    return () => {
      ejInstance?.current?.destroy();
      ejInstance.current = null;
    };
  }, [page]);
  return (
    <div className="">
      <div className="flex justify-between w-[1200px] m-auto  mt-6 mb-6 items-center">
        <p className="font-bold text-2xl">{script && script.title}</p>
        <input
          type="text"
          placeholder="Search"
          className="bg-gray-200 rounded-md w-48 h-10 pl-2 focus:outline-primary"
        />
      </div>
      <hr className="" />
      <div className="flex ">
        <div className="w-[250px] m-auto h-[540px] pr-2 overflow-auto">
          <h3 className="text-3xl mt-5 mb-5">DCKAP</h3>

          {page.map((topLevelPage, index) => (
            <div
              key={topLevelPage.page_id}
              id={topLevelPage.page_id}
              className=""
            >
              <PageTree
                node={topLevelPage}
                hasSibling={index < page.length - 1}
                hasParent={false}
                contentPage={contentPage}

              />
            </div>
          ))}
        </div>
        <div className="bg-gray-300 h-[543px] w-px"></div>

        <div className="h-[520px] overflow-auto pt-12 pl-14 w-[1000px]">
          <h1 className="text-3xl font-bold mb-5">
            {page.length == 0 ? "Page Name" : loadPage.title}
          </h1>
          <h4 className="text-xl mb-5">
            {page.length == 0 ? "Page description" : loadPage.description}
          </h4>
          <div id="editorjs" className="mr-64"></div>
        </div>
      </div>
    </div>
  );
};
