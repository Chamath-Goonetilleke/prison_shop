import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { useMediaQuery, useTheme } from "@mui/material";

export default function ProductCard({ product }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const imageUrl = product?.mainImage ? product.mainImage : "/bed.jpg";

  // Safely format the price
  const formatPrice = (price) => {
    // Check if price exists and is a number
    if (price && !isNaN(parseFloat(price))) {
      return parseFloat(price).toFixed(2);
    }
    return "0.00";
  };

  return (
    <div onClick={() => (window.location = `/product/${product?.id || ""}`)}>
      <Card
        sx={{
          maxWidth: { xs: 160, sm: 200, md: 250 },
          minWidth: { xs: 160, sm: 200, md: 250 },
        }}
      >
        <CardActionArea>
          <CardMedia
            component="img"
            height={isMobile ? "120" : "140"}
            image={imageUrl}
            alt={product?.nameEn || "Product"}
          />
          <CardContent sx={{ padding: isMobile ? 1 : 2 }}>
            <Typography
              gutterBottom
              fontSize={{ xs: "14px", sm: "16px", md: "17px" }}
              component="center"
            >
              {product?.nameEn || "Product Name"}
            </Typography>
            <Typography
              variant="body2"
              component="center"
              sx={{
                color: "text.secondary",
                fontSize: { xs: "13px", sm: "14px", md: "14px" },
              }}
            >
              Rs {formatPrice(product?.price)}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}
