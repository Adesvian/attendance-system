import React from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf } from "react-icons/fa";
import SingleButton from "../../components/button/singleButton";

const ExportButtonsComponent = ({ dt, exportExcel, exportPdf }) => (
  <div className="flex items-center justify-end gap-2 mb-4">
    <SingleButton
      btnTitle={<FaFileCsv />}
      btnBg="bg-blue-500 rounded-full text-white"
      onClick={() => dt.current.exportCSV({ selectionOnly: false })}
      data-pr-tooltip="CSV"
    />
    <SingleButton
      btnTitle={<FaFileExcel />}
      btnBg="bg-emerald-500 rounded-full text-white"
      onClick={exportExcel}
      data-pr-tooltip="XLS"
    />
    <SingleButton
      btnTitle={<FaFilePdf />}
      btnBg="bg-rose-500 rounded-full text-white"
      onClick={exportPdf}
      data-pr-tooltip="PDF"
    />
  </div>
);

export default ExportButtonsComponent;
