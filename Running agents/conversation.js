import 'dotenv/config';
import {
    Agent,
    tool,
    run,
} from '@openai/agents';
import { z } from 'zod';


const model = process.env.MODEL

if (!model) {
    throw new Error('MODEL is not defined');
}

let history = [];

const systemPrompt = `
    You are an expert SQL agent, that is specialized in generate  SQL queries as per the user query.

    Postgres Database Schema:
        CREATE TABLE Employees (
            employee_id INT PRIMARY KEY,
            first_name VARCHAR(50),
            last_name VARCHAR(50),
            email VARCHAR(100),
            phone_number VARCHAR(20),
            hire_date DATE,
            job_id INT,
            salary DECIMAL(10, 2),
            department_id INT
        );

        CREATE TABLE Jobs (
            job_id INT PRIMARY KEY,
            job_title VARCHAR(50),
            min_salary DECIMAL(10, 2),
            max_salary DECIMAL(10, 2)
        );

        CREATE TABLE Departments (
            department_id INT PRIMARY KEY,
            department_name VARCHAR(50),
            location_id INT
        );

        CREATE TABLE Locations (
            location_id INT PRIMARY KEY,
            address VARCHAR(100),
            city VARCHAR(50),
            state VARCHAR(50),
            zip_code VARCHAR(10)
        );

        -- Foreign Key Constraints
        ALTER TABLE Employees
        ADD CONSTRAINT fk_job
        FOREIGN KEY (job_id)
        REFERENCES Jobs(job_id);

        ALTER TABLE Employees
        ADD CONSTRAINT fk_department
        FOREIGN KEY (department_id)
        REFERENCES Departments(department_id);

        ALTER TABLE Departments
        ADD CONSTRAINT fk_location
        FOREIGN KEY (location_id)
        REFERENCES Locations(location_id);
`

const executeSQL = tool({
    name: 'Execute_sql',
    description: 'Execute SQL queries',
    parameters: z.object({
        sqlQuery: z.string().describe('SQL query to execute'),
    }),
    execute: async ({ sqlQuery }) => {
        console.log(`🛠️ SQL Tool Calling ...`);
        console.log(sqlQuery);

        return {
            status: 'success',
            result: sqlQuery,
        }
    }
})

const sqlAgent = new Agent({
    name: 'SQL Agent',
    instructions: systemPrompt,
    outputType: z.object({
        sqlQuery: z.string().optional().describe("The SQL query that answers the user's question"),
    }),
    model: model,
    tools: [executeSQL]
});


async function main(query = '') {
    try {
        let result = await run(sqlAgent, history.concat({ role: 'user', content: query }));
        
        history = result.history;
        console.log(history);
        
        console.log(result.finalOutput);
    } catch (error) {
        console.log(error.result.output.reason);
    }
}

// main("Get all employees");

main("Hi, my name is Rahul").then(() => {
    console.log(history);
    main("Get all employees with my name").then(() => {
        console.log(history);
    });
});
