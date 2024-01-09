import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useMyContext } from "../../context/AppContext";
import axiosClient from "../../axios-client";

export const MergeHeader = (props) => {
  const params = useParams();
  const { handleAfterAddedChildrenScripts, getScript } = useMyContext();
  const items = [
    {
      label: "Save & Publish",
      key: "1",
      onClick: props.handleSaveAndPublish,
    },
  ];
  const [loadings, setLoadings] = useState([]);

  const [selectedImage, setSelectedImage] = useState();
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // You can perform additional checks here if needed
      setSelectedImage(URL.createObjectURL(file));
      setImage(file);
      const formData = new FormData();
      formData.append("uuid", params.slug); // Assuming you have an 'avatar' file to upload
      formData.append("image", file); // Assuming you have an 'avatar' file to upload

      axiosClient
        .put("http://localhost:4000/api/scripts/scriptLogo", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (props.renderScript?.batch_uuid) {
            handleAfterAddedChildrenScripts(props.renderScript.batch_uuid);
            props.getParticularScript();
          } else {
            getScript();
            props.getParticularScript();
          }
        })
        .catch((err) => {
          const response = err.response;
          console.error("Error:", response);
        });
    }
  };
  return (
    <div className="bg-[#ffff] w-[100%]">
      <div
        className={`flex items-center m-auto justify-between relative w-[100%]  2xl:py-[30px] py-[10px]  px-[30px] phone:px-[10px] shadow-sm`}
      >
        <div className="flex items-center">
          <div className=" cursor-pointer p-1 ">
            <label htmlFor="imageInput" className="cursor-pointer">
              {props.renderScript.logo ? (
                <>
                  {props.renderScript.logo ? (
                    <div className="w-[38px] h-[38px]">
                      <img
                        src={props.renderScript.logo}
                        alt=""
                        className="w-[100%] h-[100%]"
                      />
                    </div>
                  ) : (
                    <i className="fa-regular  fa-image text-slate-600 text-2xl cursor-pointer pr-1"></i>
                  )}
                  <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </>
              ) : (
                <>
                  <i className="fa-regular  fa-image text-slate-600 text-2xl cursor-pointer pr-1"></i>

                  <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </>
              )}
            </label>
          </div>
          <input
            className="text-[#444449] font-bold text-2xl bg-[#EEEEEE] focus:outline-gray-300 w-80 h-11 phone:h-8 pl-2 phone:w-[160px] rounded"
            value={props.inputValue}
            onChange={(e) => props.changeEvent(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between max-w-[110px] phone:max-w-[140px]  w-[100%]">
          {/* <div>
          <Space direction="vertical">
            <Dropdown.Button
              onClick={props.clickPublish}
              icon={<DownOutlined />}
              loading={loadings[1]}
              menu={{
                items,
              }}
            >
              Save
            </Dropdown.Button>
          </Space>
        </div> */}
          <div>
            <button
              type="button"
              className="text-textPrimary border-[1px] phone:text-sm border-gray-400 font-medium rounded-lg text-sm h-9 w-24 phone:w-16 phone:h-7 hover:bg-primary hover:text-white "
              onClick={props.handleMerge}
            >
              <i className="fa-solid fa-code-merge text-sm pr-1"></i>
              Merge
            </button>
          </div>

          {/* <Link to={`dashboard/*`}>
          <button
            type="button"
            className="text-textPrimary border-[1px] phone:text-sm border-gray-400 font-medium rounded-lg text-sm h-9 w-24 phone:w-16 phone:h-7 "
            onClick={props.HandleShare}
          >
            Edit
          </button>
        </Link> */}

          {/* <Link to={`dashboard/*`}>
          <button
            type="button"
            className="text-textPrimary border-[1px] phone:text-sm border-gray-400 font-medium rounded-lg text-sm h-9 w-24 phone:w-16 phone:h-7 "
            onClick={props.HandleShare}
          >
            Share
          </button>
        </Link> */}
        </div>
      </div>
    </div>
  );
};
