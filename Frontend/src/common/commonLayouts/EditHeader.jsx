import Link from "antd/es/typography/Link";
import React, { useEffect, useState } from "react";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";

export default function EditHeader(props) {

  const items = [
    {
      label: "Save & Publish",
      key: "1",
      onClick: props.handleSaveAndPublish
    },
  ];
  const [loadings, setLoadings] = useState([]);
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

  return (
    <div className="bg-[#ffff] w-[100%]">
      <div
        className={`flex items-center m-auto justify-between relative w-[100%]  2xl:py-[30px] py-[10px]  px-[30px] phone:px-[10px]`}
      >
        <input
          className="text-[#444449] font-bold text-2xl bg-[#EEEEEE] focus:outline-gray-300 w-80 h-11 phone:h-8 pl-2 phone:w-[160px] rounded"
          value={props.inputValue}
          onChange={(e) => props.changeEvent(e.target.value)}
        />
        <div className="flex items-center justify-between max-w-[200px] phone:max-w-[140px]  w-[100%]">

          <div>
            <Space direction="vertical">
              <Dropdown.Button
                onClick={props.clickPublish}
                icon={<DownOutlined  />}
                loading={loadings[1]}
                menu={{
                  items,
                }}
              >
                Save 
              </Dropdown.Button>
            </Space>
          </div>


          <Link to={`dashboard/*`}>
            <button
              type="button"
              className="text-textPrimary border-[1px] phone:text-sm border-gray-400 font-medium rounded-lg text-sm h-9 w-24 phone:w-16 phone:h-7 "
              onClick={props.HandleShare}
            >
              Share
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
