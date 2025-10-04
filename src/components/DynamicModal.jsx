import React from "react";
import { Modal } from "antd";

const DynamicModal = ({
  open,
  title,
  children,
  onOk,
  onCancel,
  okText = "OK",
  cancelText = "Cancel",
  footer = true, // agar custom footer dena ho to false bhi kar sakte ho
}) => {
  return (
    <Modal
      open={open}
      title={title}
      onOk={onOk}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      footer={footer ? undefined : null}
    >
      {children}
    </Modal>
  );
};

export default DynamicModal;
