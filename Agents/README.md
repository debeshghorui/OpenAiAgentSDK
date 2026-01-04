# [OpenAI Agents SDK](https://openai.github.io/openai-agents-js/)

## [Agents](https://openai.github.io/openai-agents-js/guides/agents/#_top)

Agents are the main building‑block of the OpenAI Agents SDK. An Agent is a Large Language Model (LLM) that has been configured with:

* Instructions – the system prompt that tells the model who it is and how it should respond.
* Model – which OpenAI model to call, plus any optional model tuning parameters.
* Tools – a list of functions or APIs the LLM can invoke to accomplish a task.

Basic Agent definition

```javascript
import { Agent } from '@openai/agents';

const agent = new Agent({
    name: 'Haiku Agent',
    instructions: 'Always respond in haiku form.',
    model: 'gpt-5-nano', // optional – falls back to the default model
});
```

The rest of this page walks through every Agent feature in more detail.

### [Cloning / Copying agents](https://openai.github.io/openai-agents-js/guides/agents/#cloning-copying-agents)

Need a slightly modified version of an existing agent? Use the clone() method, which returns an entirely new Agent instance.

```javascript
import { Agent } from '@openai/agents';

const pirateAgent = new Agent({
    name: 'Pirate',
    instructions: 'Respond like a pirate – lots of “Arrr!”',
    model: 'gpt-5-mini',
});

const robotAgent = pirateAgent.clone({
    name: 'Robot',
    instructions: 'Respond like a robot – be precise and factual.',
});
```

### Forcing tool use

Supplying tools doesn’t guarantee the LLM will call one. You can force tool use with `modelSettings.tool_choice`:

1. `'auto'` (default) – the LLM decides whether to use a tool.
2. `'required'` – the LLM must call a tool (it can choose which one).
3. `'none'` – the LLM must not call a tool.
4. A specific tool name, e.g. `'calculator'` – the LLM must call that particular tool.

```javascript
import { Agent, tool } from '@openai/agents';
import { z } from 'zod';

const calculatorTool = tool({
  name: 'Calculator',
  description: 'Use this tool to answer questions about math problems.',
  parameters: z.object({ question: z.string() }),
  execute: async (input) => {
    throw new Error('TODO: implement this');
  },
});

const agent = new Agent({
  name: 'Strict tool user',
  instructions: 'Always answer using the calculator tool.',
  tools: [calculatorTool],
  modelSettings: { toolChoice: 'auto' },
});
```

### Preventing infinite loops

After a tool call the SDK automatically resets `tool_choice` back to `'auto'`. This prevents the model from entering an infinite loop where it repeatedly tries to call the tool. You can override this behavior via the `resetToolChoice` flag or by configuring `toolUseBehavior`:

* `'run_llm_again'` (default) – run the LLM again with the tool result.
* `'stop_on_first_tool'` – treat the first tool result as the final answer.
* `{ stopAtToolNames: ['my_tool'] }` – stop when any of the listed tools is called.
* `(context, toolResults) => ...` – custom function returning whether the run should finish.

```javascript
const agent = new Agent({
  ...,
  toolUseBehavior: 'stop_on_first_tool',
});
```

## [Basic configuration](https://openai.github.io/openai-agents-js/guides/agents/#basic-configuration)

## [Output types](https://openai.github.io/openai-agents-js/guides/agents/#output-types)
