import { AuthLayout } from "@/modules/auth/layouts/AuthLayout";
import { LoginPage } from "@/modules/auth/pages/LoginPage";
import { DashboardPage } from "@/modules/dashboard/pages/DashboardPage";
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
        Component: LoginPage,
      },
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
];
