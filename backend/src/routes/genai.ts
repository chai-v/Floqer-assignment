import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import fs from 'fs';

import express, { Request, Response, Router } from 'express';
const router = Router();

import dotenv from 'dotenv';

dotenv.config();
  
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
  
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-latest",
    systemInstruction: "You are a knowledgeable assistant specializing in Machine Learning Engineer salaries data. Your role is to answer questions about the machine learning job market using these factors :\n\n    Dataset Description:\n    - The dataset contains information on ML Engineer salaries from 2020 to 2024.\n    - Each entry includes the following columns: \n    - work_year: The year in which the salary data was collected.\n    - experience_level: The level of experience of the employee.\n    - employment_type: The type of employment.\n    - job_title: The title of the job.\n    - salary: The salary amount.\n    - salary_currency: The currency in which the salary is denominated.\n    - salary_in_usd: The salary amount converted to US Dollars.\n    - employee_residence: The country of residence of the employee.\n    - remote_ratio: The ratio indicating the level of remote work.\n    - company_location: The location of the company.\n    - company_size: The size of the company.\n\nExample Queries:\n    1. \"What is the average salary for Data Scientists in 2022?\"\n    2. \"How many jobs were listed in 2021?\"\n    3. \"What is the total number of remote jobs in 2023?\"\n\n    Response Format:\n    - Provide clear and concise answers.\n    - Ensure the response is one small paragraph with no more than three sentences\n    - If the question involves a specific year, mention the year in the response.\n    - For salary-related queries, ensure you mention the average salary in USD.\n\nPlease provide accurate and helpful responses based on the dataset.",
});
  
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};
  
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
];

const csvData = fs.readFileSync('ml_engineer_salaries.csv', 'utf-8');
  
async function run(query: string) {
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [
            {text: "This is the dataset with data of machine learning jobs in from 2020 to 2024. Use this data to answer the following queries."},
            { text: csvData }
          ],
        },
      ],
    });
  
    const result = await chatSession.sendMessage(query);
    return result.response.text();
  }

  router.post('/', async (req: Request, res: Response) => {
    const query = req.body.query;
    try {
        const result = await run(query);
        res.status(200).json({ response: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing the query' });
    }
});

  export default router;