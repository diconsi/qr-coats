import { FC, ChangeEvent } from "react";
import { CardMedia, Grid, Input, Card } from "@mui/material";

interface InputImageProps {
  previewImage: string | null;
  setPreviewImage: (imageUrl: string | null) => void;
  defaultIcon: string;
  accept: string;
  cardColor: string;
  setSelectedFile: (file: File | null) => void; // Ajustar el tipo aquí
}

const InputImage: FC<InputImageProps> = ({
  previewImage,
  setPreviewImage,
  defaultIcon,
  accept,
  cardColor,
  setSelectedFile,
}) => {
  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    } else {
      setPreviewImage(null);
    }
  };

  return (
    <Grid
      container
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ width: "100%", height: "100%" }}
    >
      <Grid
        display="flex"
        justifyContent="center"
        item
        sx={{ p: 2, height: "80%", width: "100%" }}
      >
        <Card
          variant="outlined"
          sx={{
            backgroundColor: cardColor,
            width: "40%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "none",
          }}
        >
          <CardMedia
            component="img"
            image={previewImage ? previewImage : defaultIcon}
            alt="Club Icon"
            sx={{
              height: "100%",
              width: "100%",
              objectFit: "contain",
            }}
          />
        </Card>
      </Grid>
      <Grid container sx={{ height: "20%", width: "100%" }}>
        <Grid
          display="flex"
          justifyContent="center"
          alignItems="center"
          item
          md={12}
        >
          <Input
            type="file"
            inputProps={{ accept: accept }}
            onChange={handleFileInputChange}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default InputImage;
