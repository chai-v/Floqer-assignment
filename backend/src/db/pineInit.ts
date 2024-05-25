//Pinecone vector store with Google 'embedding-001' model
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import fs from 'fs';
import csv from 'csv-parser';

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

const pinecone = new Pinecone(
    {
        apiKey: PINECONE_API_KEY,
    }
);

const pineconeIndex = pinecone.Index(PINECONE_INDEX);

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

const googleEmbeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: GEMINI_API_KEY,
    modelName: 'embedding-001'
});


async function populateVectorStore(){

    const records: Document[] = [];
        fs.createReadStream('salaries.csv')
        .pipe(csv())
        .on('data', (row) => {
            const metadata = {
                work_year: row.work_year,
                experience_level: row.experience_level,
                employment_type: row.employment_type,
                job_title: row.job_title,
                salary: row.salary,
                salary_currency: row.salary_currency,
                salary_in_usd: row.salary_in_usd,
                employee_residence: row.employee_residence,
                remote_ratio: row.remote_ratio,
                company_location: row.company_location,
                company_size: row.company_size,
            };

            const content = `Job Title: ${row.job_title}, Experience Level: ${row.experience_level}, Employment Type: ${row.employment_type}, Salary: ${row.salary_in_usd} USD, Location: ${row.company_location}`;

            records.push(new Document({ pageContent: content, metadata: metadata }));
        })
        .on('end', async () => {
            console.log(records);

            //Test google embeddings
            // for (const record of records) {
            //     const embedding = await googleEmbeddings.embedQuery(record.pageContent);
            //     console.log(`Embedding for content "${record.pageContent}":`, embedding);
            //     if (embedding.length === 0) {
            //         console.error(`Empty embedding for content: ${record.pageContent}`);
            //         break;
            //     }
            // }

            const recordChunks = chunkArray(records, 1);
        for (const chunk of recordChunks) {
            try {
                await PineconeStore.fromDocuments(chunk, googleEmbeddings, {
                    pineconeIndex,
                    maxConcurrency: 1, 
                });
                console.log(`Processed batch of ${chunk.length} records`);
            } catch (error) {
                console.error('Error processing batch:', error);
            }
        }
        console.log('CSV file successfully processed');
        });
    }


populateVectorStore().catch(console.error);
