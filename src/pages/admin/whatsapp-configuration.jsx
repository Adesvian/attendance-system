import React, { useEffect, useRef, useState } from "react";
import { setPageTitle } from "../../redux/headerSlice";
import { useDispatch } from "react-redux";
import TextInput from "../../components/input/TextInput";
import SingleButton from "../../components/button/Button";
import { FaCheck } from "react-icons/fa6";
import { IoAlertCircleOutline } from "react-icons/io5";
import { FaRegTrashAlt, FaRegUser, FaWhatsapp } from "react-icons/fa";
import { GrStatusGoodSmall } from "react-icons/gr";
import { BsQrCodeScan } from "react-icons/bs";
import { AiOutlineDisconnect, AiOutlineLink } from "react-icons/ai";
import io from "socket.io-client";
import { QRCodeSVG } from "qrcode.react";
import { PiSealCheckFill } from "react-icons/pi";
import {
  ConnnectSession,
  DeleteSession,
  DisconnectSession,
  functionCloseQR,
  functionOpenQR,
  SubmitSession,
  updateNotification,
} from "../../app/api/v1/admin-services";
import { MdOutlineMessage } from "react-icons/md";
import axiosInstance from "../../app/api/auth/axiosConfig";

let socket;

function WhatsappConfiguration() {
  const dispatch = useDispatch();
  const QRModal = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [qrData, setQrData] = useState("");
  const [data, setData] = useState({
    number: "",
    name: "",
    status: "Pending",
    greet_template: "",
  });
  const [defaultGreetTemplate, setDefaultGreetTemplate] = useState("");
  let QrCount = 0;

  const handleQR = async () => {
    functionOpenQR(QRModal, data.name);
  };

  const handleCloseQR = async (fetchStopSession = false) => {
    functionCloseQR(QRModal, data.name, fetchStopSession);
  };

  const handleConnect = async () => {
    ConnnectSession(setIsConnected, setLoading, data.number);
  };

  const handleGreetSubmit = async (event) => {
    event.preventDefault();
    const greet = event.target.custom_greet.value;
    document.getElementById("modal_greet").close();

    const success = await updateNotification(setLoading, greet, data.number);

    if (!success) {
      setData((prevData) => ({
        ...prevData,
        greet_template: defaultGreetTemplate,
      }));
    } else {
      setDefaultGreetTemplate(greet);
    }
  };

  const handleDisconnect = async () => {
    DisconnectSession(setIsConnected, setLoading, data.number);
  };

  const handleDelete = async () => {
    DeleteSession(setLoading, setData, data.number);
    setIsValid(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "number") {
      setIsValid(value.length >= 8);
    }
  };

  const handleSubmit = async (event) => {
    SubmitSession(event, setLoading, socket, data);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/get-whatsapp-creds`
        );
        const fetchedData = response.data.data;

        if (fetchedData.length > 0) {
          const firstEntry = fetchedData[0];
          setData(firstEntry);
          setDefaultGreetTemplate(firstEntry.greet_template);
          setHasData(true);

          if (firstEntry.status === "active") {
            setIsConnected(true);
          } else if (firstEntry.status === "pending") {
            setIsConnected(false);
          }
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
    dispatch(setPageTitle({ title: "Guru" }));

    socket = io(`${import.meta.env.VITE_SOCKET_URL_BACKEND}`);

    socket.on("creds-created", (data) => {
      setData(data);
      setHasData(true);
    });

    socket.on("qr-update", (data) => {
      setQrData(data);
      QrCount++;
      if (QrCount >= 3) {
        handleCloseQR(true);
        QrCount = 0;
      }
    });

    socket.on("connected-creds", async (data) => {
      try {
        const status_connected = {
          status: "active",
        };
        await axiosInstance.put(
          `${
            import.meta.env.VITE_BASE_URL_BACKEND
          }/update-whatsapp-creds/${data}`,
          status_connected
        );
        setData((prevData) => ({
          ...prevData,
          status: "active",
        }));
      } catch (error) {
        console.log(error);
      }
      handleCloseQR();
      setTimeout(() => {
        setIsConnected(true);
      }, 3000);
    });

    socket.on("stop-session", (data) => {
      setData((prevData) => ({
        ...prevData,
        status: "inactive",
      }));
    });

    socket.on("closed-session", (data) => {
      setHasData(false);
      setData((prevData) => ({
        ...prevData,
        number: "",
        name: "",
        status: "pending",
      }));
    });

    return () => {
      socket.off("whatsapp-status");
      socket.off("creds-created");
      socket.off("qr-update");
      socket.off("connected-creds");
      socket.off("closed-session");
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-2 font-poppins" data-testid="whatsapp-config-element">
      {!hasData ? (
        <form onSubmit={handleSubmit}>
          <div className="mt-5 grid grid-cols-1 gap-x-6 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label
                htmlFor="number"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text"
              >
                No Whatsapp :
              </label>
              <div className="mt-2 relative">
                <TextInput
                  id="number"
                  name="number"
                  type="number"
                  label="1234567890"
                  value={data.number}
                  onChange={handleChange}
                  required
                  className="px-12 "
                />
                <span className="absolute inset-y-0 left-3 flex items-center">
                  +62
                </span>
                <span className="absolute inset-y-0 right-3 flex items-center">
                  {isValid ? (
                    <FaCheck className="text-green-500" />
                  ) : (
                    <IoAlertCircleOutline className="text-red-500" />
                  )}
                </span>
              </div>
            </div>
            <div className="sm:col-span-6">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-dark-text"
              >
                Nama Device :
              </label>
              <div className="mt-2">
                <TextInput
                  id="name"
                  name="name"
                  type="text"
                  label="Device Name"
                  value={data.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-5">
            <SingleButton
              btnTitle={loading ? "loading" : "Submit"}
              type="submit"
              className={`px-4 py-2 ${
                loading || !isValid ? "opacity-50 cursor-not-allowed" : ""
              } bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none flex items-center justify-center`}
              disabled={loading || !isValid}
            >
              {loading && (
                <span className="loading loading-spinner text-primary mr-2"></span>
              )}
            </SingleButton>
          </div>
        </form>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 mt-5 p-5 rounded-md lg:px-10">
          <div className="flex flex-col items-center self-center">
            <img src="./assets/phone.png" alt="device" className="w-24" />
          </div>
          <div className="flex flex-col w-full md:w-3/4 font-medium gap-y-2">
            <div className="flex items-center">
              <FaRegUser className="w-5 text-gray-600 dark:text-gray-300 mr-3" />
              <p>{data.name}</p>
            </div>
            <div className="flex items-center">
              <FaWhatsapp className="w-5 text-green-600 mr-3" />
              <p>+{data.number}</p>
            </div>
            <div className="flex items-center">
              {data.status === "pending" && (
                <GrStatusGoodSmall className="w-5 text-gray-300 mr-3" />
              )}
              {data.status === "active" && (
                <GrStatusGoodSmall className="w-5 text-green-500 mr-3" />
              )}
              {data.status === "inactive" && (
                <GrStatusGoodSmall className="w-5 text-red-500 mr-3" />
              )}
              <p>{data.status}</p>
            </div>
          </div>

          <div className="flex flex-col justify-center w-full md:w-1/4">
            <div className="grid grid-cols-1 gap-2">
              {data.status === "pending" && (
                <>
                  <SingleButton
                    btnTitle="Scan QR"
                    type="button"
                    className="bg-black text-white hover:bg-black"
                    onClick={handleQR}
                  >
                    <BsQrCodeScan className="mr-2" />
                  </SingleButton>
                  <dialog ref={QRModal} className="modal">
                    <div className="modal-box bg-white">
                      {qrData ? (
                        <div className="py-4 flex flex-col items-center justify-center relative">
                          <QRCodeSVG value={qrData} size={300} />
                          {isConnected && (
                            <div className="absolute flex items-center justify-center">
                              <div className="bg-black rounded-full w-10 h-10 absolute z-0"></div>
                              <PiSealCheckFill className="text-green-600 w-16 h-16 z-10" />
                            </div>
                          )}
                          <p className="mt-4 text-lg text-center">
                            Scan the QR code above
                          </p>
                        </div>
                      ) : (
                        <p className="py-4 text-center">Menunggu QR Code...</p>
                      )}
                    </div>

                    <form
                      method="dialog"
                      className="modal-backdrop"
                      onClick={handleCloseQR}
                    >
                      <button>close</button>
                    </form>
                  </dialog>
                </>
              )}
              {data.status !== "pending" && (
                <>
                  <SingleButton
                    btnTitle="Custom Notification"
                    type="button"
                    className="bg-gray-600 text-white hover:bg-gray-700"
                    onClick={() =>
                      document.getElementById("modal_greet").showModal()
                    }
                  >
                    <MdOutlineMessage className="mr-2" />
                  </SingleButton>

                  <SingleButton
                    btnTitle="Connect"
                    type="button"
                    className="bg-green-600 text-white hover:bg-green-700"
                    onClick={handleConnect}
                  >
                    <AiOutlineLink className="mr-2 transform rotate-45" />
                  </SingleButton>
                  <SingleButton
                    btnTitle="Disconnect"
                    type="button"
                    className="bg-black text-white hover:bg-black"
                    onClick={handleDisconnect}
                  >
                    <AiOutlineDisconnect className="mr-2" />
                  </SingleButton>
                </>
              )}
              <SingleButton
                btnTitle="Delete"
                type="button"
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={handleDelete}
              >
                <FaRegTrashAlt className="mr-2" />
              </SingleButton>
            </div>
          </div>
        </div>
      )}
      <dialog id="modal_greet" className="modal">
        <div className="modal-box bg-white dark:bg-gray-800 w-11/12 max-w-5xl h-3/4 lg:h-1/2 max-h-5xl">
          <form onSubmit={handleGreetSubmit} className="flex flex-col h-full">
            {/* Tombol Close */}
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => document.getElementById("modal_greet").close()} // Menutup modal
            >
              ✕
            </button>
            <h3 className="font-bold text-lg mb-2">Set Custom Notification</h3>
            <textarea
              name="custom_greet"
              placeholder="Enter your custom greeting here"
              className="w-full h-60 p-2 border border-gray-300 dark:bg-gray-800 rounded"
              value={data.greet_template}
              onChange={(e) =>
                setData((prevData) => ({
                  ...prevData,
                  greet_template: e.target.value,
                }))
              }
            />
            <div className="flex gap-2 mt-2">
              <span className="text-red-500">*</span>
              <span className="italic text-xs lg:text-sm">
                Gunakan Variabel ini:
                {"{nama}, {waktu}, {metode}, {status}"}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-red-500">*</span>{" "}
              <span className="text-xs lg:text-sm">
                Gunakan *...* untuk membuat tulisan bold
              </span>
            </div>
            <div className="mt-auto flex justify-end">
              <button
                type="submit"
                className="btn bg-indigo-500 text-white border-none hover:bg-indigo-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default WhatsappConfiguration;
