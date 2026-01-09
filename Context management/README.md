# [Context management](<https://openai.github.io/openai-agents-js/guides/context/>)

Context is an overloaded term. There are two main classes of context you might care about:

1. Local context that your code can access during a run: dependencies or data needed by tools, callbacks like `onHandoff`, and lifecycle hooks.
2. Agent/LLM context that the language model can see when generating a response.
