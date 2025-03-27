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

export default function ProgramPhaseTable({ programPhases }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { t } = useTranslation("Programs");
  const columns = [
    { id: "phaseName", label: t("phase_name_label"), minWidth: 170 },
    {
      id: "startConditionType",
      label: t("start_condition_type_label"),
      minWidth: 170,
    },
    {
      id: "startConditionValue",
      label: t("start_condition_value_label"),
      minWidth: 170,
      align: "center",
    },
    {
      id: "endConditionType",
      label: t("end_condition_type_label"),
      minWidth: 170,
    },
    {
      id: "endConditionValue",
      label: t("end_condition_value_label"),
      minWidth: 170,
      align: "center",
    },
    {
      id: "frequency",
      label: t("frequency_label"),
      minWidth: 170,
      align: "center",
      format: (value) => value.toLocaleString("en-US"),
    },
  ];
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function createTableRow(programPhase) {
    const phaseName = programPhase.ProgramPhase.name;
    const startConditionType = programPhase.ProgramPhase.startConditionType;
    const startConditionValue = programPhase.ProgramPhase.startConditionValue;
    const endConditionType = programPhase.ProgramPhase.endConditionType;
    const endConditionValue = programPhase.ProgramPhase.endConditionValue;
    const frequency = programPhase.ProgramPhase.frequency;

    return {
      phaseName,
      startConditionType,
      startConditionValue,
      endConditionType,
      endConditionValue,
      frequency,
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
            {programPhases
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((programPhase) => {
                // programPhase.phaseName = programPhase.ProgramPhase.name;
                programPhase = createTableRow(programPhase);
                return (
                  // <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    {columns.map((column) => {
                      const value = programPhase[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
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
        count={programPhases?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
ProgramPhaseTable.propTypes = {
  programPhases: PropTypes.arrayOf(
    PropTypes.shape({
      ProgramPhase: PropTypes.shape({
        name: PropTypes.string,
        startConditionType: PropTypes.string,
        startConditionValue: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ]),
        endConditionType: PropTypes.string,
        endConditionValue: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ]),
        frequency: PropTypes.number,
      }),
    })
  ).isRequired,
};
