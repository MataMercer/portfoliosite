/* eslint-disable react/no-array-index-key */
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from 'reactstrap';

type UploadInputProps = {
  pictures: File[];
  setPictures: (pictures: File[]) => void;
};

const UploadInput = ({ pictures, setPictures }: UploadInputProps) => {
  const [pictureSrcs, setPictureSrcs] = useState<string[]>([]);

  const processFile = (file: File) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      const url = reader.readAsDataURL(file);
      reader.onabort = () => {
        reject(new Error('file reading was aborted'));
      };
      reader.onerror = () => {
        reject(new Error('file reading has failed'));
      };
      reader.onload = () => {
        resolve(reader.result);
        console.log('file reading has completed');
      };
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const processedFiles = await Promise.all(
        acceptedFiles.map((acceptedFile: File) => processFile(acceptedFile))
      );
      setPictureSrcs([...pictureSrcs, ...(processedFiles as string[])]);
      setPictures([...pictures, ...acceptedFiles]);
    },
    [setPictures, pictures, setPictureSrcs, pictureSrcs]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleDeleteClick = (e: React.MouseEvent<HTMLInputElement>) => {
    setPictures(
      pictures.filter(
        (picture: File, index: number) =>
          index.toString() !== (e.target as HTMLInputElement).value.toString()
      )
    );
    setPictureSrcs(
      pictureSrcs.filter(
        (pictureSrc, index) =>
          index.toString() !== (e.target as HTMLInputElement).value.toString()
      )
    );
  };

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />

        <p>[Drag and drop some files here, or click to select files]</p>
      </div>
      <ul>
        {pictureSrcs.map((pictureSrc, index) => (
          <li key={index}>
            <img width="50px" src={pictureSrc} alt="uploaded" />
            <Button
              color="danger"
              size="sm"
              onClick={handleDeleteClick}
              value={index}
            >
              X
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default UploadInput;
