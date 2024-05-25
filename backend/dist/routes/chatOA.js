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
const express_1 = require("express");
const openai_1 = require("@langchain/openai");
const chains_1 = require("langchain/chains");
const openai_2 = require("@langchain/openai");
const prompts_1 = require("@langchain/core/prompts");
const memory_1 = require("langchain/memory");
//pgvector with neon
const pgvector_1 = require("@langchain/community/vectorstores/pgvector");
//Pinecone
const pinecone_1 = require("@pinecone-database/pinecone");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, OPENAI_API_KEY, GEMINI_API_KEY, PINECONE_API_KEY, PINECONE_INDEX, PINECONE_ENVIRONMENT } = process.env;
const router = (0, express_1.Router)();
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
const embeddings = new openai_1.OpenAIEmbeddings({
    apiKey: OPENAI_API_KEY,
});
function initializeVectorStore() {
    return __awaiter(this, void 0, void 0, function* () {
        const pgvectorStore = yield pgvector_1.PGVectorStore.initialize(embeddings, config);
        return pgvectorStore;
    });
}
const pgvectorstore = initializeVectorStore();
const pinecone = new pinecone_1.Pinecone({
    apiKey: PINECONE_API_KEY,
});
const pineconeIndex = pinecone.Index(PINECONE_INDEX);
const chat = new openai_2.ChatOpenAI({ temperature: 0 });
const chatPrompt = prompts_1.ChatPromptTemplate.fromMessages([
    prompts_1.SystemMessagePromptTemplate.fromTemplate(`
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
    new prompts_1.MessagesPlaceholder("history"),
    prompts_1.HumanMessagePromptTemplate.fromTemplate("{query}"),
]);
const chain = new chains_1.ConversationChain({
    prompt: chatPrompt,
    llm: chat,
    memory: new memory_1.BufferMemory({ returnMessages: true, memoryKey: "history" }),
});
function getResponse(query, vectorEmbeddings) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield chain.call({ query: query, embeddings: vectorEmbeddings });
        return response;
    });
}
router.get('/query', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.params;
    const results = yield (yield pgvectorstore).similaritySearch(query, 100);
    const vectorEmbeddings = results.map((result) => result.pageContent).join("/n");
    const response = yield getResponse(query, vectorEmbeddings);
    res.json(response);
}));
exports.default = router;
