import 'dotenv/config';
import { Agent, tool, run } from '@openai/agents';
import z from 'zod';

// Mimic DataBase
import fs from 'node:fs/promises';

// Model
const model = process.env.MODEL
if (!model) {
    throw new Error('MODEL is not defined');
}

// Tools
const fetchAvailablePlans = tool({
    name: 'fetch_Available_plans',
    description: 'fetch the available plans for internet company',
    parameters: z.object({}),

    execute: async () => {
        return [
            { plan_id: '1', name: 'Basic', price_inr: 399, speed: '30MB/s' },
            { plan_id: '2', name: 'regular', price_inr: 599, speed: '100MB/s' },
            { plan_id: '3', name: 'premium', price_inr: 999, speed: '200MB/s' },
        ]
    }
})

const processRefund = tool({
    name: 'process_refund',
    description: 'This tool is used to process refunds',
    parameters: z.object({
        customer_id: z.string().describe('customer id'),
        reason: z.string().describe('refund reason')
    }),

    execute: async ({ customer_id, reason }) => {
        await fs.appendFile(
            'DB/refund.txt', 
            `\nRefund Processed for ${customer_id} for reason ${reason}`,
            'utf-8'
        )

        return {
            customer_id: customer_id,
            refundIssued: true,
            reason: reason,
        }
    }
})

// Agents

// Refund Agent
const refundAgent = new Agent({
    name: 'Refund expert',
    instructions: 'Help customers process refunds and credits.',
    tools: [processRefund],
    model: model
});

// Sale Agent
const salesAgent = new Agent({
    name: 'sales expert',
    instructions: `
        you are an expert sales agent for an internet company.
        Talk to the usr and help them with what they need.
    `,
    tools: [
        fetchAvailablePlans, 
        refundAgent.asTool({
            toolName: 'refund_expert',
            toolDescription: 'Handles refund questions and requests.',
        })
    ],
    model: model
});


async function runAgent(query = '') {
    const result = await run(salesAgent, query);

    console.log(result.finalOutput);
}

// runAgent('Hey there')
// runAgent('what are the available plans')
runAgent('Hey i had a plan and i want a refund right now. my id is 0231 and region bad service')