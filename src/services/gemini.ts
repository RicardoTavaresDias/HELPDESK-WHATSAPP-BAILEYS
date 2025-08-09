import { AI, model } from "@/config/google.config";
import client from "@/config/postgres.config";

async function main() {
  await client.connect();
  const res = await client.query('SELECT id, name, email, role FROM "user"');

  const response = await AI.models.generateContent({
    model,
    contents: "Quem é você? o que você poderá me ajudar?",
  });
  
  return response.text
}
export { main }