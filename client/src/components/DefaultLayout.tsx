import React from "react";
import "../resourses/layout.css";
import { useNavigate } from "react-router-dom";
import { useUserStore, UserState } from "../stores/useUserStore";
import { User } from "../types";

interface MenuItem {
  name: string;
  path: string;
  icon: string;
}

interface Props {
  children: React.ReactNode;
}

const DefaultLayout: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(false);
  const user = useUserStore((state: UserState) => state.user);

  const userMenu: MenuItem[] = [
    { name: "Home", icon: "ri-home-line", path: "/" },
    { name: "Bookings", icon: "ri-file-list-line", path: "/bookings" },
    { name: "Profile", icon: "ri-user-line", path: "/profile" },
    { name: "Logout", icon: "ri-logout-box-line", path: "/logout" },
  ];

  const adminMenu: MenuItem[] = [
    { name: "Home", path: "/", icon: "ri-home-line" },
    { name: "Buses", path: "/admin/buses", icon: "ri-bus-line" },
    { name: "Users", path: "/admin/users", icon: "ri-user-line" },
    { name: "Bookings", path: "/admin/bookings", icon: "ri-file-list-line" },
    { name: "Logout", path: "/logout", icon: "ri-logout-box-line" },
  ];

  const menuToBeRendered = user?.isAdmin ? adminMenu : userMenu;
  let activeRoute = window.location.pathname;
  if (window.location.pathname.includes("book-now")) {
    activeRoute = "/";
  }

  const handleMenuClick = (item: MenuItem) => {
    if (item.path === "/logout") {
      useUserStore.getState().logout();
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="layout-parent">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">SB</h1>
          <h1 className="role">
            {user?.name} <br />Role : {user?.isAdmin ? "Admin" : "User"}
          </h1>
        </div>
        <div className="d-flex flex-column gap-3 justify-content-start menu">
          {menuToBeRendered.map((item, index) => (
            <div
              key={index}
              className={`${activeRoute === item.path && "active-menu-item"} menu-item`}
            >
              <i className={item.icon}></i>
              {!collapsed && (
                <span onClick={() => handleMenuClick(item)}>{item.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="body">
        <div className="header">
          {collapsed ? (
            <i
              className="ri-menu-2-fill"
              onClick={() => setCollapsed(!collapsed)}
            ></i>
          ) : (
            <i
              className="ri-close-line"
              onClick={() => setCollapsed(!collapsed)}
            ></i>
          )}
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default DefaultLayout;
