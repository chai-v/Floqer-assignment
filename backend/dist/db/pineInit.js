"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Pinecone vector store with Google 'embedding-001' model
const google_genai_1 = require("@langchain/google-genai");
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
//Pinecone
const pinecone_1 = require("@pinecone-database/pinecone");
const documents_1 = require("@langchain/core/documents");
const pinecone_2 = require("@langchain/pinecone");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, GEMINI_API_KEY, PINECONE_API_KEY, PINECONE_INDEX, PINECONE_ENVIRONMENT } = process.env;
const pinecone = new pinecone_1.Pinecone({
    apiKey: PINECONE_API_KEY,
});
const pineconeIndex = pinecone.Index(PINECONE_INDEX);
function chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}
const googleEmbeddings = new google_genai_1.GoogleGenerativeAIEmbeddings({
    apiKey: GEMINI_API_KEY,
    modelName: 'embedding-001'
});
function populateVectorStore() {
    return __awaiter(this, void 0, void 0, function* () {
        const records = [];
        fs_1.default.createReadStream('salaries.csv')
            .pipe((0, csv_parser_1.default)())
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
            records.push(new documents_1.Document({ pageContent: content, metadata: metadata }));
        })
            .on('end', () => __awaiter(this, void 0, void 0, function* () {
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
                    yield pinecone_2.PineconeStore.fromDocuments(chunk, googleEmbeddings, {
                        pineconeIndex,
                        maxConcurrency: 1,
                    });
                    console.log(`Processed batch of ${chunk.length} records`);
                }
                catch (error) {
                    console.error('Error processing batch:', error);
                }
            }
            console.log('CSV file successfully processed');
        }));
    });
}
populateVectorStore().catch(console.error);
