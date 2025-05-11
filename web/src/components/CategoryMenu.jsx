import React, { useState, useEffect } from "react";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  MenuList,
  CircularProgress,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowRight,
  GridView,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import categoryService from "../services/categoryService";

const CategoryMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategoriesMap, setSubcategoriesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch categories and subcategories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get all categories
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);

        // Get all subcategories
        const allSubcategories = await categoryService.getAllSubcategories();

        // Create a map of category id to its subcategories
        const subcatMap = {};
        allSubcategories.forEach((subcategory) => {
          if (!subcatMap[subcategory.category_id]) {
            subcatMap[subcategory.category_id] = [];
          }
          subcatMap[subcategory.category_id].push(subcategory);
        });

        setSubcategoriesMap(subcatMap);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories and subcategories:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
    setActiveCategory(null);
  };

  const handleCategoryHover = (event, category) => {
    const hasSubcategories =
      subcategoriesMap[category.id] && subcategoriesMap[category.id].length > 0;

    if (hasSubcategories) {
      setSubMenuAnchorEl(event.currentTarget);
      setActiveCategory(category);
    } else {
      setSubMenuAnchorEl(null);
      setActiveCategory(null);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
    handleClose();
  };

  const handleSubcategoryClick = (categoryId, subcategoryId) => {
    navigate(`/category/${categoryId}?subcategory=${subcategoryId}`);
    handleClose();
  };

  const isMenuOpen = Boolean(anchorEl);
  const isSubMenuOpen = Boolean(subMenuAnchorEl) && activeCategory !== null;

  // Function to get the display name (English and Sinhala)
  const getDisplayName = (item) => {
    if (item.nameSi) {
      return `${item.nameSi} (${item.nameEn})`;
    }
    return item.nameEn;
  };

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
        {loading ? (
          <MenuItem disabled>
            <CircularProgress size={24} sx={{ mr: 2 }} />
            Loading categories...
          </MenuItem>
        ) : (
          categories.map((category) => (
            <MenuItem
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
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
              <ListItemText primary={getDisplayName(category)} />
              {subcategoriesMap[category.id] &&
                subcategoriesMap[category.id].length > 0 && (
                  <ListItemIcon sx={{ minWidth: "auto" }}>
                    <KeyboardArrowRight />
                  </ListItemIcon>
                )}
            </MenuItem>
          ))
        )}
      </Menu>

      <Popper
        open={isSubMenuOpen}
        anchorEl={subMenuAnchorEl}
        placement="right-start"
        sx={{ zIndex: 1300 }}
      >
        <Paper elevation={3}>
          <MenuList>
            {activeCategory &&
              subcategoriesMap[activeCategory.id] &&
              subcategoriesMap[activeCategory.id].map((subcategory) => (
                <MenuItem
                  key={subcategory.id}
                  onClick={() =>
                    handleSubcategoryClick(activeCategory.id, subcategory.id)
                  }
                  sx={{
                    color: "#235661",
                    "&:hover": { backgroundColor: "#f1f8e9" },
                  }}
                >
                  <ListItemText primary={getDisplayName(subcategory)} />
                </MenuItem>
              ))}
          </MenuList>
        </Paper>
      </Popper>
    </div>
  );
};

export default CategoryMenu;
