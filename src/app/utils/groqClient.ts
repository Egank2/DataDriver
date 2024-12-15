import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function getGroqResponse(chatMessages: ChatMessage[]) {
  const messages: ChatMessage[] = [
    { 
      role: "system",
      content: "You are an academic expert. Provide only a few, highly relevant sources, focusing on credible and authoritative publications. Keep responses concise, no more than 3-4 recommendations, and avoid unnecessary detail."

    },
    ...chatMessages
  ];

  console.log("messages", messages);
  console.log("Starting Groq request ")
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages
  })
  
  return response.choices[0].message.content;
}
