// import { Dropzone, ExtFile, FileMosaic } from "@files-ui/react";
// import { FC, useEffect, useState } from "react";

// interface DropzoneInputProps {
//   previewIcon: string;
//   setSelectedFile: (file: File | null) => void;
// }
// const DropzoneInput: FC<DropzoneInputProps> = ({
//   previewIcon,
//   setSelectedFile,
// }) => {
//   const [files, setFiles] = useState<ExtFile[]>([]);
//   const [dropzoneKey, setDropzoneKey] = useState(0);

//   const updateFiles = (incomingFiles: ExtFile[] | undefined) => {
//     setDropzoneKey((prevKey) => prevKey + 1);
//     if (incomingFiles && incomingFiles.length > 0 && incomingFiles[0].file) {
//       setSelectedFile(incomingFiles[0].file);
//       setFiles(incomingFiles);
//     }
//   };

//   const removeFile = (id: string | number | undefined) => {
//     setFiles(files.filter((x) => x.id !== id));
//     setSelectedFile(null);
//   };

//   useEffect(() => {
//     const previewFile: ExtFile = {
//       id: "preview",
//       name: "Preview",
//       imageUrl: previewIcon,
//     };

//     setFiles([previewFile]);
//   }, []);

//   return (
//     <Dropzone
//       key={dropzoneKey}
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "100%",
//         width: "100%",
//         border: "none",
//       }}
//       onChange={updateFiles}
//       value={files}
//       footer={false}
//       header={false}
//       maxFiles={1}
//     >
//       {files.map((file) => {
//         return (
//           <FileMosaic
//             style={{
//               height: "100%",
//               width: "90%",
//             }}
//             key={file.id}
//             {...file}
//             backgroundBlurImage={false}
//             preview={true}
//           />
//         );
//       })}
//     </Dropzone>
//   );
// };

// export default DropzoneInput;

import { Dropzone, ExtFile, FileMosaic } from "@files-ui/react";
import { FC, useEffect, useState } from "react";
interface DropzoneInputProps {
  previewIcon: string;
  setSelectedFile: (file: File) => void;
}
const DropzoneInput: FC<DropzoneInputProps> = ({
  previewIcon,
  setSelectedFile,
}) => {
  const [files, setFiles] = useState<ExtFile[]>([]);
  const [dropzoneKey, setDropzoneKey] = useState(0);

  useEffect(() => {
    if (files.length === 0) {
      const previewFile: ExtFile = {
        id: "preview",
        name: "Preview",
        imageUrl: previewIcon,
      };

      setFiles([previewFile]);
    }
  }, [files, previewIcon]);

  const updateFiles = (incomingFiles: ExtFile[]) => {
    if (incomingFiles && incomingFiles.length > 0) {
      const image =
        incomingFiles.length === 2 ? incomingFiles[1] : incomingFiles[0];
      if (image.file) {
        setFiles([image]);
        setSelectedFile(image.file);
        setDropzoneKey((prevKey) => prevKey + 1);
      }
    }
  };

  const removeFile = (id: string | number | undefined) => {
    setFiles(files.filter((x: ExtFile) => x.id !== id));
  };

  return (
    <Dropzone
      key={dropzoneKey}
      onChange={updateFiles}
      value={files}
      accept="image/*"
      maxFiles={1}
      footer={false}
      header={false}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        border: "none",
      }}
    >
      {files.map((file: ExtFile) => (
        <FileMosaic
          style={{
            display: "flex",
            justifyContent: "center",
            height: "100%",
            width: "90%",
          }}
          key={file.id}
          {...file}
          backgroundBlurImage={false}
          preview={true}
          onDelete={removeFile}
        />
      ))}
    </Dropzone>
  );
};

export default DropzoneInput;
