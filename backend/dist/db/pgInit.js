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
//Neon postgres vector store with OpenAI embeddings
const openai_1 = require("@langchain/openai");
const pgvector_1 = require("@langchain/community/vectorstores/pgvector");
const documents_1 = require("@langchain/core/documents");
const pg_1 = require("pg");
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, GEMINI_API_KEY, PINECONE_API_KEY, PINECONE_INDEX, PINECONE_ENVIRONMENT } = process.env;
const config = {
    postgresConnectionOptions: {
        host: PGHOST,
        port: 5432,
        user: PGUSER,
        password: PGPASSWORD,
        database: PGDATABASE,
        ssl: {
            require: true,
        }
    },
    tableName: "datacontext",
    columns: {
        idColumnName: "id",
        vectorColumnName: "vector",
        contentColumnName: "content",
        metadataColumnName: "metadata",
    },
    distanceStrategy: "cosine",
};
const embeddings = new openai_1.OpenAIEmbeddings();
function initializeVectorStore() {
    return __awaiter(this, void 0, void 0, function* () {
        const pgvectorStore = yield pgvector_1.PGVectorStore.initialize(embeddings, config);
        return pgvectorStore;
    });
}
const pgvectorstorePromise = initializeVectorStore();
function populateVectorStore() {
    return __awaiter(this, void 0, void 0, function* () {
        const tableExists = `
    SELECT EXISTS(
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'datacontext'
    );
    `;
        const pool = new pg_1.Pool(config.postgresConnectionOptions);
        const { rows } = yield pool.query(tableExists);
        const records = [];
        if (!rows[0]) {
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
                const pgvectorstore = yield pgvectorstorePromise;
                yield pgvectorstore.addDocuments(records);
                console.log('CSV file successfully processed');
            }));
        }
    });
}
populateVectorStore().catch(console.error);
