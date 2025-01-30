import * as React from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import ProductCard from "./common/ProductCard";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default function HomeProductGrid() {
  return (
    <Box sx={{ width: "100%" }}>
      <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {Array.from(Array(20)).map((_, index) => (
          <ProductCard/>
        ))}
      </Grid>
    </Box>
  );
}
