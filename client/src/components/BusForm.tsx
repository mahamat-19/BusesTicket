import React from "react";
import { Col, Form, Modal, Row, message } from "antd";
import axiosInstance from "../helpers/axiosInstance";
import { useAlertStore, AlertState } from "../stores/useAlertStore";
import { Bus as BusType } from "../types";
import { busSchema, BusForm } from "../schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  showBusForm: boolean;
  setShowBusForm: (show: boolean) => void;
  type?: "add" | "edit";
  getData: () => void;
  selectedBus?: BusType | null;
  setSelectedBus: (bus: BusType | null) => void;
}

const BusFormComponent: React.FC<Props> = ({
  showBusForm,
  setShowBusForm,
  type = "add",
  getData,
  selectedBus,
  setSelectedBus,
}) => {
  const setLoading = useAlertStore((s: AlertState) => s.setLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BusForm>({
    resolver: zodResolver(busSchema),
    defaultValues: selectedBus || undefined,
  });

  const onFinish = async (values: BusForm) => {
    try {
      setLoading(true);
      let response;
      if (type === "add") {
        response = await axiosInstance.post("/buses/add-bus", values);
      } else {
        response = await axiosInstance.post("/buses/update-bus", {
          ...values,
          _id: selectedBus?._id,
        });
      }
      setLoading(false);
      if (response.data.success) {
        message.success(response.data.message);
        getData();
        setShowBusForm(false);
        setSelectedBus(null);
        reset();
      } else {
        message.error(response.data.message);
      }
    } catch (error: any) {
      setLoading(false);
      message.error(error.message);
    }
  };

  const handleCancel = () => {
    setSelectedBus(null);
    setShowBusForm(false);
    reset();
  };

  return (
    <Modal
      width={800}
      title={type === "add" ? "Add Bus" : "Update Bus"}
      visible={showBusForm}
      onCancel={handleCancel}
      footer={false}
    >
      <Form layout="vertical" onFinish={handleSubmit(onFinish)}>
        <Row gutter={[10, 10]}>
          <Col lg={24} xs={24}>
            <Form.Item label="Bus Name" name="name">
              <input type="text" {...register("name")} />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Bus Number" name="number">
              <input type="text" {...register("number")} />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Capacity" name="capacity">
              <input
                type="number"
                {...register("capacity", { valueAsNumber: true })}
              />
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item label="From" name="from">
              <input type="text" {...register("from")} />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="To" name="to">
              <input type="text" {...register("to")} />
            </Form.Item>
          </Col>

          <Col lg={8} xs={24}>
            <Form.Item label="Journey Date" name="journeyDate">
              <input type="date" {...register("journeyDate")} />
            </Form.Item>
          </Col>
          <Col lg={8} xs={24}>
            <Form.Item label="Departure" name="departure">
              <input type="time" {...register("departure")} />
            </Form.Item>
          </Col>
          <Col lg={8} xs={24}>
            <Form.Item label="Arrival" name="arrival">
              <input type="time" {...register("arrival")} />
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item label="Type" name="type">
              <select {...register("type")}> 
                <option value="AC">AC</option>
                <option value="Non-AC">Non-AC</option>
              </select>
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Fare" name="fare">
              <input
                type="number"
                {...register("fare", { valueAsNumber: true })}
              />
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item label="Status" name="status">
              <select {...register("status")}> 
                <option value="Yet To Start">Yet To Start</option>
                <option value="Running">Running</option>
                <option value="Completed">Completed</option>
              </select>
            </Form.Item>
          </Col>
        </Row>

        <div className="d-flex justify-content-end">
          <button className="primary-btn" type="submit">
            Save
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default BusFormComponent;
