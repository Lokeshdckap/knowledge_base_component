import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import List from "@editorjs/list";
import Table from "@editorjs/table";
import Header from "@editorjs/header";
import InlineCode from "@editorjs/inline-code";
import Underline from "@editorjs/underline";
import Marker from "@editorjs/marker";
import Checklist from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import Embed from "@editorjs/embed";
import ImageTool from "@editorjs/image";
import BreakLine from "editorjs-break-line";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { PageTree } from "../commonComponents/PageTree";
import { Search } from "./Search";
import AttachesTool from "@editorjs/attaches";
export const UrlPage = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const [script, setScript] = useState(null);
  const [page, setPages] = useState([]);
  const params = useParams();

  //style State
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  const [serachPopup, setsearchPopup] = useState(false);
  const [searchPageData, setSearchPageData] = useState(null);

  const [parentOpen, setParentOpen] = useState(null);
  const [url, setUrl] = useState(null);
  const [loadPage, setLoadPage] = useState({});

  const searchInpRef = useRef();

  useEffect(() => {
    if (params["*"]) {
      axiosClient
        .get(`/api/public/pages/${params.slug}/${params["*"]}`)
        .then((res) => {
          if (res.status == 200) {
            setLoadPage(res.data.publicUrl);
            setEditorValue(res.data.publicUrl.content);
          }
        })
        .catch((err) => {
          const response = err.response;

          if (response && response?.status === 404) {
            navigate("/error");
          } else {
            console.error("Error:", response?.status);
          }
        });

      axiosClient
        .get(
          `/api/public/documents/${params.uuid}/${params.slug}/${params["*"]}`
        )
        .then((res) => {
          if (!res.data.script.is_published) {
            navigate("/error");
          }
          setParentOpen(res.data.parentPages);
          setPages(res.data.hierarchy);
          setScript(res.data.script);
        })
        .catch((err) => {
          const response = err.response;

          if (response && response?.status === 404) {
            navigate("/error");
          } else {
            console.error("Error:", response?.status);
          }
        });
    }
    if (params.slug && params["*"] == "") {
      axiosClient
        .get(
          `/api/public/documents/${params.uuid}/${params.slug}/${params["*"]}`
        )
        .then((res) => {
          if (!res.data.script.is_published) {
            navigate("/error");
          }
          setPages(res.data.hierarchy);
          setScript(res.data.script);
          setParentOpen(res.data.parentPages);
          navigate(`/${params.uuid}${res.data.hierarchy[0].path}`);
        })
        .catch((err) => {
          const response = err.response;

          if (response && response?.status === 404) {
            navigate("/error");
          } else {
            console.error("Error:", response?.status);
          }
        });

      const updateScreenHeight = () => {
        setScreenHeight(window.innerHeight);
      };
      // Attach the event listener for window resize
      window.addEventListener("resize", updateScreenHeight);
      return () => {
        window.removeEventListener("resize", updateScreenHeight);
      };
    }
  }, [params.slug, params["*"]]);

  const ejInstance = useRef();

  const [editorValue, setEditorValue] = useState(null);

  const contentPage = (e) => {
    let path = e.target.dataset.set;

    navigate(`/${params.uuid}${path}`);
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
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: "unordered",
          },
        },
        header: Header,
        image: {
          class: ImageTool,
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },
        Marker: {
          class: Marker,
          shortcut: "CMD+SHIFT+M",
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
          shortcut: "CMD+SHIFT+ENTER",
        },
        attaches: {
          class: AttachesTool,
        },
        underline: Underline,
      },
    });
  };

  // This will run only once
  useEffect(() => {
    setEditorValue(page.length == 0 ? "" : page[0].content);

    if (ejInstance.current === null && editorValue) {
      initEditor();
    }
    return () => {
      ejInstance?.current?.destroy();
      ejInstance.current = null;
    };
  }, [page]);

  const searchEvent = async (e) => {
    let value = e.target.value;
    let path = params.slug + "/" + params["*"];

    await axiosClient
      .get(
        `/api/dashboard/${params.uuid}/${params.slug}/pageSearch/items?q=${value}`
      )
      .then((res) => {
        if (res.data.length > 0) {
          setSearchPageData(res.data);
        } else {
          setSearchPageData(null);
        }
      })
      .catch((err) => {
        const response = err.response;
        if (response && response?.status === 404) {
          setSearchPageData(null);
        } else {
          console.error("Error:", response?.status);
        }
      });
  };

  return (
    <div className="">
      <div className="flex justify-between items-center py-[20px] px-[30px]">
        <p className="font-bold text-2xl">{script && script.title}</p>
        <input
          type="text"
          placeholder="Search"
          onClick={() => setsearchPopup((prevState) => !prevState)}
          ref={searchInpRef}
          readOnly
          className="bg-gray-200 rounded-md w-48 h-10 pl-2 focus:outline-primary cursor-pointer"
        />
      </div>
      <hr className="" />
      <div className="flex ">
        <div
          className=" overflow-auto"
          style={{
            maxHeight: `calc(${screenHeight}px - 85px)`,
          }}
        >
          <div className="w-[250px] pr-[10px] pl-[24px] pt-[20px]">
            {page.map((topLevelPage, index) => (
              <div
                key={topLevelPage.uuid}
                id={topLevelPage.page_id}
                className=""
              >
                <PageTree
                  node={topLevelPage}
                  hasSibling={index < page.length - 1}
                  hasParent={false}
                  contentPage={contentPage}
                  parentOpen={parentOpen}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-300 w-px"></div>
        <div
          className=" overflow-auto pt-10 pl-14"
          style={{
            width: "calc(100% - 250px)",
            maxHeight: `calc(${screenHeight}px - 85px)`,
          }}
        >
          <h1 className="text-3xl font-bold mb-5">
            {page.length == 0
              ? "Page Name"
              : loadPage.title && loadPage.title.split("-")[0]}
          </h1>
          <h4 className="text-xl mb-5">
            {page.length == 0 ? "Page description" : loadPage.description}
          </h4>
          <div id="editorjs" className="mr-64"></div>
        </div>
      </div>
      {serachPopup && (
        <Search
          searchInpRef={searchInpRef}
          setsearchPopup={setsearchPopup}
          searchEvent={searchEvent}
          searchPageData={searchPageData}
          setSearchPageData={setSearchPageData}
        />
      )}
    </div>
  );
};
