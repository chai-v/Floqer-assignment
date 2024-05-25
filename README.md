# Floqer Assignment

A seamless dashboard to gain insights on machine learning jobs over the past few years.

## Table of Contents

- [Introduction](#introduction)
- [Tasks](#tasks)
- [Deployment](#deployment)
- [Built With](#built-with)

## Introduction

This is my submission for Floqer SDE internship application. The project is still a work in progress.

## Tasks

### Task 1: Basic Table

#### Data Information
- The dataset provides information on ML Engineer salaries from 2020 to 2024.

#### Description
Create a table (referred to as the "main table") with the following columns:
1. **Year**: The year from 2020 to 2024.
2. **Number of Total Jobs**: The total number of ML Engineer jobs for each year.
3. **Average Salary in USD**: The average salary in USD for ML Engineer jobs for each year.
4. Users should be able to sort the table by any column.

### Task 2: Analytics

#### Description
1. **Line Graph**: Display how the number of ML Engineer jobs has changed from 2020 to 2024.

2. **Aggregated Job Titles Table**:
   - When a user clicks on a row in the main table, display a second table.
   - This table should show aggregated job titles and the number of jobs for the selected year.
   - For example, if the user clicks on 2022 in the main table, the second table should display all job titles from 2022 along with the sum of how many times each job appeared in 2022.

### Bonus task: Chatbot
Create a chat app that creates the best response based on business knowledge from the dataset.

## Deployment

The web app is hosted on vercel. The backend service is hosted on Render's free tier, therefore, there can be a delay in data population in the web app.

## Built With

| Technology/Framework/Library | Description                                     |
|-------------------------------|-------------------------------------------------|
| [React + TS](https://reactjs.org/) | JavaScript library for building user interfaces |
| [Ant Design](https://ant.design/) | UI framework for React                         |
| [Tailwind](https://tailwindcss.com/) | CSS framework                        |
| [Express.js](https://expressjs.com/) | Web application framework for Node.js         |
| [LangChain.js](https://js.langchain.com/v0.2/docs/introduction/) | LLMs framework                                 |
| [NeonDB](https://neon.tech/) | Serverless Postgres database                                 |
| [Pinecone](https://www.pinecone.io/) | Serverless vector database                                 |

