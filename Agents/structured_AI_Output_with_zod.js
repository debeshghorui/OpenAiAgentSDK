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
        console.log(`🛠️ Weather Tool Calling ...`);

        const response = await fetch(`http://localhost:8080/getWeather?city=${city}`)
        console.log(response);

        return response.text();
        // return `The weather in ${city} is sunny`
    }
})

const GetWeatherSchema = z.object({
    city: z.string().describe('Name of the city'),
    degree_c: z.number().describe('Temperature in celsius'),
    degree_f: z.number().describe('Temperature in fahrenheit'),
    condition: z.string().describe('Weather condition')
})

const agent = new Agent({
    name: 'Weather Agent',
    instructions: `You provide weather info and can send email when requested.`,
    model: module,
    tools: [weatherTool],
    outputType: GetWeatherSchema
});

async function main(query = '') {
    const result = await run(agent, query);
    console.log(result.finalOutput);
}

main("weather in Mumbai");