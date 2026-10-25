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
import { exerciseLoader } from "@/modules/gym/exercises/loaders/exerciseLoader";
import { CreateExercisePage } from "@/modules/gym/exercises/pages/CreateExercisePage";
import { EditExercisePage } from "@/modules/gym/exercises/pages/EditExercisePage";
import { deleteExerciseAction } from "@/modules/gym/exercises/actions/deleteExerciseAction";
import { ExerciseErrorBoundary } from "@/modules/gym/exercises/pages/ExerciseErrorBoundary";
import { RoutinesErrorBoundary } from "@/modules/gym/routines/pages/RoutinesErrorBoundary";
import { routinesLoader } from "@/modules/gym/routines/loaders/routinesLoader";
import { CreateRoutinePage } from "@/modules/gym/routines/pages/CreateRoutinePage";
import { RoutineErrorBoundary } from "@/modules/gym/routines/pages/RoutineErrorBoundary";
import { routineLoader } from "@/modules/gym/routines/loaders/routineLoader";
import { EditRoutinePage } from "@/modules/gym/routines/pages/EditRoutinePage";

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
                children: [
                  {
                    index: true,
                    loader: routinesLoader,
                    Component: RoutinesPage,
                    ErrorBoundary: RoutinesErrorBoundary,
                  },
                  {
                    path: "new",
                    Component: CreateRoutinePage,
                    ErrorBoundary: RoutineErrorBoundary,
                  },
                  {
                    path: ":routineId/edit",
                    loader: routineLoader,
                    Component: EditRoutinePage,
                    ErrorBoundary: RoutineErrorBoundary,
                  },
                ],
              },
              {
                path: "gym/workouts",
                Component: WorkoutsPage,
              },
              {
                path: "gym/exercises",
                children: [
                  {
                    index: true,
                    loader: exercisesLoader,
                    action: deleteExerciseAction,
                    Component: ExercisesPage,
                    ErrorBoundary: ExercisesErrorBoundary,
                  },
                  {
                    path: "new",
                    Component: CreateExercisePage,
                  },
                  {
                    path: ":exerciseId/edit",
                    loader: exerciseLoader,
                    Component: EditExercisePage,
                    ErrorBoundary: ExerciseErrorBoundary,
                  },
                ],
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
