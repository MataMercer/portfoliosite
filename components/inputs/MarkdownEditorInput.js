import React, { createContext, useState, useContext, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input, Row, Col } from "reactstrap";
import ReactMarkdown from "react-markdown";
export default function MarkdownEditorInput(props) {
  const { label, name, id, handleTextChange, text } = props;



  return (
    <>
      <Row>
        <Col>
          <FormGroup>
            <Label for={id}>{label}</Label>
            <Input
              onChange={handleTextChange}
              type="textarea"
              name={text}
              id={id}
            />
          </FormGroup>
        </Col>
        <Col>{text ? <ReactMarkdown source={text} /> : null}</Col>
      </Row>
    </>
  );
}
