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
} from "@mui/material";
import { useSelector } from "react-redux";

// Comparator functions for sorting
const descendingComparator = (a, b, orderBy) => {
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
  ({ data, columns, getStatusClass, type }, ref) => {
    const theme = useSelector((state) => state.header.theme);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState(columns[0]?.field || "");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(2);

    // Format data based on type
    const formattedData = useMemo(() => {
      return type === "standard"
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
      if (type === "standard") {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
      }
    };

    const paginatedRows = useMemo(() => {
      // Jika type adalah 'standard', lakukan sorting dan pagination
      if (type === "standard") {
        const sortedRows = stableSort(
          formattedData,
          getComparator(order, orderBy)
        );
        return sortedRows.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        );
      }

      // Jika type bukan 'standard', tampilkan seluruh data tanpa sorting dan pagination
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

    return (
      <div className="text-gray-800 dark:text-white mt-5 ">
        {type === "standard" && (
          <div className="flex justify-end">
            <TablePagination
              component="div"
              className="-top-5 relative inline dark:text-dark-text"
              count={formattedData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[2, 4, 6, 8]}
              sx={{
                "& .MuiTablePagination-selectIcon": {
                  color: theme === "dark" ? "white" : "inherit",
                },
              }}
              labelRowsPerPage="Rows per page:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} of ${count}`
              }
            />
          </div>
        )}
        {data.length > 0 ? (
          <TableContainer
            component={Paper}
            className={type === "standard" ? "h-64 dark:bg-base-300" : ""}
          >
            <Table
              ref={ref}
              aria-label="data table"
              className="whitespace-nowrap"
            >
              <TableHead>
                <TableRow>
                  {columns.map((col, index) => (
                    <TableCell
                      key={index}
                      align="center"
                      sortDirection={
                        type === "standard" && orderBy === col.field
                          ? order
                          : false
                      }
                      className="dark:bg-base-300 dark:text-dark-text bg-gray-100"
                    >
                      {type === "standard" ? (
                        <TableSortLabel
                          active={orderBy === col.field}
                          direction={orderBy === col.field ? order : "asc"}
                          onClick={() => handleRequestSort(col.field)}
                          className="dark:text-dark-text text-dark-text hover:dark:text-dark-text focus:dark:text-dark-text"
                          sx={{
                            "&.Mui-active": {
                              color: theme === "dark" ? "white" : "inherit", // Warna saat label aktif
                              "& .MuiTableSortLabel-icon": {
                                color: theme === "dark" ? "white" : "inherit", // Warna ikon saat label aktif
                              },
                            },
                            "&:hover": {
                              color: theme === "dark" ? "white" : "inherit", // Warna saat hover
                            },
                            color: theme === "dark" ? "white" : "inherit", // Warna default
                          }}
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
                        className="dark:text-dark-text dark:bg-base-200"
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
                        {col.field !== "profile" && (
                          <div
                            className={`p-2 font-medium ${getStatusClass(
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
        ) : (
          <div className="text-center text-gray-500">
            Tabel kosong. Pilih tanggal dan kelas untuk menampilkan data.
          </div>
        )}
      </div>
    );
  }
);

export default TableComponent;
