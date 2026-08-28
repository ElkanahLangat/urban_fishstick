Nganya Ride Nairobi

### Matatu Booking, Smart Routing & Live Transit Telemetry

**Nganya Ride Nairobi** is a Nairobi-focused smart matatu transit platform designed to explore how software, routing algorithms, real-time data, and automation can improve the everyday public transportation experience.

The project combines a web-based transit interface with a high-performance C++ routing core for traffic-aware route computation and transit dispatch.

🌐 **Live App:** https://urbanfishstick.vercel.app

---

## 🚀 Project Vision

Nairobi's matatu network moves millions of people, but passengers and operators can face challenges such as:

* Uncertain arrival times
* Traffic congestion
* Difficult route planning
* Limited visibility into vehicle movement
* Seat availability uncertainty
* Delays
* Manual refund processes
* Fragmented transit information

**Nganya Ride Nairobi** explores how modern software infrastructure could turn these challenges into a more intelligent, connected transit system.

The long-term vision is a platform where passengers, matatus, routes, stages, operators, and transit data can interact through one system.

---

## 🌍 Live Application

The current web application is available at:

**https://urbanfishstick.vercel.app**

The live application demonstrates the project's user-facing transit experience, while the C++ component provides the foundation for high-performance routing and dispatch logic.

---

# 🧠 Core Architecture

The project is being developed around several major components:

```text
                    NGANYA RIDE NAIROBI
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
       Web Application            Transit Engine
             │                           │
             │                           ▼
             │                    C++ Routing Core
             │                           │
             │              ┌────────────┴────────────┐
             │              │                         │
             ▼              ▼                         ▼
       Passenger UI     Route Planning          Traffic Weighting
             │              │                         │
             └──────────────┼─────────────────────────┘
                            │
                            ▼
                     Transit Dispatch
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
          Booking System           Refund Engine
```

---

# ⚡ C++ Transit Routing Core

The C++ engine is designed for fast route computation across a graph representing Nairobi transit stages and roads.

Each stage contains information such as:

```cpp
struct StageNode
{
    std::string stage_id;
    std::string sheng_name;

    double lat;
    double lng;

    double jam_weight;
};
```

Each road connection contains:

```cpp
struct Edge
{
    std::string to_stage;
    double distance_km;
    double avg_speed_kmh;
};
```

This creates a graph such as:

```text
Kencom CBD
     │
     │ 4.2 km
     │
     ▼
Westy Sarit
     │
     │ 16.8 km
     │
     ▼
Kikuyu Terminal
```

---

# 🗺️ Traffic-Aware Routing

The routing engine calculates travel time using:

```text
Travel Time =
Distance / Average Speed × 60 × Traffic Weight
```

For example:

```text
Distance:       4.2 km
Average Speed:  45 km/h
Traffic Weight: 1.1

Normal Time:
4.2 / 45 × 60

Traffic Adjusted:
Normal Time × 1.1
```

This allows the route engine to represent changing traffic conditions.

A stage with:

```text
jam_weight = 1.0
```

represents relatively normal traffic.

A stage with:

```text
jam_weight = 1.5
```

represents significantly slower conditions.

---

# 🔎 Shortest-Path Algorithm

The current C++ implementation uses **Dijkstra's shortest-path algorithm with dynamic traffic weighting**.

The engine:

1. Receives an origin.
2. Receives a destination.
3. Examines connected stages.
4. Calculates traffic-adjusted travel times.
5. Compares possible routes.
6. Selects the lowest-cost route.
7. Reconstructs the route.
8. Reports the estimated travel time.

Example:

```text
Kencom CBD
     ↓
Westy Sarit
     ↓
Kikuyu Terminal
```

The project can later be upgraded to a true **A*** implementation using latitude/longitude as the geographic heuristic.

---

# 💳 Automated Refund Engine

The C++ core also contains an atomic refund counter for tracking processed refunds.

Example:

```cpp
nairobi.process_office_delay_refund(
    "BKG-8891-KENCOM",
    70.0
);
```

The system can represent an automated workflow:

```text
Passenger Booking
       │
       ▼
Transit Delay
       │
       ▼
Delay Detection
       │
       ▼
Refund Decision
       │
       ▼
Refund Processor
       │
       ▼
M-Pesa / Payment System
```

The current implementation is a **simulation/core prototype**. It does not itself perform a real M-Pesa transaction.

---

# 📍 Transit Stages

The current C++ demonstration includes stages such as:

| Stage ID    | Location        | Traffic Weight |
| ----------- | --------------- | -------------: |
| `kencom`    | Kencom CBD      |            1.1 |
| `westlands` | Westy Sarit     |            1.3 |
| `kikuyu`    | Kikuyu Terminal |            1.0 |

The graph can be expanded with additional Nairobi stages.

For example:

```text
Kencom
   │
   ├── Westlands
   │
   ├── Ngara
   │
   ├── Pangani
   │
   └── CBD
          │
          ├── Kikuyu
          ├── Rongai
          ├── Ngong
          └── Thika
```

---

# 🛠️ Technology Stack

## Frontend

* Web application
* JavaScript / TypeScript ecosystem
* Modern web UI
* Vercel deployment

## Transit Engine

* C++
* C++17/C++20-compatible implementation
* STL
* `unordered_map`
* `priority_queue`
* `vector`
* `atomic`
* `chrono`

## Algorithms

* Graph traversal
* Dijkstra shortest path
* Traffic-weighted routing
* Route reconstruction
* Atomic counters

## Future Technologies

Potential future integrations include:

* GPS telemetry
* WebSockets
* Redis
* PostgreSQL
* Map APIs
* Real-time traffic APIs
* M-Pesa APIs
* Vehicle tracking
* Event-driven dispatch
* Machine-learning traffic prediction

---

# 📁 Suggested Project Structure

```text
nganya-ride-nairobi/
│
├── README.md
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── transit-engine/
│   ├── Main.cpp
│   ├── NairobiRouteGraph.hpp
│   └── CMakeLists.txt
│
├── data/
│   ├── stages.json
│   ├── routes.json
│   └── vehicles.json
│
└── docs/
    ├── architecture.md
    └── routing.md
```

---

# ▶️ Running the C++ Routing Engine

Make sure a C++ compiler is installed.

### Compile

```bash
g++ -std=c++17 -Wall -Wextra -pedantic Main.cpp -o NairobiTransit
```

Or, with C++20:

```bash
g++ -std=c++20 -Wall -Wextra -pedantic Main.cpp -o NairobiTransit
```

### Run

macOS/Linux:

```bash
./NairobiTransit
```

Windows:

```powershell
.\NairobiTransit.exe
```

---

# 🧪 Example Output

```text
========================================
       NAIROBI ROUTING ENGINE
========================================

Origin:      Kencom CBD
Destination: Kikuyu Terminal

Travel time: 26.50 minutes

Route:
Kencom CBD -> Westy Sarit -> Kikuyu Terminal

========================================
          REFUND DISPATCH
========================================

Refund #: 1
Booking:  BKG-8891-KENCOM
Amount:   KES 70.00
Status:   REFUND EXECUTED
Method:   M-Pesa

Total refunds processed: 1
```

---

Roadmap

## Version 0.1 — Foundation

* [x] Nairobi transit web application
* [x] Transit stage model
* [x] Road graph
* [x] Traffic weighting
* [x] Shortest-path engine
* [x] Refund processor prototype
* [x] Live deployment

## Version 0.2 — Real-Time Transit

* [ ] Real vehicle locations
* [ ] GPS tracking
* [ ] Live stage updates
* [ ] Vehicle status
* [ ] Estimated arrival times
* [ ] Driver/vehicle dashboard

## Version 0.3 — Smart Dispatch

* [ ] Multiple matatus
* [ ] Vehicle capacity tracking
* [ ] Seat allocation
* [ ] Dynamic dispatch
* [ ] Driver assignment
* [ ] Route optimization

## Version 0.4 — Intelligent Traffic

* [ ] Live traffic data
* [ ] Automatic congestion updates
* [ ] A* routing
* [ ] Historical traffic analysis
* [ ] ETA prediction
* [ ] Machine-learning traffic prediction

## Version 0.5 — Payments

* [ ] Digital booking
* [ ] M-Pesa integration
* [ ] Automated payment confirmation
* [ ] Delay detection
* [ ] Automated refund workflow
* [ ] Transaction history

## Version 1.0 — Nairobi Transit Network

The long-term objective is to build a scalable transit coordination platform capable of connecting:

```text
Passengers
    │
    ▼
Bookings
    │
    ▼
Matatus
    │
    ▼
Drivers
    │
    ▼
Routes
    │
    ▼
Traffic Intelligence
    │
    ▼
Transit Dispatch
```

Important Disclaimer

This project is currently a **software prototype and research project**.
The routing engine's traffic data is simulated unless explicitly connected to a live traffic or telemetry provider.
The refund processor demonstrates application logic and does **not** automatically transfer real money.
Real-world deployment would require appropriate:

* Transport regulations
* Payment-provider integration
* Data protection measures
* Driver/operator verification
* Safety systems
* Cybersecurity
* Infrastructure testing
* Reliability engineering

Why This Project Matters

Nganya Ride Nairobi explores a simple question:

> **Can software make Nairobi's matatu transportation more predictable, connected, and intelligent?**

The project approaches public transportation as a distributed computing problem.
Thousands of vehicles can potentially become data points.
Thousands of stages can become nodes.
Roads can become graph edges.
Traffic can become dynamic weights.
Passenger bookings can become events.

And the entire network can become an intelligent transportation system.

---

# 👨‍💻 Development

This project is being developed as an independent technology project exploring:

* Computer Science
* C++
* Algorithms
* Artificial Intelligence
* Transportation technology
* Distributed systems
* Real-time systems
* Urban mobility

The project is intended to evolve from a prototype into a larger transportation technology experiment.

**License**

Add an appropriate open-source license before publishing the repository publicly.

Recommended options:

* MIT License — permissive and simple
* Apache 2.0 — includes additional patent protections
* GPL — requires derivative works to remain open source

---

## 🌐 Live Demo

_**Nganya Ride Nairobi**_

https://urbanfishstick.vercel.app

_> Building technology for the way Nairobi moves._
