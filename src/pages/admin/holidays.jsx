import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import SingleButton from "../../components/button/Button";
import TextInput from "../../components/input/TextInput";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../redux/headerSlice";

function Holidays() {
  const dispatch = useDispatch();
  const [holidayName, setHolidayName] = useState("");
  const [holidayDate, setHolidayDate] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => {
    dispatch(setPageTitle({ title: "Events Calendar" }));
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
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

    fetchEvents();
  }, []);

  const handleDateClick = (arg) => {
    const existingEvent = events.find((event) => event.date === arg.dateStr);
    if (existingEvent) {
      Swal.fire({
        title: "Error!",
        text: "An event already exists on this date!",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }
    setHolidayDate(arg.dateStr);
    setHolidayName("");
    setSelectedEventId(null);
    document.getElementById("ModalEvent").showModal();
  };

  const handleEventClick = (arg) => {
    const eventId = Number(arg.event.id);
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setHolidayName(event.title);
      setHolidayDate(event.date);
      setSelectedEventId(event.id);
      document.getElementById("ModalEvent").showModal();
    }
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
      if (selectedEventId) {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/events/${selectedEventId}`,
          holiday
        );
        Swal.fire({
          title: "Updated!",
          text: "Holiday has been updated!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL_BACKEND}/events`,
          holiday
        );
        Swal.fire({
          title: "Success!",
          text: "Holiday has been added!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      const fetchEvents = async () => {
        try {
          const response = await axios.get(
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

      fetchEvents();
    } catch (error) {
      console.error("Error submitting holiday:", error);
    }

    handleModalClose();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL_BACKEND}/events/${selectedEventId}`
      );
      Swal.fire({
        title: "Deleted!",
        text: "Holiday has been deleted!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      const fetchEvents = async () => {
        try {
          const response = await axios.get(
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

      fetchEvents();
    } catch (error) {
      console.error("Error deleting holiday:", error);
    }

    handleModalClose();
  };

  return (
    <>
      <div className="relative">
        <SingleButton
          className="bg-blue-500 hover:bg-blue-600 text-white absolute -top-14 right-0 w-full lg:w-fit"
          onClick={() => {
            setHolidayName("");
            setHolidayDate("");
            setSelectedEventId(null);
            document.getElementById("ModalEvent").showModal();
          }}
          btnTitle="Tambah Event"
        />
        <dialog id="ModalEvent" className="modal">
          <div className="modal-box bg-white max-w-md w-full p-5">
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-semibold mb-5">
                {selectedEventId ? "Update Event" : "Tambah Event"}
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium">Event Name</label>
                <TextInput
                  type="text"
                  value={holidayName}
                  onChange={(e) => setHolidayName(e.target.value)}
                  required
                  className="input input-bordered w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Event Date</label>
                <TextInput
                  type="date"
                  value={holidayDate}
                  onChange={(e) => setHolidayDate(e.target.value)}
                  required
                  className="input input-bordered w-full"
                />
              </div>
              <div className="lg:modal-action flex flex-col md:flex-row">
                <SingleButton
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white mb-2 md:mb-0 md:mr-2 w-full md:w-auto"
                >
                  {selectedEventId ? "Update" : "Submit"}
                </SingleButton>
                {selectedEventId && (
                  <SingleButton
                    type="button"
                    className="bg-red-500 hover:bg-red-600 text-white w-full md:w-auto"
                    onClick={handleDelete}
                  >
                    Delete
                  </SingleButton>
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
        <div className="mt-16">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            events={events}
            eventContent={(arg) => (
              <div className="bg-red-600 text-white p-1 rounded">
                {arg.event.title}
              </div>
            )}
          />
        </div>
      </div>
    </>
  );
}

export default Holidays;
