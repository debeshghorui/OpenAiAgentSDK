import 'dotenv/config'
import { Agent, tool, run } from '@openai/agents';
import { z } from 'zod';
import axios from 'axios';
import readline from 'node:readline/promises';

const model = process.env.MODEL

if (!model) {
    throw new Error('MODEL is not defined');
}

const sendEmailTool = tool({
    name: 'send_email',
    description: 'sends an email to the given recipient',
    parameters: z.object({
        to: z.string().describe('email address of the recipient'),
        subject: z.string().describe('subject of the email'),
        html: z.string().describe('body of the email'),
    }),

    needsApproval: true,

    execute: async function ({ to, subject, html }) {
        const apiKey = process.env.AUTOSEND_API_KEY;

        if (!apiKey) {
            throw new Error('AUTOSEND_API_KEY is not defined');
        }

        const response = await axios.post('https://api.autosend.com/v1/mails/send', {
            from: {
                email: 'no-reply@debeshghorui.cloud',
                name: 'AI Weather Agent'
            },
            to: {
                email: to,
                name: 'Recipient'
            },
            subject,
            html,
        }, {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
            }
        })

        return response.data;
    }
})

const getWeatherTool = tool({
    name: 'get_weather',
    description: 'returns the current weather information for the given city',
    parameters: z.object({
        city: z.string().describe('name of the city'),
    }),

    execute: async function ({ city }) {
        const url = `https://wttr.in/${city.toLowerCase()}?format=%C+%t`;
        const response = await axios.get(url, { responseType: 'text' });

        return `The weather of ${city} is ${response.data}`;
    },
});

const agent = new Agent({
    name: 'weather Email Agent',
    instructions: `
        You're an expert agent in getting info and sending it using email.
    `,
    tools: [getWeatherTool, sendEmailTool],
})

async function askForUserConfirmation(question: string) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const answer = await rl.question(`${question} (y/n): `);
    const normalizedAnswer = answer.toLowerCase();

    rl.close();

    return normalizedAnswer === 'y' || normalizedAnswer === 'yes';
}

async function main(query: string) {
    let result = await run(agent, query);

    let hasInterruptions = result.interruptions.length > 0;

    while (hasInterruptions) {
        const currentState = result.state;

        for (const interruption of result.interruptions) {
            if (interruption.type === 'tool_approval_item') {
                const approval = await askForUserConfirmation(
                    `${interruption.agent.name} is asking for calling tool ${interruption.toolName}`
                    // `${JSON.stringify(interruption)}`
                )

                if (approval) {
                    currentState.approve(interruption)
                } else {
                    currentState.reject(interruption)
                }

                result = await run(agent, currentState);
                hasInterruptions = result.interruptions?.length > 0;
            }
        }
    }
}

main('what is the weather in delhi and goa send me on debeshghorui@gmail.com')