import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const Search = (props) => {

  let params = useParams();
  let navigate = useNavigate();
  let searchRef = useRef();

  const handleScriptGo = (e) => {
    navigate(e.target.id);
    props.setsearchPopup(false);
    // props.setSearchPageData(null);
    
  };

  useEffect(() => {
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
  }, []);
  return (
    <div>
      <div className="bg-primary opacity-[0.5] w-[1292px] h-screen absolute top-0 left-0  z-10"></div>
      <div className=" absolute left-0 top-0 z-20 ">
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
                
              />
            </div>
          </div>
          <div className="max-h-[320px] overflow-auto pt-3 pb-6">
            {props.searchData !== undefined ? (
              props.searchData ? (
                props.searchData.map((search) => (
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
                    {search.title}
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
          </div>
        </div>
      </div>
    </div>
  );
};
