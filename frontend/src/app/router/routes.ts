import { AuthLayout } from "@/modules/auth/layouts/AuthLayout";
import { Loginpage } from "@/modules/auth/pages/LoginPage";
import { DashboardPage } from "@/modules/gym/pages/DashboardPage";
import { NotFoundPage } from "@/shared/pages/NotFoundPage";
import type { RouteObject } from "react-router";
import { AppLayout } from "../layouts/AppLayout";

export const routes: RouteObject[] = [
  {
    path: "/",
    Component: AppLayout,
    children: [
      {
        index: true,
        Component: DashboardPage,
      },
    ],
  },
  {
    Component: AuthLayout,
    children: [
      {
        path: "/login",
        Component: Loginpage,
      },
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
];
