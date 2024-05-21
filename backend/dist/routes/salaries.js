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
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
const poolConfig = {
    host: PGHOST,
    database: PGDATABASE,
    user: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: {
        require: true,
    },
};
const pool = new pg_1.Pool(poolConfig);
function getPgVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield pool.connect();
        try {
            const result = yield client.query('SELECT version()');
            console.log(result.rows[0]);
        }
        finally {
            client.release();
        }
    });
}
getPgVersion();
// Route to get all salary data
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield pool.query('SELECT work_year AS year, COUNT(*) AS total_jobs, AVG(salary_in_usd) AS average_salary_usd FROM salaries GROUP BY work_year ORDER BY work_year;');
        res.json(result.rows);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}));
// Route to get aggregated job titles by year
router.get('/:year', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { year } = req.params;
    try {
        const result = yield pool.query('SELECT job_title, COUNT(*) AS count FROM salaries WHERE work_year = $1 GROUP BY job_title', [year]);
        res.json(result.rows);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}));
exports.default = router;
