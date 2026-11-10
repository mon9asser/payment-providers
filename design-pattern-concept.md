
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

  API --> catalog[Catalog]
  API --> customers[Customers]
  API --> billing[Billing]
  API --> events[Events]
  API --> account[Account]
  API --> platform[Platform]
  API --> webhook[Webhook simulator]
  API --> reporting[Reporting]

  catalog --> c1[Products]
  catalog --> c2[Prices]
  catalog --> c3[Discounts]
  catalog --> c4[Discount groups]

  customers --> u1[Customers]
  customers --> u2[Addresses]
  customers --> u3[Businesses]
  customers --> u4[Payment methods]
  customers --> u5[Customer portals]

  billing --> b1[Transactions]
  billing --> b2[Subscriptions]
  billing --> b3[Subscription history]
  billing --> b4[Adjustments]
  billing --> b5[Pricing preview]

  events --> e1[Events]
  events --> e2[Event types]
  events --> e3[Notifications]
  events --> e4[Notification settings]
  events --> e5[Notification logs]

  account --> a1[Account]
  account --> a2[Settings]
  account --> a3[Checkout domains]
  account --> a4[Verifications]
  account --> a5[API root]

  platform --> p1[Client-side tokens]
  platform --> p2[Countries]
  platform --> p3[Currencies]
  platform --> p4[IP addresses]

  webhook --> w1[Simulations]
  webhook --> w2[Simulation types]
  webhook --> w3[Simulation runs]
  webhook --> w4[Simulation run events]

  reporting --> r1[Reports]
  reporting --> r2[Metrics]
```

#### Stripe Diagram
```mermaid
flowchart LR
  root([Stripe API])

  root --> core["Core Resources"]
  root --> pm["Payment Methods"]
  root --> catalog["Product Catalog"]
  root --> agentic["Agentic Commerce"]
  root --> checkout["Checkout"]
  root --> plinks["Payment Links"]
  root --> billing["Billing"]
  root --> capital["Capital"]
  root --> connect["Connect"]

  core --> co1["Accounts (v2)"]
  core --> co2["Account Links (v2)"]
  core --> co3["Account Tokens (v2)"]
  core --> co4["US Bank Accounts (v2)"]
  core --> co5["GB Bank Accounts (v2)"]
  core --> co6["Balances"]
  core --> co7["Balance Transactions"]
  core --> co8["Charges"]
  core --> co9["Customers"]
  core --> co10["Customer Sessions"]
  core --> co11["Disputes"]
  core --> co12["Events"]
  core --> co13["Events (v2)"]
  core --> co14["Event Destinations (v2)"]
  core --> co15["Files"]
  core --> co16["File Links"]
  core --> co17["Mandates"]
  core --> co18["Payment Intents"]
  core --> co19["Persons (v2)"]
  core --> co20["Person Tokens (v2)"]
  core --> co21["Setup Intents"]
  core --> co22["Setup Attempts"]
  core --> co23["3DS Authentications"]
  core --> co24["Payouts"]
  core --> co25["Refunds"]
  core --> co26["Confirmation Tokens"]
  core --> co27["Tokens"]
  core --> co28["Ephemeral Keys"]

  pm --> pm1["Payment Methods"]
  pm --> pm2["Payment Method Configurations"]
  pm --> pm3["Payment Method Domains"]
  pm --> pm4["Bank Accounts"]
  pm --> pm5["Cash Balances"]
  pm --> pm6["Cash Balance Transactions"]
  pm --> pm7["Cards"]
  pm --> pm8["Sources"]

  catalog --> pc1["Trial Offers"]

  agentic --> ag1["Shared Payment Issued Tokens"]
  agentic --> ag2["Shared Payment Granted Tokens"]

  checkout --> ck1["Checkout Sessions"]

  plinks --> pl1["Payment Links"]

  billing --> b1["Alerts"]
  billing --> b2["Credit Balance Summaries"]
  billing --> b3["Credit Balance Transactions"]
  billing --> b4["Credit Grants"]
  billing --> b5["Credit Notes"]
  billing --> b6["Customer Balance Transactions"]
  billing --> b7["Customer Portal Configurations"]
  billing --> b8["Customer Portal Sessions"]
  billing --> b9["Feedback Options"]
  billing --> b10["Invoices"]
  billing --> b11["Invoice Items"]
  billing --> b12["Invoice Line Items"]
  billing --> b13["Invoice Payments"]
  billing --> b14["Invoice Rendering Templates"]
  billing --> b15["Billing Meters"]
  billing --> b16["Billing Meter Events"]
  billing --> b17["Billing Meter Event Adjustments"]
  billing --> b18["Meter Event Adjustments (v2)"]
  billing --> b19["Meter Event Streams (v2)"]
  billing --> b20["Billing Meter Event Summaries"]
  billing --> b21["Meter Events (v2)"]
  billing --> b22["Plans"]
  billing --> b23["Quotes"]
  billing --> b24["Subscriptions"]
  billing --> b25["Subscription Items"]
  billing --> b26["Subscription Schedules"]
  billing --> b27["Tax IDs"]
  billing --> b28["Test Clocks"]

  capital --> cp1["Financing Offers"]
  capital --> cp2["Financing Summaries"]

  connect --> cn1["Accounts"]
  connect --> cn2["Login Links"]
  connect --> cn3["Account Links"]
  connect --> cn4["Account Sessions"]
  connect --> cn5["Application Fees"]
  connect --> cn6["Application Fee Refunds"]
  connect --> cn7["Capabilities"]
  connect --> cn8["Country Specs"]
  connect --> cn9["Balance Settings"]
  connect --> cn10["External Bank Accounts"]
  connect --> cn11["External Account Cards"]
  connect --> cn12["Persons"]
  connect --> cn13["Top-ups"]
  connect --> cn14["Transfers"]
  connect --> cn15["Transfer Reversals"]
  connect --> cn16["Secrets"]
  connect --> cn17["App Installs"]
```
#### PayPal Diagram



