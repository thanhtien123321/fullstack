import React, { useState } from 'react';
import { Table } from 'antd';

const TableComponent = (props) => {
  const {
    selectionType = 'checkbox',
    data = [],
    isLoading = false,
    columns = [],
    handleDeleteManyProduct,
    handleDeleteManyUser,
  } = props;

  const [rowSelectedKeys, setRowSelectedKeys] = useState([]);

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setRowSelectedKeys(selectedRowKeys);
    },
  };

  const handleDeleteAll = () => {
    if (handleDeleteManyProduct && typeof handleDeleteManyProduct === 'function') {
      handleDeleteManyProduct(rowSelectedKeys);
    } else if (handleDeleteManyUser && typeof handleDeleteManyUser === 'function') {
      handleDeleteManyUser(rowSelectedKeys);
    } else {
      console.warn("Không có hàm xóa nào được truyền vào TableComponent.");
    }
  };

  return (
    <div>
      {rowSelectedKeys.length > 0 && (
        <div
          style={{
            background: '#1d1ddd',
            color: '#fff',
            fontWeight: 'bold',
            padding: '10px',
            cursor: 'pointer',
          }}
          onClick={handleDeleteAll}
        >
          Xóa tất cả
        </div>
      )}

      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        loading={isLoading}
        {...props}
      />
    </div>
  );
};

export default TableComponent;
