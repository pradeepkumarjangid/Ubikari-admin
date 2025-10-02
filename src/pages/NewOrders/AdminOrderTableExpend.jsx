import React, { useState } from "react";
import DynamicTable from "../../components/DynamicTable";
import { Button, Dropdown, Menu, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownOutlined,
  TruckOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import DynamicDrawer from "../../components/DynamicDrawer";
import EditOrder from "./EditOrder";
import { showConfirm } from "../../utility/confirmBox";
import apiObj from "../../services/api";
import { toast } from "react-toastify";
const AdminOrderTableExpandable = ({ orders = [] }) => {
  const baseUrl = import.meta.env.VITE_IMG_BASE_URL;
  const [state, setState] = useState({
    isOpen: false,
    record: {},
  });
  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);
  let UNIKARIADMIN = localStorage.getItem("UNIKARIADMIN");
  UNIKARIADMIN = UNIKARIADMIN ? JSON.parse(UNIKARIADMIN) : null;
  let headers = {
    Authorization: `Bearer ${UNIKARIADMIN ? UNIKARIADMIN.token : ""}`,
  };

  const orderActions = [
    // { key: "view", label: "View Details", icon: <EyeOutlined /> },
    { key: "edit", label: "Edit Order", icon: <EditOutlined /> },
    {
      key: "createOnShipRocket",
      label: "Create On Shiprocket",
      icon: <SaveOutlined />,
    },
    { key: "cancel", label: "Cancel Order", icon: <CloseCircleOutlined /> },
    { key: "ship", label: "Mark as Shipped", icon: <TruckOutlined /> },
    // {
    //   key: "deliver",
    //   label: "Mark as Delivered",
    //   icon: <CheckCircleOutlined />,
    // },
    // { key: "delete", label: "Delete Order", icon: <DeleteOutlined /> },
  ];
  const handleOrderAction = (actionKey, order) => {
    switch (actionKey) {
      case "view":
        // Show modal or navigate
        message.info(`Viewing order ${order.orderId}`);
        break;
      case "edit":
        setState({ isOpen: true, record: order });
        break;
      case "createOnShipRocket":
        handleCreateShipRocketOrder(order);
        break;
      case "cancel":
        message.warning(`Cancelling order ${order.orderId}`);
        break;
      case "ship":
        message.success(`Order ${order.orderId} marked as shipped`);
        break;
      case "deliver":
        message.success(`Order ${order.orderId} marked as delivered`);
        break;
      case "delete":
        message.error(`Order ${order.orderId} deleted`);
        break;
      default:
        break;
    }
  };
  const columns = [
    {
      title: "", // the expand icon column
      dataIndex: "expandIcon", // dummy
      render: (_, __, idx) => null,
    },
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Customer",
      dataIndex: ["userId", "name"],
      key: "customer",
    },
    {
      title: "Status",
      dataIndex: "admin_status",
      key: "status",
    },
    {
      title: "Amount",
      dataIndex: "finalAmount",
      key: "amount",
      render: (amt) => `₹${amt}`,
    },
    {
      title: "Method",
      dataIndex: "paymentMethod",
      key: "method",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      render: (dt) => new Date(dt).toLocaleDateString(),
    },
  ];
  // const renderOrderActions = (order) => {
  //   return (
  //     <Dropdown
  //       overlay={
  //         <Menu
  //           onClick={({ key }) => handleOrderAction(key, order)}
  //           items={orderActions.map((action) => ({
  //             key: action.key,
  //             label: (
  //               <span className="flex items-center gap-2">
  //                 {action.icon} {action.label}
  //               </span>
  //             ),
  //           }))}
  //         />
  //       }
  //       trigger={["click"]}
  //     >
  //       <Button size="small">
  //         Actions <DownOutlined />
  //       </Button>
  //     </Dropdown>
  //   );
  // };
  const renderOrderActions = (order) => {
    // Dynamically filter actions based on order fields
    const filteredActions = orderActions.filter((action) => {
      switch (action.key) {
        case "edit":
          return order.admin_status === "New_order"; // Only show edit if order is pending
        case "createOnShipRocket":
          return !order.shiprocketOrderId; // Show only if not already created
        case "cancel":
          return order.deliveryStatus === "Pending";
        case "ship":
          return order.deliveryStatus === "Accepted";
        case "deliver":
          return order.deliveryStatus === "Shipped";
        case "delete":
          return (
            order.deliveryStatus === "Cancelled" ||
            order.deliveryStatus === "Delivered"
          );
        default:
          return true;
      }
    });

    // If no actions available, return null or disabled button
    if (filteredActions.length === 0) return null;

    return (
      <Dropdown
        overlay={
          <Menu
            onClick={({ key }) => handleOrderAction(key, order)}
            items={filteredActions.map((action) => ({
              key: action.key,
              label: (
                <span className="flex items-center gap-2">
                  {action.icon} {action.label}
                </span>
              ),
            }))}
          />
        }
        trigger={["click"]}
      >
        <Button size="small">
          Actions <DownOutlined />
        </Button>
      </Dropdown>
    );
  };

  const expandable = {
    expandedRowRender: (record) => {
      const items = JSON.parse(record.items || "[]");
      return (
        <ul>
          {items.map((item, idx) => (
            <li
              key={idx}
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid #ddd",
                padding: "8px 0",
              }}
            >
              <div style={{ display: "flex", gap: 8 }}>
                <img
                  src={`${baseUrl}${item?.images?.[0]}`}
                  alt=""
                  style={{ height: 40, width: 40 }}
                />
                <div>
                  <p style={{ margin: 0, fontWeight: "bold" }}>
                    {item.productName}
                  </p>
                  <p style={{ margin: 0, fontSize: 12 }}>
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0 }}>
                  ₹{item.priceAfterDiscount} × {item.quantity}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    textDecoration: "line-through",
                    color: "#888",
                  }}
                >
                  ₹{item.price}
                </p>
              </div>
            </li>
          ))}
        </ul>
      );
    },
    rowExpandable: (record) => {
      const items = JSON.parse(record.items || "[]");
      return items.length > 0;
    },
  };

  const filters = [
    { key: "userId.name", label: "Customer", type: "text" },
    {
      key: "deliveryStatus",
      label: "Status",
      type: "select",
      options: [
        { value: "Pending", label: "Pending" },
        { value: "Shipped", label: "Shipped" },
        { value: "Delivered", label: "Delivered" },
      ],
    },
    {
      key: "createdAt",
      label: "Date",
      type: "dateRange",
    },
  ];

  const closeDrawer = () => {
    setState({
      isOpen: false,
      record: {},
    });
  };

  const handleCreateShipRocketOrder = (item) => {
    if (!item?.height || !item?.weight || !item?.length || !item?.breadth) {
      notifyError("Please Update order dimensions first");
      return;
    }
    showConfirm({
      title: "Create Order On Shiprocket",
      content: "Are you sure you want to create order on shiprocket?",
      onOk: async () => {
        let data = {
          orderId: item?.orderId,
        };
        try {
          let res = await apiObj.createOrderOnShip(data, headers);
          notifySuccess(res?.data?.message);
        } catch (err) {
          console.log(err);
        }
        // call your delete API here
      },
      onCancel: () => {
        console.log("Delete cancelled");
      },
    });
  };
  return (
    <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
      <h2>Admin Orders (Expandable Rows)</h2>
      <DynamicTable
        columns={columns}
        dataSource={orders}
        rowKey="_id"
        expandable={expandable}
        filters={filters}
        defaultPageSize={5}
        pageSizeOptions={["5", "10", "20"]}
        actionRender={renderOrderActions} // NEW!
      />

      <DynamicDrawer
        isOpen={state?.isOpen}
        onClose={closeDrawer}
        title={`Edit Order: ${state?.record?.orderId || ""}`}
        width={300}
      >
        <EditOrder
          onClose={closeDrawer}
          record={state?.record}
          // onSubmit={handleEditSubmit}
        />
      </DynamicDrawer>
    </div>
  );
};

export default AdminOrderTableExpandable;
