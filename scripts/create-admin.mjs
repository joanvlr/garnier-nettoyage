import bcryptjs from "bcryptjs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const email = process.argv[2] || "admin@garnier-nettoyage.fr";
const password = process.argv[3] || "GarnierAdmin2024!";

async function createAdmin() {
  console.log(`Creating admin account...`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);

  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error("DATABASE_URL not found in .env.local");
      process.exit(1);
    }

    // Parse MySQL connection string
    const url = new URL(databaseUrl);
    const connection = await mysql.createConnection({
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
    });

    const passwordHash = await bcryptjs.hash(password, 10);

    await connection.execute(
      "INSERT INTO users (email, passwordHash, role, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW()) ON DUPLICATE KEY UPDATE role='admin'",
      [email, passwordHash, "admin"]
    );

    console.log("✅ Admin account created successfully!");
    console.log(`\nLogin credentials:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`\nAccess the admin panel at: http://localhost:3000/login`);

    await connection.end();
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
