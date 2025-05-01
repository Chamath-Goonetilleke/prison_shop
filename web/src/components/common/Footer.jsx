import { Box, Typography } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#24364d",
        padding: "3rem",
        mt: "1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img src="/main-only-logo.png" alt="main logo" style={{ width: 130 }} />
        <Typography
          fontFamily={"monospace"}
          fontWeight={"bold"}
          fontSize={"20px"}
          color="white"
          marginTop={"10px"}
        >
          CELLMADE
        </Typography>
      </Box>
      <Box style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Typography
          sx={{ color: "white", fontSize: "20px", fontWeight: "bold" }}
        >
          Site Map
        </Typography>
        <NavLink
          to={"/"}
          style={{
            textDecoration: "underline",
            color: "white",
            fontSize: "18px",
          }}
        >
          Home
        </NavLink>
        <NavLink
          to={"/"}
          style={{
            textDecoration: "underline",
            color: "white",
            fontSize: "18px",
          }}
        >
          About Us
        </NavLink>
        <NavLink
          to={"/"}
          style={{
            textDecoration: "underline",
            color: "white",
            fontSize: "18px",
          }}
        >
          Contact Us
        </NavLink>
      </Box>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{ color: "white", fontSize: "20px", fontWeight: "bold" }}
        >
          Prisons
        </Typography>
        <Box style={{ display: "flex", gap: "1rem" }}>
          <Box
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <NavLink
              to={"/"}
              style={{
                textDecoration: "underline",
                color: "white",
                fontSize: "18px",
              }}
            >
              වැලිකඩ
            </NavLink>
            <NavLink
              to={"/"}
              style={{
                textDecoration: "underline",
                color: "white",
                fontSize: "18px",
              }}
            >
              බෝගම්බර
            </NavLink>
            <NavLink
              to={"/"}
              style={{
                textDecoration: "underline",
                color: "white",
                fontSize: "18px",
              }}
            >
              මහර
            </NavLink>
            <NavLink
              to={"/"}
              style={{
                textDecoration: "underline",
                color: "white",
                fontSize: "18px",
              }}
            >
              අනුරාධපුර
            </NavLink>
          </Box>
          <Box
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <NavLink
              to={"/"}
              style={{
                textDecoration: "underline",
                color: "white",
                fontSize: "18px",
              }}
            >
              පල්ලේකැලේ
            </NavLink>
            <NavLink
              to={"/"}
              style={{
                textDecoration: "underline",
                color: "white",
                fontSize: "18px",
              }}
            >
              පල්ලන්සේන
            </NavLink>
            <NavLink
              to={"/"}
              style={{
                textDecoration: "underline",
                color: "white",
                fontSize: "18px",
              }}
            >
              තල්දෙන
            </NavLink>
            <NavLink
              to={"/"}
              style={{
                textDecoration: "underline",
                color: "white",
                fontSize: "18px",
              }}
            >
              අගුණ කොළ
            </NavLink>
          </Box>
        </Box>
      </Box>
      <Box style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Typography
          sx={{ color: "white", fontSize: "20px", fontWeight: "bold" }}
        >
          Quick Links
        </Typography>
        <NavLink
          to={"/"}
          style={{
            textDecoration: "underline",
            color: "white",
            fontSize: "18px",
          }}
        >
          කම්හල් (Workshops/Factories)
        </NavLink>
        <NavLink
          to={"/"}
          style={{
            textDecoration: "underline",
            color: "white",
            fontSize: "18px",
          }}
        >
          වඩු (Carpentry)
        </NavLink>
        <NavLink
          to={"/"}
          style={{
            textDecoration: "underline",
            color: "white",
            fontSize: "18px",
          }}
        >
          පේෂ කර්ම (Textiles)
        </NavLink>
      </Box>
      <Box
        sx={{
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography fontSize={"20px"} fontWeight={"bold"} mb={"0.7rem"}>
          Contact
        </Typography>
        <Typography>
          Prison Headquarters, No.150,Baseline Road,Colombo 09,Sri Lanka
        </Typography>
        <Typography></Typography>
        <Typography></Typography>
        <Typography></Typography>
        <Typography>UsTel : +94 114 677177 Fax : +94 114 677180</Typography>
        <Typography>E-mail : prisons@sltnet.lk</Typography>
        <img
          src="/prisons-department-logo.png"
          alt="logo"
          style={{
            width: "500px",
            marginTop: "2rem",
          }}
        />
      </Box>
    </Box>
  );
}
