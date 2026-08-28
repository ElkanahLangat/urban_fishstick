// ============================================================================
// Nairobi Matatu Transit Dispatch Core
// Compatible with C++17 / C++20
// ============================================================================

#include <algorithm>
#include <atomic>
#include <chrono>
#include <cmath>
#include <functional>
#include <iomanip>
#include <iostream>
#include <limits>
#include <queue>
#include <string>
#include <unordered_map>
#include <utility>
#include <vector>
#include <cstdint>

struct StageNode
{
    std::string stage_id;
    std::string sheng_name;

    double lat;
    double lng;

    // 1.0 = normal traffic
    // 1.2 = 20% slower
    // 2.0 = 100% slower
    double jam_weight;
};

struct Edge
{
    std::string to_stage;
    double distance_km;
    double avg_speed_kmh;
};

struct RouteResult
{
    std::vector<std::string> path;
    double total_minutes;
    bool found;
};

class NairobiRouteGraph
{
private:

    std::unordered_map<
        std::string,
        std::vector<Edge>
    > adj_list;

    std::unordered_map<
        std::string,
        StageNode
    > stages;

    std::atomic<std::uint64_t>
        total_refunds_processed{0};

public:

    // ========================================================================
    // ADD STAGE
    // ========================================================================

    bool add_stage(const StageNode& node)
    {
        if (node.stage_id.empty())
        {
            std::cerr
                << "[ERROR] Stage ID cannot be empty.\n";

            return false;
        }

        if (node.jam_weight <= 0.0)
        {
            std::cerr
                << "[ERROR] Invalid jam weight for stage: "
                << node.stage_id << '\n';

            return false;
        }

        stages[node.stage_id] = node;

        // Create empty adjacency list for this stage.
        adj_list[node.stage_id];

        return true;
    }

    // ========================================================================
    // ADD ROAD
    // ========================================================================

    bool add_road(
        const std::string& u,
        const std::string& v,
        double distance_km,
        double speed_kmh)
    {
        // C++17-compatible lookup.
        if (stages.find(u) == stages.end())
        {
            std::cerr
                << "[ERROR] Stage does not exist: "
                << u << '\n';

            return false;
        }

        if (stages.find(v) == stages.end())
        {
            std::cerr
                << "[ERROR] Stage does not exist: "
                << v << '\n';

            return false;
        }

        if (distance_km <= 0.0)
        {
            std::cerr
                << "[ERROR] Distance must be greater than zero.\n";

            return false;
        }

        if (speed_kmh <= 0.0)
        {
            std::cerr
                << "[ERROR] Speed must be greater than zero.\n";

            return false;
        }

        // Bidirectional road.
        adj_list[u].push_back(
            {
                v,
                distance_km,
                speed_kmh
            }
        );

        adj_list[v].push_back(
            {
                u,
                distance_km,
                speed_kmh
            }
        );

        return true;
    }

    // ========================================================================
    // UPDATE TRAFFIC
    // ========================================================================

    bool update_jam_weight(
        const std::string& stage_id,
        double new_weight)
    {
        auto it = stages.find(stage_id);

        if (it == stages.end())
        {
            std::cerr
                << "[ERROR] Stage not found: "
                << stage_id << '\n';

            return false;
        }

        if (new_weight <= 0.0)
        {
            std::cerr
                << "[ERROR] Jam weight must be greater than zero.\n";

            return false;
        }

        it->second.jam_weight = new_weight;

        return true;
    }

private:

    // ========================================================================
    // CALCULATE TRAFFIC-ADJUSTED TRAVEL TIME
    // ========================================================================

    double calculate_edge_time(
        const Edge& edge) const
    {
        auto stage_it =
            stages.find(edge.to_stage);

        if (stage_it == stages.end())
        {
            return std::numeric_limits<double>::infinity();
        }

        const double congestion =
            stage_it->second.jam_weight;

        const double normal_time_minutes =
            (edge.distance_km /
             edge.avg_speed_kmh) * 60.0;

        return normal_time_minutes * congestion;
    }

public:

    // ========================================================================
    // COMPUTE OPTIMAL ROUTE
    //
    // This is Dijkstra's algorithm with traffic weighting.
    // ========================================================================

    RouteResult compute_optimal_route(
        const std::string& origin,
        const std::string& destination)
    {
        const auto start_clock =
            std::chrono::steady_clock::now();

        // --------------------------------------------------------------------
        // Check origin
        // --------------------------------------------------------------------

        if (stages.find(origin) == stages.end())
        {
            std::cerr
                << "[ERROR] Origin stage not found: "
                << origin << '\n';

            return {{}, 0.0, false};
        }

        // --------------------------------------------------------------------
        // Check destination
        // --------------------------------------------------------------------

        if (stages.find(destination) == stages.end())
        {
            std::cerr
                << "[ERROR] Destination stage not found: "
                << destination << '\n';

            return {{}, 0.0, false};
        }

        // --------------------------------------------------------------------
        // Origin == destination
        // --------------------------------------------------------------------

        if (origin == destination)
        {
            return {
                {origin},
                0.0,
                true
            };
        }

        // --------------------------------------------------------------------
        // Priority queue
        // --------------------------------------------------------------------

        typedef std::pair<
            double,
            std::string
        > QueueItem;

        std::priority_queue<
            QueueItem,
            std::vector<QueueItem>,
            std::greater<QueueItem>
        > pq;

        // --------------------------------------------------------------------
        // Minimum travel time
        // --------------------------------------------------------------------

        std::unordered_map<
            std::string,
            double
        > min_time;

        // --------------------------------------------------------------------
        // Parent map
        // --------------------------------------------------------------------

        std::unordered_map<
            std::string,
            std::string
        > parent;

        const double INF =
            std::numeric_limits<double>::infinity();

        // Initialize all stages.
        for (const auto& entry : stages)
        {
            min_time[entry.first] = INF;
        }

        // Origin takes zero minutes.
        min_time[origin] = 0.0;

        pq.push({
            0.0,
            origin
        });

        // ====================================================================
        // DIJKSTRA
        // ====================================================================

        while (!pq.empty())
        {
            QueueItem current =
                pq.top();

            pq.pop();

            double current_time =
                current.first;

            std::string current_stage =
                current.second;

            // Ignore outdated queue entry.
            if (current_time >
                min_time[current_stage])
            {
                continue;
            }

            // Destination reached.
            if (current_stage == destination)
            {
                break;
            }

            auto graph_it =
                adj_list.find(current_stage);

            if (graph_it == adj_list.end())
            {
                continue;
            }

            // Examine every connected road.
            for (const Edge& edge :
                 graph_it->second)
            {
                double edge_time =
                    calculate_edge_time(edge);

                // Requires <cmath>.
                if (!std::isfinite(edge_time))
                {
                    continue;
                }

                double new_time =
                    current_time + edge_time;

                if (new_time <
                    min_time[edge.to_stage])
                {
                    min_time[edge.to_stage] =
                        new_time;

                    parent[edge.to_stage] =
                        current_stage;

                    pq.push({
                        new_time,
                        edge.to_stage
                    });
                }
            }
        }

        // ====================================================================
        // CHECK WHETHER ROUTE EXISTS
        // ====================================================================

        if (!std::isfinite(
                min_time[destination]))
        {
            std::cerr
                << "[ROUTING] No route found from "
                << origin
                << " to "
                << destination
                << ".\n";

            return {
                {},
                0.0,
                false
            };
        }

        // ====================================================================
        // RECONSTRUCT ROUTE
        // ====================================================================

        std::vector<std::string> path;

        std::string current =
            destination;

        while (true)
        {
            path.push_back(current);

            if (current == origin)
            {
                break;
            }

            auto parent_it =
                parent.find(current);

            if (parent_it == parent.end())
            {
                std::cerr
                    << "[ERROR] Route reconstruction failed.\n";

                return {
                    {},
                    0.0,
                    false
                };
            }

            current =
                parent_it->second;
        }

        // Destination -> origin
        // becomes
        // Origin -> destination
        std::reverse(
            path.begin(),
            path.end()
        );

        // ====================================================================
        // PERFORMANCE
        // ====================================================================

        const auto end_clock =
            std::chrono::steady_clock::now();

        const double elapsed_us =
            std::chrono::duration<
                double,
                std::micro
            >(
                end_clock - start_clock
            ).count();

        // ====================================================================
        // DISPLAY ROUTE
        // ====================================================================

        std::cout
            << "\n========================================\n"
            << "       NAIROBI ROUTING ENGINE\n"
            << "========================================\n";

        std::cout
            << "Origin:      "
            << stages.at(origin).sheng_name
            << '\n';

        std::cout
            << "Destination: "
            << stages.at(destination).sheng_name
            << '\n';

        std::cout
            << "Travel time: "
            << std::fixed
            << std::setprecision(2)
            << min_time[destination]
            << " minutes\n";

        std::cout
            << "Engine time: "
            << std::setprecision(2)
            << elapsed_us
            << " microseconds\n";

        std::cout
            << "Route: ";

        for (std::size_t i = 0;
             i < path.size();
             ++i)
        {
            std::cout
                << stages.at(path[i]).sheng_name;

            if (i + 1 < path.size())
            {
                std::cout
                    << " -> ";
            }
        }

        std::cout
            << "\n";

        std::cout
            << "========================================\n";

        return {
            path,
            min_time[destination],
            true
        };
    }

    // ========================================================================
    // REFUND PROCESSOR
    // ========================================================================

    bool process_office_delay_refund(
        const std::string& booking_id,
        double fare_kes)
    {
        if (booking_id.empty())
        {
            std::cerr
                << "[REFUND ERROR] Booking ID cannot be empty.\n";

            return false;
        }

        if (fare_kes <= 0.0)
        {
            std::cerr
                << "[REFUND ERROR] Fare must be greater than zero.\n";

            return false;
        }

        // Atomic operation.
        std::uint64_t refund_number =
            total_refunds_processed.fetch_add(
                1,
                std::memory_order_relaxed
            ) + 1;

        std::cout
            << "\n========================================\n"
            << "          REFUND DISPATCH\n"
            << "========================================\n";

        std::cout
            << "Refund #: "
            << refund_number
            << '\n';

        std::cout
            << "Booking:  "
            << booking_id
            << '\n';

        std::cout
            << "Amount:   KES "
            << std::fixed
            << std::setprecision(2)
            << fare_kes
            << '\n';

        std::cout
            << "Status:   REFUND EXECUTED\n";

        std::cout
            << "Method:   M-Pesa\n";

        std::cout
            << "========================================\n";

        return true;
    }

    // ========================================================================
    // REFUND STATISTICS
    // ========================================================================

    std::uint64_t get_total_refunds() const
    {
        return total_refunds_processed.load(
            std::memory_order_relaxed
        );
    }
};

// ============================================================================
// MAIN
// ============================================================================

int main()
{
    NairobiRouteGraph nairobi;

    // ========================================================================
    // NAIROBI STAGES
    // ========================================================================

    nairobi.add_stage({
        "kencom",
        "Kencom CBD",
        -1.2858,
        36.8242,
        1.1
    });

    nairobi.add_stage({
        "westlands",
        "Westy Sarit",
        -1.2638,
        36.8028,
        1.3
    });

    nairobi.add_stage({
        "kikuyu",
        "Kikuyu Terminal",
        -1.2464,
        36.6631,
        1.0
    });

    // ========================================================================
    // ROADS
    // ========================================================================

    nairobi.add_road(
        "kencom",
        "westlands",
        4.2,
        45.0
    );

    nairobi.add_road(
        "westlands",
        "kikuyu",
        16.8,
        70.0
    );

    // ========================================================================
    // ROUTING
    // ========================================================================

    RouteResult result =
        nairobi.compute_optimal_route(
            "kencom",
            "kikuyu"
        );

    // ========================================================================
    // REFUND
    // ========================================================================

    if (result.found)
    {
        nairobi.process_office_delay_refund(
            "BKG-8891-KENCOM",
            70.0
        );
    }

    // ========================================================================
    // STATISTICS
    // ========================================================================

    std::cout
        << "\nTotal refunds processed: "
        << nairobi.get_total_refunds()
        << '\n';

    return 0;
}
