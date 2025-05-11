import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
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

const CategoryProductsPage = () => {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const subcategoryParam = searchParams.get("subcategory");

  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch category details
        const categoriesData = await categoryService.getAllCategories();
        const categoryData = categoriesData.find(
          (cat) => cat.id === parseInt(categoryId)
        );
        setCategory(categoryData);

        // Fetch subcategories for this category
        const subcategoriesData =
          await categoryService.getSubcategoriesByCategory(categoryId);
        setSubcategories(subcategoriesData);

        // Set selected subcategory from URL parameter if exists
        if (subcategoryParam) {
          const subcategoryId = parseInt(subcategoryParam);
          setSelectedSubcategories([subcategoryId]);
        }

        // Fetch products for this category
        const productsData = await productService.getProductsByCategory(
          categoryId
        );
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

        setError(null);
      } catch (error) {
        console.error(`Error fetching data for category ${categoryId}:`, error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchData();
    }
  }, [categoryId, subcategoryParam]);

  // Filter products based on search term, price range, selected subcategories, and in-stock filter
  useEffect(() => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
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
    selectedSubcategories,
    showInStockOnly,
    products,
  ]);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
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
    setSearchTerm("");
    setPriceRange([
      Math.min(...products.map((p) => parseFloat(p.price) || 0)),
      Math.max(...(products.map((p) => parseFloat(p.price) || 0) || 10000)),
    ]);
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
          {/* Category Header */}
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {category?.nameSi && `${category.nameSi} - `}
              {category?.nameEn}
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
              }}
              size="small"
            />

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

export default CategoryProductsPage;
