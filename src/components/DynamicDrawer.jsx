// components/DynamicDrawer.jsx
import React from 'react';
import { Drawer } from 'antd';

const DynamicDrawer = ({
  isOpen,
  onClose,
  title,
  width = 500,
  children,
}) => {
  return (
    <Drawer
      title={title}
      placement="right"
      onClose={onClose}
      open={isOpen}
      width={width}
      closable
    >
      {children}
    </Drawer>
  );
};



export default DynamicDrawer;
