
import { NextResponse } from "next/server";
import { getGroqResponse } from "@/app/utils/groqClient";
import { scrapeUrl, urlPattern } from "@/app/utils/scraper";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Ensure messages exist
    if (!messages || messages.length === 0) {
      throw new Error("No messages provided");
    }

    // Get the content of the last message
    const lastMessage = messages[messages.length - 1];
    const messageContent = lastMessage.content;

    console.log("Message received:", messageContent);
    console.log("Messages received:", messages);

    // Check for URL in the message
    const url = messageContent.match(urlPattern);
    let scrapedContent = "";

    if (url) {
      console.log("URL found:", url);
      const scraperResponse = await scrapeUrl(url[0]);
      scrapedContent = scraperResponse.content;
      console.log("Scraped content:", scrapedContent);
    }

    // Construct the user query without the URL
    const userQuery = messageContent.replace(url ? url[0] : "", "").trim();

    // Create the user prompt
    const userPrompt = `
Answer my question: "${userQuery}"

Based on the following content: 
<content>
${scrapedContent}
</content>
`;

    // Build the LLM messages, including all previous messages
    const llmMessages = [
      ...messages.slice(0, -1), // Include all previous messages except the last one
      {
        role: "user",
        content: userPrompt,
      },
    ];

    // Get response from the LLM
    const response = await getGroqResponse(llmMessages);

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error" });
  }
}
