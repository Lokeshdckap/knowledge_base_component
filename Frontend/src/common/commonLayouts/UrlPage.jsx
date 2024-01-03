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
import HashLoader from "react-spinners/HashLoader";
import { formatDistanceToNow, isValid } from "date-fns";

export const UrlPage = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const [script, setScript] = useState(null);
  const [page, setPages] = useState([]);
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //style State
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const [serachPopup, setsearchPopup] = useState(false);
  const [searchPageData, setSearchPageData] = useState(null);

  const [parentOpen, setParentOpen] = useState(null);
  const [url, setUrl] = useState(null);
  const [loadPage, setLoadPage] = useState({});

  const searchInpRef = useRef();
  const createdAt = script?.createdAt;
  let formattedTime = "Invalid date";

  if (createdAt && isValid(new Date(createdAt))) {
    formattedTime = formatDistanceToNow(new Date(createdAt), {
      addSuffix: true,
    });
  }
  const updatedAt = script?.updatedAt;
  let formattedTimes = "Invalid date";

  if (createdAt && isValid(new Date(updatedAt))) {
    formattedTimes = formatDistanceToNow(new Date(updatedAt), {
      addSuffix: true,
    });
  }

  useEffect(() => {
    if (params["*"]) {
      setLoading(true);
      axiosClient
        .get(`/api/public/pages/${params.slug}/${params["*"]}`)
        .then((res) => {
          if (res.status == 200) {
            setLoading(false);

            setLoadPage(res.data.publicUrl);
            setEditorValue(res.data.publicUrl.content);
          }
        })
        .catch((err) => {
          setLoading(false);

          const response = err.response;

          if (response && response?.status === 404) {
            navigate("/underMaintenance");
          } else {
            console.error("Error:", response?.status);
          }
        });

      axiosClient
        .get(
          `/api/public/documents/${params.uuid}/${params.slug}/${params["*"]}`
        )
        .then((res) => {
          console.log(res);
          if (!res.data.script.is_published) {
            navigate("/underMaintenance");
          }
          setParentOpen(res.data.parentPages);
          setPages(res.data.hierarchy);
          setLoading(false);

          setScript(res.data.script);
          console.log(res.data.script);
        })
        .catch((err) => {
          const response = err.response;
          setLoading(false);
          if (response && response?.status === 404) {
            navigate("/underMaintenance");
          } else {
            console.error("Error:", response?.status);
          }
        });
    }
    if (params.slug && params["*"] == "") {
      setLoading(true);
      axiosClient
        .get(
          `/api/public/documents/${params.uuid}/${params.slug}/${params["*"]}`
        )
        .then((res) => {
          if (!res.data.script.is_published) {
            navigate("/underMaintenance");
          }
          setLoading(false);

          setPages(res.data.hierarchy);
          setScript(res.data.script);
          setParentOpen(res.data.parentPages);
          navigate(`/${params.uuid}${res.data.hierarchy[0].path}`);
        })
        .catch((err) => {
          const response = err.response;

          if (response && response?.status === 404) {
            navigate("/underMaintenance");
          } else {
            console.error("Error:", response?.status);
            setLoading(false);
          }
          setLoading(false);
        });

      const updateScreenHeight = () => {
        setScreenWidth(window.innerWidth);
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
      <div className="flex justify-between items-center py-[20px] px-[30px] shadow-sm">
        <div className="flex items-center space-x-2">
          {script?.logo ? (
            <img src={script?.logo} alt="" className="w-8 " />
          ) : (
            <i className="fa-regular text-slate-600 fa-circle-user text-2xl cursor-pointer pr-1"></i>
          )}
          <p className="font-bold text-2xl phone:text-xl font-inter">
            {script && script.title}
          </p>
        </div>

        <input
          type="text"
          placeholder="Search"
          onClick={() => setsearchPopup((prevState) => !prevState)}
          ref={searchInpRef}
          readOnly
          className="bg-[#f0f3f7] rounded-md w-48 h-10 phone:w-28 phone:h-9 pl-2 focus:outline-primary  cursor-pointer"
        />
      </div>
      <hr className="" />
      <div className="flex ">
        <div
          className=" overflow-x-hidden"
          style={{
            maxHeight: `calc(${screenHeight}px - 85px)`,
          }}
        >
          <div className="w-[250px]  phone:w-[150px]  pr-[10px] pl-[24px] pt-[20px]">
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
          className=" overflow-auto pt-10 phone:pl-[6px] px-14  "
          style={{
            width:
              screenWidth > "425" ? "calc(100% - 250px)" : "calc(100% - 150px)",
            maxHeight: `calc(${screenHeight}px - 85px)`,
          }}
        >
          <div className=" flex justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <img
                  className="cursor-pointer w-[25px]"
                  src={
                    loadPage?.emoji
                      ? loadPage?.emoji
                      : `https://icons.getbootstrap.com/assets/icons/emoji-smile.svg`
                  }
                />
                <h1 className="text-3xl font-bold phone:text-[18px] font-inter  phone:w-[190px] ">
                  {page?.length == 0
                    ? "Page Name"
                    : loadPage?.title && loadPage?.title.split("-")[0]}
                </h1>
              </div>
              <h4 className="text-xl my-3 ml-[32px] font-inter phone:text-[16px] phone:w-[170px] ">
                {page?.length == 0 ? "Page description" : loadPage?.description}
              </h4>
            </div>
            <div className="float-right">
              <p className="text-[#69747e] text-sm ">
                <span className="font-medium text-[#25282b] text-sm">
                  Created By Team :
                </span>{" "}
                {script?.title} Team
              </p>
              <p className="text-[#69747e] text-sm pt-1">
                <span className="font-medium text-[#25282b] text-sm ">
                  Created At :
                </span>{" "}
                     {formattedTime}
              </p>
              <p className="text-[#69747e] text-sm pt-1">
                <span className="font-medium text-[#25282b] text-sm">
                  Last Modified At :
                </span>{" "}
                {formattedTimes}
              </p>
            </div>
          </div>

          <div id="editorjs" className="mr-64 phone:pl-[30px] font-inter "></div>
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
      {loading && (
        <>
          <div className="bg-[#aeaeca] opacity-[0.5] w-[100%] h-[100vh] absolute top-0 left-0  z-10"></div>
          <div className="">
            <p className="absolute top-[48%] left-[48%] z-50 ">
              <HashLoader color="#3197e8" />
            </p>
          </div>
        </>
      )}
    </div>
  );
};
