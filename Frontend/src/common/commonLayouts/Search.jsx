import React, { useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export const Search = (props) => {
  let params = useParams();
  let navigate = useNavigate();
  let searchRef = useRef();
  const inputRef = useRef(null);

  const handleScriptGo = (e) => {
    navigate(e.target.id);
    props.setsearchPopup(false);
  };



  useEffect(() => {

    if (props.serachPopup || props.searchPopup) {
      inputRef.current.focus();
    }

    const closeOnOutsideClick = (e) => {
      if (
        !searchRef.current.contains(e.target) &&
        e.target !== searchRef.current &&
        e.target !== props.searchInpRef.current
      ) {
        props.setsearchPopup(false);
      }
    };
    window.addEventListener("click", closeOnOutsideClick);
    return () => {
      window.removeEventListener("click", closeOnOutsideClick);
    };
  }, [props.serachPopup,props.searchPopup]);
  return (
    <div>
      <div className="bg-[#a3a2e9] opacity-[0.5] w-screen  h-screen absolute top-0 left-0  z-10"></div>
      <div className=" absolute left-0 top-0 z-20  ">
        <div
          className="bg-[#fff] max-h-[600px] w-[600px] ml-[380px] mt-[60px] rounded-lg -z-10"
          ref={searchRef}
        >
          <div className="w-[550px] m-auto">
            <div className="pt-4  flex items-center gap-2">
              <i className="fa-solid fa-magnifying-glass text-primary "></i>
              <input
                type="text"
                className=" w-[100%] pl-2 h-[30px] outline-none text-textPrimary"
                onChange={props.searchEvent}
                placeholder="search title"
                ref={inputRef}
              />
            </div>
          </div>

          <div className="max-h-[320px] overflow-auto pt-3 pb-6">
            {props.searchData !== undefined ? (
              props.searchData ? (
                <>
                  {props.searchData.scripts.map((search) => (
                    <Link to={`/dashboard/${params.uuid}/s/${search.uuid}`}>
                      <div
                        key={search.id}
                        className="flex justify-between items-center w-[550px] p-2 rounded m-auto hover:bg-sky-100 cursor-pointer"
                        id={`/dashboard/${params.uuid}/s/${search.uuid}`}
                        onClick={handleScriptGo}
                      >
                        <p className="text-textPrimary">{search.title}</p>
                        <p className="text-primary">Go to script</p>
                      </div>
                    </Link>
                  ))}
                  {props.searchData.pages.map((search) => (
                    <Link
                      to={`/dashboard/${params.uuid}/s/${search.script_uuid}/?pageId=${search.uuid}`}
                    >
                      <div
                        key={search.id}
                        className="flex justify-between items-center w-[550px] p-2 rounded m-auto hover:bg-sky-100 cursor-pointer"
                        id={`/dashboard/${params.uuid}/s/${search.script_uuid}/?pageId=${search.uuid}`}
                        onClick={handleScriptGo}
                      >
                        <p className="text-textPrimary">
                          {search.title.split("-")[0]}
                        </p>
                        <p className="text-primary">Go to pages</p>
                      </div>
                    </Link>
                  ))}
                </>
              ) : (
                <div className="text-center pt-5 pb-10">
                  <p className="text-xl text-textPrimary">No Records Found</p>
                </div>
              )
            ) : props.searchPageData ? (
              props.searchPageData.map((search) => (
                <Link to={`/${params.uuid}${search.path}`}>
                  <div
                    className="flex justify-between items-center w-[550px] p-2 rounded m-auto hover:bg-sky-100 cursor-pointer"
                    id={`/${params.uuid}${search.path}`}
                    onClick={handleScriptGo}
                  >
                    <p
                      key={search.id}
                      id={`/${params.uuid}${search.path}`}
                      className="text-textPrimary"
                    >
                      {search.title.split("-")[0]}
                    </p>
                    <p
                      id={`/${params.uuid}${search.path}`}
                      className="text-primary"
                    >
                      Go to Pages
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center pt-5 pb-10">
                <p className="text-xl text-textPrimary">No Pages Found</p>
              </div>
            )}
          </div>

          {/* <div className="max-h-[320px] overflow-auto pt-3 pb-6">
            {props.searchData !== undefined ? (
              props.searchData ? (
                Object.keys(props.searchData)[0] == "scripts" ? (
                  props.searchData?.scripts.map((search) => (
                    <div
                      className="flex justify-between items-center w-[550px] p-2 rounded m-auto hover:bg-sky-100 cursor-pointer"
                      id={`/dashboard/${params.uuid}/s/${search.uuid}`}
                      onClick={handleScriptGo}
                    >
                      <p
                        key={search.id}
                        id={`/dashboard/${params.uuid}/s/${search.uuid}`}
                        className="text-textPrimary"
                      >
                        {search.title}
                      </p>
                      <p
                        id={`/dashboard/${params.uuid}/s/${search.uuid}`}
                        className="text-primary"
                      >
                        Go to script
                      </p>
                    </div>
                  ))
                ) : 
                (
                  props.searchData?.pages.map((search) => (
                    <div
                      className="flex justify-between items-center w-[550px] p-2 rounded m-auto hover:bg-sky-100 cursor-pointer"
                      id={`/dashboard/${params.uuid}/s/${search.script_uuid}/?pageId=${search.uuid}`}
                      onClick={handleScriptGo}
                    >
                      <p
                        key={search.id}
                        id={`/dashboard/${params.uuid}/s/${search.script_uuid}/?pageId=${search.uuid}`}
                        className="text-textPrimary"
                      >
                        {search.title}
                      </p>
                      <p
                        id={`/dashboard/${params.uuid}/s/${search.script_uuid}/?pageId=${search.uuid}`}
                        className="text-primary"
                      >
                        Go to pages
                      </p>
                    </div>
                  ))
                )
              ) : (
                <div className="text-center pt-5 pb-10">

                  <p className="text-xl text-textPrimary">No Records Found</p>
                </div>
              )
            ) : props.searchPageData ? (
              props.searchPageData.map((search) => (
                <div
                  className="flex justify-between items-center w-[550px] p-2 rounded m-auto hover:bg-sky-100 cursor-pointer"
                  id={`/${params.uuid}${search.path}`}
                  onClick={handleScriptGo}
                >
                  <p
                    key={search.id}
                    id={`/${params.uuid}${search.path}`}
                    className="text-textPrimary"
                  >
                    {search.title.split("-")[0]}
                  </p>
                  <p
                    id={`/${params.uuid}${search.path}`}
                    className="text-primary"
                  >
                    Go to Pages
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center pt-5 pb-10">
                <p className="text-xl text-textPrimary">No Pages Found</p>
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};
