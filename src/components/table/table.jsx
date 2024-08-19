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
import { AiOutlineEdit, AiTwotoneDelete } from "react-icons/ai";
import { useSelector } from "react-redux";

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

function TableDataManager({ data, columns, handleEdit, handleDelete }) {
  const theme = useSelector((state) => state.header.theme);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(columns[0]?.field || "");
  const [page, setPage] = useState(1); // Mulai dari halaman 1
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Format data based on type
  const formattedData = useMemo(() => {
    return data;
  }, [data]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const paginatedRows = useMemo(() => {
    // Jika type adalah 'standard', lakukan sorting dan pagination
    const sortedRows = stableSort(formattedData, getComparator(order, orderBy));
    return sortedRows.slice(
      (page - 1) * rowsPerPage,
      (page - 1) * rowsPerPage + rowsPerPage
    );
  }, [formattedData, order, orderBy, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div className=" mt-5">
      <TableContainer component={Paper} className="h-[30rem] dark:bg-base-200">
        <Table
          stickyHeader
          aria-label="sticky table"
          className="whitespace-nowrap "
        >
          <TableHead>
            <TableRow>
              {columns.map((col, index) => (
                <TableCell
                  key={index}
                  align="center"
                  sortDirection={orderBy === col.field ? order : false}
                  className="dark:bg-base-200"
                >
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
                    className="dark:text-dark-text"
                  >
                    {col.field === "profile" ? (
                      <div className="avatar">
                        <div className="mask mask-circle h-20 w-20">
                          <img
                            src={row[col.field]}
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                    ) : col.field === "action" ? (
                      <div className="flex justify-center gap-x-2">
                        <SingleButton
                          // btnTitle={"Edit"}
                          className="btn bg-amber-500 text-white hover:bg-amber-600 hover:text-white"
                          onClick={() => handleEdit(row["nik"])}
                        >
                          <AiOutlineEdit />
                        </SingleButton>
                        <SingleButton
                          // btnTitle={"Delete"}
                          className="btn bg-rose-500 text-white hover:bg-rose-600 hover:text-white"
                          onClick={() => handleDelete(row["nik"])}
                        >
                          <AiTwotoneDelete />
                        </SingleButton>
                      </div>
                    ) : (
                      <div className="p-2 font-medium">{row[col.field]}</div>
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
          count={Math.ceil(formattedData.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
          sx={
            theme === "dark"
              ? {
                  "& .MuiPaginationItem-root": {
                    color: "white",
                  },
                  // background color
                  "& .MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: "white",
                    color: "black",
                  },
                  // border color untuk item tidak aktif berwarna putih
                  "& .MuiPaginationItem-page": {
                    borderColor: "white",
                    color: "white",
                  },
                  // border color untuk previous dan next button
                  "& .MuiPaginationItem-root.MuiButtonBase-root": {
                    borderColor: "white",
                  },
                }
              : {}
          }
        />
      </Stack>
    </div>
  );
}

export default TableDataManager;
