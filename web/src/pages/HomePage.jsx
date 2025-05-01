import React, { useState, useEffect } from "react";
import Carousel from "../components/common/Carousel";
import CategoryMenu from "../components/CategoryMenu";
import { Box, Typography, CircularProgress } from "@mui/material";
import CategorySlider from "../components/CategorySlider";
import HomeProductSection from "../components/HomeProductSection";
import categoryService from "../services/categoryService";

const BACKGROUND_COLORS = [
  "#fdf2e4", // Light orange
  "#bedcf7", // Light blue
  "#e6f5ea", // Light green
  "#f8e6ff", // Light purple
  "#fff4cc", // Light yellow
  "#ffe6e6", // Light red
];

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          categories.map((category, index) => (
            <HomeProductSection
              key={category.id}
              category={category}
              color={BACKGROUND_COLORS[index % BACKGROUND_COLORS.length]}
            />
          ))
        )}
      </Box>
    </div>
  );
}
