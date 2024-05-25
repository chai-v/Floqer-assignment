//Testing google embeddings
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

import dotenv from 'dotenv';
dotenv.config();
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, OPENAI_API_KEY, GEMINI_API_KEY } = process.env;


const model = new GoogleGenerativeAIEmbeddings({
    apiKey: GEMINI_API_KEY,
    modelName: "embedding-001",
  });
  
  // Embed a single query
async function embedQuery() {
    const res = await model.embedQuery(
        "What would be a good company name for a company that makes colorful socks?"
      );
      console.log({ res });
}
  
embedQuery();
  