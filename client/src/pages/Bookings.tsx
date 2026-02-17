import React from "react";
import { Table } from "antd";
import { useMyBookings } from "../api/hooks";
import { Booking } from "../types";

const Bookings: React.FC = () => {
  const { data: bookings = [], isLoading } = useMyBookings();

  const columns = [
    {
      title: "Bus",
      dataIndex: ["bus", "name"],
      render: (text: string, record: Booking) =>
        typeof record.bus === "object" ? record.bus.name : "N/A",
    },
    {
      title: "From",
      dataIndex: ["bus", "from"],
      render: (text: string, record: Booking) =>
        typeof record.bus === "object" ? record.bus.from : "N/A",
    },
    {
      title: "To",
      dataIndex: ["bus", "to"],
      render: (text: string, record: Booking) =>
        typeof record.bus === "object" ? record.bus.to : "N/A",
    },
    {
      title: "Seats",
      dataIndex: "seats",
      render: (seats: number[]) => seats?.join(", ") || "N/A",
    },
    {
      title: "Fare",
      dataIndex: ["bus", "fare"],
      render: (text: string, record: Booking) =>
        typeof record.bus === "object" ? `$${record.bus.fare}` : "N/A",
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
    },
  ];

  return (
    <div>
      <Table
        dataSource={bookings as Booking[]}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
      />
    </div>
  );
};

export default Bookings;
