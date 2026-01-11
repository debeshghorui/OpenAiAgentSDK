import 'dotenv/config'
import { Agent, run, hostedMcpTool } from '@openai/agents';

const model = process.env.MODEL

if (!model) {
    throw new Error('MODEL is not defined');
}

const agent = new Agent({
    name: 'MCP Assistant',
    instructions: 'You must always use the MCP tool to answer question',
    tools: [
        hostedMcpTool({
            serverLabel: 'gitmcp',
            serverUrl: 'https://gitmcp.io/openai/codex',
        }),
    ],
});

async function main(query: string) {
    const result = await run(agent, query);

    console.log(result.finalOutput);
}

main("What is this repo about");