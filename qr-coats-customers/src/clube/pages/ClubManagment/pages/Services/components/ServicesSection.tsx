import { CustomButton } from "@/clube/components";
import { useAppSelector } from "@/hooks";
import { updateServices } from "@/store/club/clubSlice";
import IconCoat from "@mui/icons-material/CheckroomOutlined";
import AccesIcon from "@mui/icons-material/LocalActivityOutlined";
import {
  Alert,
  ButtonGroup,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";

import ErrorIcon from "@mui/icons-material/ErrorOutlineOutlined";

import { useDispatch } from "react-redux";

interface IService {
  enable: boolean;
  id: string;
  name: string;
  price: string;
  status: boolean;
  total: number;
}

const ServicesSection = () => {
  const dispatch = useDispatch();
  const { services, promotion, activeClub } = useAppSelector(
    (store) => store.clubState
  );

  const { name, price, status } = promotion;

  const handleServiceChange = (serviceId: string, changeAction: number) => {
    dispatch(updateServices({ id: serviceId, amount: changeAction }));
  };

  return (
    <Grid item xs={12} md={6}>
      <Grid container justifyContent={"center"} alignItems="center" mb={2}>
        <Alert
          variant="filled"
          sx={{
            color: "#2B2E3A",
            display: status ? "" : "none",
            borderRadius: "30px",
            fontSize: "10PX",
            bgcolor: "#D5E7FF",
            alignItems: "center",
          }}
        >
          WE HAVE THE COMBO PROMOTION
          <span style={{ marginLeft: "2px" }}>
            {name} = ${price}
          </span>
        </Alert>
      </Grid>
      {services
        .filter((item: IService) => item.status)
        .map((item: IService) => (
          <Grid key={item.id} container alignItems="center" mb={2}>
            <Grid item xs={8} md={6}>
              <Grid container>
                <Grid
                  item
                  xs={4}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <IconButton
                    size="large"
                    sx={{
                      bgcolor: "#656581",
                      color: "white",
                    }}
                    disableRipple
                  >
                    {item.name.toUpperCase() === "COAT" ? (
                      <IconCoat />
                    ) : (
                      <AccesIcon />
                    )}
                  </IconButton>
                </Grid>
                <Grid item xs={8}>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "end",
                      }}
                    >
                      {item.name.toUpperCase()}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "start",
                        fontSize: "14px",
                      }}
                    >
                      ${parseFloat(item.price).toFixed(2)}
                      <span style={{ marginLeft: "5px", fontSize: "8px" }}>
                        +TAX
                      </span>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              display="flex"
              alignItems="center"
              justifyContent="center"
              xs={4}
              md={6}
            >
              <ButtonGroup
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: "#656581",
                  borderRadius: "30px",
                }}
              >
                <CustomButton
                  label="-"
                  onClick={() => handleServiceChange(item.id, -1)}
                  style={{ border: "none", borderRadius: "30px" }}
                />
                <Typography>{item.total}</Typography>
                <CustomButton
                  label={"+"}
                  onClick={() => handleServiceChange(item.id, 1)}
                  style={{ border: "none", borderRadius: "30px" }}
                />
              </ButtonGroup>
            </Grid>
          </Grid>
        ))}
      <Grid container justifyContent={"center"} alignItems="center">
        <Alert
          icon={<ErrorIcon sx={{ color: "black" }} />}
          sx={{
            display: activeClub.customNote !== "" ? "" : "none",
            borderRadius: "30px",
            bgcolor: "#D5E7FF",
            color: "#2B2E3A",
            fontSize: "10PX",
            alignItems: "center",
          }}
        >
          {activeClub.customNote.toUpperCase()}
        </Alert>
      </Grid>
    </Grid>
  );
};

export default ServicesSection;
