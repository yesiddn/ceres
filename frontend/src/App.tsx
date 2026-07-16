import { useEffect, useState } from "react";
import "./App.css";

interface HealthResponse {
  status: string;
  dataBaseStatus: string;
  timestamp: string;
}

async function getHealth(signal: AbortSignal) {
  const res = await fetch("/api/health", { signal });
  if (!res.ok) {
    throw new Error(`Health check failed with status ${res.status}`);
  }
  const data: HealthResponse = await res.json();
  return data;
}

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchHealth = async () => {
      try {
        const data = await getHealth(controller.signal);
        setHealth(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          console.log("Fetch aborted");
          return; // cancelación intencional, no es un error real
        }
        setError("No se pudo conectar con el servidor");
        console.error("Error fetching health check:", err);
      }
    };

    fetchHealth();

    return () => controller.abort();
  }, []);

  return (
    <>
      <h1>Connection status</h1>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : health ? (
        <div>
          <p>Status: {health.status}</p>
          <p>Database Status: {health.dataBaseStatus}</p>
          <p>Timestamp: {health.timestamp}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

export default App;
