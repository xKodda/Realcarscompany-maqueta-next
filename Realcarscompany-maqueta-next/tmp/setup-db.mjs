import pkg from 'pg';
const { Client } = pkg;

const connectionString = "postgresql://postgres:Realcarscompany2025*@db.biygbkzzjeijfynrfjrj.supabase.co:5432/postgres";

async function main() {
    const client = new Client({ connectionString });
    await client.connect();

    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS ordenes_monzza (
                id VARCHAR(255) PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                nombre VARCHAR(255) NOT NULL,
                total INTEGER NOT NULL,
                cantidad_tickets INTEGER NOT NULL,
                metadata JSONB,
                estado VARCHAR(50) DEFAULT 'pendiente',
                tickets JSONB DEFAULT '[]'::jsonb,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Tabla 'ordenes_monzza' creada exitosamente.");
    } catch (e) {
        console.error("Error: ", e);
    } finally {
        await client.end();
    }
}

main();
