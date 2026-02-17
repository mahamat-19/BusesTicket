import React, { useEffect, useRef, useState } from "react";
import { message, Modal, Table } from "antd";
import axiosInstance from "../../helpers/axiosInstance";
import { useAlertStore, AlertState } from "../../stores/useAlertStore";
import { Booking } from "../../types";
import PageTitle from "../../components/PageTitle";
import { useReactToPrint } from "react-to-print";

const AdminBookings: React.FC = () => {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const setLoading = useAlertStore((s: AlertState) => s.setLoading);

  const getBookings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/bookings/get-all-bookings", {});
      setLoading(false);
      if (response.data.success) {
        const mappedData = response.data.data.map((booking: any) => ({
          ...booking,
          ...booking.bus,
          key: booking._id,
        }));
        setBookings(mappedData);
      } else {
        message.error(response.data.message);
      }
    } catch (error: any) {
      setLoading(false);
      message.error(error.message);
    }
  };

  const columns = [
    { title: "Bus Name", dataIndex: "name", key: "bus" },
    { title: "Bus Number", dataIndex: "number", key: "bus" },
    { title: "Journey Date", dataIndex: "journeyDate" },
    { title: "Journey Time", dataIndex: "departure" },
    {
      title: "Seats",
      dataIndex: "seats",
      render: (seats: any[]) => seats.join(", "),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: any) => (
        <div>
          <p
            className="text-md underline"
            onClick={() => {
              setSelectedBooking(record);
              setShowPrintModal(true);
            }}
          >
            Print Ticket
          </p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getBookings();
  }, []);

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <PageTitle title="Bookings" />
      <div className="mt-2">
        <Table columns={columns} dataSource={bookings} rowKey={(r: any) => r._id} />
      </div>

      {showPrintModal && selectedBooking && (
        <Modal
          title="Print Ticket"
          onCancel={() => {
            setShowPrintModal(false);
            setSelectedBooking(null);
          }}
          visible={showPrintModal}
          okText="Print"
          onOk={handlePrint}
        >
          <div className="d-flex flex-column p-5" ref={componentRef}>
            <p>Bus : {selectedBooking.name}</p>
            <p>
              {selectedBooking.from} - {selectedBooking.to}
            </p>
            <hr />
            <p>
              <span>Journey Date:</span>{" "}
              {selectedBooking.journeyDate}
            </p>
            <p>
              <span>Journey Time:</span> {selectedBooking.departure}
            </p>
            <hr />
            <p>
              <span>Seat Numbers:</span> <br />
              {selectedBooking.seats}
            </p>
            <hr />
            <p>
              <span>Total Amount:</span>{" "}
              {selectedBooking.fare * selectedBooking.seats.length} /-
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminBookings;
