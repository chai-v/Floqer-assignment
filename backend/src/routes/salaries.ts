import express, { Request, Response, Router } from 'express';
import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const poolConfig: PoolConfig = {
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: {
      require: true,
  } as PoolConfig['ssl'], 
};

const pool = new Pool(poolConfig);

async function getPgVersion() {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT version()');
        console.log(result.rows[0]);
    } finally {
        client.release();
    }
}

getPgVersion();

// Route to get all salary data
router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT work_year AS year, COUNT(*) AS total_jobs, AVG(salary_in_usd) AS average_salary_usd FROM salaries GROUP BY work_year ORDER BY work_year;');
        res.json(result.rows);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to get aggregated job titles by year
router.get('/:year', async (req: Request, res: Response) => {
    const { year } = req.params;
    try {
        const result = await pool.query(
            'SELECT job_title, COUNT(*) AS count FROM salaries WHERE work_year = $1 GROUP BY job_title',
            [year]
        );
        res.json(result.rows);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

export default router;
