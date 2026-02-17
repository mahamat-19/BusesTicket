import React, { useEffect, useState } from "react";
import { message, Table } from "antd";
import { useAlertStore, AlertState } from "../../stores/useAlertStore";
import axiosInstance from "../../helpers/axiosInstance";
import BusForm from "../../components/BusForm";
import PageTitle from "../../components/PageTitle";
import { Bus } from "../../types";

const AdminBuses: React.FC = () => {
  const setLoading = useAlertStore((s: AlertState) => s.setLoading);
  const [showBusForm, setShowBusForm] = useState(false);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

  const getBuses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/buses/get-all-buses", {});
      setLoading(false);
      if (response.data.success) {
        setBuses(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error: any) {
      setLoading(false);
      message.error(error.message);
    }
  };

  const deleteBus = async (id: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/buses/delete-bus", { _id: id });
      setLoading(false);
      if (response.data.success) {
        message.success(response.data.message);
        getBuses();
      } else {
        message.error(response.data.message);
      }
    } catch (error: any) {
      setLoading(false);
      message.error(error.message);
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Number", dataIndex: "number" },
    { title: "From", dataIndex: "from" },
    { title: "To", dataIndex: "to" },
    { title: "Journey Date", dataIndex: "journeyDate" },
    { title: "Status", dataIndex: "status" },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: Bus) => (
        <div className="d-flex gap-3">
          <i
            className="ri-delete-bin-line"
            onClick={() => {
              deleteBus(record._id);
            }}
          ></i>
          <i
            className="ri-pencil-line"
            onClick={() => {
              setSelectedBus(record);
              setShowBusForm(true);
            }}
          ></i>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getBuses();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between my-2">
        <PageTitle title="Buses" />
        <button className="primary-btn" onClick={() => setShowBusForm(true)}>
          Add Bus
        </button>
      </div>

      <Table columns={columns} dataSource={buses} rowKey={(record) => record._id} />

      {showBusForm && (
        <BusForm
          showBusForm={showBusForm}
          setShowBusForm={setShowBusForm}
          type={selectedBus ? "edit" : "add"}
          selectedBus={selectedBus}
          setSelectedBus={setSelectedBus}
          getData={getBuses}
        />
      )}
    </div>
  );
};

export default AdminBuses;
