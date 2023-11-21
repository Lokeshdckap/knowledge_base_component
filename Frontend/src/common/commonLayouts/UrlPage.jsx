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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { PageTree } from "../commonComponents/PageTree";
import { Search } from "./Search";

export const UrlPage = () => {


  const location = useLocation();
  const navigate = useNavigate();

  const [script, setScript] = useState(null);
  const [page, setPages] = useState([]);
  const params = useParams();

  const [serachPopup,setsearchPopup] = useState(false);
  const [searchPageData, setSearchPageData] = useState(null);


  const [url, setUrl] = useState(null);
  const [loadPage, setLoadPage] = useState({});

  const searchInpRef = useRef();

  useEffect(() => {
    if (params["*"]) {
      axiosClient
        .get(`/pages/${params.slug}/${params["*"]}`)
        .then((res) => {
          if (res.status == 200) {
            setLoadPage(res.data.publicUrl);
            setEditorValue(res.data.publicUrl.content);
          }
        })
        .catch((err) => {
          const response = err.response;

          if (response && response.status === 409) {

          } else {
            console.error("Error:", response.status);
          }
        });


        axiosClient
         .get(`/documents/${params.uuid}/${params.slug}`)
        .then((res) => {
          if (!res.data.script.is_published) {
            navigate("/");
          }
          setPages(res.data.hierarchy);
          setScript(res.data.script);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if(params.slug && params["*"] == ""){
    axiosClient
      .get(`/documents/${params.uuid}/${params.slug}`)
      .then((res) => {
        if (!res.data.script.is_published) {
          navigate("/");
        }
        setPages(res.data.hierarchy);
        setScript(res.data.script);
        navigate(`/${params.uuid}${res.data.hierarchy[0].path}`);
      })
      .catch((err) => {
        console.log(err);
      });
    
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



  //search

  const searchEvent = async(e) => {
    let value = e.target.value;
    let path = params.slug+"/"+params["*"]

    await axiosClient
      .get(`${params.uuid}/${params.slug}/pageSearch/items?q=${value}`)
      .then((res) => {
        console.log(res.data);
        if (res.data.length > 0) {


          setSearchPageData(res.data);
        } else {
          setSearchPageData(null);
        }
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 404) {
          setSearchPageData(null);
        } else {
          console.error("Error:", response.status);
        }
      });
  }
  return (
    <div className="">
      <div className="flex justify-between w-[1200px] m-auto  mt-6 mb-6 items-center">
        <p className="font-bold text-2xl">{script && script.title}</p>
        <input
          type="text"
          placeholder="Search"
          onClick={()=>setsearchPopup((prevState) => !prevState)}
          ref={searchInpRef}
          value=""
          className="bg-gray-200 rounded-md w-48 h-10 pl-2 focus:outline-primary cursor-pointer"
        />
      </div>
      <hr className="" />
      <div className="flex ">
        <div className="w-[250px] m-auto mt-5 h-[540px] pr-2 overflow-auto">
          {/* <h3 className="text-3xl mt-5 mb-5">DCKAP</h3> */}
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
      {serachPopup &&

       <Search 
          searchInpRef={searchInpRef}
          setsearchPopup={setsearchPopup}
          searchEvent={searchEvent}
          searchPageData={searchPageData}
          setSearchPageData={setSearchPageData}
       /> 

      }
    </div>
  );
};
