import * as React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import { NavLink } from "react-router-dom";
function handleClick(event) {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
}
export default function Breadcrumb({ category, subcategory, product }) {
  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "18px" }}>
        <NavLink
          underline="hover"
          sx={{ display: "flex", alignItems: "center" }}
          color="inherit"
          style={{ textDecoration: "none" }}
          to={"/"}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </NavLink>
        {category && (
          <Link
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
            href={`/category/${category.id}`}
          >
            {category.nameSi} ({category.nameEn})
          </Link>
        )}

        {subcategory && (
          <Typography
            sx={{
              color: "text.primary",
              display: "flex",
              alignItems: "center",
            }}
          >
            {subcategory.nameSi} ({subcategory.nameEn})
          </Typography>
        )}
      </Breadcrumbs>
    </div>
  );
}
