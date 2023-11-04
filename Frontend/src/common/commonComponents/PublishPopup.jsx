import React, { useEffect, useState } from "react";
import { Switch } from "antd";
export const PublishPopup = (props) => {
    console.log(props.publish);
    const [publishUrl,setPublishUrl] = useState(props.publish)

    useEffect(() => {
      setPublishUrl(props.publish)
    },[props.publish])
  return (
    <div>
      <div className="bg-primary opacity-[0.5] w-[1289px] h-[664px] absolute top-0 left-0  z-10"></div>
      <div className=" absolute left-0 top-0 z-20">
        <div className="bg-white h-[500px] w-[900px] ml-[200px] mt-[60px] rounded-lg -z-10">
          <div className="flex">
            <div className="w-[280px] mt-8">
              <div className="w-[200px] m-auto space-y-1">
                <div className="hover:bg-[#e5e8f1] p-2 cursor-pointer rounded bg-[#e5e8f1]">
                  <p>Publish to the web</p>
                </div>
                <div className="hover:bg-[#e5e8f1] p-2 cursor-pointer rounded">
                  <p>Invite members</p>
                </div>
              </div>
            </div>
            <div className="bg-[#e5e8f1] w-[650px] h-[500px] rounded-r-lg">
              <div className="">
                <i
                  className="fa-solid fa-xmark text-[#8f97aa] pt-2 float-right text-2xl cursor-pointer mr-5"
                  onClick={() => {
                    props.setShareState(false);
                  }}
                ></i>
              </div>
              <div className="w-[580px] m-auto mt-9 space-y-2">
                <p className="text-2xl font-semibold text-textPrimary">
                  Publish to the web
                </p>
                <p className="text-lg text-[#394863]">
                  Share your content online with a customizable layout.
                </p>
                <div className="box-border border-[#c5ccd8] h-28 w-full border-[1px] rounded bg-white">
                  <div className="flex w-[530px] m-auto space-x-5 mt-3.5">
                    <div>
                      <div className="rounded-full h-8 w-8 bg-primary mt-5">
                        <i class="fa-solid fa-globe text-lg pl-1.5 pt-[0.5px] text-white"></i>
                      </div>
                    </div>
                    <div className="flex space-x-16 ">
                      <div>
                        <p className="text-textPrimary text-xl ">
                          Publish this space to the web
                        </p>
                        <p className="text-textPrimary text-[14px] w-[350px] m-auto pt-1">
                          With an unique configurable URL, indexable by search
                          engines.
                        </p>
                      </div>
                      <div className="pt-5">

                        <Switch default onChange={props.onChange} className="bg-gray-400"/>

                      </div>
                    </div>
                  </div>
                  
                </div>

                {/* {
                <div className="box-border border-[#c5ccd8] h-32 w-full border-[1px] rounded bg-white">
                  <div className="w-[500px] m-auto">
                    <div className="flex justify-between mt-4 items-center">
                      <p className="text-xl">Script Title</p>
                      <div className="box-border border-[#c5ccd8] h-10 w-28 border-[1px] rounded-lg bg-primary flex space-x-2">
                        <p>
                          <i class="fa-solid fa-up-right-from-square pl-2 pt-2.5 text-white "></i>
                        </p>
                        <p className="pt-1.5  text-white ">Visit Site</p>
                      </div>
                    </div>
                    <div className="box-border border-[#c5ccd8] h-10 w-full border-[1px] rounded bg-sky-100 mt-4 ">
                      <div className="flex justify-between w-[450px] items-center m-auto">
                        <p className="">http://localhost:3000/title</p>

                        <div className="box-border border-[#c5ccd8] h-8 w-24 border-[1px] rounded bg-white flex space-x-2 mt-0.5 hover:bg-sky-200 cursor-pointer">
                          <p className="text-lg text-gray-400">
                            <i class="fa-regular fa-copy pl-5 text-sm pr-2 text-gray-400"></i>
                            copy
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                } */}
              </div>
              
              <div>
               {console.log(publishUrl.data)}
               <p>{Object.keys(publishUrl).length == 0 ? "" : `http://localhost:3000${publishUrl.data[0].script.path}`}</p>
                {/* <p>{publishUrl.length > 0 ? `http://localhost:3000${props.publish.data[0].script.path}` : ""}</p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
