<<<<<<< HEAD
import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export default function BlocTable({ blocs }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { t } = useTranslation("Sessions");
  const columns = [
    { id: "name", label: t("label_name"), minWidth: 100 },
    {
      id: "description",
      label: t("label_description"),
      minWidth: 100,
    },
    { id: "dayTime", label: t("label_day_time"), minWidth: 70 },
    {
      id: "isRequired",
      label: t("label_required"),
      align: "ceneter",
      minWidth: 70,
    },
  ];
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function createRowData(bloc) {
    const name = bloc.Bloc.name;
    const description = bloc.Bloc.description;
    const isRequired = bloc.required;
    const dayTime = bloc.dayTime;
    return {
      name,
      description,
      isRequired,
      dayTime,
    };
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {blocs
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((bloc) => {
                bloc = createRowData(bloc);
                return (
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    {columns.map((column) => {
                      const value = bloc[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value.toString()}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={blocs?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
BlocTable.propTypes = {
  blocs: PropTypes.arrayOf(
    PropTypes.shape({
      Bloc: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      }),
      required: PropTypes.bool,
      dayTime: PropTypes.string,
    })
  ).isRequired,
};
=======
import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

export default function BlocTable({ blocs }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { t } = useTranslation("Sessions");
  const columns = [
    { id: "name", label: t("label_name"), minWidth: 100 },
    {
      id: "description",
      label: t("label_description"),
      minWidth: 100,
    },
    { id: "dayTime", label: t("label_day_time"), minWidth: 70 },
    {
      id: "isRequired",
      label: t("label_required"),
      align: "ceneter",
      minWidth: 70,
    },
  ];
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function createRowData(bloc) {
    const name = bloc.Bloc.name;
    const description = bloc.Bloc.description;
    const isRequired = bloc.required;
    const dayTime = bloc.dayTime;
    return {
      name,
      description,
      isRequired,
      dayTime,
    };
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {blocs
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((bloc) => {
                bloc = createRowData(bloc);
                return (
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    {columns.map((column) => {
                      const value = bloc[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value.toString()}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={blocs?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
BlocTable.propTypes = {
  blocs: PropTypes.arrayOf(
    PropTypes.shape({
      Bloc: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      }),
      required: PropTypes.bool,
      dayTime: PropTypes.string,
    })
  ).isRequired,
};
>>>>>>> 14cb596907bdb9208979898040b04da5a64dcc68
