# CraftCurio Data Flow Diagrams (DFD)

This document contains Mermaid.js definitions for Data Flow Diagrams ranging from Level 0 (Context) to Level 4 (Detailed Logic).

## Level 0: Context Diagram
High-level view of the system and its interaction with external entities.

```mermaid
graph TD
    %% Entities
    User[User / Visitor]
    Artisan[Artisan]
    Collector[Collector]
    Admin[Admin]
    PaymentGateway[Payment Gateway]

    %% System
    System((CraftCurio System))

    %% Relationships
    User -- "Search, Browse, Register" --> System
    System -- "Product Details, Search Results" --> User

    Artisan -- "Upload Products, Manage Stories" --> System
    System -- "Orders, Analytics" --> Artisan

    Collector -- "List Collectibles, Place Bids" --> System
    System -- "Auction Updates, Bid Status" --> Collector

    Admin -- "Verify Users, Approve Products" --> System
    System -- "Reports, Flagged Content" --> Admin

    System -- "Payment Request" --> PaymentGateway
    PaymentGateway -- "Transaction Status" --> System
```

## Level 1: System Overview
Breakdown of the main system processes.

```mermaid
graph TD
    %% Entities
    User[User]
    Admin[Admin]

    %% Processes
    P1((1.0 Authentication))
    P2((2.0 Product Mgmt))
    P3((3.0 Auction Engine))
    P4((4.0 Order Processing))
    P5((5.0 Messaging))

    %% Data Stores
    D1[(User DB)]
    D2[(Product DB)]
    D3[(Order DB)]
    D4[(Message DB)]

    %% Flows
    User -->|Login/Register| P1
    P1 <--> D1
    P1 -->|Session Token| User

    User -->|Upload/Edit Item| P2
    P2 <--> D2
    Admin -->|Approve/Reject| P2

    User -->|Place Bid| P3
    P3 <--> D2
    P3 -->|Bid Update| User

    User -->|Checkout| P4
    P4 <--> D3
    P4 -->|Update Stock| D2

    User -->|Send Message| P5
    P5 <--> D4
    P5 -->|Notify| User
```

## Level 2: Auction Engine Breakdown
Detailed view of Process 3.0 (Auction Engine).

```mermaid
graph TD
    %% Entities
    Collector[Collector / Bidder]
    
    %% Sub-Processes
    P3_1((3.1 Create Auction))
    P3_2((3.2 Process Bid))
    P3_3((3.3 Timer / Monitor))
    P3_4((3.4 Finalize Auction))

    %% Data Stores
    D_Collectibles[(Collectibles DB)]
    D_Bids[(Bid History)]

    %% Flows
    Collector -->|Define Start/End/Reserve| P3_1
    P3_1 -->|Save Listing| D_Collectibles

    Collector -->|Submit Bid Amount| P3_2
    P3_2 -->|Validate & Save| D_Bids
    P3_2 -->|Update Current Price| D_Collectibles
    
    P3_3 -.->|Check Time Expiry| D_Collectibles
    P3_3 -->|Trigger Close| P3_4

    P3_4 -->|Determine Winner| D_Bids
    P3_4 -->|Mark Sold/Unsold| D_Collectibles
    P3_4 -->|Notify Winner| Collector
```

## Level 3: Process Bid Logic
Detailed view of Process 3.2 (Process Bid).

```mermaid
graph TD
    %% Input
    Input[Incoming Bid Request]

    %% Sub-Processes
    P3_2_1((3.2.1 Validate Session))
    P3_2_2((3.2.2 Check Auction Status))
    P3_2_3((3.2.3 Validate Bid Amount))
    P3_2_4((3.2.4 Persist Bid))
    P3_2_5((3.2.5 Broadcast Update))

    %% Data Stores
    D_User[(User DB)]
    D_Item[(Collectible DB)]

    %% Flows
    Input --> P3_2_1
    P3_2_1 <--> D_User
    P3_2_1 -->|Valid| P3_2_2
    P3_2_1 -->|Invalid| Error[Return Error]

    P3_2_2 <-->|Get Start/End Time| D_Item
    P3_2_2 -->|Active| P3_2_3
    P3_2_2 -->|Ended/Not Started| Error

    P3_2_3 <-->|Get Current Bid + Increment| D_Item
    P3_2_3 -->|High Enough| P3_2_4
    P3_2_3 -->|Too Low| Error

    P3_2_4 -->|Save Bid| D_Item
    P3_2_4 --> P3_2_5

    P3_2_5 -->|Socket.io Emit| Output[Update All Clients]
```

## Level 4: Validate Bid Amount Logic
Granular logic view of Process 3.2.3 (Validate Bid Amount).

```mermaid
flowchart TD
    Start([Start Validation])
    
    Input[/Input: Proposed Amount, Current Bid, Min Increment, Wallet Balance/]

    Check1{Proposed > Current Bid?}
    Check2{Proposed >= Current + Increment?}
    Check3{User != Item Owner?}
    
    ResultYes([Valid Bid])
    ResultNo([Invalid Bid])

    Start --> Input
    Input --> Check1
    
    Check1 -- No --> ResultNo
    Check1 -- Yes --> Check2
    
    Check2 -- No --> ResultNo
    Check2 -- Yes --> Check3
    
    Check3 -- No --> ResultNo
    Check3 -- Yes --> ResultYes
```
