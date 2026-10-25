import { useNavigate } from "react-router";
import { RoutineForm } from "../components/RoutineForm";
import type { RoutineFormValues } from "../schemas/routineSchema";

export function CreateRoutinePage() {
  const navigate = useNavigate();

  async function handleCreate(values: RoutineFormValues) {
    console.log(values);
    navigate("/gym/routines");
  }

  return (
    <section>
      <h1>Nueva rutina</h1>

      <RoutineForm defaultValues={{ name: "", scheduledDays: [] }} onSubmit={handleCreate} />
    </section>
  );
}
