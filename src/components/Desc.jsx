import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './custom-editor-styles.css';
import { useState } from 'react';
export default function Desc() {
    const [description, setDescription] = useState('');

    const handleEditorChange = (event, editor) => {
      const data = editor.getData();
      setDescription(data);
    };
  return (
    <div >
      <label>Short Description:</label>
      <CKEditor
      className="ck-editor__editable_inline"
        editor={ClassicEditor}
        data={description}
        config={{
            extraPlugins: [function (editor) {
              editor.on('ready', () => {
                editor.editing.view.change(writer => {
                  writer.setStyle('padding', '20px', editor.editing.view.document.getRoot());
                });
              });
            }],
          }}
        onChange={handleEditorChange}
      />
    </div>
  )
}
