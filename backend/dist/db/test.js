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
//Testing google embeddings
const google_genai_1 = require("@langchain/google-genai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, OPENAI_API_KEY, GEMINI_API_KEY } = process.env;
const model = new google_genai_1.GoogleGenerativeAIEmbeddings({
    apiKey: GEMINI_API_KEY,
    modelName: "embedding-001",
});
// Embed a single query
function embedQuery() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield model.embedQuery("What would be a good company name for a company that makes colorful socks?");
        console.log({ res });
    });
}
embedQuery();
