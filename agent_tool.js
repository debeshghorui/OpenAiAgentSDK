import 'dotenv/config';
import { Agent, tool, run } from '@openai/agents';
import z from 'zod';

import { sendMail } from './Tools/SendMail.js';

const model = process.env.MODEL

if (!model) {
    throw new Error('MODEL is not defined');
}

const weatherTool = tool({
    name: 'get_weather',
    description: 'return the current weather for a given location',
    parameters: z.object({
        city: z.string().describe('name of the city'),
    }),
    execute: async ({ city }) => {
        console.log(`🛠️ Weather Tool Calling ...`);

        const response = await fetch(`https://wttr.in/${city.toLocaleLowerCase()}?format=%C+%t`)
        console.log(response);

        return response.text();
        // return `The weather in ${city} is sunny`
    }
})

const sendMailTool = tool({
    name: 'send_mail',
    description: 'this tool is used to send mail using resend api',
    parameters: z.object({
        to: z.string().describe('Mail to'),
        subject: z.string().describe('Mail subject'),
        html: z.string().describe('Mail body')
    }),
    execute: async ({ to, subject, html}) => {
        console.log(`🛠️ Send Mail Tool Calling ... \n To: ${to} \n Subject: ${subject} \n Body: ${html}`)

        const result = await sendMail(to, subject, html);
        return result;
    }
})

const agent = new Agent({
    name: 'Weather Agent',
    instructions: `You provide weather info and can send email when requested.`,
    model: model,
    tools: [weatherTool, sendMailTool]
});

async function main(query = '') {
    const result = await run(agent, query);
    console.log(result.finalOutput);
}

main("Mail me the weather in Mumbai, my email is debeshghorui@gmail.com");