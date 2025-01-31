import React, { useState, useRef, useEffect } from "react";
import { IconButton, Box, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CategorySlider = () => {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const categories = [
    { id: 1, name: "Plants", image: "/bed.jpg" },
    { id: 2, name: "Perfumes", image: "/bed.jpg" },
    { id: 3, name: "Gift Vouchers", image: "/bed.jpg" },
    { id: 4, name: "Jewelry", image: "/bed.jpg" },
    { id: 5, name: "Home & Living", image: "/bed.jpg" },
    { id: 6, name: "Greeting Cards", image: "/bed.jpg" },
    {
      id: 7,
      name: "Pirikara & Pooja Bhanda",
      image: "/bed.jpg",
    },
    { id: 8, name: "Flowers", image: "/bed.jpg" },
    { id: 9, name: "Cakes and Bakes", image: "/bed.jpg" },
    { id: 9, name: "Cakes and Bakes", image: "/bed.jpg" },
    { id: 9, name: "Cakes and Bakes", image: "/bed.jpg" },
    { id: 9, name: "Cakes and Bakes", image: "/bed.jpg" },
    { id: 9, name: "Cakes and Bakes", image: "/bed.jpg" },
    { id: 9, name: "Cakes and Bakes", image: "/bed.jpg" },
    { id: 9, name: "Cakes and Bakes", image: "/bed.jpg" },
    { id: 9, name: "Cakes and Bakes", image: "/bed.jpg" },
  ];

  useEffect(() => {
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

      const progress = timestamp - startTime;
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
  }, [isHovered]);

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

  return (
    <Box sx={{ position: "relative", width: "100%", padding: "30px" }}>


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
          padding: "0 48px",
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
              minWidth: "fit-content",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <Box
              sx={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                overflow: "hidden",
                backgroundColor: "#f5f5f5",
                marginBottom: 1,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={category.image}
                alt={category.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                maxWidth: 96,
                fontSize: "0.875rem",
                color: "#333",
              }}
            >
              {category.name}
            </Typography>
          </Box>
        ))}
      </Box>

    </Box>
  );
};

export default CategorySlider;
