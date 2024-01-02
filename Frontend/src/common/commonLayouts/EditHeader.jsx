import Link from "antd/es/typography/Link";
import React, { useEffect, useState } from "react";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios-client";

export default function EditHeader(props) {
  console.log(props);
  const params = useParams();
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

  const enterLoading = (index) => {
    setLoadings((state) => {
      const newLoadings = [...state];
      newLoadings[index] = true;
      return newLoadings;
    });

    setTimeout(() => {
      setLoadings((state) => {
        const newLoadings = [...state];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 6000);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // You can perform additional checks here if needed
      setSelectedImage(URL.createObjectURL(file));
      setImage(file);
      const formData = new FormData();
      formData.append("uuid", params.slug); // Assuming you have an 'avatar' file to upload
      formData.append("image", file); // Assuming you have an 'avatar' file to upload
      console.log(formData);

      axiosClient
        .put("http://localhost:4000/api/scripts/scriptLogo", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          const response = err.response;
          console.error("Error:", response.status);
        });
    }
  };

  return (
    <div className="bg-[#ffff] w-[100%]">
      <div
        className={`flex items-center m-auto justify-between relative w-[100%]  2xl:py-[30px] py-[10px]  px-[30px] phone:px-[10px]`}
      >
        <div className="flex items-center">
          <div className=" cursor-pointer p-1">
            <label htmlFor="imageInput" className="cursor-pointer">
              {selectedImage ? (
                <>
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="object-cover w-[40px]"
                  />
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
                  {props.renderScript.logo ? (
                    <img src={props.renderScript.logo} alt="" className="w-13 h-10" />
                  ) : (
                    <i className="fa-regular text-slate-600 fa-circle-user text-2xl cursor-pointer pr-1"></i>
                  )}
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
          <div>
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
          </div>

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
}
