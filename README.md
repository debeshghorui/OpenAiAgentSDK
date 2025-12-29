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

## [Basic configuration](https://openai.github.io/openai-agents-js/guides/agents/#basic-configuration)

## [Output types](https://openai.github.io/openai-agents-js/guides/agents/#output-types)
