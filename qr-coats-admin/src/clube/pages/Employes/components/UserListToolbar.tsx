import { DeleteOutline } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import {
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { ChangeEvent } from "react";

interface PropsUserListToolbar {
  numSelected: number;
  filterName: string;
  onFilterName: (event: ChangeEvent<HTMLInputElement>) => void;
}

const UserListToolbar = ({
  numSelected,
  filterName,
  onFilterName,
}: PropsUserListToolbar) => {
  const handleDelete = () => {
    console.log(numSelected);
  };

  return (
    <Toolbar
      sx={{
        ...(numSelected > 0 && {
          color: "primary.main",
          display: "flex",
          justifyContent: "space-between",
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <TextField
          value={filterName}
          onChange={onFilterName}
          placeholder="Search user..."
          InputProps={{
            endAdornment: (
              <InputAdornment variant="standard" position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      )}

      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton onClick={handleDelete}>
            <DeleteOutline />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

export default UserListToolbar;
