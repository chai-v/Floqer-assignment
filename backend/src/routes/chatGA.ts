import express, { Request, Response, Router } from 'express';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { ConversationChain } from "langchain/chains";
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";
import { BufferMemory } from "langchain/memory";


//Pinecone
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "@langchain/core/documents";
import { PineconeStore } from "@langchain/pinecone";


import dotenv from 'dotenv';
dotenv.config();
let {
  PGHOST,
  PGDATABASE,
  PGUSER,
  PGPASSWORD,
  GEMINI_API_KEY,
  PINECONE_API_KEY,
  PINECONE_INDEX,
  PINECONE_ENVIRONMENT
} = process.env as {
  PGHOST: string;
  PGDATABASE: string;
  PGUSER: string;
  PGPASSWORD: string;
  GEMINI_API_KEY: string;
  PINECONE_API_KEY: string;
  PINECONE_INDEX: string;
  PINECONE_ENVIRONMENT: string;
};

const router = Router();

const pinecone = new Pinecone(
    {
        apiKey: PINECONE_API_KEY,
    }
);

const pineconeIndex = pinecone.Index(PINECONE_INDEX);

const googleEmbeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: GEMINI_API_KEY,
  modelName: 'embedding-001'
});

const chat = new ChatGoogleGenerativeAI({ 
    apiKey: GEMINI_API_KEY,
    modelName: 'gemini-1.5-flash',
    temperature: 0
});

const chatPrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(`
    You are a knowledgeable assistant specializing in Machine Learning Engineer salaries data. Your role is to answer questions about the dataset based on the following details:

    Dataset Description:
    - The dataset contains information on ML Engineer salaries from 2020 to 2024.
    - Each entry includes the following columns: 
    - work_year: The year in which the salary data was collected.
    - experience_level: The level of experience of the employee.
    - employment_type: The type of employment.
    - job_title: The title of the job.
    - salary: The salary amount.
    - salary_currency: The currency in which the salary is denominated.
    - salary_in_usd: The salary amount converted to US Dollars.
    - employee_residence: The country of residence of the employee.
    - remote_ratio: The ratio indicating the level of remote work.
    - company_location: The location of the company.
    - company_size: The size of the company.

    Example Queries:
    1. "What is the average salary for Data Scientists in 2022?"
    2. "How many jobs were listed in 2021?"
    3. "What is the total number of remote jobs in 2023?"

    Response Format:
    - Provide clear and concise answers.
    - If the question involves a specific year, mention the year in the response.
    - For salary-related queries, ensure you mention the average salary in USD.
    - For job count queries, specify the total number of jobs and, if relevant, break it down by job title or employment type.
    
    Contextual Information:
    Here are a few entries from the database related to the user's query
    {embeddings}

    Please provide accurate and helpful responses based on the dataset.
    `),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{query}"),
  ]);


async function initializeVectorStore(){
    const vectorStore = await PineconeStore.fromExistingIndex(
      googleEmbeddings,
      { pineconeIndex }
    );
    return vectorStore;
  }
  
  const pineStore = initializeVectorStore();

  const chain = new ConversationChain({
    prompt: chatPrompt,
    llm: chat,
    memory: new BufferMemory({ returnMessages: true, memoryKey: "history", inputKey: "query"}),
  });

  async function getResponse(query: string, vectorEmbeddings: string){
    const response = await chain.call({ query: query, embeddings: vectorEmbeddings });
    return response;
  }
  router.get('/', (req: Request, res: Response) => {
    res.send('Gemini Chat Bot');
  });
  router.post('/query', async (req: Request, res: Response) => {
    const query = req.body.query;
    try{
        const results = await (await pineStore).similaritySearch(query, 10000);
        const vectorEmbeddings = results.map((result) => result.pageContent).join("/n");
        console.log(vectorEmbeddings);
        const response = await getResponse(query, vectorEmbeddings);
        res.json(response);
    } catch(error){
        console.log(error);
    }
    });

  export default router;