import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";

export default function ProductCard() {
  return (
    <Card sx={{ maxWidth: 250, minWidth: 250 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image="/static/images/cards/contemplative-reptile.jpg"
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom fontSize="17px" component="center">
            Lizard
          </Typography>
          <Typography
            variant="body2"
            component="center"
            sx={{ color: "text.secondary" }}
          >
            Rs 1500.00
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
