import { createBrowserRouter } from "react-router";
import { routes } from "./routes";
import { installAuthInterceptors } from "@/modules/auth/services/installAuthIntercepetors";
import { startAuthChannel } from "@/modules/auth/services/startAuthChannel";

installAuthInterceptors();
startAuthChannel();

export const router = createBrowserRouter(routes);
