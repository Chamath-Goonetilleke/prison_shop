import * as React from "react";
import Box from "@mui/material/Box";
import ProductCard from "./common/ProductCard";
import { Typography } from "@mui/material";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
export default function HomeProductSection({ category, color }) {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: color,
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <Box>
        <Typography fontSize={"25px"} fontWeight={"bold"}>
          {category.name}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              overflowX: "hidden",
              scrollBehavior: "smooth",
              whiteSpace: "nowrap",
              flexGrow: 1,
              maxWidth: "78%",
              gap: "25px",
            }}
          >
            {Array.from(Array(20)).map((_, index) => (
              <ProductCard />
            ))}
          </Box>
          <Box
            position="relative"
            display="inline-block"
            sx={{ cursor: "pointer" }}
          >
            <img
              src={category.image}
              alt="workshop"
              style={{
                maxWidth: 250,
                minWidth: 250,
                maxHeight: 210,
                borderRadius: "10px",
                opacity: 0.6,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#2a6595",
                color: "white",
                fontWeight: "bold",
                fontSize: "21px",
                textAlign: "center",
                padding: "10px",
                width: "65%",
              }}
            >
              View More <ArrowForwardOutlinedIcon />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
