import React from 'react'
import Carousel from '../components/common/Carousel'
import CategoryMenu from '../components/CategoryMenu'
import { Box, Typography } from '@mui/material';
import CategorySlider from '../components/CategorySlider';
import HomeProductGrid from '../components/HomeProductGrid';

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
      <CategorySlider />
      <Box sx={{mx: '4rem',my:'2rem'}}>
        <HomeProductGrid />
      </Box>
    </div>
  );
}
