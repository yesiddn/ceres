import { AuthLayout } from "@/modules/auth/layouts/AuthLayout";
import { LoginPage } from "@/modules/auth/pages/LoginPage";
import { NotFoundPage } from "@/shared/pages/NotFoundPage";
import { replace, type RouteObject } from "react-router";
import { AppLayout } from "../layouts/AppLayout";
import { RegisterPage } from "@/modules/auth/pages/registerPage";
import { ProtectedRoute } from "../guards/ProtectedRoute";
import { PublicOnlyRoute } from "../guards/PublicOnlyRoute";
import { RoutinesPage } from "@/modules/gym/routines/pages/RoutinesPage";
import { ExercisesPage } from "@/modules/gym/exercises/pages/ExercisesPage";
import { WorkoutsPage } from "@/modules/gym/workouts/pages/WorkoutsPage";
import { exercisesLoader } from "@/modules/gym/exercises/loaders/exercisesLoader";
import {
  initializeAuthMiddleware,
  requireAuthMiddleware,
} from "@/modules/auth/routing/authMiddleware";
import { AppLoadingScreen } from "@/shared/components/AppLoadingScreen";
import { AuthInitializationErrorBoundary } from "@/modules/auth/pages/AuthInitializationErrorBoundary";
import { ExercisesErrorBoundary } from "@/modules/gym/exercises/pages/ExercisesErrorBoundary";

export const routes: RouteObject[] = [
  {
    id: "root",
    middleware: [initializeAuthMiddleware],
    HydrateFallback: AppLoadingScreen,
    ErrorBoundary: AuthInitializationErrorBoundary,
    children: [
      {
        Component: ProtectedRoute,
        middleware: [requireAuthMiddleware],
        children: [
          {
            path: "/",
            Component: AppLayout,
            children: [
              {
                index: true,
                loader: () => replace("/gym/routines"),
              },
              {
                path: "gym/routines",
                Component: RoutinesPage,
              },
              {
                path: "gym/workouts",
                Component: WorkoutsPage,
              },
              {
                path: "gym/exercises",
                loader: exercisesLoader,
                Component: ExercisesPage,
                ErrorBoundary: ExercisesErrorBoundary,
              },
            ],
          },
        ],
      },
      {
        Component: PublicOnlyRoute,
        children: [
          {
            Component: AuthLayout,
            children: [
              {
                path: "/login",
                Component: LoginPage,
              },
              {
                path: "/register",
                Component: RegisterPage,
              },
            ],
          },
        ],
      },
      {
        path: "*",
        Component: NotFoundPage,
      },
    ],
  },
];
