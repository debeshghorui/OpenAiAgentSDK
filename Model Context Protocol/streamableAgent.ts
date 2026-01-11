import 'dotenv/config'
import { Agent, run, MCPServerStreamableHttp } from '@openai/agents';

const model = process.env.MODEL

if (!model) {
    throw new Error('MODEL is not defined');
}


const githubMcpServer = new MCPServerStreamableHttp({
    url: 'https://gitmcp.io/openai/codex',
    name: 'GitMCP Documentation Server',
});

const agent = new Agent({
    name: 'MCP Assistant',
    instructions: 'You must always use the MCP tool to answer question',
    mcpServers: [githubMcpServer],
});

async function main(query: string) {
    try {
        await githubMcpServer.connect();

        const result = await run(agent, query);
    
        console.log(result.finalOutput);
    } catch (error) {
        await githubMcpServer.close();
        console.error(error);
    }
}

main("What is this repo about");