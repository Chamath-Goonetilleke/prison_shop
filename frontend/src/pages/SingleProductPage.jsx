import React, { useRef, useState } from "react";
import {
  Button,
  Typography,
  Select,
  MenuItem,
  IconButton,
  TextField,
  Breadcrumbs,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import Breadcrumb from "../components/common/BreadCrumb";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
const SingleProductPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState("1 KG");
  const [cakeBase, setCakeBase] = useState("CHOCOLATE FUDGE");


const scrollContainerRef = useRef(null);

const scroll = (direction) => {
  if (scrollContainerRef.current) {
    const scrollAmount = 200; 
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }
};
  const handleQuantityChange = (type) => {
    setQuantity((prev) =>
      type === "increase" ? prev + 1 : prev > 1 ? prev - 1 : 1
    );
  };

  return (
    <div style={{ margin: "3rem" }}>
      <Breadcrumb />
      <div
        style={{
          display: "flex",
          gap: "20px",
          padding: "20px",
        }}
      >
        <div style={{ flex: 1.3 }}>
          <img
            src="/bed.jpg"
            alt="Chocolate Fudge Cake"
            style={{ width: "100%", borderRadius: "10px" }}
          />
          <div
            style={{ display: "flex", alignItems: "center", maxWidth: "95vh" }}
          >
            {/* Left Arrow Button */}
            <button
              onClick={() => scroll("left")}
              style={{
                cursor: "pointer",
                border: "none",
                background: "none",
              }}
            >
              <ArrowCircleLeftOutlinedIcon fontSize="large" />
            </button>

            {/* Scrollable Image Container */}
            <div
              ref={scrollContainerRef}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
                overflowX: "hidden", // Hide scrollbar
                scrollBehavior: "smooth",
                whiteSpace: "nowrap",
                flexGrow: 1,
              }}
            >
              {[...Array(5)].map((_, index) => (
                <img
                  key={index}
                  src="/bed.jpg"
                  alt="Chocolate Fudge Cake"
                  style={{ maxWidth: "170px", marginRight: "10px" }}
                />
              ))}
            </div>

            {/* Right Arrow Button */}
            <button
              onClick={() => scroll("right")}
              style={{
                cursor: "pointer",
                border: "none",
                background: "none"
              }}
            >
              <ArrowCircleRightOutlinedIcon fontSize="large" />
            </button>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            marginLeft: "2rem",
            gap: "50px",
          }}
        >
          <Typography variant="h5">
            CHOCOLATE FUDGE CAKE 1KG (2.2LBS)
          </Typography>
          <Typography variant="h6">Rs. 5,250.00</Typography>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <IconButton onClick={() => handleQuantityChange("decrease")}>
              <Remove />
            </IconButton>
            <TextField
              value={quantity}
              size="small"
              style={{ width: "50px", textAlign: "center" }}
              disabled
            />
            <IconButton onClick={() => handleQuantityChange("increase")}>
              <Add />
            </IconButton>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <Button
              variant="contained"
              style={{
                backgroundColor: "green",
                color: "white",
                height: "3rem",
              }}
            >
              ADD TO CART
            </Button>
            <Button variant="outlined" sx={{ height: "3rem" }}>
              BUY IT NOW
            </Button>
          </div>
          <div style={{ textAlign: "justify" }}>
            Elevate your dessert experience with our coffee gateau – a true
            masterpiece. Luxuriously topped with cashews, dark chocolate,
            caramel, and a delicate scattering of biscuits, this creation offers
            a perfect symphony of textures and flavors. Indulge in the
            delightful crunch of cashews paired with the rich allure of dark
            chocolate and caramel, all crowned with the satisfying touch of
            biscuits. A dessert like no other, designed to captivate your senses
            and leave you craving for more.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
