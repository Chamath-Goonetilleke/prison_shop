import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  TextField,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  Slider,
  Checkbox,
  FormControlLabel,
  Chip,
  Button,
  useMediaQuery,
  useTheme,
  Paper,
  Switch,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import ProductCard from "../components/common/ProductCard";
import productService from "../services/productService";
import categoryService from "../services/categoryService";

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchQuery = new URLSearchParams(location.search).get("q") || "";

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    // Reset search term when URL query changes
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch products based on search term
        if (searchQuery) {
          const productsData = await productService.searchProducts(searchQuery);
          setProducts(productsData);
          setFilteredProducts(productsData);

          // Determine price range
          if (productsData.length > 0) {
            const prices = productsData.map((product) =>
              parseFloat(product.price)
            );
            const minPrice = Math.floor(Math.min(...prices));
            const maxPrice = Math.ceil(Math.max(...prices));
            setPriceRange([minPrice, maxPrice]);
          }
        }

        // Fetch all categories and subcategories for filters
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);

        const allSubcategoriesData =
          await categoryService.getAllSubcategories();
        setSubcategories(allSubcategoriesData);

        setError(null);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError("Failed to load search results. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery]);

  // Filter products based on search term, price range, selected categories/subcategories, and in-stock filter
  useEffect(() => {
    let filtered = [...products];

    // Filter by search term (if different from the initial search)
    if (searchTerm && searchTerm !== searchQuery) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          (product.nameEn && product.nameEn.toLowerCase().includes(term)) ||
          (product.nameSi && product.nameSi.toLowerCase().includes(term)) ||
          (product.description &&
            product.description.toLowerCase().includes(term))
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (product) =>
        parseFloat(product.price) >= priceRange[0] &&
        parseFloat(product.price) <= priceRange[1]
    );

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category_id)
      );
    }

    // Filter by selected subcategories
    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedSubcategories.includes(product.subCategory_id)
      );
    }

    // Filter by in-stock status
    if (showInStockOnly) {
      filtered = filtered.filter(
        (product) => product.status === "In Stock" && product.stock > 0
      );
    }

    setFilteredProducts(filtered);
  }, [
    searchTerm,
    priceRange,
    selectedCategories,
    selectedSubcategories,
    showInStockOnly,
    products,
    searchQuery,
  ]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategories((prev) => {
      if (prev.includes(subcategoryId)) {
        return prev.filter((id) => id !== subcategoryId);
      } else {
        return [...prev, subcategoryId];
      }
    });
  };

  const handleClearFilters = () => {
    setSearchTerm(searchQuery);
    setPriceRange([
      Math.min(...products.map((p) => parseFloat(p.price) || 0)),
      Math.max(...(products.map((p) => parseFloat(p.price) || 0) || 10000)),
    ]);
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setShowInStockOnly(false);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  // Render filter sidebar/drawer content
  const filterContent = (
    <Box sx={{ width: isMobile ? "100vw" : 250, p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" component="div">
          Filters
        </Typography>
        {isMobile && (
          <IconButton onClick={toggleDrawer(false)}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* In-Stock Filter */}
      <FormControlLabel
        control={
          <Switch
            checked={showInStockOnly}
            onChange={(e) => setShowInStockOnly(e.target.checked)}
            color="primary"
          />
        }
        label="Show In-Stock Only"
        sx={{ mb: 2, display: "block" }}
      />

      <Divider sx={{ mb: 2 }} />

      {/* Price Range Filter */}
      <Typography variant="subtitle1" gutterBottom>
        Price Range
      </Typography>
      <Box sx={{ px: 1 }}>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={Math.min(...products.map((p) => parseFloat(p.price) || 0))}
          max={Math.max(
            ...(products.map((p) => parseFloat(p.price) || 0) || 10000)
          )}
          sx={{ mt: 2, mb: 1 }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2">Rs. {priceRange[0]}</Typography>
          <Typography variant="body2">Rs. {priceRange[1]}</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Categories Filter */}
      {categories.length > 0 && (
        <>
          <Typography variant="subtitle1" gutterBottom>
            Categories
          </Typography>
          <Box>
            {categories.map((category) => (
              <FormControlLabel
                key={category.id}
                control={
                  <Checkbox
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                  />
                }
                label={
                  category.nameSi
                    ? `${category.nameSi} (${category.nameEn})`
                    : category.nameEn
                }
              />
            ))}
          </Box>
          <Divider sx={{ my: 2 }} />
        </>
      )}

      {/* Subcategories Filter */}
      {subcategories.length > 0 && (
        <>
          <Typography variant="subtitle1" gutterBottom>
            Subcategories
          </Typography>
          <Box>
            {subcategories.map((subcategory) => (
              <FormControlLabel
                key={subcategory.id}
                control={
                  <Checkbox
                    checked={selectedSubcategories.includes(subcategory.id)}
                    onChange={() => handleSubcategoryChange(subcategory.id)}
                  />
                }
                label={
                  subcategory.nameSi
                    ? `${subcategory.nameSi} (${subcategory.nameEn})`
                    : subcategory.nameEn
                }
              />
            ))}
          </Box>
          <Divider sx={{ my: 2 }} />
        </>
      )}

      <Button
        variant="outlined"
        fullWidth
        onClick={handleClearFilters}
        sx={{ mt: 2 }}
      >
        Clear All Filters
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: "center", my: 4 }}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Box>
      ) : (
        <>
          {/* Search Results Header */}
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={"bold"}
              gutterBottom
            >
              Search Results for "{searchQuery}"
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {filteredProducts.length} products found
            </Typography>
          </Box>

          {/* Search & Filter Bar */}
          <Box
            component={Paper}
            elevation={2}
            sx={{
              p: 2,
              mb: 3,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              gap: 2,
            }}
          >
            <form onSubmit={handleSearchSubmit} style={{ width: "100%" }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button type="submit" variant="contained">
                        Search
                      </Button>
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </form>

            <Button
              variant="outlined"
              startIcon={<TuneIcon />}
              onClick={toggleDrawer(true)}
              sx={{ display: { sm: "none" } }}
            >
              Filters
            </Button>

            {/* Selected filter chips */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {showInStockOnly && (
                <Chip
                  label="In-Stock Only"
                  onDelete={() => setShowInStockOnly(false)}
                  size="small"
                  color="primary"
                />
              )}

              {selectedCategories.length > 0 &&
                selectedCategories.map((catId) => {
                  const cat = categories.find((c) => c.id === catId);
                  return (
                    <Chip
                      key={catId}
                      label={cat ? cat.nameEn : `Category ${catId}`}
                      onDelete={() => handleCategoryChange(catId)}
                      size="small"
                    />
                  );
                })}

              {selectedSubcategories.length > 0 &&
                selectedSubcategories.map((subId) => {
                  const subcat = subcategories.find((s) => s.id === subId);
                  return (
                    <Chip
                      key={subId}
                      label={subcat ? subcat.nameEn : `Subcategory ${subId}`}
                      onDelete={() => handleSubcategoryChange(subId)}
                      size="small"
                    />
                  );
                })}
            </Box>
          </Box>

          {/* Main Content */}
          <Grid container spacing={2}>
            {/* Filter Sidebar - visible on desktop */}
            <Grid
              item
              xs={12}
              md={3}
              lg={2}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              {filterContent}
            </Grid>

            {/* Products Grid */}
            <Grid item xs={12} md={9} lg={10}>
              {filteredProducts.length === 0 ? (
                <Box sx={{ textAlign: "center", my: 4 }}>
                  <Typography variant="h6">
                    No products found matching your criteria.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleClearFilters}
                    sx={{ mt: 2 }}
                  >
                    Clear Filters
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {filteredProducts.map((product) => (
                    <Grid item xs={6} sm={4} md={4} lg={3} key={product.id}>
                      <ProductCard product={product} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
          </Grid>
        </>
      )}

      {/* Mobile Drawer for Filters */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {filterContent}
      </Drawer>
    </Container>
  );
};

export default SearchResultsPage;
