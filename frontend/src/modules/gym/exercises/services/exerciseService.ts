import apiClient from "@/shared/services/api/apiClient";
import type { ExerciseResponse, ExerciseRequest } from "../types/exercise";
import { toApiError } from "@/shared/services/api/ApiError";

export async function listExercises(): Promise<ExerciseResponse[]> {
  try {
    const response = await apiClient.get<ExerciseResponse[]>("/exercises");

    return response.data;
  } catch (error: unknown) {
    throw toApiError(error);
  }
}

export async function getExercise(id: string): Promise<ExerciseResponse> {
  try {
    const response = await apiClient.get<ExerciseResponse>(`/exercises/${id}`);

    return response.data;
  } catch (error: unknown) {
    throw toApiError(error);
  }
}

export async function createExercise(request: ExerciseRequest): Promise<ExerciseResponse> {
  try {
    const response = await apiClient.post<ExerciseResponse>("/exercises", request);

    return response.data;
  } catch (error: unknown) {
    throw toApiError(error);
  }
}

export async function updateExercise(
  id: string,
  request: ExerciseRequest,
): Promise<ExerciseResponse> {
  try {
    const response = await apiClient.put<ExerciseResponse>(`/exercises/${id}`, request);

    return response.data;
  } catch (error: unknown) {
    throw toApiError(error);
  }
}

export async function deleteExercise(id: string): Promise<void> {
  try {
    await apiClient.delete(`/exercises/${id}`);
  } catch (error: unknown) {
    throw toApiError(error);
  }
}
