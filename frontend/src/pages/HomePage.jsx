import React from "react";
import Carousel from "../components/common/Carousel";
import CategoryMenu from "../components/CategoryMenu";
import { Box, Typography } from "@mui/material";
import CategorySlider from "../components/CategorySlider";
import HomeProductSection from "../components/HomeProductSection";

export default function HomePage() {
  return (
    <div>
      <Box
        sx={{
          px: "5rem",
          py: "0.7rem",
          backgroundColor: "lightblue",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CategoryMenu />
        <Typography
          sx={{ cursor: "pointer" }}
          fontWeight="bold"
          fontSize="17px"
        >
          වැලිකඩ
        </Typography>
        <Typography
          sx={{ cursor: "pointer" }}
          fontWeight="bold"
          fontSize="17px"
        >
          බෝගම්බර
        </Typography>
        <Typography
          sx={{ cursor: "pointer" }}
          fontWeight="bold"
          fontSize="17px"
        >
          මහර
        </Typography>
        <Typography
          sx={{ cursor: "pointer" }}
          fontWeight="bold"
          fontSize="17px"
        >
          අනුරාධපුර
        </Typography>
        <Typography
          sx={{ cursor: "pointer" }}
          fontWeight="bold"
          fontSize="17px"
        >
          පල්ලේකැලේ
        </Typography>
        <Typography
          sx={{ cursor: "pointer" }}
          fontWeight="bold"
          fontSize="17px"
        >
          පල්ලන්සේන
        </Typography>
        <Typography
          sx={{ cursor: "pointer" }}
          fontWeight="bold"
          fontSize="17px"
        >
          තල්දෙන
        </Typography>
        <Typography
          sx={{ cursor: "pointer" }}
          fontWeight="bold"
          fontSize="17px"
        >
          අගුණ කොළ
        </Typography>
      </Box>
      <Carousel />
      <div style={{ padding: "1rem" }}>
        <CategorySlider />
      </div>
      <Box
        sx={{
          mx: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <HomeProductSection name={"කම්හල් (Workshops/Factories)"} color={"#fdf2e4"}/>
        <HomeProductSection name={"වඩු (Carpentry)"} color={"#fdf2e4"} />
      </Box>
    </div>
  );
}
