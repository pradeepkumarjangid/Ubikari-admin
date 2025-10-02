// components/DynamicTable.jsx

import React, { useState, useMemo } from "react";
import { Table, Input, Select, DatePicker, Pagination } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const DynamicTable = ({
  columns = [],
  dataSource = [],
  rowKey = "id",
  expandable = null, // e.g. { expandedRowRender: fn, rowExpandable: fn }
  // filter config
  filters = [], // array of { key, label, type: "text" | "select" | "dateRange", options? }
  // pagination props
  defaultPageSize = 10,
  pageSizeOptions = ["5", "10", "20", "50"],
  onRowClick = null, // optional callback
  actionRender = null, // NEW
}) => {
  const [searchFilters, setSearchFilters] = useState(
    filters.reduce((acc, f) => {
      acc[f.key] = f.type === "dateRange" ? [] : "";
      return acc;
    }, {})
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Filter data
  const filteredData = useMemo(() => {
    return dataSource.filter((row) => {
      return filters.every((f) => {
        const val = searchFilters[f.key];
        if (f.type === "text") {
          if (!val) return true;
          const cellVal = (row[f.key] ?? "").toString().toLowerCase();
          return cellVal.includes(val.toLowerCase());
        } else if (f.type === "select") {
          if (!val) return true;
          return row[f.key] === val;
        } else if (f.type === "dateRange") {
          if (!val || val.length !== 2) return true;
          const [from, to] = val;
          const cellDate = row[f.key] ? dayjs(row[f.key]) : null;
          if (!cellDate) return true;
          return cellDate.isAfter(dayjs(from).startOf("day").subtract(1, "ms")) &&
                 cellDate.isBefore(dayjs(to).endOf("day").add(1, "ms"));
        }
        return true;
      });
    });
  }, [dataSource, searchFilters, filters]);

  // Paginated data
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  // Handlers for filters
  const renderFilterInput = (f) => {
    if (f.type === "text") {
      return (
        <Input
          placeholder={`Search ${f.label}`}
          value={searchFilters[f.key]}
          onChange={(e) =>
            setSearchFilters((prev) => ({
              ...prev,
              [f.key]: e.target.value,
            }))
          }
          style={{ width: 200, marginRight: 8 }}
        />
      );
    } else if (f.type === "select") {
      return (
        <Select
          placeholder={`Select ${f.label}`}
          value={searchFilters[f.key]}
          onChange={(val) =>
            setSearchFilters((prev) => ({ ...prev, [f.key]: val }))
          }
          allowClear
          style={{ width: 200, marginRight: 8 }}
        >
          {(f.options || []).map((opt) => (
            <Select.Option key={opt.value} value={opt.value}>
              {opt.label}
            </Select.Option>
          ))}
        </Select>
      );
    } else if (f.type === "dateRange") {
      return (
        <RangePicker
          value={
            searchFilters[f.key].length === 2
              ? [dayjs(searchFilters[f.key][0]), dayjs(searchFilters[f.key][1])]
              : []
          }
          onChange={(dates) =>
            setSearchFilters((prev) => ({
              ...prev,
              [f.key]:
                dates && dates.length === 2
                  ? [dates[0].toDate(), dates[1].toDate()]
                  : [],
            }))
          }
          style={{ marginRight: 8 }}
        />
      );
    }
    return null;
  };
   const finalColumns = useMemo(() => {
    if (!actionRender) return columns;

    return [
      ...columns,
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => actionRender(record),
      },
    ];
  }, [columns, actionRender]);

  return (
    <div>
      {/* Filters */}
      <div style={{ marginBottom: 16 }}>
        {filters.map((f) => (
          <span key={f.key}>{renderFilterInput(f)}</span>
        ))}
      </div>

      <Table
        columns={finalColumns}
        dataSource={paginatedData}
        rowKey={rowKey}
        expandable={expandable}
        pagination={false}
        onRow={(record) =>
          onRowClick
            ? {
                onClick: () => onRowClick(record),
              }
            : {}
        }
      />

      {/* Pagination */}
      <div style={{ marginTop: 16, textAlign: "right" }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredData.length}
          showSizeChanger
          pageSizeOptions={pageSizeOptions}
          onChange={(page, newSize) => {
            setCurrentPage(page);
            if (newSize && newSize !== pageSize) {
              setPageSize(newSize);
              setCurrentPage(1);
            }
          }}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} items`
          }
        />
      </div>
    </div>
  );
};

export default DynamicTable;
