
## Design Pattern

Here is an example:
```
payment = new PaymentProvider("stripe", config) 
payment.product.create(...)
```


#### Paddle Diagram

```mermaid
flowchart LR
  API([API])

  subgraph Catalog
    direction TB
    c1[Products] ~~~ c2[Prices] ~~~ c3[Discounts] ~~~ c4[Discount groups]
  end
  subgraph Customers
    direction TB
    u1[Customers] ~~~ u2[Addresses] ~~~ u3[Businesses] ~~~ u4[Payment methods] ~~~ u5[Customer portals]
  end
  subgraph Billing
    direction TB
    b1[Transactions] ~~~ b2[Subscriptions] ~~~ b3[Subscription history] ~~~ b4[Adjustments] ~~~ b5[Pricing preview]
  end
  subgraph Events
    direction TB
    e1[Events] ~~~ e2[Event types] ~~~ e3[Notifications] ~~~ e4[Notification settings] ~~~ e5[Notification logs]
  end
  subgraph Account
    direction TB
    a1[Account] ~~~ a2[Settings] ~~~ a3[Checkout domains] ~~~ a4[Verifications] ~~~ a5[API root]
  end
  subgraph Platform
    direction TB
    p1[Client-side tokens] ~~~ p2[Countries] ~~~ p3[Currencies] ~~~ p4[IP addresses]
  end
  subgraph Webhook simulator
    direction TB
    w1[Simulations] ~~~ w2[Simulation types] ~~~ w3[Simulation runs] ~~~ w4[Simulation run events]
  end
  subgraph Reporting
    direction TB
    r1[Reports] ~~~ r2[Metrics]
  end

  API --> Catalog & Customers & Billing & Events
  API --> Account & Platform & Webhook simulator & Reporting
```


#### Stripe Diagram

#### PayPal Diagram



