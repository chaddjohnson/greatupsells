import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';

const { Controlled: CodeMirror } =
  (typeof window !== 'undefined' && require('react-codemirror2')) || {};

if (typeof window !== 'undefined') {
  require('codemirror/mode/htmlmixed/htmlmixed');
  require('codemirror/mode/css/css');
  require('codemirror/mode/javascript/javascript');
  require('codemirror/addon/search/search');
  require('codemirror/addon/dialog/dialog');
  require('codemirror/addon/dialog/dialog.css');
  require('codemirror/addon/search/jump-to-line');
  require('codemirror/addon/search/match-highlighter');
  require('codemirror/addon/search/searchcursor');
  require('codemirror/addon/edit/matchbrackets');
  require('codemirror/addon/edit/closebrackets');
  require('codemirror/addon/edit/matchtags');
  require('codemirror/addon/comment/comment');
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'block',

    [theme.breakpoints.up('lg')]: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }
  },
  tabPanel: {
    paddingTop: theme.spacing(1),
    height: '100%'
  }
}));

const tabIndexes = {
  html: 0,
  css: 1,
  javascript: 2,
  scripts: 3
};

const TabPanel = ({ index, value, children, ...props }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`code-tabpanel-${index}`}
    aria-labelledby={`code-tab-${index}`}
    {...props}
  >
    {value === index && children}
  </div>
);

TabPanel.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired
};

const CodeEditor = ({ template, onChange, ...props }) => {
  const classes = useStyles();

  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, index) => {
    setTabIndex(index);
  };

  const handleHtmlChange = (editor, data, newValue) => {
    onChange({ ...template, html: newValue });
  };

  const handleCssChange = (editor, data, newValue) => {
    onChange({ ...template, css: newValue });
  };

  const handleJavaScriptChange = (editor, data, newValue) => {
    onChange({ ...template, javascript: newValue });
  };

  if (!CodeMirror) {
    return null;
  }

  return (
    <div className={classes.root}>
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab id="code-tab-1" label="HTML" />
        <Tab id="code-tab-2" label="CSS" />
        <Tab id="code-tab-3" label="JavaScript" />
        <Tab id="code-tab-4" label="Scripts" />
      </Tabs>
      <TabPanel
        className={classes.tabPanel}
        value={tabIndex}
        index={tabIndexes.html}
      >
        <CodeMirror
          value={template.html}
          options={{
            mode: 'htmlmixed',
            theme: 'monokai',
            lineNumbers: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            matchTags: true,
            extraKeys: {
              'Cmd-/': (editor) => editor.toggleComment({ indent: true }),
              'Ctrl-/': (editor) => editor.toggleComment({ indent: true })
            }
          }}
          onBeforeChange={handleHtmlChange}
          {...props}
        />
      </TabPanel>
      <TabPanel
        className={classes.tabPanel}
        value={tabIndex}
        index={tabIndexes.css}
      >
        <CodeMirror
          value={template.css}
          options={{
            mode: 'css',
            theme: 'monokai',
            lineNumbers: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            matchTags: true,
            extraKeys: {
              'Cmd-/': (editor) => editor.toggleComment({ indent: true }),
              'Ctrl-/': (editor) => editor.toggleComment({ indent: true })
            }
          }}
          onBeforeChange={handleCssChange}
          {...props}
        />
      </TabPanel>
      <TabPanel
        className={classes.tabPanel}
        value={tabIndex}
        index={tabIndexes.javascript}
      >
        <CodeMirror
          value={template.javascript}
          options={{
            mode: 'javascript',
            theme: 'monokai',
            lineNumbers: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            matchTags: true,
            extraKeys: {
              'Cmd-/': (editor) => editor.toggleComment({ indent: true }),
              'Ctrl-/': (editor) => editor.toggleComment({ indent: true })
            }
          }}
          onBeforeChange={handleJavaScriptChange}
          {...props}
        />
      </TabPanel>
      <TabPanel
        className={classes.tabPanel}
        value={tabIndex}
        index={tabIndexes.scripts}
      >
        TODO
      </TabPanel>
    </div>
  );
};

CodeEditor.propTypes = {
  template: PropTypes.shape({
    html: PropTypes.string,
    css: PropTypes.string,
    javascript: PropTypes.string
  }),
  onChange: PropTypes.func
};

CodeEditor.defaultProps = {
  template: {
    html: '',
    css: '',
    javascript: ''
  },
  onChange: () => {}
};

export default CodeEditor;
