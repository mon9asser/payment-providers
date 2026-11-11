# Payment Gateway Providers

This project uses two main design patterns: Adapter Pattern and Factory Pattern.

This architecture makes the payment integration modular, reusable, and extensible. That allows new payment providers to be added without changing the application's core business logic.

## Architecture diagram (Class Diagram)

```mermaid
classDiagram
    class PaymentProvider {
        +init(provider, config) Providers
    }

    class Providers {
        <<interface>>
        +product ProductInterface
    }

    class ProductInterface {
        <<interface>>
        +create(data)
        +update(id, data)
        +delete(id)
        +get(id)
    }

    class Paddle {
        -config
        +product ProductInterface
        +constructor(config)
    }

    class PaddleProduct {
        +create(data)
        +update(id, data)
        +delete(id)
        +get(id)
    }

    class Stripe {
        -config
        +product ProductInterface
        +constructor(config)
    }

    class StripeProduct {
        +create(data)
        +update(id, data)
        +delete(id)
        +get(id)
    }

    PaymentProvider ..> Paddle : creates
    PaymentProvider ..> Stripe : creates

    Paddle ..|> Providers : implements
    Stripe ..|> Providers : implements

    Paddle --> ProductInterface : exposes
    Stripe --> ProductInterface : exposes

    PaddleProduct ..|> ProductInterface : implements
    StripeProduct ..|> ProductInterface : implements

    Paddle --> PaddleProduct : uses
    Stripe --> StripeProduct : uses
```

## Execution flow (Sequence Diagram)

```mermaid
sequenceDiagram
    participant App as Your Application
    participant Factory as PaymentProvider
    participant Paddle as Paddle Provider
    participant Product as Paddle Product
    participant API as Paddle API

    App->>Factory: init("paddle", config)
    Factory->>Paddle: new Paddle(config)
    Paddle->>Paddle: Initialize product module
    Paddle-->>Factory: Return Paddle instance
    Factory-->>App: Return Providers interface

    App->>Paddle: product.create(data)
    Paddle->>Product: create(data)
    Product->>API: Create product request
    API-->>Product: Product response
    Product-->>App: Return result
```

## Documentation

- [Adding a payment provider](docs/adding-a-provider.md) — the required structure, contracts, registration step, and provider template.
- [Design-pattern concept](design-pattern-concept.md) — gateway API inventories used when deciding which common capabilities to introduce.
