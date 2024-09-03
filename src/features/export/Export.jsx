import React from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf } from "react-icons/fa";
import SingleButton from "../../components/button/Button";

const ExportButtonsComponent = ({ exportCSV, exportExcel, exportPdf }) => (
  <div className="flex items-center justify-end gap-2 mb-4">
    <SingleButton
      btnTitle={<FaFileCsv />}
      className="btn border-none bg-blue-500 rounded-full text-white"
      onClick={exportCSV}
      data-pr-tooltip="CSV"
    />
    <SingleButton
      btnTitle={<FaFileExcel />}
      className="btn border-none bg-emerald-500 rounded-full text-white"
      onClick={exportExcel}
      data-pr-tooltip="XLS"
    />
    <SingleButton
      btnTitle={<FaFilePdf />}
      className="btn border-none bg-rose-500 rounded-full text-white"
      onClick={exportPdf}
      data-pr-tooltip="PDF"
    />
  </div>
);

export default ExportButtonsComponent;