import React, { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  MenuList,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowRight,
  GridView,
} from "@mui/icons-material";

const CategoryMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  const [activeCategory, setActiveCategory] = useState("");

  const categories = {
    Flowers: [],
    "Cakes and Bakes": [
      "By Occasion",
      "Signature Cakes",
      "Cheese Cakes",
      "Themed Cakes",
      "Specialty Cakes",
      "Cupcakes",
      "Jar Cakes",
      "Mini Cakes",
      "Dessert Cakes",
      "Bento Cakes",
      "Tea Time Essentials",
    ],
    Supermarket: [],
    Pharmacy: [],
    "Fruit Baskets & Hampers": [],
    "Chocolates & Cookies": [],
    "Traditional Treats": [],
    Gifts: [],
    Toys: [],
    Plants: [],
    Perfumes: [],
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
    setActiveCategory("");
  };

  const handleCategoryHover = (event, category) => {
    if (categories[category].length > 0) {
      setSubMenuAnchorEl(event.currentTarget);
      setActiveCategory(category);
    } else {
      setSubMenuAnchorEl(null);
      setActiveCategory("");
    }
  };

  const isMenuOpen = Boolean(anchorEl);
  const isSubMenuOpen = Boolean(subMenuAnchorEl) && activeCategory !== "";

  return (
    <div>
      <Button
        onClick={handleClick}
        sx={{
          backgroundColor: "#588157",
          color: "white",
          "&:hover": {
            backgroundColor: "#3a5a40",
          },
          textTransform: "none",
          fontSize:'17px',
          gap: 1,
        }}
        endIcon={<KeyboardArrowDown />}
      >
        <GridView sx={{ mr: 1 }} />
        Categories
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            width: 250,
            maxHeight: "none",
          },
        }}
      >
        {Object.entries(categories).map(([category, subcategories]) => (
          <MenuItem
            key={category}
            onMouseEnter={(e) => handleCategoryHover(e, category)}
            onMouseLeave={() => {
              if (!isSubMenuOpen) setActiveCategory("");
            }}
            sx={{
              color: "#588157",
              "&:hover": {
                backgroundColor: "#f1f8e9",
              },
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <ListItemText primary={category} />
            {subcategories.length > 0 && (
              <ListItemIcon sx={{ minWidth: "auto" }}>
                <KeyboardArrowRight />
              </ListItemIcon>
            )}
          </MenuItem>
        ))}
      </Menu>

      <Popper
        open={isSubMenuOpen}
        anchorEl={subMenuAnchorEl}
        placement="right-start"
        sx={{ zIndex: 1300 }}
      >
        <Paper elevation={3}>
          <MenuList>
            {categories[activeCategory]?.map((subcategory) => (
              <MenuItem
                key={subcategory}
                onClick={handleClose}
                sx={{
                  width: 250,
                  color: "#588157",
                  "&:hover": {
                    backgroundColor: "#f1f8e9",
                  },
                }}
              >
                <ListItemText primary={subcategory} />
              </MenuItem>
            ))}
          </MenuList>
        </Paper>
      </Popper>
    </div>
  );
};

export default CategoryMenu;
