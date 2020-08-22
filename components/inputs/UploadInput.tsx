/* eslint-disable react/no-array-index-key */
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from 'reactstrap';

type UploadInputProps = {
  pictures: File[];
  pictureUrls: string[];
  setPictures: (pictures: File[]) => void;
  // existing picture urls
  setPictureUrls: (pictureUrls: string[]) => void;
};

const UploadInput = ({
  pictures,
  setPictures,
  pictureUrls,
  setPictureUrls,
}: UploadInputProps) => {
  const [pictureSrcs, setPictureSrcs] = useState<string[]>([]);

  useEffect(() => {
    setPictureSrcs(pictureUrls);
  }, [setPictureSrcs, pictureUrls]);

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
    const indexToDelete = (e.target as HTMLInputElement).value.toString();
    // if the picture is an existing image, delete from url list. If not, delete from the file list.
    if (parseInt(indexToDelete, 10) >= pictureUrls.length) {
      setPictures(
        pictures.filter(
          (picture: File, index: number) => index.toString() !== indexToDelete
        )
      );
    } else {
      setPictureUrls(
        pictureUrls.filter(
          (pictureUrl: string, index: number) =>
            index.toString() !== indexToDelete
        )
      );
    }

    setPictureSrcs(
      pictureSrcs.filter(
        (pictureSrc, index) => index.toString() !== indexToDelete
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
