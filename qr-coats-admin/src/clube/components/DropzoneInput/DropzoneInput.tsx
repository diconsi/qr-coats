import { Dropzone, FileMosaic } from "@files-ui/react";
import { Grid } from "@mui/material";
import { useState } from "react";
const DropzoneInput = ({ previewIcon, setSelectedFile }) => {
  const [files, setFiles] = useState([]);

  const updateFiles = (incommingFiles) => {
    setSelectedFile(incommingFiles[0].file);
    setFiles(incommingFiles);
  };

  const removeFile = (id) => {
    setFiles(files.filter((x) => x.id !== id));
  };

  const renderPreview = () => {
    return (
      <Grid
        container
        sx={{ background: "primary.main", maxWidth: "100%", maxHeight: "100%" }}
      >
        <img width={200} height={100} src={previewIcon} />
      </Grid>
    );
  };

  return (
    <Dropzone
      style={{
        height: "100%",
        minHeight: "90%",
        width: "80%",
        border: "none",
      }}
      label={renderPreview()}
      onChange={updateFiles}
      value={files}
      footer={false}
      header={false}
      maxFiles={1}
    >
      {files.map((file) => (
        <FileMosaic
          style={{
            height: "100%",
            minHeight: "50% !important",
            width: "40%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
          key={file.id}
          {...file}
          onDelete={removeFile}
          backgroundBlurImage={false}
          preview={previewIcon}
          alwaysActive={false}
        />
      ))}
    </Dropzone>
  );
};

export default DropzoneInput;
