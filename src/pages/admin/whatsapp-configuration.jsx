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
import axios from "axios";
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
} from "../../app/api/v1/admin-services";

const socket = io(`${import.meta.env.VITE_SOCKET_URL_BACKEND}`);

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
  });
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

  const handleDisconnect = async () => {
    DisconnectSession(setIsConnected, setLoading, data.number);
  };

  const handleDelete = async () => {
    DeleteSession(setLoading, setData, data.number);
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
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/get-whatsapp-creds`
        );
        const fetchedData = response.data.data;

        if (fetchedData.length > 0) {
          const firstEntry = fetchedData[0];
          setData(firstEntry);
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

    socket.on("whatsapp-status", (data) => {
      console.log(data);
    });

    socket.on("connected-creds", async (data) => {
      try {
        await axios.put(
          `${
            import.meta.env.VITE_BASE_URL_BACKEND
          }/update-whatsapp-creds/${data}`
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
    <div className="grid lg:grid-cols-1 md:grid-cols-1 grid-cols-1 gap-6 mt-5">
      <div className="bg-white dark:bg-base-100 rounded-md shadow-md text-gray-800 dark:text-white p-5 px-10 font-poppins">
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
                    label="6287xxxxx"
                    value={data.number}
                    onChange={handleChange}
                    required
                    className="pr-12"
                  />
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
                } bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none flex items-center justify-center`}
                disabled={loading || !isValid}
              >
                {loading && (
                  <span className="loading loading-spinner text-primary mr-2"></span>
                )}
              </SingleButton>
            </div>
          </form>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 mt-5 p-5 shadow-md rounded-md bg-gray-50 dark:bg-base-200 lg:px-10">
            <div className="flex flex-col items-center self-center">
              <img src="../../assets/phone.png" alt="device" className="w-24" />
            </div>
            <div className="flex flex-col w-full md:w-3/4 font-medium gap-y-2">
              <div className="flex items-center">
                <FaRegUser className="w-5 text-gray-600 mr-3" />
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
                          <p className="py-4 text-center">
                            Menunggu QR Code...
                          </p>
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
      </div>
    </div>
  );
}

export default WhatsappConfiguration;
