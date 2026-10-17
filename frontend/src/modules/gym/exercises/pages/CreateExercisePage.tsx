import { useNavigate } from "react-router";
import type { ExerciseFormValues } from "../schemas/exerciseSchema";
import { createExercise } from "../services/exerciseService";
import { ExerciseForm } from "../components/ExerciseForm";

export function CreateExercisePage() {
  const navigate = useNavigate();

  async function handleCreate(values: ExerciseFormValues) {
    await createExercise(values);

    navigate("/gym/exercises");
  }

  return (
    <section>
      <h1>Nuevo ejercicio</h1>

      <ExerciseForm submitLabel="Crear ejercicio" onSubmit={handleCreate} />
    </section>
  );
}
