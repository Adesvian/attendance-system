import React, { forwardRef, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TableSortLabel,
  ThemeProvider,
} from "@mui/material";
import { useSelector } from "react-redux";
import getTheme from "./theme/tableTheme";
import OptionMenu from "./options";
import { deleteAttendance } from "../../app/api/v1/teacher-services";
// Comparator functions for sorting
const parseDate = (dateString) => {
  return new Date(dateString);
};

const descendingComparator = (a, b, orderBy) => {
  if (orderBy === "time") {
    return parseDate(b[orderBy]) - parseDate(a[orderBy]);
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

const TableComponent = forwardRef(
  ({ data, columns, getStatusClass, type, setData, tab, className }, ref) => {
    const theme = useSelector((state) => state.header.theme);
    const muitheme = getTheme(theme);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState(columns[0]?.field || "");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const parent = useSelector((state) => state.auth.parent);
    // Format data based on type
    const formattedData = useMemo(() => {
      return type === "logs-table"
        ? data
        : data.map((row) => {
            const rowData = { name: row.name };
            row.attendance.forEach((att, i) => {
              rowData[`day${i + 1}`] = att;
            });
            rowData.hadir = row.hadir;
            rowData.absen = row.absen;
            rowData.izin = row.izin;
            rowData.sakit = row.sakit;
            rowData.percentage = row.percentage;
            return rowData;
          });
    }, [data, type]);

    const handleRequestSort = (property) => {
      if (type === "logs-table") {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
      }
    };

    const paginatedRows = useMemo(() => {
      // Jika type adalah 'logs-table', lakukan sorting dan pagination
      if (type === "logs-table") {
        const sortedRows = stableSort(
          formattedData,
          getComparator(order, orderBy)
        );
        return sortedRows.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        );
      }

      return formattedData;
    }, [formattedData, order, orderBy, page, rowsPerPage, type]);

    // Handle pagination
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const handleDelete = async (id) => {
      await deleteAttendance(id, tab, setData);
    };

    return (
      <div className={`text-gray-800 dark:text-white mt-5 ${className || ""}`}>
        <ThemeProvider theme={muitheme}>
          {type === "logs-table" && (
            <div className="flex justify-end">
              <TablePagination
                component="div"
                className="-top-5 relative inline dark:text-dark-text"
                count={formattedData.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 25, 50, 100]}
                labelRowsPerPage="Rows per page:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} of ${count}`
                }
              />
            </div>
          )}
          {data.length > 0 ? (
            <div className="overflow-x-auto">
              {" "}
              <TableContainer
                component={Paper}
                className={
                  type === "logs-table"
                    ? "max-h-[32rem] dark:bg-base-300"
                    : "max-h-[32rem]"
                }
              >
                <Table
                  stickyHeader
                  aria-label="sticky table"
                  ref={ref}
                  className=" table-auto"
                >
                  <TableHead>
                    <TableRow>
                      {columns.map((col, index) => (
                        <TableCell
                          key={index}
                          align="center"
                          sortDirection={
                            type === "logs-table" && orderBy === col.field
                              ? order
                              : false
                          }
                          className=" dark:bg-base-300 bg-base-300 text-sm md:text-base" // Responsive font size
                          sx={{
                            position: "sticky",
                            left: index === 0 ? 0 : "auto",
                            zIndex: index === 0 ? 10 : 2,
                            minWidth: col.field === "name" ? "150px" : "auto",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {type === "logs-table" ? (
                            <TableSortLabel
                              active={orderBy === col.field}
                              direction={orderBy === col.field ? order : "asc"}
                              onClick={() => handleRequestSort(col.field)}
                              className="dark:text-dark-text text-dark-text hover:dark:text-dark-text focus:dark:text-dark-text"
                            >
                              {col.header}
                            </TableSortLabel>
                          ) : (
                            <div>{col.header}</div>
                          )}
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
                            className={` ${
                              index % 2 === 0
                                ? "bg-gray-100 dark:text-dark-text dark:bg-base-200"
                                : "bg-white dark:bg-base-300"
                            } text-sm md:text-base`} // Responsive font size
                            sx={{
                              position: colIndex === 0 ? "sticky" : "static",
                              left: colIndex === 0 ? 0 : "auto",
                              zIndex: colIndex === 0 ? 5 : "auto",
                              fontSize: colIndex === 0 ? "0.7rem" : "1rem",
                            }}
                          >
                            {col.field === "profile" && (
                              <div className="avatar">
                                <div className="mask mask-squircle h-12 w-12">
                                  <img
                                    src={row[col.field]}
                                    alt="Avatar Tailwind CSS Component"
                                  />
                                </div>
                              </div>
                            )}
                            {col.field === "action" && !parent && (
                              <OptionMenu row={row} onDelete={handleDelete} />
                            )}

                            {col.field !== "profile" &&
                              col.field !== "action" && (
                                <div
                                  className={`p-2 mr-5 font-medium text-base ${getStatusClass(
                                    row[col.field]
                                  )}`}
                                >
                                  {row[col.field]}
                                </div>
                              )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              {type === "logs-table"
                ? "Tabel kosong. Tidak ada data."
                : "Tabel kosong. Pilih tanggal dan opsi untuk menampilkan data."}
            </div>
          )}
        </ThemeProvider>
      </div>
    );
  }
);

export default TableComponent;
