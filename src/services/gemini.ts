import { AI, model } from "@/config/google.config";

async function main() {
  const response = await AI.models.generateContent({
    model,
    contents: "Quem é você? o que você poderá me ajudar?",
  });
  
  return response.text
}
export { main }