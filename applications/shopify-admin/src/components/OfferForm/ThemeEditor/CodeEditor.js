import React from 'react';
import PropTypes from 'prop-types';
import 'codemirror/lib/codemirror.css';

const { Controlled: CodeMirror } =
  (typeof window !== 'undefined' && require('react-codemirror2')) || {};

if (typeof window !== 'undefined') {
  require('codemirror/mode/htmlmixed/htmlmixed');
}

const options = {
  mode: 'htmlmixed',
  theme: 'default',
  lineNumbers: true
};

const CodeEditor = ({ markup, onChange }) => {
  const handleChange = (editor, data, value) => {
    onChange(value);
  };

  return (
    <CodeMirror value={markup} options={options} onChange={handleChange} />
  );
};

CodeEditor.propTypes = {
  markup: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

CodeEditor.defaultProps = {
  onChange: () => {}
};

export default CodeEditor;
