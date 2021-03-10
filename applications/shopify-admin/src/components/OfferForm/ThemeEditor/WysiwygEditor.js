import React from 'react';
import PropTypes from 'prop-types';
import { Editor } from '@tinymce/tinymce-react';

if (typeof window !== 'undefined') {
  require('tinymce/tinymce');
  require('tinymce/icons/default');
  require('tinymce/themes/silver');
  require('tinymce/plugins/link');
  require('tinymce/plugins/lists');
  require('tinymce/plugins/fullscreen');
  require('tinymce/plugins/code');
  require('tinymce-variable');
}

const WysiwygEditor = ({ template, onChange }) => {
  const handleChange = (value) => {
    onChange(value);
  };

  return (
    <Editor
      init={{
        menubar: false,
        statusbar: false,
        height: 500,
        content_css: '/tinymce/custom.css',
        skin_url: '/tinymce/skins/ui/oxide',
        plugins: 'link lists code fullscreen variable',
        toolbar: [
          'undo redo | font formatting color alignment lists | link | fullscreen code | variables'
        ],
        toolbar_groups: {
          font: {
            icon: 'paragraph',
            tooltip: 'Font',
            items: 'fontselect fontsizeselect styleselect'
          },
          formatting: {
            icon: 'bold',
            tooltip: 'Formatting',
            items: 'bold italic underline strikethrough'
          },
          color: {
            icon: 'text-color',
            tooltip: 'Color',
            items: 'backcolor forecolor'
          },
          alignment: {
            icon: 'align-left',
            tooltip: 'Alignment',
            items: 'alignleft aligncenter alignright | alignjustify'
          },
          lists: {
            icon: 'ordered-list',
            tooltip: 'Lists',
            items: 'numlist bullist outdent indent'
          }
        },
        valid_children: '+body[style]',
        variable_mapper: {
          product_url: 'Product URL',
          product_title: 'Product Title',
          price: 'Price',
          sale_price: 'Sale Price'
        },
        setup(editor) {
          editor.ui.registry.addButton('variables', {
            text: 'Variables',
            onAction() {
              editor.plugins.variable.addVariable('product_title');
            }
          });

          editor.on('variableClick', function (event) {
            console.log('click', event);
          });
        }
      }}
      value={template}
      onEditorChange={handleChange}
    />
  );
};

WysiwygEditor.propTypes = {
  template: PropTypes.string,
  onChange: PropTypes.func
};

WysiwygEditor.defaultProps = {
  template: '',
  onChange: () => {}
};

export default WysiwygEditor;
