import React, { useState, useCallback } from "react";
import ProgressBar from "../ProgressBar";
import { useDropzone } from "react-dropzone";
import { Button, Form, FormGroup, Label, Input, Row, Col } from "reactstrap";

const UploadInput = () => {
  const [pictures, setPictures] = useState([]);
  const [pictureSrcs, setPictureSrcs] = useState([]);
  const onDrop = useCallback(
    async (acceptedFiles) => {
      
      const processedFiles = await batchProcessFiles(acceptedFiles);
      console.log("Completed");
      setPictureSrcs([...pictureSrcs, ...processedFiles]);
      setPictures([...pictures, ...acceptedFiles]);
    },
    [setPictures, pictures, setPictureSrcs, pictureSrcs]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });


  const processFile = (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      const url = reader.readAsDataURL(file);
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => {
        reject("");
        console.log("file reading has failed")};
      reader.onload = () => {
        resolve(reader.result);
        console.log("file reading has completed")};
    })
  }

  const batchProcessFiles = (acceptedFiles) => {
    return new Promise(async (resolve, reject) => {
      let processedFiles = [];

      for(let i = 0; i<acceptedFiles.length; i++){
        const processedFile = await processFile(acceptedFiles[i]);
        processedFiles = [...processedFiles, processedFile];
      }


      resolve(processedFiles);
    })
  }

  const handleDeleteClick = (e) => {
    setPictures(pictures.filter((picture, index) => index != e.target.id));
    setPictureSrcs(
      pictureSrcs.filter((pictureSrc, index) => {
        return index != e.target.id;
      })
    );
  };

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />

        <p>[Drag 'n' drop some files here, or click to select files]</p>
      </div>
      <ul>
        {pictureSrcs.map((pictureSrc, index) => (
          <li key={index}>
            <img width="50px" src={pictureSrc} />
            <Button color="danger" size="sm" onClick={handleDeleteClick} id={index}>
              X
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default UploadInput;
