/* eslint-disable react/no-array-index-key */
import { MouseEvent, useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from 'reactstrap';

export type FileInput = {
  data?: File;
  url?: string;
};

type UploadInputProps = {
  id: string;
  fileInputs: FileInput[];
  setFileInputs: (pictures: FileInput[]) => void;
};

const UploadInput = ({ id, fileInputs, setFileInputs }: UploadInputProps) => {
  const [fileInputsState, setFileInputsState] = useState<FileInput[]>([]);

  useEffect(() => {
    setFileInputsState(fileInputs);
  }, [fileInputs]);

  const processFile = (file: File) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.readAsDataURL(file);
      reader.onabort = () => {
        reject(new Error('file reading was aborted'));
      };
      reader.onerror = () => {
        reject(new Error('file reading has failed'));
      };
      reader.onload = () => {
        resolve(reader.result);
      };
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const processedFiles = await Promise.all(
        acceptedFiles.map((acceptedFile: File) => processFile(acceptedFile))
      );

      const newFileInputs = acceptedFiles.map((acceptedFile, index) => ({
        data: acceptedFile,
        url: processedFiles[index] as string,
      }));
      setFileInputs([...fileInputs, ...newFileInputs]);
    },
    [setFileInputs, fileInputs]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
    const indexToDelete = (e.target as HTMLInputElement).value.toString();
    const newState = fileInputsState.filter(
      (inputs, i) => i !== parseInt(indexToDelete, 10)
    );
    setFileInputsState(newState);
    setFileInputs(newState);
  };
  return (
    <>
      <div {...getRootProps()}>
        <input id={id} {...getInputProps()} />

        <p>[Drag and drop some files here, or click to select files]</p>
      </div>
      <ul>
        {fileInputsState
          ? fileInputsState.map((pictureSrc, index) => (
              <li key={pictureSrc.url}>
                <img width="50px" src={pictureSrc.url} alt="uploaded" />
                <Button
                  color="danger"
                  size="sm"
                  onClick={handleDeleteClick}
                  value={index}
                >
                  X
                </Button>
              </li>
            ))
          : null}
      </ul>
    </>
  );
};

export default UploadInput;
