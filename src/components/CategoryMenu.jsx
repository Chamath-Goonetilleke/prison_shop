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

const categories = [
  {
    category: "කම්හල් (Workshops/Factories)",
    subCategory: [
      "කල්දේරම් / පිහි වර්ග (Kettles / Types of Knives)",
      "ඇළුමිනියම් හැඳි වර්ග (Aluminum Spoons)",
      "බාල්දි වර්ග (Buckets)",
      "කේක් තැටි (Cake Trays)",
      "යකඩ ඇඳන් (Iron Beds)",
      "අත් මුල්ලු (Hand Tools/Joints)",
      "දුම් කබල් (Smoke Chambers/Stoves)",
      "ඉටිපන්දම් රඳවන (Candle Holders)",
      "රේක්ක (Rakes)",
      "අත් සවල් (Hand Shovels)",
      "ලියුම් පෙට්ටි (Letter Boxes)",
      "විවිධ විසිතුරු භාණ්ඩ (Various Ornaments/Decorations)",
      "වෙනත් නිර්මාණ (Other Creations)",
    ],
  },
  {
    category: "වඩු (Carpentry)",
    subCategory: [
      "ලී ඇඳන් (Wooden Beds)",
      "පුටු (Chairs)",
      "මේස (Tables)",
      "හකුලන පුටු (Folding Chairs)",
      "කණ්ණාඩි මේස (Dressing Tables/Mirror Tables)",
      "අල්මාරි (Wardrobes/Cupboards)",
      "විවිධ කැටයම් වර්ග (Various Carvings)",
      "බුදු කුටි (Buddha Shrines)",
      "අකුලන ස්ටුල් (Folding Stools)",
      "පොල් කටු හැදි (Coconut Shell Spoons)",
      "පාන් ලැලි (Bread Boards)",
      "හැඳි පෙට්ටි (Spoon Boxes/Cutlery Holders)",
      "ලුණු පොල්කටු (Salt Coconut Shells)",
      "එළවළු කපන ලැලි (Vegetable Cutting Boards)",
      "විදුරු කැබිනට් (Glass Cabinets)",
    ],
  },
  {
    category: "පේෂ කර්ම (Textiles)",
    subCategory: [
      "බේඩ් ෂිට් (Bed Sheets)",
      "අත් පිස්නා (Hand Towels)",
      "හැන්ඩ් ලුම් සාරි (Handloom Sarees)",
      "කොට්ට උර (Pillowcases)",
      "තුවා (Towels)",
    ],
  },
  {
    category: "මැහුම් (Sewing/Tailoring)",
    subCategory: [
      "මදුරු නෙට් (Mosquito Nets)",
      "කොට්ට උර (Pillowcases)",
      "නිම කළ ඇඳුම් (Ready-made Garments)",
      "පාසැල් නිළ ඇඳුම් (School Uniforms)",
      "රෙදි බෑග් (Cloth Bags)",
    ],
  },
  {
    category: "කොසු/ඉදල් (Brooms/Brushes)",
    subCategory: [
      "කොසු මුස්න (Broom Handles)",
      "ඉරටු ඉදල් (Coir Brushes)",
      "B වර්ග (Type B)",
    ],
  },
  {
    category: "බේකරි (Bakery)",
    subCategory: ["සියළුම බේකරි නිෂ්පාදන (All Bakery Products)"],
  },
  {
    category: "පෙදරේරු (Masonry)",
    subCategory: [
      "සිමේන්ති මල් පොච්චි වර්ග (Types of Cement Flower Pots)",
      "ගඩොල් (Bricks)",
    ],
  },
  {
    category: "ලිපි කවර (Letter Covers)",
    subCategory: ["ලිපි කවර (Letter Covers)", "බේහෙත් කවර (Medicine Covers)"],
  },
];

const CategoryMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
    setActiveCategory(null);
  };

  const handleCategoryHover = (event, category) => {
    if (category.subCategory.length > 0) {
      setSubMenuAnchorEl(event.currentTarget);
      setActiveCategory(category);
    } else {
      setSubMenuAnchorEl(null);
      setActiveCategory(null);
    }
  };

  const isMenuOpen = Boolean(anchorEl);
  const isSubMenuOpen = Boolean(subMenuAnchorEl) && activeCategory !== null;

  return (
    <div>
      <Button
        onClick={handleClick}
        sx={{
          backgroundColor: "#235661",
          color: "white",
          "&:hover": { backgroundColor: "#3a5a40" },
          textTransform: "none",
          gap: 1,
        }}
        endIcon={<KeyboardArrowDown />}
      >
        <GridView sx={{ mr: 1 }} />
        Categories
      </Button>

      <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleClose}>
        {categories.map((category) => (
          <MenuItem
            key={category.category}
            onMouseEnter={(e) => handleCategoryHover(e, category)}
            onMouseLeave={() => {
              if (!isSubMenuOpen) setActiveCategory(null);
            }}
            sx={{
              color: "#235661",
              "&:hover": { backgroundColor: "#f1f8e9" },
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <ListItemText primary={category.category} />
            {category.subCategory.length > 0 && (
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
            {activeCategory?.subCategory.map((subcategory) => (
              <MenuItem
                key={subcategory}
                onClick={handleClose}
                sx={{
                  color: "#235661",
                  "&:hover": { backgroundColor: "#f1f8e9" },
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
