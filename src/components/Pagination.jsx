import React from 'react';
import { Pagination } from 'antd';

const CustomPagination = ({
  current,
  total,
  pageSize,
  onChange,
  showSizeChanger = false,
  pageSizeOptions = ['10', '20', '50', '100'],
  showTotal = (total, range) => `${range[0]}-${range[1]} of ${total} items`,
}) => {
  return (
    <Pagination
      current={current}
      total={total}
      pageSize={pageSize}
      onChange={onChange}
      showSizeChanger={showSizeChanger}
      pageSizeOptions={pageSizeOptions}
      showTotal={showTotal}
      align='end'
    />
  );
};



export default CustomPagination;
