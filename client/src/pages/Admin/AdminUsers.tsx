import React, { useEffect, useState } from "react";
import { message, Table } from "antd";
import axiosInstance from "../../helpers/axiosInstance";
import { useAlertStore } from "../../stores/useAlertStore";
import { User } from "../../types";
import PageTitle from "../../components/PageTitle";

const AdminUsers: React.FC = () => {
  const setLoading = useAlertStore((s) => s.setLoading);
  const [users, setUsers] = useState<User[]>([]);

  const getUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/users/get-all-users", {});
      setLoading(false);
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error: any) {
      setLoading(false);
      message.error(error.message);
    }
  };

  const updateUserPermissions = async (user: User, action: string) => {
    try {
      let payload: any = null;
      if (action === "make-admin") {
        payload = { ...user, isAdmin: true };
      } else if (action === "remove-admin") {
        payload = { ...user, isAdmin: false };
      } else if (action === "block") {
        payload = { ...user, isBlocked: true };
      } else if (action === "unblock") {
        payload = { ...user, isBlocked: false };
      }

      setLoading(true);
      const response = await axiosInstance.post(
        "/users/update-user-permissions",
        payload
      );
      setLoading(false);
      if (response.data.success) {
        getUsers();
        message.success(response.data.message);
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
    { title: "Email", dataIndex: "email" },
    {
      title: "Status",
      render: (data: User) => {
        return (data as any).isBlocked ? "Blocked" : "Active";
      },
    },
    {
      title: "Role",
      render: (data: User) => {
        if (data.isAdmin) {
          return "Admin";
        } else {
          return "User";
        }
      },
    },
    {
      title: "Action",
      render: (_: any, record: User) => (
        <div className="d-flex gap-3">
          {(record as any).isBlocked && (
            <p
              className="underline"
              onClick={() => updateUserPermissions(record, "unblock")}
            >
              UnBlock
            </p>
          )}
          {!(record as any).isBlocked && (
            <p
              className="underline"
              onClick={() => updateUserPermissions(record, "block")}
            >
              Block
            </p>
          )}
          {record.isAdmin && (
            <p
              className="underline"
              onClick={() => updateUserPermissions(record, "remove-admin")}
            >
              Remove Admin
            </p>
          )}
          {!record.isAdmin && (
            <p
              className="underline"
              onClick={() => updateUserPermissions(record, "make-admin")}
            >
              Make Admin
            </p>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between my-2">
        <PageTitle title="Users" />
      </div>
      <Table columns={columns} dataSource={users} rowKey={(r) => r._id} />
    </div>
  );
};

export default AdminUsers;
