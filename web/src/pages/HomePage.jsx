import React, { useState, useEffect } from "react";
import Carousel from "../components/common/Carousel";
import CategoryMenu from "../components/CategoryMenu";
import {
  Box,
  Typography,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Grid,
  Container,
} from "@mui/material";
import CategorySlider from "../components/CategorySlider";
import HomeProductSection from "../components/HomeProductSection";
import categoryService from "../services/categoryService";
import prisonService from "../services/prisonService";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const[prisons, setPrisons] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllProductCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPrisons=async()=>{
      try {
        const data = await prisonService.getAllPrisons();
        setPrisons(data);
      } catch (error) {
        console.error("Error fetching prisons:", error);
      } finally {
        setLoading(false);
      }
    }
fetchPrisons();
    fetchCategories();
  }, []);

  return (
    <div>
      <Box
        sx={{
          px: { xs: "0.5rem", sm: "1rem", md: "5rem" },
          py: "0.7rem",
          backgroundColor: "lightblue",
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        {/* Mobile version - scrollable */}
        {isMobile && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <CategoryMenu />
           { prisons.map((prison, index)=>(
              <Typography
              sx={{ cursor: "pointer", px: 1 }}
              fontWeight="bold"
              fontSize="15px"
            >
              {prison.nameSi}
            </Typography>
            ))}
            
          </Box>
        )}

        {/* Desktop version */}
        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap:"1rem"
            }}
          >
            <CategoryMenu />
            { prisons.map((prison, index)=>(
              <Typography
              sx={{ cursor: "pointer" }}
              fontWeight="bold"
              fontSize={isTablet ? "15px" : "17px"}
            >
              {prison.nameSi}
            </Typography>
            ))}
           
          </Box>
        )}
      </Box>

      <Carousel />

      <Box sx={{ padding: { xs: "0.5rem", sm: "1rem" } }}>
        <CategorySlider />
      </Box>

      <Container maxWidth="xl">
        <Box
          sx={{
            mx: { xs: "0.5rem", sm: "1rem", md: "2rem" },
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
      </Container>
    </div>
  );
}
