import 'dotenv/config';
import {
    Agent,
    run,
} from '@openai/agents';
import { isValid, z } from 'zod';


const model = process.env.MODEL

if (!model) {
    throw new Error('MODEL is not defined');
}

// Input Check Agent
const mathInputAgent = new Agent({
    name: 'math_input_checker agent',
    instructions: 'You are an input guardrail agent that checks if the user query is a maths question or not',
    model: 'gpt-4o-mini',
    outputType: z.object({
        isValidQuestion: z.boolean().describe("if the user query is a maths question or not"),
        reason: z.string().optional().describe("why the user query is a maths question or not")
    }),
});

// Guardrail
const mathInputGuardrail = {
    name: 'math_input_guardrail',
    execute: async({ input }) => {
        const result = await run(mathInputAgent, input);

        return {
            reason: result.finalOutput.reason,
            tripwireTriggered: !result.finalOutput.isValidQuestion,
        }
    }
};

const mathAgent = new Agent({
    name: 'Meths Agent',
    instructions: 'You are an expert math agent',
    model: model,
    inputGuardrails: [mathInputGuardrail]
});

function main(query = '') {
    run(mathAgent, query)
        .then((result) => {
            console.log(result.finalOutput);
        })
        .catch((err) => {
            console.log(err.result.output.reason);
        });
}

main("Create a js code for add two numbers");
// main('2 + 2');