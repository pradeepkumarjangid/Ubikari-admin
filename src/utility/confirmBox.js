import { Modal } from "antd";
export const showConfirm = ({ title, content, onOk, onCancel }) => {
  Modal.confirm({
    title: title || "Are you sure?",
    content: content || "This action cannot be undone.",
    okText: "Yes",
    cancelText: "No",
    onOk,
    onCancel,
  });
};