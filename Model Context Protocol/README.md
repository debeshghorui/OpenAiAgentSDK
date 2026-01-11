# [Model Context Protocol (MCP)](https://openai.github.io/openai-agents-js/guides/mcp/)

The Model Context Protocol (MCP) is an open protocol that standardizes how applications provide tools and context to LLMs. From the MCP docs:

>MCP is an open protocol that standardizes how applications provide context to LLMs. Think of MCP like a USB-C port for AI applications. Just as USB-C provides a standardized way to connect your devices to various peripherals and accessories, MCP provides a standardized way to connect AI models to different data sources and tools.

There are three types of MCP servers this SDK supports:

1. Hosted MCP server tools – remote MCP servers used as tools by the OpenAI Responses API
2. Streamable HTTP MCP servers – local or remote servers that implement the Streamable HTTP transport
3. Stdio MCP servers – servers accessed via standard input/output (the simplest option)

Choose a server type based on your use‑case:

| What You Need                                                                    |  Recommended Option   |
| -------------------------------------------------------------------------------- | --------------------- |
| Call publicly accessible remote servers with default OpenAI responses models     | 1. Hosted MCP tools   |
| Use publicly accessible remote servers but have the tool calls triggered locally | 2. Streamable HTTP    |
| Use locally running Streamable HTTP servers                                      | 3. Streamable HTTP    |
| Use any Streamable HTTP servers with non-OpenAI-Responses models                 | 4. Streamable HTTP    |
| Work with local MCP servers that only support the standard-I/O protocol          | 5. Stdio              |
