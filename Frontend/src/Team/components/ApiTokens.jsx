import React, { useEffect, useRef, useState } from "react";
import { Select, Space } from "antd";
import axiosClient from "../../axios-client";
import { useParams } from "react-router-dom";
import ClipboardJS from "clipboard";
import { ToastContainer, toast } from "react-toastify";

export const ApiTokens = () => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  let duration = 2000;
  const showToastMessage = (data) => {
    toast.success(data, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: duration,
      hideProgressBar: true,
      draggable: true,
      closeOnClick: true,
    });
  };
  const buttonRef = useRef(null);
  const textToCopyRef = useRef(null);
  let clipboard = null;
  const [apiToken, setApiTokens] = useState([]);
  useEffect(() => {
    getApiTokens();

    // clipboard = new ClipboardJS(buttonRef.current, {
    //   text: () => textToCopyRef.current.innerText,
    // });
    // clipboard.on("success", (e) => {
    //   e.clearSelection(); // Deselect the text
    //   showToastMessage("Link Copied !");
    // });

    // return () => {
    //   if (clipboard) {
    //     clipboard.destroy();
    //   }
    // };
  }, []);

  const getApiTokens = async () => {
    setLoading(true);
    await axiosClient
      .get(`/api/dashboard/getApiTokens/${params.uuid}`)
      .then((res) => {
        setApiTokens(res.data.access_token);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const createTokenHandle = async () => {
    setLoading(true);
    let payLoad = {
      uuid: params.uuid,
    };

    await axiosClient
      .post("/api/dashboard/createAccessToken", payLoad)
      .then((res) => {
        setApiTokens(res.data.access_token);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  // const copyLink = (link) => {
  //   let path = link;
  //   // navigator.clipboard.writeText(path);
  //   console.log("Sffs");
  //   showToastMessage("Token Copied !");
  // };

  const handleChange = (value) => {
    // setIsLoading(true);
    console.log(`selected ${value}`);

    // let payLoad = {
    // }
    // axiosClient.post("/api/createToken",payLoad)
    // .then((res) => {
    //     setIsLoading(false);
    //   })
    //   .catch((err) => {
    //     setIsLoading(false);

    //     console.log(err);
    //   });
  };

  return (
    <div className="m-auto">
      <div className="bg-white w-[900px] h-[550px] shadow-md overflow-auto">
        <div className="w-[850px] m-auto">
          <div className="flex justify-between mt-[25px]  items-center">
            <div>
              <p className="text-textPrimary text-2xl  font-semibold">
                API Create Tokens
              </p>
            </div>
            <div onClick={createTokenHandle}>
              <button
                type="button"
                className="text-primary hover:text-white border border-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg  px-6 py-2 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
              >
                {loading ? (
                  <div role="status" className="">
                    <div role="status" className="" colSpan={4}>
                      <svg
                        aria-hidden="true"
                        className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                      Create Token
                    </div>
                  </div>
                ) : (
                  <>
                    <i className="fa-solid fa-plus pr-1"></i>
                    Create Token
                  </>
                )}
              </button>
            </div>
          </div>
          <hr className="text-gray-400 mt-5" />
          <div className="relative  shadow-md sm:rounded-lg mt-5">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr className="text-center">
                  <th scope="col" className=" py-3">
                    Tokens
                  </th>
                  <th scope="col" className=" py-3">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center">
                      <div role="status" className="py-[50px]">
                        <div role="status" className="py-[50px]" colSpan={4}>
                          <svg
                            aria-hidden="true"
                            className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : apiToken && apiToken.length > 0 ? (
                  apiToken.map((token) => (
                    <tr className="bg-white border-b text-center dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-6 py-4 flex space-x-5">
                        <p className="max-w-[450px] w-[100%] overflow-hidden"
                        ref={textToCopyRef}
                        >
                          {token.token}
                        </p>
                        <p ref={buttonRef} data-clipboard-text="Copy Text">
                          <i className="fa-regular fa-copy text-lg  text-gray-400 cursor-pointer"></i>
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <Select
                          defaultValue={
                            token?.status == 1 ? "active" : "inactive"
                          }
                          style={{
                            width: 120,
                          }}
                          loading={false}
                          onChange={handleChange}
                          options={[
                            {
                              value: "active",
                              label: "active",
                            },
                            {
                              value: "inactive",
                              label: "inactive",
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      <div role="status" className="py-[50px]">
                        <p>No Records Found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ToastContainer />
      {/* {loading && (
      <>
        <div className="bg-[#aeaeca] opacity-[0.5] w-[100%] h-[100vh] absolute top-0 left-0  z-10"></div>
        <div className="">
          <p className="absolute top-[48%] left-[48%] z-50">
            <HashLoader color="#3197e8" />
          </p>
        </div>
      </>
    )} */}
    </div>
  );
};
