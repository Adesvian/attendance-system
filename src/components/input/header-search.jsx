import React from "react";
import { MdOutlineAdd, MdSearch } from "react-icons/md";
import { Button } from "@mui/material";
import TextInput from "../../components/input/TextInput"; // Adjust the import path as necessary

const SearchAndButton = ({
  searchQuery,
  setSearchQuery,
  buttonLabel,
  onButtonClick,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-6">
      <div className="lg:col-span-4 relative">
        <TextInput
          id="search"
          name="search"
          type="text"
          label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 pl-10"
        />
        <MdSearch className="absolute left-3 top-1/2 -translate-y-[17px] text-gray-300 text-xl" />
      </div>
      <Button
        variant="contained"
        className="dark:bg-indigo-700 lg:flex-none flex-auto whitespace-nowrap h-10"
        startIcon={<MdOutlineAdd />}
        onClick={onButtonClick}
      >
        {buttonLabel}
      </Button>
    </div>
  );
};

export default SearchAndButton;
