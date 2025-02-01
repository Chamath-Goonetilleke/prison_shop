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

export default function Breadcrumb() {
  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb" sx={{fontSize:'18px'}}>
        <NavLink
          underline="hover"
          sx={{ display: "flex", alignItems: "center" }}
          color="inherit"
          style={{textDecoration:"none"}}
          to={"/"}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </NavLink>
        <Link
          underline="hover"
          sx={{ display: "flex", alignItems: "center" }}
          color="inherit"
          href="/material-ui"
        >
          වඩු (Carpentry)
        </Link>
        <Typography
          sx={{ color: "text.primary", display: "flex", alignItems: "center" }}
        >
          ලී ඇඳන් (Wooden Beds)
        </Typography>
      </Breadcrumbs>
    </div>
  );
}
