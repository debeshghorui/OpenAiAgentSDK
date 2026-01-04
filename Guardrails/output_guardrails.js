import 'dotenv/config';
import {
    Agent,
    run,
} from '@openai/agents';
import { z } from 'zod';


const model = process.env.MODEL

if (!model) {
    throw new Error('MODEL is not defined');
}

// Output Check Agent
const sqlGuardrailAgent = new Agent({
    name: 'SQL output checker agent',
    instructions: `
        Check if query is safe to execute. The query should be read only and do not modify, delete and drop any table
    `,
    model: 'gpt-4o-mini',
    outputType: z.object({
        reason: z.string().optional().describe("region "),
        isSafe: z.boolean().describe("if the query is safe to execute or not"),
    }),
});

// Output Guardrail
const sqlGuardrail = {
    name: 'sql_output_guardrail',
    execute: async({ agentOutput }) => {
        const result = await run(sqlGuardrailAgent, agentOutput.sqlQuery);

        return {
            reason: result.finalOutput.reason,
            tripwireTriggered: !result.finalOutput.isValidQuestion,
        }
    }
};

const sqlAgent = new Agent({
    name: 'SQL Agent',
    instructions: `
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
    `,
    outputType: z.object({
        sqlQuery: z.string().optional().describe("The SQL query that answers the user's question"),
    }),
    model: model,
    outputGuardrails: [sqlGuardrail]
});


function main(query = '') {
    run(sqlAgent, query)
        .then((result) => {
            console.log(result.finalOutput);
        })
        .catch((err) => {
            console.log(err.result.output.reason);
        });
}

main("delete all the Employees");