import Layout from "layouts/DashboardLayout.jsx";
import resetPassword from "views/pages/admin/resetPassword";
import {
  Login,
  Register,
  Error400,
  ForgotPassword,
  Error500
} from "./../views/pages/index";

const indexRoutes = [
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/error400", component: Error400 },
  { path: "/error500", component: Error500 },
  { path: "/forgotPassword", component: ForgotPassword },
  { path: "/admin/resetpassword/:id", component: resetPassword },
  { path: "/", component: Layout }
];

export default indexRoutes;
