//Neon postgres vector store with OpenAI embeddings
import { OpenAIEmbeddings } from '@langchain/openai';
import { DistanceStrategy, PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { Document } from "@langchain/core/documents";
import { Pool, PoolConfig } from 'pg';
import fs from 'fs';
import csv from 'csv-parser';


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

  const config = {
    postgresConnectionOptions: {
        host: PGHOST,
        port: 5432,
        user: PGUSER,
        password: PGPASSWORD,
        database: PGDATABASE,
        ssl: {
            require: true,
        } as PoolConfig['ssl']
    } as PoolConfig,
    tableName: "datacontext",
    columns: {
        idColumnName: "id",
        vectorColumnName: "vector",
        contentColumnName: "content",
        metadataColumnName: "metadata",
    },
    distanceStrategy: "cosine" as DistanceStrategy,
};

const embeddings = new OpenAIEmbeddings();

async function initializeVectorStore(){
    const pgvectorStore = await PGVectorStore.initialize(embeddings, config);
    return pgvectorStore;
}

const pgvectorstorePromise = initializeVectorStore();

async function populateVectorStore(){
    const tableExists = `
    SELECT EXISTS(
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'datacontext'
    );
    `;
    const pool = new Pool(config.postgresConnectionOptions);
    const { rows } = await pool.query(tableExists);

    const records: Document[] = [];

    if (!rows[0]) {
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
            const pgvectorstore = await pgvectorstorePromise;
            await pgvectorstore.addDocuments(records);
            console.log('CSV file successfully processed');
        });
    }
}

populateVectorStore().catch(console.error);