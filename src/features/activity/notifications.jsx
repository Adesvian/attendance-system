import React, { useEffect, useState } from "react";
import { BsSortDown, BsSortUpAlt } from "react-icons/bs";
import { IoCalendarOutline } from "react-icons/io5";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./calendarStyles.css";

function Notifications({
  data,
  initialRowsPerPage = 5,
  initialSortOrder = "desc",
}) {
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);
  const [events, setEvents] = useState([]);
  const [activeEventId, setActiveEventId] = useState(null);
  const [selectedValue, setSelectedValue] = useState(
    initialRowsPerPage.toString()
  );

  useEffect(() => {
    setEvents(data);
  }, [data]);

  const toggleSortOrder = () =>
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));

  const filterEventsByMonth = (startDate, endDate) => {
    const filteredEvents = data.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= startDate && eventDate < endDate;
    });
    setEvents(filteredEvents);
  };

  const handleDateSet = (dateInfo) => {
    const startDate = dateInfo.start;
    const endDate = dateInfo.end;
    filterEventsByMonth(startDate, endDate);
  };

  const sortedEvents = [...events].sort((a, b) =>
    sortOrder === "desc"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date)
  );

  const paginatedData = sortedEvents.slice(0, rowsPerPage);

  // Handle event click
  const handleEventClick = (info) => {
    const eventId = info.event.id;
    setActiveEventId(parseInt(eventId));
    const element = document.getElementById(`event-${eventId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-white h-[32rem] w-full overflow-y-auto dark:bg-base-100 rounded-md shadow-md text-gray-800 dark:text-dark-text p-4 border dark:border-[#2B3039] dark:border-[2px]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-2xl font-bold">Events</div>
          <p className="text-sm mt-2">Update Events terkini</p>
        </div>
        <div className="stat-figure flex-shrink-0 rounded-[22px] p-4 bg-red-200 text-red-600">
          <IoCalendarOutline className="w-7 h-7" />
        </div>
      </div>
      <div className="flex justify-between mb-3 text-sm">
        <div className="flex items-center">
          <label
            htmlFor="rowsPerPage"
            className="mr-2 text-gray-500 dark:text-gray-300"
          >
            Rows per page:
          </label>
          <select
            id="rowsPerPage"
            value={selectedValue}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "All") {
                setRowsPerPage(data.length);
              } else {
                setRowsPerPage(Number(value));
              }
              setSelectedValue(value);
            }}
            className="cursor-pointer border bg-transparent rounded-md p-1"
          >
            {[5, 10, 15, 20, "All"].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <button
            onClick={toggleSortOrder}
            className="cursor-pointer border bg-transparent rounded-md p-1 flex items-center"
          >
            {sortOrder === "asc" ? <BsSortDown /> : <BsSortUpAlt />}
          </button>
        </div>
      </div>
      {/* FullCalendar Component */}
      <div id="calendar" className="my-4">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events.map((event) => ({
            id: event.id,
            title: event.name,
            start: event.date,
          }))}
          dayMaxEventRows={true}
          views={{
            dayGridMonth: {
              dayMaxEvents: 3,
            },
          }}
          datesSet={handleDateSet}
          eventClick={handleEventClick}
        />
      </div>
      <div className="mt-4">
        {paginatedData.map((notification) => (
          <div
            key={notification.id}
            id={`event-${notification.id}`}
            className={`border-b text-sm flex justify-between p-2 ${
              notification.id === activeEventId ? "bg-yellow-100" : ""
            }`}
          >
            <div className="font-semibold">{notification.name}</div>
            <div className=" text-gray-500 dark:text-gray-300">
              {new Date(notification.date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
