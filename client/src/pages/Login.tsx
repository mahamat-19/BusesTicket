import React from "react";
import { Form, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../helpers/axiosInstance"; // used for fetching user info after login
import { loginSchema, LoginForm } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAlertStore, AlertState } from "../stores/useAlertStore";
import "../resourses/auth.css";
import { useUserStore, UserState } from "../stores/useUserStore";
import { useLogin } from "../api/hooks";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const setLoading = useAlertStore((s: AlertState) => s.setLoading);
  const setUser = useUserStore((s: UserState) => s.setUser);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onFinish = async (values: LoginForm) => {
    try {
      setLoading(true);
      const response = await loginMutation.mutateAsync(values);
      setLoading(false);
      if (response?.success) {
        message.success(response.message);
        const token = response.data as string; // token is returned as data
        localStorage.setItem("token", token);
        // fetch user info
        // get user details by POST (backend expects POST)
        try {
          const userRes = await axiosInstance.post("/users/get-user-by-id", {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if ((userRes.data as any)?.success) {
            setUser((userRes.data as any).data, token);
          }
        } catch (userErr) {
          // if fetching user fails we still redirect; token is stored
          console.warn("Failed to fetch user info after login", userErr);
        }
        // navigate after attempt
        navigate("/");
      } else {
        message.error(response?.message || "Login failed");
      }
    } catch (error: any) {
      setLoading(false);
      message.error(error.message || "Login error");
    }
  };

  return (
    <div className="h-screen d-flex justify-content-center align-items-center auth">
      <div className="w-400 card p-3">
        <h1 className="text-lg">SheyBus - Login</h1>
        <hr />
        <Form layout="vertical" onFinish={handleSubmit(onFinish)}>
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
            <Link to="/register">Click Here To Register</Link>
            <button className="secondary-btn" type="submit">
              Login
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
