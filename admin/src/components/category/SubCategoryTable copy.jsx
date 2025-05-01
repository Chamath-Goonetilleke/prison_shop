import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

const columns = [
  { id: "image", label: "Image", minWidth: 100 },
  { id: "code", label: "Code", minWidth: 100 },
  { id: "nameEn", label: "Name(English)", minWidth: 100 },
  { id: "nameSi", label: "Name(Sinhala)", minWidth: 100 },
  { id: "mainCategory", label: "Main Category", minWidth: 150 },
];

// Sample data for categories
const rows = [
  {
    image: "/cat-bakery.png",
    nameEn: "Food Items",
    nameSi: "ආහාර භාණ්ඩ",
    code: "FOOD",
    mainCategory: "Grocery",
  },
  {
    image: "/cat-bakery.png",
    nameEn: "Beverages",
    nameSi: "පාන",
    code: "BEV",
    mainCategory: "Grocery",
  },
  {
    image: "/cat-bakery.png",
    nameEn: "Snacks",
    nameSi: "ස්නැක්ස්",
    code: "SNACK",
    mainCategory: "Grocery",
  },
  {
    image: "/cat-bakery.png",
    nameEn: "Toiletries",
    nameSi: "සනීපාරක්ෂක භාණ්ඩ",
    code: "TOIL",
    mainCategory: "Personal Care",
  },
  {
    image: "/cat-bakery.png",
    nameEn: "Stationery",
    nameSi: "ලේඛන සාමාග්‍රී",
    code: "STAT",
    mainCategory: "Office Supplies",
  },
];

export default function SubCategoryTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: "75vh" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id}>
                          {column.id === "image" ? (
                            <img
                              src={value}
                              alt={row.nameEn}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            value
                          )}
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
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
