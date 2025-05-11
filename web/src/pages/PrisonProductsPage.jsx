import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ProductCard from "../components/common/ProductCard";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import prisonService from "../services/prisonService";

const PrisonProductsPage = () => {
  const { prisonId } = useParams();
  const [prison, setPrison] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategoriesMap, setSubcategoriesMap] = useState({});
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
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

        // Fetch prison details
        const prisonData = await prisonService.getPrisonById(prisonId);
        setPrison(prisonData);

        // Fetch all categories
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);

        // Fetch all subcategories
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

        // Fetch products for this prison
        const productsData = await productService.getProductsByPrison(prisonId);
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
        console.error(`Error fetching data for prison ${prisonId}:`, error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (prisonId) {
      fetchData();
    }
  }, [prisonId]);

  // Filter products based on search term, price range, categories, subcategories, and in-stock filter
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
  ]);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        // If removing category, also remove its subcategories
        const subcategoriesToRemove =
          subcategoriesMap[categoryId]?.map((sc) => sc.id) || [];
        setSelectedSubcategories((current) =>
          current.filter((id) => !subcategoriesToRemove.includes(id))
        );
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleSubcategoryChange = (subcategoryId, categoryId) => {
    setSelectedSubcategories((prev) => {
      if (prev.includes(subcategoryId)) {
        return prev.filter((id) => id !== subcategoryId);
      } else {
        // If adding subcategory, ensure its parent category is selected
        if (!selectedCategories.includes(categoryId)) {
          setSelectedCategories((current) => [...current, categoryId]);
        }
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

  // Get display name for category or subcategory
  const getDisplayName = (item) => {
    if (item.nameSi) {
      return `${item.nameSi} (${item.nameEn})`;
    }
    return item.nameEn;
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

      {/* Categories and Subcategories Filter */}
      <Typography variant="subtitle1" gutterBottom>
        Categories
      </Typography>
      <Box sx={{ mt: 1 }}>
        {categories.map((category) => (
          <Box key={category.id} sx={{ mb: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                />
              }
              label={getDisplayName(category)}
            />

            {/* Show subcategories if this category is selected */}
            {selectedCategories.includes(category.id) &&
              subcategoriesMap[category.id] && (
                <Box sx={{ ml: 3 }}>
                  {subcategoriesMap[category.id].map((subcategory) => (
                    <FormControlLabel
                      key={subcategory.id}
                      control={
                        <Checkbox
                          checked={selectedSubcategories.includes(
                            subcategory.id
                          )}
                          onChange={() =>
                            handleSubcategoryChange(subcategory.id, category.id)
                          }
                          size="small"
                        />
                      }
                      label={
                        <Typography variant="body2">
                          {getDisplayName(subcategory)}
                        </Typography>
                      }
                    />
                  ))}
                </Box>
              )}
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

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
          {/* Prison Header */}
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {prison?.nameSi && `${prison.nameSi} - `}
              {prison?.nameEn} Prison Products
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

              {selectedCategories.map((catId) => {
                const cat = categories.find((c) => c.id === catId);
                return (
                  <Chip
                    key={`cat-${catId}`}
                    label={cat ? getDisplayName(cat) : `Category ${catId}`}
                    onDelete={() => handleCategoryChange(catId)}
                    size="small"
                  />
                );
              })}

              {selectedSubcategories.map((subId) => {
                // Find the subcategory in the map
                let subcat = null;
                for (const catId in subcategoriesMap) {
                  const found = subcategoriesMap[catId].find(
                    (s) => s.id === subId
                  );
                  if (found) {
                    subcat = found;
                    break;
                  }
                }
                return (
                  <Chip
                    key={`sub-${subId}`}
                    label={
                      subcat ? getDisplayName(subcat) : `Subcategory ${subId}`
                    }
                    onDelete={() =>
                      handleSubcategoryChange(subId, subcat?.category_id)
                    }
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

export default PrisonProductsPage;
