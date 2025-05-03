import {
  Box,
  Typography,
  Grid,
  useMediaQuery,
  useTheme,
  Divider,
  Container,
} from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  return (
    <Box
      sx={{
        backgroundColor: "#24364d",
        padding: { xs: "1.5rem", sm: "2rem", md: "3rem" },
        mt: "1rem",
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={isMobile ? 3 : 4}>
          {/* Logo and Brand */}
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            sx={{ textAlign: { xs: "center", md: "left" } }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", md: "flex-start" },
              }}
            >
              <img
                src="/main-only-logo.png"
                alt="main logo"
                style={{ width: isMobile ? 100 : 130 }}
              />
              <Typography
                fontFamily={"monospace"}
                fontWeight={"bold"}
                fontSize={isMobile ? "18px" : "20px"}
                color="white"
                marginTop={"10px"}
              >
                CELLMADE
              </Typography>
            </Box>
          </Grid>

          {/* Site Map */}
          <Grid item xs={6} sm={6} md={2}>
            <Typography
              sx={{
                color: "white",
                fontSize: isMobile ? "18px" : "20px",
                fontWeight: "bold",
                mb: 2,
                textAlign: { xs: "left", md: "left" },
              }}
            >
              Site Map
            </Typography>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}
            >
              <NavLink
                to={"/"}
                style={{
                  textDecoration: "underline",
                  color: "white",
                  fontSize: isMobile ? "16px" : "18px",
                }}
              >
                Home
              </NavLink>
              <NavLink
                to={"/"}
                style={{
                  textDecoration: "underline",
                  color: "white",
                  fontSize: isMobile ? "16px" : "18px",
                }}
              >
                About Us
              </NavLink>
              <NavLink
                to={"/"}
                style={{
                  textDecoration: "underline",
                  color: "white",
                  fontSize: isMobile ? "16px" : "18px",
                }}
              >
                Contact Us
              </NavLink>
            </Box>
          </Grid>

          {/* Prisons */}
          <Grid item xs={6} sm={6} md={3}>
            <Typography
              sx={{
                color: "white",
                fontSize: isMobile ? "18px" : "20px",
                fontWeight: "bold",
                mb: 2,
                textAlign: { xs: "left", md: "left" },
              }}
            >
              Prisons
            </Typography>

            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.8rem",
                  }}
                >
                  <NavLink
                    to={"/"}
                    style={{
                      textDecoration: "underline",
                      color: "white",
                      fontSize: isMobile ? "14px" : "18px",
                    }}
                  >
                    වැලිකඩ
                  </NavLink>
                  <NavLink
                    to={"/"}
                    style={{
                      textDecoration: "underline",
                      color: "white",
                      fontSize: isMobile ? "14px" : "18px",
                    }}
                  >
                    බෝගම්බර
                  </NavLink>
                  <NavLink
                    to={"/"}
                    style={{
                      textDecoration: "underline",
                      color: "white",
                      fontSize: isMobile ? "14px" : "18px",
                    }}
                  >
                    මහර
                  </NavLink>
                  <NavLink
                    to={"/"}
                    style={{
                      textDecoration: "underline",
                      color: "white",
                      fontSize: isMobile ? "14px" : "18px",
                    }}
                  >
                    අනුරාධපුර
                  </NavLink>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.8rem",
                  }}
                >
                  <NavLink
                    to={"/"}
                    style={{
                      textDecoration: "underline",
                      color: "white",
                      fontSize: isMobile ? "14px" : "18px",
                    }}
                  >
                    පල්ලේකැලේ
                  </NavLink>
                  <NavLink
                    to={"/"}
                    style={{
                      textDecoration: "underline",
                      color: "white",
                      fontSize: isMobile ? "14px" : "18px",
                    }}
                  >
                    පල්ලන්සේන
                  </NavLink>
                  <NavLink
                    to={"/"}
                    style={{
                      textDecoration: "underline",
                      color: "white",
                      fontSize: isMobile ? "14px" : "18px",
                    }}
                  >
                    තල්දෙන
                  </NavLink>
                  <NavLink
                    to={"/"}
                    style={{
                      textDecoration: "underline",
                      color: "white",
                      fontSize: isMobile ? "14px" : "18px",
                    }}
                  >
                    අගුණ කොළ
                  </NavLink>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} sm={6} md={2}>
            <Typography
              sx={{
                color: "white",
                fontSize: isMobile ? "18px" : "20px",
                fontWeight: "bold",
                mb: 2,
                textAlign: { xs: "left", md: "left" },
              }}
            >
              Quick Links
            </Typography>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}
            >
              <NavLink
                to={"/"}
                style={{
                  textDecoration: "underline",
                  color: "white",
                  fontSize: isMobile ? "14px" : "18px",
                }}
              >
                කම්හල් (Workshops/Factories)
              </NavLink>
              <NavLink
                to={"/"}
                style={{
                  textDecoration: "underline",
                  color: "white",
                  fontSize: isMobile ? "14px" : "18px",
                }}
              >
                වඩු (Carpentry)
              </NavLink>
              <NavLink
                to={"/"}
                style={{
                  textDecoration: "underline",
                  color: "white",
                  fontSize: isMobile ? "14px" : "18px",
                }}
              >
                පේෂ කර්ම (Textiles)
              </NavLink>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              fontSize={isMobile ? "18px" : "20px"}
              fontWeight={"bold"}
              mb={"0.7rem"}
              color="white"
              sx={{ textAlign: { xs: "center", sm: "left" } }}
            >
              Contact
            </Typography>
            <Box
              sx={{
                color: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", sm: "flex-start" },
                fontSize: isMobile ? "14px" : "16px",
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              <Typography fontSize="inherit">
                Prison Headquarters, No.150,Baseline Road,Colombo 09,Sri Lanka
              </Typography>
              <Typography fontSize="inherit" mt={1}>
                Tel: +94 114 677177
              </Typography>
              <Typography fontSize="inherit">Fax: +94 114 677180</Typography>
              <Typography fontSize="inherit">
                E-mail: prisons@sltnet.lk
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, backgroundColor: "rgba(255,255,255,0.2)" }} />

        {/* Logo at bottom */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <img
            src="/prisons-department-logo.png"
            alt="logo"
            style={{
              width: isMobile ? "90%" : isTablet ? "70%" : "500px",
              maxWidth: "500px",
            }}
          />
        </Box>
      </Container>
    </Box>
  );
}
