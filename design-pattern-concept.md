
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

  subgraph catalog [Catalog]
    direction TB
    c1[Products] ~~~ c2[Prices] ~~~ c3[Discounts] ~~~ c4[Discount groups]
  end
  subgraph customers [Customers]
    direction TB
    u1[Customers] ~~~ u2[Addresses] ~~~ u3[Businesses] ~~~ u4[Payment methods] ~~~ u5[Customer portals]
  end
  subgraph billing [Billing]
    direction TB
    b1[Transactions] ~~~ b2[Subscriptions] ~~~ b3[Subscription history] ~~~ b4[Adjustments] ~~~ b5[Pricing preview]
  end
  subgraph events [Events]
    direction TB
    e1[Events] ~~~ e2[Event types] ~~~ e3[Notifications] ~~~ e4[Notification settings] ~~~ e5[Notification logs]
  end
  subgraph account [Account]
    direction TB
    a1[Account] ~~~ a2[Settings] ~~~ a3[Checkout domains] ~~~ a4[Verifications] ~~~ a5[API root]
  end
  subgraph platform [Platform]
    direction TB
    p1[Client-side tokens] ~~~ p2[Countries] ~~~ p3[Currencies] ~~~ p4[IP addresses]
  end
  subgraph webhook [Webhook simulator]
    direction TB
    w1[Simulations] ~~~ w2[Simulation types] ~~~ w3[Simulation runs] ~~~ w4[Simulation run events]
  end
  subgraph reporting [Reporting]
    direction TB
    r1[Reports] ~~~ r2[Metrics]
  end

  API --> catalog & customers & billing & events
  API --> account & platform & webhook & reporting
```

#### Stripe Diagram

#### PayPal Diagram



