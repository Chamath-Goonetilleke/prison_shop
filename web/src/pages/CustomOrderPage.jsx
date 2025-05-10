import React from "react";
import { Container, Typography, Box, Breadcrumbs, Link } from "@mui/material";
import CustomOrderForm from "../components/customOrder/CustomOrderForm";
import { Link as RouterLink } from "react-router-dom";

const CustomOrderPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/" underline="hover" color="inherit">
          Home
        </Link>
        <Typography color="text.primary">Custom Orders</Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Custom Orders
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Need something special that you don't see in our regular product
          catalog? We offer custom-made products tailored to your specific
          requirements.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          How It Works
        </Typography>
        <Typography variant="body1" paragraph>
          1. Fill out the form below with your requirements
        </Typography>
        <Typography variant="body1" paragraph>
          2. Our team will review your request and contact you to discuss
          details
        </Typography>
        <Typography variant="body1" paragraph>
          3. We'll provide a quote and timeline for your custom order
        </Typography>
        <Typography variant="body1" paragraph>
          4. Once approved, our skilled craftsmen will create your custom item
        </Typography>
        <Typography variant="body1" paragraph>
          5. We'll notify you when your item is ready for delivery or pickup
        </Typography>
      </Box>

      <CustomOrderForm />
    </Container>
  );
};

export default CustomOrderPage;
