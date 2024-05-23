import { OpenAIEmbeddings } from "@langchain/openai";
import {
  DistanceStrategy,
  PGVectorStore,
} from "@langchain/community/vectorstores/pgvector";
import { Pool, PoolConfig } from 'pg';
import fs from 'fs';
import csv from 'csv-parser';

import dotenv from 'dotenv';
dotenv.config();
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, OPENAI_API_KEY } = process.env;

interface MyDocument {
    pageContent: string;
    metadata: Record<string, any>;
}

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

  const embeddings = new OpenAIEmbeddings({
    apiKey: OPENAI_API_KEY,
    });

  async function initializeVectorStore(){
    const pgvectorStore = await PGVectorStore.initialize(embeddings, config);
    return pgvectorStore
  }

  const pgvectorstore = initializeVectorStore();

  async function populateVectorStore(){
    const tableExists = `
    SELECT EXISTS(
        SELECT FROM information_schema.tables
        WHERE  table_schema = 'public'
        AND    table_name   = 'datacontext'
    );
    `
    const pool = new Pool(config.postgresConnectionOptions);
    const { rows } = await pool.query(tableExists);

    const records: MyDocument[] = []; 

    if(!rows[0].exists) {
        fs.createReadStream('salaries.csv')
        .pipe(csv())
        .on('data', async (row) => {
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
            }

            const content = `Job Title: ${row.job_title}, Experience Level: ${row.experience_level}, Employment Type: ${row.employment_type}, Salary: ${row.salary_in_usd} USD, Location: ${row.company_location}`;

            records.push({ pageContent: content, metadata: metadata });

        })
        .on('end', async () => {
            console.log(records);
            await (await pgvectorstore).addDocuments(records);
            console.log('CSV file successfully processed');
        });
    }
  }

  populateVectorStore().catch(console.error);