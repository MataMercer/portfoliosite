import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

type MarkdownEditorInputProps = {
  label: string;
  id: string;
  handleTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  text: string;
};

export default function MarkdownEditorInput(props: MarkdownEditorInputProps) {
  const { label, id, handleTextChange, text } = props;

  return (
    <Row>
      <Col>
        <Form.Group>
          <Form.Label for={id}>{label}</Form.Label>
          <Form.Control
            onChange={handleTextChange}
            type="textarea"
            as="textarea"
            rows={15}
            name={text}
            id={id}
            value={text}
          />
        </Form.Group>
      </Col>
      <Col>
        <Form.Label>Markdown Preview</Form.Label>
        {text ? <ReactMarkdown>{text}</ReactMarkdown> : null}
      </Col>
    </Row>
  );
}
