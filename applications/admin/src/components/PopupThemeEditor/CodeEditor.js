import React from 'react';
import PropTypes from 'prop-types';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';

const { Controlled: CodeMirror } =
  (typeof window !== 'undefined' && require('react-codemirror2')) || {};

if (typeof window !== 'undefined') {
  require('codemirror/mode/htmlmixed/htmlmixed');
}

const CodeEditor = ({ value, onChange, ...props }) => {
  const handleChange = (editor, data, newValue) => {
    onChange(newValue);
  };

  if (!CodeMirror) {
    return null;
  }

  return (
    <CodeMirror
      value={value}
      options={{
        mode: 'htmlmixed',
        theme: 'monokai',
        lineNumbers: true
      }}
      onBeforeChange={handleChange}
      {...props}
    />
  );
};

CodeEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
};

CodeEditor.defaultProps = {
  value: '',
  onChange: () => {}
};

export default CodeEditor;
