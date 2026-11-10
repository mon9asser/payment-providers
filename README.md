# Payment Gateway Providers

A TypeScript adapter layer for payment gateways. The codebase currently contains a Paddle scaffold and is structured so that each gateway exposes the same supported capabilities through a shared interface.

## Documentation

- [Adding a payment provider](docs/adding-a-provider.md) — the required structure, contracts, registration step, and provider template.
- [Design-pattern concept](design-pattern-concept.md) — gateway API inventories used when deciding which common capabilities to introduce.
