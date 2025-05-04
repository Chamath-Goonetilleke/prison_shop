import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Paper,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextareaAutosize,
  IconButton,
  Card,
  CardMedia,
  CardActions,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import subCategoryService from "../../services/subCategoryService";
import prisonService from "../../services/prisonService";

// Helper function to extract filename from path

// Will be loaded dynamically from the database
const PRODUCT_TYPES = {};

// Define attribute types for validation and UI rendering
const ATTRIBUTE_TYPES = {
  TEXT: "text",
  NUMBER: "number",
  COLOR: "color",
  SELECT: "select",
  MULTISELECT: "multiselect",
  TEXTAREA: "textarea",
  DIMENSIONS: "dimensions",
  WEIGHT: "weight",
  MATERIAL: "material",
  LANGUAGE: "language",
};

// Product type attribute configurations

export default function AddProductForm({ onBack, editProduct, mode = "add" }) {
  const [newProduct, setNewProduct] = useState({
    id: Date.now(),
    nameEn: "",
    nameSi: "",
    description: "",
    price: "",
    stock: "",
    productCode: "",
    category: "",
    category_id: "",
    subCategory: "",
    prison_id: "",
    status: "In Stock",
    active: "Yes",
    type: "",
    attributes: {},
    image: "",
    mainImage: null,
    additionalImages: [],
  });

  const [previewImages, setPreviewImages] = useState({
    mainImage: null,
    additionalImages: [],
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categoryAttributes, setCategoryAttributes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [prisons, setPrisons] = useState([]);

  const mainImageInputRef = useRef(null);
  const additionalImagesInputRef = useRef(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();

        // Create a lookup object for product types
        const types = {};
        data.forEach((category) => {
          types[category.code.toLowerCase()] = category.code.toLowerCase();
        });

        // Update PRODUCT_TYPES with dynamic data
        Object.assign(PRODUCT_TYPES, types);

        setCategories(data);

        // Set default type if available and not in edit mode
        if (data.length > 0 && mode !== "edit") {
          setNewProduct((prev) => ({
            ...prev,
            type: data[0].code.toLowerCase(),
            category_id: data[0].id, // Set initial category_id to first category's id
          }));

          // Fetch attributes for the first category
          fetchCategoryAttributes(data[0].id);

          // Fetch subcategories for the first category
          fetchSubCategories(data[0].id);
        } else {
          setInitialLoading(false);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        showNotification("Error loading categories", "error");
        setInitialLoading(false);
      }
    };

    fetchCategories();
  }, [mode]);

  // Special useEffect to handle edit mode dependencies
  useEffect(() => {
    if (mode === "edit" && editProduct && categories.length > 0) {
      // Find the category based on category_id
      const category = categories.find((c) => c.id === editProduct.category_id);

      if (category) {
        setNewProduct((prev) => ({
          ...prev,
          type: category.code.toLowerCase(),
          category_id: category.id,
        }));

        fetchCategoryAttributes(category.id);
        fetchSubCategories(category.id);
      }

      setInitialLoading(false);
    }
  }, [categories, editProduct, mode]);

  const fetchCategoryAttributes = async (categoryId) => {
    try {
      const attributes =
        await categoryService.getCategoryAttributes(categoryId);
      setCategoryAttributes(attributes);

      // If in edit mode and we have attributes, make sure they're preserved
      if (mode === "edit" && editProduct && editProduct.attributes) {
        // Keep the existing attributes but ensure they match the format for available attributes
        setNewProduct((prev) => {
          // Only keep attributes that are defined for this category
          const validAttributes = {};
          attributes.forEach((attr) => {
            if (prev.attributes[attr.name] !== undefined) {
              validAttributes[attr.name] = prev.attributes[attr.name];
            }
          });

          return {
            ...prev,
            attributes: validAttributes,
          };
        });
      }

      setInitialLoading(false);
    } catch (error) {
      console.error(
        `Error fetching attributes for category ${categoryId}:`,
        error
      );
      setCategoryAttributes([]);
      setInitialLoading(false);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    try {
      const data =
        await subCategoryService.getSubCategoriesByCategory(categoryId);
      setSubcategories(data);

      // Reset subcategory selection when changing category
      setNewProduct((prev) => ({
        ...prev,
        subCategory: "",
      }));
    } catch (error) {
      console.error(
        `Error fetching subcategories for category ${categoryId}:`,
        error
      );
      setSubcategories([]);
    }
  };

  // Fetch prisons on component mount
  useEffect(() => {
    const fetchPrisons = async () => {
      try {
        const data = await prisonService.getActivePrisons();
        setPrisons(data);
      } catch (error) {
        console.error("Error fetching prisons:", error);
        showNotification("Error loading prisons", "error");
      }
    };

    fetchPrisons();
  }, []);

  // Add a useEffect to populate form when in edit mode
  useEffect(() => {
    if (mode === "edit" && editProduct) {
      // First make sure we have loaded categories
      if (categories.length === 0) {
        return; // Wait for categories to load
      }

      // Find the category based on category_id
      const category = categories.find((c) => c.id === editProduct.category_id);
      const categoryCode = category ? category.code.toLowerCase() : "";

      // Convert the editProduct data to the format expected by the form
      const productToEdit = {
        id: editProduct.id,
        nameEn: editProduct.nameEn,
        nameSi: editProduct.nameSi || "",
        description: editProduct.description || "",
        price: editProduct.price,
        stock: editProduct.stock || "",
        productCode: editProduct.productCode || "",
        category: "",
        category_id: editProduct.category_id,
        subCategory: editProduct.subCategory_id || "",
        prison_id: editProduct.prison_id || "",
        status: editProduct.status || "In Stock",
        active: editProduct.active || "Yes",
        type: categoryCode, // Use the category code from the found category
        attributes: editProduct.attributes || {},
        mainImage: editProduct.mainImage,
        additionalImages: editProduct.additionalImages || [],
      };

      // Set preview images
      setPreviewImages({
        mainImage: editProduct.mainImage || null,
        additionalImages: editProduct.additionalImages || [],
      });

      setNewProduct(productToEdit);

      // If category exists, fetch its attributes and subcategories
      if (editProduct.category_id) {
        fetchCategoryAttributes(editProduct.category_id);
        fetchSubCategories(editProduct.category_id);
      }
    }
  }, [mode, editProduct, categories]);

  // After categories are loaded and we're in edit mode, handle subcategory
  useEffect(() => {
    if (mode === "edit" && editProduct && subcategories.length > 0) {
      // Set the subcategory value
      setNewProduct((prev) => ({
        ...prev,
        subCategory: editProduct.subCategory_id || "",
      }));
    }
  }, [subcategories, editProduct, mode]);

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (e) => {
    const typeCode = e.target.value;

    // Find the category with this code
    const category = categories.find((c) => c.code.toLowerCase() === typeCode);

    setNewProduct((prev) => ({
      ...prev,
      type: typeCode,
      category_id: category ? category.id : "", // Add category_id
      attributes: {}, // Reset attributes when type changes
      subCategory: "", // Reset subcategory when type changes
    }));

    if (category) {
      fetchCategoryAttributes(category.id);
      fetchSubCategories(category.id);
    } else {
      setCategoryAttributes([]);
      setSubcategories([]);
    }
  };

  const handleAttributeChange = (attributeId, value) => {
    setNewProduct((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attributeId]: value,
      },
    }));
  };

  const handleMainImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Create a preview URL
      const previewUrl = URL.createObjectURL(selectedFile);

      setPreviewImages((prev) => ({
        ...prev,
        mainImage: previewUrl,
      }));

      setNewProduct((prev) => ({
        ...prev,
        mainImage: selectedFile,
      }));
    }
  };

  const handleAdditionalImagesChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);

      // Create preview URLs for each file
      const newPreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );

      setPreviewImages((prev) => ({
        ...prev,
        additionalImages: [...prev.additionalImages, ...newPreviews],
      }));

      setNewProduct((prev) => ({
        ...prev,
        additionalImages: [...prev.additionalImages, ...selectedFiles],
      }));
    }
  };

  const removeAdditionalImage = (index) => {
    setPreviewImages((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index),
    }));

    setNewProduct((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index),
    }));
  };

  const removeMainImage = () => {
    setPreviewImages((prev) => ({
      ...prev,
      mainImage: null,
    }));

    setNewProduct((prev) => ({
      ...prev,
      mainImage: null,
    }));

    // Reset the file input
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = "";
    }
  };

  const setAsMainImage = (index) => {
    // Get the image to be promoted
    const imageToPromote = newProduct.additionalImages[index];
    const previewToPromote = previewImages.additionalImages[index];

    // Store the current main image
    const currentMainImage = newProduct.mainImage;
    const currentMainPreview = previewImages.mainImage;

    // Filter out the promoted image from additional images
    const newAdditionalImages = newProduct.additionalImages.filter(
      (_, i) => i !== index
    );
    const newAdditionalPreviews = previewImages.additionalImages.filter(
      (_, i) => i !== index
    );

    // If there was a main image, add it to additional images
    if (currentMainImage) {
      newAdditionalImages.push(currentMainImage);
      newAdditionalPreviews.push(currentMainPreview);
    }

    // Update state
    setNewProduct((prev) => ({
      ...prev,
      mainImage: imageToPromote,
      additionalImages: newAdditionalImages,
    }));

    setPreviewImages((prev) => ({
      ...prev,
      mainImage: previewToPromote,
      additionalImages: newAdditionalPreviews,
    }));
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const addProduct = async () => {
    if (!newProduct.nameEn || !newProduct.price) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    if (!newProduct.mainImage && mode === "add") {
      showNotification("Main image is required", "error");
      return;
    }

    if (!newProduct.category_id) {
      showNotification("Category is required", "error");
      return;
    }

    try {
      setLoading(true);

      // Prepare the product data for the API
      const productData = {
        nameEn: newProduct.nameEn,
        nameSi: newProduct.nameSi,
        description: newProduct.description,
        price: newProduct.price,
        stock: newProduct.stock,
        productCode: newProduct.productCode || "",
        status: newProduct.status,
        active: newProduct.active,
        type: newProduct.type,
        category_id: newProduct.category_id, // Add category_id to product data
        subCategory: newProduct.subCategory,
        mainImage: newProduct.mainImage,
        prison_id: newProduct.prison_id,
        additionalImages: newProduct.additionalImages,
        attributes: newProduct.attributes,
      };

      let result;

      if (mode === "edit") {
        // Update existing product
        result = await productService.updateProduct(newProduct.id, productData);
        showNotification("Product updated successfully!");
      } else {
        // Create new product
        result = await productService.createProduct(productData);
        showNotification("Product created successfully!");
      }

      console.log(
        `Product ${mode === "edit" ? "updated" : "created"} successfully:`,
        result
      );

      // Reset form if not editing
      if (mode !== "edit") {
        setNewProduct({
          id: Date.now(),
          nameEn: "",
          nameSi: "",
          description: "",
          price: "",
          stock: "",
          productCode: "",
          category: "",
          category_id: "",
          subCategory: "",
          status: "In Stock",
          active: "Yes",
          type: "",
          attributes: {},
          image: "",
          mainImage: null,
          additionalImages: [],
        });

        setPreviewImages({
          mainImage: null,
          additionalImages: [],
        });
      }

      // Wait a moment to show success message before going back
      setTimeout(() => {
        // Go back to the product list
        onBack();
      }, 1500);
    } catch (error) {
      console.error(
        `Error ${mode === "edit" ? "updating" : "creating"} product:`,
        error
      );
      showNotification(
        error.response?.data?.message ||
          `Error ${mode === "edit" ? "updating" : "creating"} product`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Render the appropriate input for each attribute type
  const renderAttributeInput = (attribute) => {
    // Get existing value from attributes object, or default to empty value
    let value = newProduct.attributes[attribute.name] || "";

    // For multiselect, ensure value is an array
    if (
      attribute.type === ATTRIBUTE_TYPES.MULTISELECT &&
      !Array.isArray(value)
    ) {
      value = value ? [value] : [];
    }

    switch (attribute.type) {
      case "text":
        return (
          <TextField
            fullWidth
            variant="outlined"
            value={value}
            onChange={(e) =>
              handleAttributeChange(attribute.name, e.target.value)
            }
          />
        );

      case "number":
        return (
          <TextField
            fullWidth
            type="number"
            variant="outlined"
            value={value}
            onChange={(e) =>
              handleAttributeChange(attribute.name, e.target.value)
            }
          />
        );

      case "color":
        return (
          <TextField
            fullWidth
            variant="outlined"
            value={value}
            placeholder="e.g. Red, Blue, #FF5733"
            onChange={(e) =>
              handleAttributeChange(attribute.name, e.target.value)
            }
          />
        );

      case "select":
        return (
          <FormControl fullWidth>
            <InputLabel>{attribute.name}</InputLabel>
            <Select
              value={value}
              label={attribute.name}
              onChange={(e) =>
                handleAttributeChange(attribute.name, e.target.value)
              }
            >
              <MenuItem value="">Select {attribute.name}</MenuItem>
              {attribute.options &&
                attribute.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        );

      case "multiselect":
        return (
          <FormGroup>
            {attribute.options &&
              attribute.options.map((option) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={value.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleAttributeChange(attribute.name, [
                            ...value,
                            option,
                          ]);
                        } else {
                          handleAttributeChange(
                            attribute.name,
                            value.filter((val) => val !== option)
                          );
                        }
                      }}
                    />
                  }
                  label={option}
                />
              ))}
          </FormGroup>
        );

      case "textarea":
        return (
          <TextareaAutosize
            minRows={3}
            value={value}
            onChange={(e) =>
              handleAttributeChange(attribute.name, e.target.value)
            }
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginTop: "8px",
              resize: "vertical",
            }}
          />
        );

      default:
        return (
          <TextField
            fullWidth
            variant="outlined"
            value={value}
            onChange={(e) =>
              handleAttributeChange(attribute.name, e.target.value)
            }
          />
        );
    }
  };

  if (initialLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading categories...
        </Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ padding: 3 }}>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={onBack} variant="outlined" sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={"bold"}>
          {mode === "edit" ? "Edit Product" : "Add New Product"}
        </Typography>
      </Box>

      <div>
        <Typography
          variant="h6"
          sx={{
            mt: 3,
            mb: 1,
            fontWeight: "bold",
            backgroundColor: "lightgray",
            padding: "0.5rem",
          }}
        >
          Product Details
        </Typography>
        <div style={{ display: "flex", width: "100%", gap: "1rem" }}>
          <TextField
            required
            fullWidth
            label="Name (English)"
            name="nameEn"
            value={newProduct.nameEn}
            onChange={handleBasicInfoChange}
            variant="outlined"
            margin="normal"
          />

          <TextField
            required
            fullWidth
            label="Name (Sinhala)"
            name="nameSi"
            value={newProduct.nameSi}
            onChange={handleBasicInfoChange}
            variant="outlined"
            margin="normal"
          />
        </div>

        <div style={{ display: "flex", width: "100%", gap: "1rem" }}>
          <TextField
            required
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={newProduct.price}
            onChange={handleBasicInfoChange}
            variant="outlined"
            margin="normal"
            InputProps={{
              startAdornment: <span style={{ marginRight: "8px" }}>Rs.</span>,
            }}
          />
          <TextField
            fullWidth
            label="Stock Quantity"
            name="stock"
            type="number"
            value={newProduct.stock}
            onChange={handleBasicInfoChange}
            variant="outlined"
            margin="normal"
          />
        </div>
        <div style={{ display: "flex", width: "100%", gap: "1rem" }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Product Type</InputLabel>
            <Select
              name="type"
              value={newProduct.type}
              label="Product Type"
              onChange={handleTypeChange}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.code.toLowerCase()}>
                  {category.nameSi
                    ? `${category.nameEn} (${category.nameSi})`
                    : category.nameEn}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Sub Category</InputLabel>
            <Select
              name="subCategory"
              value={newProduct.subCategory}
              label="Sub Category"
              onChange={handleBasicInfoChange}
              disabled={subcategories.length === 0}
            >
              <MenuItem value="">Select Subcategory</MenuItem>
              {subcategories.map((subcategory) => (
                <MenuItem key={subcategory.id} value={subcategory.id}>
                  {subcategory.nameSi
                    ? `${subcategory.nameEn} (${subcategory.nameSi})`
                    : subcategory.nameEn}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div style={{ display: "flex", width: "100%", gap: "1rem" }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Prison</InputLabel>
            <Select
              name="prison_id"
              value={newProduct.prison_id}
              label="Prison"
              onChange={handleBasicInfoChange}
            >
              <MenuItem value="">Select Prison</MenuItem>
              {prisons.map((prison) => (
                <MenuItem key={prison.id} value={prison.id}>
                  {prison.nameSi
                    ? `${prison.nameEn} (${prison.nameSi})`
                    : prison.nameEn}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={newProduct.status}
              label="Status"
              onChange={handleBasicInfoChange}
            >
              <MenuItem value="In Stock">In Stock</MenuItem>
              <MenuItem value="Out of Stock">Out of Stock</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            gap: "1rem",
            marginBottom: "16px",
          }}
        >
          <FormControl fullWidth margin="normal">
            <InputLabel>Active</InputLabel>
            <Select
              name="active"
              value={newProduct.active}
              label="Active"
              onChange={handleBasicInfoChange}
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Image Upload Section */}
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: "bold",
              backgroundColor: "lightgray",
              padding: "0.5rem",
            }}
          >
            Product Images
          </Typography>

          {/* Main Image Upload */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
              Main Image (Required) <span style={{ color: "red" }}>*</span>
            </Typography>

            <input
              accept="image/*"
              type="file"
              onChange={handleMainImageChange}
              style={{ display: "none" }}
              id="main-image-upload"
              ref={mainImageInputRef}
            />

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <label htmlFor="main-image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<AddPhotoAlternateIcon />}
                >
                  Upload Main Image
                </Button>
              </label>
            </Box>

            {/* Main image preview */}
            {previewImages.mainImage && (
              <Card sx={{ maxWidth: 345, mb: 2 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={previewImages.mainImage}
                  alt="Main product image"
                  sx={{ objectFit: "contain" }}
                />
                <CardActions>
                  <IconButton
                    aria-label="remove image"
                    onClick={removeMainImage}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    <StarIcon fontSize="small" color="primary" /> Main Image
                  </Typography>
                </CardActions>
              </Card>
            )}

            {!previewImages.mainImage && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Please upload a main image for the product.
              </Alert>
            )}
          </Box>

          {/* Additional Images Upload */}
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                mb: 1,
                fontWeight: "bold",
              }}
            >
              Additional Images (Optional)
            </Typography>

            <input
              accept="image/*"
              type="file"
              multiple
              onChange={handleAdditionalImagesChange}
              style={{ display: "none" }}
              id="additional-images-upload"
              ref={additionalImagesInputRef}
            />

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <label htmlFor="additional-images-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<AddPhotoAlternateIcon />}
                >
                  Add More Images
                </Button>
              </label>
            </Box>

            {/* Additional images preview */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {previewImages.additionalImages.map((preview, index) => (
                <Card key={index} sx={{ width: 200 }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={preview}
                    alt={`Additional product image ${index + 1}`}
                    sx={{ objectFit: "contain" }}
                  />
                  <CardActions>
                    <IconButton
                      aria-label="set as main"
                      onClick={() => setAsMainImage(index)}
                      color="primary"
                      title="Set as main image"
                    >
                      <StarBorderIcon />
                    </IconButton>
                    <IconButton
                      aria-label="remove image"
                      onClick={() => removeAdditionalImage(index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              ))}
            </Box>
          </Box>
        </Box>

        <Typography
          variant="h6"
          sx={{
            mb: 1,
            fontWeight: "bold",
            backgroundColor: "lightgray",
            padding: "0.5rem",
          }}
        >
          Product Description
        </Typography>
        <TextareaAutosize
          fullWidth
          label="Description"
          name="description"
          value={newProduct.description}
          placeholder="Description"
          onChange={handleBasicInfoChange}
          style={{
            width: "100%",
            minHeight: "10%",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginTop: "16px",
            resize: "vertical",
          }}
        />

        <Typography
          variant="h6"
          sx={{
            mt: 3,
            mb: 3,
            fontWeight: "bold",
            backgroundColor: "lightgray",
            padding: "0.5rem",
          }}
        >
          Product Attributes
        </Typography>
        {categoryAttributes.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            No attributes defined for this category. Please select a different
            category or add attributes in the Category Management section.
          </Alert>
        ) : (
          categoryAttributes.map((attribute) => (
            <div key={attribute.id} style={{ marginBottom: "16px" }}>
              <Typography variant="subtitle1">{attribute.name}</Typography>
              {renderAttributeInput(attribute)}
            </div>
          ))
        )}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={addProduct}
            size="large"
            disabled={loading}
            startIcon={
              loading && <CircularProgress size={20} color="inherit" />
            }
          >
            {loading ? "Creating Product..." : "Add Product"}
          </Button>
        </Box>
      </div>
    </Paper>
  );
}
