import React from "react";
import { Form, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { registerSchema, RegisterForm } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAlertStore, AlertState } from "../stores/useAlertStore";
import "../resourses/auth.css";
import { useRegister } from "../api/hooks";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const setLoading = useAlertStore((s: AlertState) => s.setLoading);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onFinish = async (values: RegisterForm) => {
    try {
      setLoading(true);
      const response = await registerMutation.mutateAsync(values);
      setLoading(false);
      if (response?.success) {
        message.success(response.message);
        navigate("/login");
      } else {
        message.error(response?.message || "Registration failed");
      }
    } catch (error: any) {
      setLoading(false);
      message.error(error.message || "Registration error");
    }
  };

  return (
    <div className="h-screen d-flex justify-content-center align-items-center auth">
      <div className="w-400 card p-3">
        <h1 className="text-lg">SheyBus - Register</h1>
        <hr />
        <Form layout="vertical" onFinish={handleSubmit(onFinish)}>
          <Form.Item
            label="Name"
            help={errors.name?.message}
            validateStatus={errors.name ? "error" : undefined}
          >
            <input type="text" {...register("name")} />
          </Form.Item>
          <Form.Item
            label="Email"
            help={errors.email?.message}
            validateStatus={errors.email ? "error" : undefined}
          >
            <input type="text" {...register("email")} />
          </Form.Item>
          <Form.Item
            label="Password"
            help={errors.password?.message}
            validateStatus={errors.password ? "error" : undefined}
          >
            <input type="password" {...register("password")} />
          </Form.Item>
          <div className="d-flex justify-content-between align-items-center my-3">
            <Link to="/login">Already have an account? Login</Link>
            <button className="secondary-btn" type="submit">
              Register
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
