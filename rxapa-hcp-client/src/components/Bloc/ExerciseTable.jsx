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
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { Modal } from "antd";

export default function ExerciseTable({ exercises, onDelete }) {
  const { t } = useTranslation("Blocs");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // state management and delete confirmation logic
  const [selectedIdToDelete, setSelectedIdToDelete] = React.useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);

  const handleDeleteClick = (id) => {
    setSelectedIdToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    onDelete(selectedIdToDelete);
    setIsDeleteConfirmOpen(false);
    setSelectedIdToDelete(null);
  };

  const columns = [
    { id: "name", label: t("name_label"), minWidth: 100 },
    {
      id: "description",
      label: t("label_description"),
      minWidth: 100,
    },
    {
      id: "instructionalVideo",
      label: t("label_intructional_video"),
      minWidth: 100,
    },
    {
      id: "numberOfSeries",
      label: t("label_number_of_series"),
      align: "ceneter",
      minWidth: 100,
    },
    {
      id: "numberOfRepetition",
      label: t("label_number_of_repetitions"),
      align: "ceneter",
      minWidth: 100,
    },
    {
      id: "restingInstruction",
      label: t("label_resting_instruction"),
      align: "ceneter",
      minWidth: 100,
    },
    {
      id: "minutes",
      label: t("label_number_of_minutes"),
      align: "ceneter",
      minWidth: 100,
    },
    {
      id: "required",
      label: t("label_required"),
      align: "center",
      minWidth: 70,
    },
    {
      id: "actions",
      label: t("label_actions"),
      align: "center",
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

  function createRowData(exerciseBloc) {
    const name = exerciseBloc.Exercise.name;
    const description = exerciseBloc.Exercise.description;
    const instructionalVideo = exerciseBloc.Exercise.instructionalVideo;
    const numberOfSeries = exerciseBloc.numberOfSeries;
    const numberOfRepetition = exerciseBloc.numberOfRepetition;
    const restingInstruction = exerciseBloc.restingInstruction;
    const minutes = exerciseBloc.minutes;
    const required = exerciseBloc.required;
    const id = exerciseBloc.Exercise.id;
    return {
      name,
      description,
      instructionalVideo,
      numberOfSeries,
      numberOfRepetition,
      restingInstruction,
      minutes,
      required,
      id,
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
            {exercises
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((exercise) => {
                exercise = createRowData(exercise);
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={exercise.id}
                  >
                    {columns.map((column) => {
                      // delete icon button in the actions column
                      if (column.id === "actions") {
                        return (
                          <TableCell key={column.id} align="center">
                            <IconButton
                              onClick={() => handleDeleteClick(exercise.id)}
                            >
                              <DeleteIcon color="error" />
                            </IconButton>
                          </TableCell>
                        );
                      }
                      const value = exercise[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value?.toString()}
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
        count={exercises?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Modal // confirmation modal for exercise deletion
        open={isDeleteConfirmOpen}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        okText={t("button_ok")}
        cancelText={t("button_cancel")}
        title={t("title_confirm_delete")}
      >
        <p>{t("text_confirm_delete")}</p>
      </Modal>
    </Paper>
  );
}
ExerciseTable.propTypes = {
  exercises: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDelete: PropTypes.func.isRequired,
};
