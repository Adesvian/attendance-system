import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import SingleButton from "../../components/button/Button";
import TextInput from "../../components/input/TextInput";
import axiosInstance from "../../app/api/auth/axiosConfig";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";
import { Button } from "@mui/material";

function Holidays() {
  const dispatch = useDispatch();
  const [holidayName, setHolidayName] = useState("");
  const [holidayDate, setHolidayDate] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => {
    dispatch(setPageTitle({ title: "Events Calendar" }));
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/events`
      );
      const formattedEvents = response.data.data.map((event) => ({
        id: event.id,
        title: event.name,
        date: event.date.split("T")[0],
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const openModal = (name = "", date = "", eventId = null) => {
    setHolidayName(name);
    setHolidayDate(date);
    setSelectedEventId(eventId);
    document.getElementById("ModalEvent").showModal();
  };

  const handleDateClick = (arg) => openModal("", arg.dateStr);

  const handleEventClick = (arg) => {
    const event = events.find((e) => e.id === Number(arg.event.id));
    if (event) openModal(event.title, event.date, event.id);
  };

  const handleModalClose = () => {
    document.getElementById("ModalEvent").close();
    setHolidayName("");
    setHolidayDate("");
    setSelectedEventId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const holiday = {
      name: holidayName,
      date: new Date(holidayDate).toISOString(),
    };

    try {
      const apiUrl = `${import.meta.env.VITE_BASE_URL_BACKEND}/events/${
        selectedEventId || ""
      }`;
      const method = selectedEventId ? axiosInstance.put : axiosInstance.post;
      await method(apiUrl, holiday);

      Swal.fire({
        title: selectedEventId ? "Updated!" : "Success!",
        text: `Holiday has been ${selectedEventId ? "updated" : "added"}!`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchEvents();
    } catch (error) {
      console.error("Error submitting holiday:", error);
    }

    handleModalClose();
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/events/${selectedEventId}`
      );
      Swal.fire({
        title: "Deleted!",
        text: "Holiday has been deleted!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchEvents();
    } catch (error) {
      console.error("Error deleting holiday:", error);
    }

    handleModalClose();
  };

  return (
    <>
      <div className="relative">
        <div className="flex justify-end">
          <Button
            variant="contained"
            className="text-white w-screen md:w-auto"
            onClick={() => {
              setHolidayName("");
              setHolidayDate("");
              setSelectedEventId(null);
              document.getElementById("ModalEvent").showModal();
            }}
          >
            Tambah Event
          </Button>
        </div>
        <dialog id="ModalEvent" className="modal">
          <div className="modal-box bg-white max-w-md w-full p-5">
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-semibold mb-5">
                {selectedEventId ? "Update Event" : "Tambah Event"}
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Event Name
                </label>
                <TextInput
                  type="text"
                  value={holidayName}
                  onChange={(e) => setHolidayName(e.target.value)}
                  required
                  className="input input-bordered w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Event Date
                </label>
                <TextInput
                  type="date"
                  value={holidayDate}
                  onChange={(e) => setHolidayDate(e.target.value)}
                  required
                  className="input input-bordered w-full"
                />
              </div>
              <div className="lg:modal-action flex flex-col md:flex-row gap-y-3">
                <Button
                  type="submit"
                  variant="contained"
                  className="text-white mb-2 md:mb-0 md:mr-2 w-full md:w-auto"
                >
                  {selectedEventId ? "Update" : "Submit"}
                </Button>
                {selectedEventId && (
                  <Button
                    type="button"
                    variant="contained"
                    color="error"
                    className="text-white w-full md:w-auto"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                )}
              </div>
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={handleModalClose}
              >
                ✕
              </button>
            </form>
          </div>
        </dialog>
        <div className="mt-3 md:mt-5">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            events={events}
            eventContent={(arg) => (
              <div className="bg-red-600 text-white p-1 rounded">
                {arg.event.title}
              </div>
            )}
            dayMaxEventRows={true}
            views={{
              dayGridMonth: {
                dayMaxEvents: 3,
              },
            }}
          />
        </div>
      </div>
    </>
  );
}

export default Holidays;
