import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Stack,
  Pagination,
} from "@mui/material";
import SingleButton from "../button/Button";
import { MdEdit, MdDelete, MdRemoveRedEye } from "react-icons/md";
import { FaCheck, FaXmark, FaEye } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { ThemeProvider } from "@emotion/react";
import getTheme from "./theme/tableTheme";

// Comparator functions
const compareDescending = (a, b, orderBy) => {
  return b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0;
};

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => compareDescending(a, b, orderBy)
    : (a, b) => -compareDescending(a, b, orderBy);
};

const stableSort = (array, comparator) => {
  const stabilizedArray = array.map((el, index) => [el, index]);
  stabilizedArray.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    return order !== 0 ? order : a[1] - b[1];
  });
  return stabilizedArray.map((el) => el[0]);
};

function TableDataManager({
  data,
  columns,
  isUserTable = true,
  searchQuery,
  ...props
}) {
  const theme = useSelector((state) => state.header.theme);
  const muitheme = getTheme(theme);

  // State variables
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(columns[0]?.field || "");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Memoized data
  const formattedData = useMemo(() => data, [data]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedRows = useMemo(
    () => stableSort(formattedData, getComparator(order, orderBy)),
    [formattedData, order, orderBy]
  );

  const filteredRows = useMemo(() => {
    return sortedRows.filter((row) =>
      columns.some((col) =>
        String(row[col.field]).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [sortedRows, searchQuery, columns]);

  const paginatedRows = useMemo(() => {
    return filteredRows.slice(
      (page - 1) * rowsPerPage,
      (page - 1) * rowsPerPage + rowsPerPage
    );
  }, [filteredRows, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <ThemeProvider theme={muitheme}>
      <div className="mt-2">
        <span className="font-poppins text-sm italic">
          Show {paginatedRows.length} data from {formattedData.length} records
        </span>
      </div>
      <TableContainer
        component={Paper}
        className="h-[30rem] dark:bg-base-200 mt-2"
      >
        <Table
          stickyHeader
          aria-label="sticky table"
          className="whitespace-nowrap"
        >
          <TableHead>
            <TableRow>
              {columns.map((col, index) => (
                <TableCell
                  key={index}
                  align="center"
                  sortDirection={orderBy === col.field ? order : false}
                  className="dark:bg-base-200 whitespace-nowrap"
                >
                  <TableSortLabel
                    active={orderBy === col.field}
                    direction={orderBy === col.field ? order : "asc"}
                    onClick={() => handleRequestSort(col.field)}
                    className="dark:text-dark-text text-dark-text hover:dark:text-dark-text focus:dark:text-dark-text"
                  >
                    <span className="ml-5">{col.header}</span>
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((col, colIndex) => (
                  <TableCell
                    key={colIndex}
                    align="center"
                    className={`text-[14px] p-[8px] w-[9px] whitespace-normal bg-white dark:bg-base-300`}
                  >
                    {col.field === "profile" ? (
                      <div className="avatar">
                        <div className="mask mask-circle w-14">
                          <img src={row[col.field]} alt="Avatar" />
                        </div>
                      </div>
                    ) : col.field === "action" ? (
                      <div className="flex justify-center gap-x-1">
                        {isUserTable ? (
                          <>
                            {props.handleAct0 && (
                              <SingleButton
                                className="py-4 bg-sky-500 hover:bg-sky-600 text-white"
                                onClick={() => props.handleAct0(row)}
                                aria-label={`View ${row.name}`}
                              >
                                <MdRemoveRedEye />
                              </SingleButton>
                            )}
                            <SingleButton
                              className="py-4 bg-amber-500 hover:bg-amber-600 text-white"
                              onClick={() => props.handleAct1(row)}
                              aria-label={`Edit ${row.name}`}
                            >
                              <MdEdit />
                            </SingleButton>
                            <SingleButton
                              className="py-4 bg-rose-500 hover:bg-rose-600 text-white"
                              onClick={() => props.handleAct2(row)}
                              aria-label={`Delete ${row.name}`}
                            >
                              <MdDelete />
                            </SingleButton>
                          </>
                        ) : row.status === "Pending" ? (
                          <>
                            <SingleButton
                              className={`btn border-none self-center ${
                                props.handleAct1.name === "handleAccept"
                                  ? "bg-green-500 hover:bg-green-600"
                                  : "bg-amber-500 hover:bg-amber-600"
                              } text-white`}
                              onClick={() => props.handleAct1(row)}
                              aria-label={`Accept ${row.name}`}
                            >
                              <FaCheck /> Accept
                            </SingleButton>
                            <SingleButton
                              className="btn border-none self-center bg-rose-500 hover:bg-rose-600 text-white"
                              onClick={() => props.handleAct2(row)}
                              aria-label={`Reject ${row.name}`}
                            >
                              <FaXmark /> Reject
                            </SingleButton>
                          </>
                        ) : (
                          <img
                            src={`/assets/icon/${
                              row.status === "Accepted" ? "approve" : "rejected"
                            }.png`}
                            alt="Attachment"
                            className="w-full h-20"
                          />
                        )}
                      </div>
                    ) : col.field === "attachment" ? (
                      <button
                        className="btn border-none self-center bg-amber-500 hover:bg-amber-600 text-white"
                        onClick={() =>
                          document.getElementById(`modal_${index}`).showModal()
                        }
                        aria-label={`View attachment for ${row.name}`}
                      >
                        <FaEye />
                      </button>
                    ) : (
                      <div className="font-medium">{row[col.field]}</div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack spacing={2} className="flex justify-center my-4">
        <Pagination
          className="flex justify-end"
          count={Math.ceil(filteredRows.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
        />
      </Stack>
      {paginatedRows.map(
        (row, index) =>
          row.attachment && (
            <dialog key={index} id={`modal_${index}`} className="modal">
              <div className="modal-box bg-white">
                <img
                  src={`${import.meta.env.VITE_BASE_URL_BACKEND}/permits/${
                    row.attachment
                  }`}
                  alt="Lampiran"
                  className="w-full h-auto"
                />
                <p className="mt-3">
                  <span className="font-bold">Keterangan:</span>
                  <br />
                  {row.notes}
                </p>
                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn border-none bg-gray-100 hover:bg-gray-300 text-black">
                      Close
                    </button>
                  </form>
                </div>
              </div>
            </dialog>
          )
      )}
    </ThemeProvider>
  );
}

export default TableDataManager;
