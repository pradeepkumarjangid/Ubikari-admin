import React, { useEffect, useState } from "react";
import { Upload, Modal, message } from "antd";
import { PlusOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";

// Convert file to base64
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

// Validate file
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const ImgUpload = ({ name, setFieldValue, value ,error}) => {
  const [fileList, setFileList] = useState([])
   useEffect(() => {
    if (value) {
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: typeof value === "string" ? value : URL.createObjectURL(value),
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [value]);

  
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handleChange = async ({ file, fileList: newFileList }) => {
    setFileList(newFileList);
    
    if (file.originFileObj) {
      setFieldValue(name, file.originFileObj);
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const handleRemove = (file) => {
    const newList = fileList.filter((f) => f.uid !== file.uid);
    setFileList(newList);
    setFieldValue(name, null);
  };

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemove}
        beforeUpload={beforeUpload}
      >
        {fileList.length >= 1 ? null : <PlusOutlined />}
      </Upload>

      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
       {error && (
        <div className="text-red-500 text-xs mt-1">{error}</div>
      )}
    </>
  );
};

export default ImgUpload;
