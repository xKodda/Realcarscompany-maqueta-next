import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Obtener DATABASE_URL con fallback para generación del cliente
const getDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }
  try {
    return env("DATABASE_URL")
  } catch {
    // Si no está disponible, usar URL dummy solo para generar el cliente
    // Esto permite que prisma generate funcione durante el build sin conexión real
    return "DATABASE_URL=postgresql://postgres:Realcarscompany2025*@db.biygbkzzjeijfynrfjrj.supabase.co:5432/postgres"
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: getDatabaseUrl(),
  },
});
