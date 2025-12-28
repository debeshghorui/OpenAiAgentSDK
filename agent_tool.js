import 'dotenv/config';
import { Agent, tool, run } from '@openai/agents';
import z from 'zod';

const weatherTool = tool({
    name: 'get_weather',
    description: 'return the current weather for a given location',
    parameters: z.object({
        city: z.string().describe('name of the city'),
    }),
    execute: async ({ city }) => {
        const response = await fetch(`https://wttr.in/${city.toLocaleLowerCase()}?format=%C+%t`)
        // console.log(response);
        
        return response.text();
        // return `The weather in ${city} is sunny`
    }
})

const agent = new Agent({
    name: 'Weather Agent',
    instructions: `You are a weather agent that helps user to tell weather report`,
    model: "gpt-4.1-nano",
    tools: [weatherTool]
})

async function main(query = '') {
    const result = await run(agent, query);
    console.log(result.finalOutput);
}

main("Kolkata weather")