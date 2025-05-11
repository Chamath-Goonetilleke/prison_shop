import React, { useState, useRef, useEffect } from "react";
import {
  IconButton,
  Box,
  Typography,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import prisonService from "../services/prisonService";

const PrisonSlider = () => {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [prisons, setPrisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // Fetch prisons from the database
  useEffect(() => {
    const fetchPrisons = async () => {
      try {
        setLoading(true);
        const data = await prisonService.getActivePrisons();
        setPrisons(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prisons:", error);
        setLoading(false);
      }
    };

    fetchPrisons();
  }, []);

  // Auto scroll animation
  useEffect(() => {
    if (loading || prisons.length === 0) return;

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
  }, [isHovered, loading, prisons]);

  const handleScroll = () => {
    const container = scrollRef.current;
    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = isMobile ? 200 : 300;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handlePrisonClick = (prisonId) => {
    navigate(`/prison/${prisonId}`);
  };

  // Function to get image for a prison
  const getPrisonImage = (prison) => {
    // If the prison has an image, use it
    if (prison.image) {
      return prison.image;
    }

    // Otherwise use a placeholder
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNjY2Ij5Qcmlzb248L3RleHQ+PC9zdmc+";
  };

  // Function to get display name
  const getDisplayName = (prison) => {
    if (prison.nameSi) {
      return `${prison.nameSi} (${prison.nameEn})`;
    }
    return prison.nameEn;
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
          Loading prisons...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        padding: { xs: "10px", sm: "15px", md: "20px" },
      }}
    >
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          mb: 2,
          color: "#235661",
        }}
      >
        Browse Products by Prison
      </Typography>

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
          gap: { xs: "16px", sm: "24px", md: "32px" },
          padding: { xs: "0 40px", sm: "0 50px", md: "0 55px" },
        }}
      >
        {prisons.map((prison) => (
          <Box
            key={prison.id}
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
            onClick={() => handlePrisonClick(prison.id)}
          >
            <Box
              sx={{
                width: { xs: 100, sm: 120, md: 150 },
                height: { xs: 100, sm: 120, md: 150 },
                borderRadius: "10px",
                overflow: "hidden",
                backgroundColor: "#f5f5f5",
                marginBottom: 1,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={getPrisonImage(prison)}
                alt={prison.nameEn}
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
                maxWidth: { xs: 100, sm: 120, md: 150 },
                fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                color: "#333",
              }}
            >
              {getDisplayName(prison)}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Left and Right arrow buttons with responsive sizing */}
      <IconButton
        onClick={() => scroll("left")}
        sx={{
          position: "absolute",
          top: "50%",
          left: { xs: 0, sm: 5 },
          transform: "translateY(-50%)",
          backgroundColor: "rgba(255,255,255,0.8)",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.9)",
          },
          display: showLeftArrow ? "flex" : "none",
          width: { xs: 32, sm: 40 },
          height: { xs: 32, sm: 40 },
        }}
      >
        <ChevronLeft size={isMobile ? 18 : 24} />
      </IconButton>

      <IconButton
        onClick={() => scroll("right")}
        sx={{
          position: "absolute",
          top: "50%",
          right: { xs: 0, sm: 5 },
          transform: "translateY(-50%)",
          backgroundColor: "rgba(255,255,255,0.8)",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.9)",
          },
          display: showRightArrow ? "flex" : "none",
          width: { xs: 32, sm: 40 },
          height: { xs: 32, sm: 40 },
        }}
      >
        <ChevronRight size={isMobile ? 18 : 24} />
      </IconButton>
    </Box>
  );
};

export default PrisonSlider;
