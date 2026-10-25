import apiClient from "@/shared/services/api/apiClient";
import type { RoutineListItemResponse, RoutineRequest, RoutineResponse } from "../types/routine";
import { toApiError } from "@/shared/services/api/ApiError";

export async function listRoutines(signal?: AbortSignal): Promise<RoutineListItemResponse[]> {
  try {
    const response = await apiClient.get<RoutineListItemResponse[]>("/routines", { signal });

    return response.data;
  } catch (error: unknown) {
    signal?.throwIfAborted();
    throw toApiError(error);
  }
}

export async function getRoutine(id: string, signal?: AbortSignal): Promise<RoutineResponse> {
  try {
    const response = await apiClient.get<RoutineResponse>(`/routines/${id}`, { signal });

    return response.data;
  } catch (error: unknown) {
    signal?.throwIfAborted();
    throw toApiError(error);
  }
}

export async function createRoutine(request: RoutineRequest): Promise<RoutineResponse> {
  try {
    const response = await apiClient.post<RoutineResponse>("/routines", request);

    return response.data;
  } catch (error: unknown) {
    throw toApiError(error);
  }
}

export async function updateRoutine(id: string, request: RoutineRequest): Promise<RoutineResponse> {
  try {
    const response = await apiClient.put<RoutineResponse>(`/routines/${id}`, request);

    return response.data;
  } catch (error: unknown) {
    throw toApiError(error);
  }
}

export async function deleteRoutine(id: string): Promise<void> {
  try {
    await apiClient.delete(`/routines/${id}`);
  } catch (error: unknown) {
    throw toApiError(error);
  }
}
