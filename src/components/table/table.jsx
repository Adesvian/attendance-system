import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { ThemeProvider } from "@emotion/react";
import { DataGrid } from "@mui/x-data-grid";
import { MdEdit, MdDelete, MdRemoveRedEye } from "react-icons/md";
import { FaCheck, FaXmark, FaEye } from "react-icons/fa6";
import { Stack, Pagination } from "@mui/material";
import SingleButton from "../button/Button";
import getTheme from "./theme/tableTheme";

function TableDataManager({
  data,
  columns,
  isUserTable = true,
  searchQuery,
  ...props
}) {
  const theme = useSelector((state) => state.header.theme);
  const muitheme = getTheme(theme);

  // State variables for pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(props.rowsPerPage || 10);

  // Memoized data
  const formattedData = useMemo(() => data, [data]);

  // Filtered rows based on search query
  const filteredRows = useMemo(() => {
    return formattedData.filter((row) =>
      columns.some((col) =>
        String(row[col.field]).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [formattedData, searchQuery, columns]);

  // Paginated rows
  const paginatedRows = useMemo(() => {
    return filteredRows.slice(
      (page - 1) * rowsPerPage,
      (page - 1) * rowsPerPage + rowsPerPage
    );
  }, [filteredRows, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const rows = paginatedRows.map((row, index) => ({
    id: index,
    ...row,
  }));

  // Columns setup
  const gridColumns = columns.map((col) => ({
    field: col.field,
    headerName: col.header,
    flex: 1,
    renderCell: (params) => {
      if (col.field === "profile") {
        return (
          <div className="avatar align-middle">
            <div className="mask mask-circle w-14">
              <img src={params.row[col.field]} alt="Avatar" />
            </div>
          </div>
        );
      }
      if (col.field === "action") {
        return (
          <div className="flex items-center justify-center gap-x-2 h-full w-full">
            {isUserTable ? (
              <>
                {props.handleAct0 && (
                  <SingleButton
                    className=" bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => props.handleAct0(params.row)}
                    aria-label={`View ${params.row.name}`}
                  >
                    <MdRemoveRedEye />
                  </SingleButton>
                )}
                <SingleButton
                  className=" bg-amber-500 hover:bg-amber-600 text-white"
                  onClick={() => props.handleAct1(params.row)}
                  aria-label={`Edit ${params.row.name}`}
                >
                  <MdEdit />
                </SingleButton>
                <SingleButton
                  className=" bg-rose-500 hover:bg-rose-600 text-white"
                  onClick={() => props.handleAct2(params.row)}
                  aria-label={`Delete ${params.row.name}`}
                >
                  <MdDelete />
                </SingleButton>
              </>
            ) : params.row.status === "Pending" ? (
              <>
                <SingleButton
                  className={`btn h-10 border-none ${
                    props.handleAct1.name === "handleAccept"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-amber-500 hover:bg-amber-600"
                  } text-white`}
                  onClick={() => props.handleAct1(params.row)}
                  aria-label={`Accept ${params.row.name}`}
                >
                  <FaCheck className="mr-1" /> Accept
                </SingleButton>
                <SingleButton
                  className="btn h-10 border-none bg-rose-500 hover:bg-rose-600 text-white"
                  onClick={() => props.handleAct2(params.row)}
                  aria-label={`Reject ${params.row.name}`}
                >
                  <FaXmark className="mr-1" /> Reject
                </SingleButton>
              </>
            ) : (
              <img
                src={`./assets/icon/${
                  params.row.status === "Accepted" ? "approve" : "rejected"
                }.png`}
                alt="Attachment"
                className="w-auto h-16 object-contain"
              />
            )}
          </div>
        );
      }
      if (col.field === "attachment") {
        return (
          <>
            <button
              className="btn border-none self-center bg-amber-500 hover:bg-amber-600 text-white"
              onClick={() =>
                document.getElementById(`modal_${params.row.id}`).showModal()
              }
              aria-label={`View attachment for ${params.row.name}`}
            >
              <FaEye />
            </button>
            <dialog
              key={params.row.id}
              id={`modal_${params.row.id}`}
              className="modal"
            >
              <div className="modal-box bg-white">
                <img
                  src={`${import.meta.env.VITE_BASE_URL_BACKEND}/permits/${
                    params.row.attachment
                  }`}
                  alt="Lampiran"
                  className="w-full"
                />
                <div className="text-left max-w-max text-wrap">
                  <p className="font-bold">Keterangan:</p>
                  <p className="text-base -mt-10 break-words">
                    {params.row.notes}
                  </p>{" "}
                  {/* Menambahkan class break-words */}
                </div>
                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn border-none bg-gray-100 hover:bg-gray-300 text-black">
                      Close
                    </button>
                  </form>
                </div>
              </div>
            </dialog>
          </>
        );
      }
      return (
        <div className="text-ellipsis overflow-hidden font-medium">
          {params.row[col.field]}
        </div>
      );
    },
  }));

  useEffect(() => {
    if (props.setDisplayedData) {
      props.setDisplayedData(paginatedRows);
    }
    if (props.rowsPerPage) {
      setRowsPerPage(props.rowsPerPage);
    }
  }, [paginatedRows, props]);

  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (
        args[0]?.includes(
          "The parent DOM element of the Data Grid has an empty height"
        )
      ) {
        return;
      }
      originalError(...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return (
    <ThemeProvider theme={muitheme}>
      <div className="mt-2">
        <span className="font-poppins text-sm italic">
          Show {paginatedRows.length} data from {formattedData.length} records
        </span>
      </div>
      <div style={{ height: 400, width: "100%" }} className="mt-2">
        <DataGrid
          rows={rows}
          columns={gridColumns.map((column) => ({
            ...column,
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: column.field === "action" ? 250 : 150,
            sx: {
              "@media (max-width: 600px)": {
                width: "auto",
                minWidth: 80,
              },
            },
          }))}
          pageSize={rowsPerPage}
          rowHeight={100}
          rowsPerPageOptions={[5, 10, 25]}
          hideFooter={true}
          disableSelectionOnClick
          onPageChange={(newPage) => setPage(newPage)}
          page={page - 1}
          sx={{
            "& .MuiDataGrid-columnHeader": {
              textAlign: "center",
            },
            "& .MuiDataGrid-cell": {
              textAlign: "center",
            },
            "& .MuiDataGrid-row": {
              alignItems: "center",
            },
            "& .MuiDataGrid-cell[data-field='activity']": {
              textAlign: "left",
            },
            "@media (max-width: 600px)": {
              "& .MuiDataGrid-cell": {
                fontSize: "0.875rem",
              },
            },
          }}
        />
      </div>
      <Stack spacing={2} className="flex justify-center my-4">
        <Pagination
          count={Math.ceil(filteredRows.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
        />
      </Stack>
    </ThemeProvider>
  );
}

export default TableDataManager;
