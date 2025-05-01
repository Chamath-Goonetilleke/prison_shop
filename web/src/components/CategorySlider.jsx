import React, { useState, useRef, useEffect } from "react";
import { IconButton, Box, Typography, CircularProgress } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import categoryService from "../services/categoryService";

const CategorySlider = () => {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getAllCategories();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Auto scroll animation
  useEffect(() => {
    if (loading || categories.length === 0) return;

    const scrollContainer = scrollRef.current;
    let animationFrameId;
    let startTime;

    const scroll = (timestamp) => {
      if (!startTime) startTime = timestamp;
      if (isHovered) {
        startTime = timestamp;
        animationFrameId = requestAnimationFrame(scroll);
        return;
      }

      const speed = 0.5;

      if (scrollContainer) {
        scrollContainer.scrollLeft += speed;

        if (
          scrollContainer.scrollLeft >=
          scrollContainer.scrollWidth - scrollContainer.clientWidth
        ) {
          scrollContainer.scrollLeft = 0;
          startTime = timestamp;
        }
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isHovered, loading, categories]);

  const handleScroll = () => {
    const container = scrollRef.current;
    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 300;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Function to get image for a category
  const getCategoryImage = (category) => {
    // If the category has an image, use it
    if (category.image) {
      return category.image;
    }

    // Otherwise use a placeholder based on code
    const code = category.code.toLowerCase();
    const placeholderImages = {
      workshop: "/cat-workshop.png",
      carpentry: "/cat-carpentry.png",
      textiles: "/cat-textiles.png",
      tailoring: "/cat-sewing.png",
      brooms: "/cat-brooms_brushes.png",
      bakery: "/cat-bakery.png",
      masonry: "/cat-masonry.png",
      stationery: "/cat-letter_covers.png",
    };

    return placeholderImages[code] || "/placeholder.png";
  };

  // Function to get display name
  const getDisplayName = (category) => {
    if (category.nameSi) {
      return `${category.nameSi} (${category.nameEn})`;
    }
    return category.nameEn;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 200,
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading categories...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", width: "100%", padding: "20px" }}>
      <Box
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          display: "flex",
          overflowX: "hidden",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          gap: "32px",
          padding: "0 55px",
        }}
      >
        {categories.map((category) => (
          <Box
            key={category.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              my: "1rem",
              minWidth: "fit-content",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <Box
              sx={{
                width: 150,
                height: 150,
                borderRadius: "50%",
                overflow: "hidden",
                backgroundColor: "#f5f5f5",
                marginBottom: 1,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={getCategoryImage(category)}
                alt={category.nameEn}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
            <Typography
              sx={{
                textAlign: "center",
                maxWidth: 150,
                fontSize: "1rem",
                color: "#333",
              }}
            >
              {getDisplayName(category)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CategorySlider;
