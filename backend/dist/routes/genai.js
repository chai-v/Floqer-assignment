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
const generative_ai_1 = require("@google/generative-ai");
const fs_1 = __importDefault(require("fs"));
const express_1 = require("express");
const router = (0, express_1.Router)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
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
        category: generative_ai_1.HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: generative_ai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: generative_ai_1.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: generative_ai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
];
const csvData = fs_1.default.readFileSync('ml_engineer_salaries.csv', 'utf-8');
function run(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const chatSession = model.startChat({
            generationConfig,
            safetySettings,
            history: [
                {
                    role: "user",
                    parts: [
                        { text: "This is the dataset with data of machine learning jobs in from 2020 to 2024. Use this data to answer the following queries." },
                        { text: csvData }
                    ],
                },
            ],
        });
        const result = yield chatSession.sendMessage(query);
        return result.response.text();
    });
}
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.body.query;
    try {
        const result = yield run(query);
        res.status(200).json({ response: result });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing the query' });
    }
}));
exports.default = router;
