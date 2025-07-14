import React from 'react';
import { Drawer } from 'antd';

const DrawerComponent = ({
  title = 'Drawer',
  placement = 'right',
  children,
  isOpen = false,
  onClose,
  ...rests
}) => {
  return (
    <Drawer
    destroyOnClose
      title={title}
      placement={placement}
      onClose={onClose}
      open={isOpen}
      {...rests}
    >
      {children}
    </Drawer>
  );
};

export default DrawerComponent;
