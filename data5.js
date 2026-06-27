// data5.js — System Design Part 1
TOPICS.push(

{
  id: 'sd-scalability',
  emoji: '📈',
  title: 'System Design: Scalability & Load Balancing',
  category: 'System Design',
  tags: [{ label: 'System Design', cls: 'ml' }],
  desc: 'Scalability is the ability of a system to handle growing load. Every system design interview starts here.',
  concepts: [
    { name: 'Vertical Scaling (Scale Up)', desc: 'Add more CPU/RAM to existing machine. Simple but has hard limits. Single point of failure. Good for databases with ACID requirements. E.g., upgrade from 16GB to 64GB RAM.' },
    { name: 'Horizontal Scaling (Scale Out)', desc: 'Add more machines. Requires stateless services (no session on server). Needs load balancer. Theoretically unlimited. Used by Google, Amazon, Netflix.' },
    { name: 'Load Balancer', desc: 'Distributes incoming requests across multiple servers. Acts as single entry point. Provides health checks — removes unhealthy servers. Types: hardware (F5), software (Nginx, HAProxy), cloud (AWS ALB/ELB).' },
    { name: 'Load Balancing Algorithms', desc: 'Round Robin: requests distributed in order. Weighted Round Robin: servers with more capacity get more. Least Connections: route to server with fewest active connections. IP Hash: same client always hits same server (sticky sessions). Random.' },
    { name: 'Sticky Sessions', desc: 'Routes user to the same server for session consistency. Problem: uneven load distribution. Better solution: move session state to external store (Redis) so any server can handle any request.' },
    { name: 'Stateless vs Stateful Services', desc: 'Stateless: each request contains all needed info (JWT auth). Any server can handle it. Easy to scale. Stateful: server stores client state between requests. Hard to scale — needs session affinity or external state store.' },
    { name: 'Auto Scaling', desc: 'Automatically add/remove servers based on metrics (CPU, request count). Horizontal scaling triggered by load. AWS Auto Scaling Groups, Kubernetes HPA. Needs warm-up time — plan for traffic spikes.' },
    { name: 'Capacity Planning', desc: 'Estimate QPS (queries per second), storage, bandwidth. Back-of-envelope: Twitter = 150M DAU × 20 tweets/day = 3B tweets/day = ~35K reads/sec. Plan for 2-3x peak.' },
    { name: 'Bottleneck Identification', desc: 'Profile before optimizing. Common bottlenecks: DB queries (N+1, missing indexes), network I/O, CPU-bound computations, memory pressure. Use metrics: latency, throughput, error rate, saturation.' },
    { name: 'Geographic Distribution', desc: 'Multi-region deployment reduces latency for global users. Data sovereignty requirements. Active-active (all regions serve traffic) vs Active-passive (failover). DNS-based routing or anycast.' },
    { name: 'Rate Limiting', desc: 'Protects services from overload and abuse. Algorithms: Token Bucket (allows bursts), Leaky Bucket (smooth output), Fixed Window Counter, Sliding Window Log. Implement at API gateway. Return 429 Too Many Requests.' },
    { name: 'Thundering Herd Problem', desc: 'Many clients retry simultaneously after a failure, causing another failure. Solutions: exponential backoff with jitter, circuit breaker, cache stampede prevention (mutex/lock on cache miss).' },
  ],
  qa: [
    { q: 'How would you design a system to handle 10x traffic growth?', a: '1) Identify current bottleneck (DB, app server, network). 2) Add read replicas + caching layer (Redis) for DB. 3) Make app servers stateless, add load balancer, enable auto-scaling. 4) Add CDN for static assets. 5) Use message queues to decouple heavy processing. 6) Consider database sharding if write throughput is the bottleneck.' },
    { q: 'What is the difference between a reverse proxy and a load balancer?', a: 'A reverse proxy sits in front of servers and forwards requests — handles SSL termination, compression, caching, security. A load balancer is a type of reverse proxy that distributes requests across multiple backend servers. Nginx can act as both. AWS ALB is both. All load balancers are reverse proxies; not all reverse proxies do load balancing.' },
    { q: 'How does a load balancer know if a server is healthy?', a: 'Health checks: periodic HTTP/TCP requests to an endpoint (e.g., GET /health). If server fails N consecutive checks, it is removed from rotation. When it recovers, it is added back. AWS ELB health checks every 30s by default. Active health checks (LB polls) vs Passive (detect failures from real traffic errors).' },
    { q: 'What is the C10K problem?', a: 'The challenge of handling 10,000+ concurrent connections on a single server. Traditional thread-per-connection model fails — 10K threads × 1MB stack = 10GB RAM. Solutions: event-driven async I/O (Node.js, Nginx, epoll/kqueue). Nginx handles 50K+ concurrent connections on a single server.' },
    { q: 'Design a rate limiter for an API that allows 100 requests per minute per user.', a: 'Use sliding window counter in Redis. Key: "ratelimit:{userId}:{minute}". On each request: INCR key, set TTL to 60s if first request. If count > 100, return 429. For distributed systems, use Redis atomic INCR to avoid race conditions. Return headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset.' },
    { q: 'What is horizontal pod autoscaling in Kubernetes?', a: 'HPA automatically scales the number of pod replicas based on metrics like CPU utilization. Controller checks metrics every 15s. Scale-up is fast; scale-down is slower (5 min cooldown) to prevent flapping. Needs metrics-server. Works with custom metrics too (request latency via Prometheus).' },
  ],
  code: [
    {
      label: 'Token Bucket rate limiter (Node.js + Redis)',
      body: `<span class="kw">async function</span> <span class="fn">isAllowed</span>(userId, limit=<span class="num">100</span>, windowMs=<span class="num">60000</span>) {
  <span class="kw">const</span> key = <span class="str">\`rl:\${userId}:\${Math.floor(Date.now()/windowMs)}\`</span>;
  <span class="kw">const</span> [count] = <span class="kw">await</span> redis.<span class="fn">multi</span>()
    .<span class="fn">incr</span>(key)
    .<span class="fn">expire</span>(key, Math.<span class="fn">ceil</span>(windowMs/<span class="num">1000</span>))
    .<span class="fn">exec</span>();
  <span class="kw">return</span> count[<span class="num">1</span>] <= limit;
}

<span class="cm">// Express middleware</span>
app.<span class="fn">use</span>(<span class="kw">async</span>(req, res, next) => {
  <span class="kw">if</span> (!<span class="kw">await</span> <span class="fn">isAllowed</span>(req.user.id)) {
    <span class="kw">return</span> res.<span class="fn">status</span>(<span class="num">429</span>).<span class="fn">json</span>({ error: <span class="str">'Rate limit exceeded'</span> });
  }
  <span class="fn">next</span>();
});`
    }
  ],
  tips: [
    'Always ask "What is the read:write ratio?" in system design — it determines caching strategy.',
    'Stateless services are the key to horizontal scaling — push state to Redis/DB.',
    'Load balancer layer 4 (TCP) is faster; layer 7 (HTTP) is smarter (routes by path, header).',
    'Back-of-envelope math: 1 million req/day ≈ 12 req/sec. 1 billion req/day ≈ 12,000 req/sec.',
    'Rate limiting should be at the edge (API Gateway/CDN) not inside your service.',
  ]
},

{
  id: 'sd-caching',
  emoji: '⚡',
  title: 'System Design: Caching',
  category: 'System Design',
  tags: [{ label: 'System Design', cls: 'ml' }],
  desc: 'Caching is the #1 performance optimization. A cache hit avoids expensive DB/API calls. Understanding eviction policies, invalidation, and patterns is essential.',
  concepts: [
    { name: 'Cache-Aside (Lazy Loading)', desc: 'App checks cache first. On miss: fetch from DB, store in cache, return. Most common pattern. Cache only stores what is actually needed. Risk: stale data after DB update. Fix: short TTL or explicit invalidation.' },
    { name: 'Write-Through', desc: 'Every write goes to cache AND DB synchronously. Cache always in sync. Adds write latency. Good for frequently-read, infrequently-written data. Risk: cache fills with data that may never be read.' },
    { name: 'Write-Behind (Write-Back)', desc: 'Write to cache immediately, asynchronously persist to DB. Very fast writes. Risk: data loss if cache crashes before DB write. Good for high write throughput (analytics, logging).' },
    { name: 'Read-Through', desc: 'Cache sits in front of DB. On miss, cache fetches from DB itself (not the app). App only talks to cache. Simplifies app code. Cache provider handles miss logic.' },
    { name: 'Cache Eviction Policies', desc: 'LRU (Least Recently Used): evict item not used for longest time. LFU (Least Frequently Used): evict least accessed item. FIFO: evict oldest entry. TTL: expire after fixed time. Redis default is LRU. Choose based on access patterns.' },
    { name: 'Cache Stampede / Thundering Herd', desc: 'Hot cache key expires → many requests hit DB simultaneously. Solutions: 1) Mutex lock on cache miss (only one fetches). 2) Probabilistic early expiration (refresh before TTL). 3) Serve stale while refreshing asynchronously.' },
    { name: 'CDN (Content Delivery Network)', desc: 'Geographically distributed caches for static assets (images, JS, CSS, video). Users served from nearest PoP (Point of Presence). Reduces latency by 100s of ms. Examples: Cloudflare, AWS CloudFront, Akamai. Also provides DDoS protection.' },
    { name: 'Cache Invalidation Strategies', desc: 'TTL-based: auto-expire. Event-based: invalidate on write (publish event to cache layer). Versioned keys: "user:123:v2" — update version on change. Cache tags: group related keys, invalidate by tag. The hardest problem in CS.' },
    { name: 'Distributed Cache', desc: 'Multiple cache nodes for scale and HA. Redis Cluster: hash slots, data sharded across nodes. Memcached: simpler, multi-threaded. Consistent hashing determines which node holds a key. Replication for read scale.' },
    { name: 'Cache Warming', desc: 'Pre-populate cache before traffic hits. Cold cache = high DB load on startup. Strategies: preload on deploy, background job fills popular keys, gradual traffic ramp-up. Critical for flash sales / event launches.' },
  ],
  qa: [
    { q: 'What are the trade-offs between local (in-process) vs distributed (Redis) cache?', a: 'Local cache: zero network latency, no serialization, but data is per-instance (inconsistent with multiple servers), limited by single machine memory, lost on restart. Distributed (Redis): consistent across all servers, survives restarts (with persistence), network roundtrip (~1ms), requires serialization. Use local for static config/lookup data; Redis for shared session, computed results.' },
    { q: 'How do you handle cache invalidation in a distributed system?', a: '1) TTL: simplest — accept eventual staleness. 2) Publish invalidation events to message queue — all caches subscribe and delete the key. 3) Version in key — "user:123:v5" — increment version on write. 4) Two-phase invalidation: mark as stale, refresh asynchronously. No perfect solution — choose based on acceptable staleness.' },
    { q: 'Design a caching strategy for a social media feed (Twitter home timeline).', a: 'Pre-compute timelines and store in Redis list (fan-out on write). For celebrities (10M followers), use fan-out on read to avoid writing to 10M caches. Hybrid: fan-out on write for regular users, fan-out on read for celebrities. Cache TTL: 24h. On new tweet: append to Redis list for followers. On cache miss: hydrate from DB.' },
    { q: 'What is consistent hashing and why is it used in distributed caches?', a: 'Maps both cache nodes and keys to a circle (hash ring). Each key goes to the nearest node clockwise. When a node is added/removed, only keys on that segment are remapped — not all keys. Without it, adding 1 node to 10 would require remapping 90% of keys. Virtual nodes improve distribution.' },
    { q: 'How does Redis handle expiration and eviction?', a: 'Expiration: Redis uses lazy expiration (check on access) + active expiration (periodic scan of 20 random keys, expire if needed). Eviction: when maxmemory is reached, Redis uses the configured policy (allkeys-lru, volatile-lru, allkeys-random etc). noeviction returns errors when full — bad for caches, ok for queues.' },
  ],
  tips: [
    '"Cache everything you can compute" — but track hit rate. Below 80% hit rate, your cache strategy needs rethinking.',
    'Cache at multiple levels: CDN → API Gateway → Application → Database query cache.',
    'Never cache user-specific data without namespacing the key with the user ID.',
    'Redis OBJECT ENCODING command shows internal data structure — impacts memory significantly.',
    'Use SCAN not KEYS in production Redis — KEYS blocks the server.',
  ]
},

{
  id: 'sd-databases',
  emoji: '🗃️',
  title: 'System Design: Database Design',
  category: 'System Design',
  tags: [{ label: 'System Design', cls: 'ml' }],
  desc: 'Database design decisions — SQL vs NoSQL, sharding, replication, indexing — are the most consequential choices in system design.',
  concepts: [
    { name: 'SQL vs NoSQL Decision', desc: 'SQL: ACID, relations, complex queries, schema enforcement. Use for: financial data, inventory, user auth. NoSQL: flexible schema, horizontal scale, high write throughput. Use for: user profiles, product catalogs, logs, social graphs. Not either/or — use both (polyglot persistence).' },
    { name: 'Database Replication', desc: 'Master-Replica (Primary-Secondary): all writes to primary, reads distributed to replicas. Async replication = eventual consistency. Sync replication = higher latency but no data loss. Multi-Primary: multiple write nodes, conflict resolution needed. Used for read scale and HA.' },
    { name: 'Database Sharding (Horizontal Partitioning)', desc: 'Split data across multiple DB instances. Each shard holds a subset. Shard key determines which shard. By range (user_id 0-1M on shard1), by hash (consistent hashing), by directory (lookup table). Fixes write bottleneck. Downside: cross-shard queries, resharding is painful.' },
    { name: 'Vertical Partitioning', desc: 'Split table columns across different tables/DBs. Put frequently accessed columns together (hot/cold split). User table: user_id + name + email in one DB; user_preferences + settings in another. Reduces row size, improves cache hit rate.' },
    { name: 'Database Indexes', desc: 'B-tree index: balanced, O(log n), good for range queries. Hash index: O(1) exact match, no range queries. Composite index: multiple columns — order matters (leftmost prefix rule). Covering index: all needed columns in index, no table lookup. Partial index: index subset of rows.' },
    { name: 'ACID Properties', desc: 'Atomicity: all or nothing. Consistency: DB always in valid state. Isolation: concurrent transactions don\'t interfere. Durability: committed data persists. Isolation levels: Read Uncommitted → Read Committed → Repeatable Read → Serializable. Higher = safer but slower.' },
    { name: 'Database Connection Pooling', desc: 'Opening a new DB connection takes 20-100ms. Pool maintains a set of open connections (e.g. 10-50). Requests borrow and return connections. PgBouncer for PostgreSQL, HikariCP for Java. Pool exhaustion = requests queue or fail.' },
    { name: 'Read Replicas Pattern', desc: 'Route all reads to replica, writes to primary. App must tolerate replication lag (typically <1s). Not suitable for: read-after-write consistency (read your own writes), financial transactions. Use sync replication or read from primary for these.' },
    { name: 'CQRS Pattern', desc: 'Command Query Responsibility Segregation. Separate read model (optimized for queries) from write model (normalized, ACID). Write: update normalized DB. Read: denormalized view/materialized view or separate read DB. Complexity trade-off: enables independent scaling of reads/writes.' },
    { name: 'Database Federation', desc: 'Split databases by function/domain. Users DB, Products DB, Orders DB. Each can be independently scaled. Reduces load per DB. Cross-database joins become application-level joins. Better for microservices — each service owns its DB.' },
    { name: 'NewSQL', desc: 'ACID + horizontal scaling. CockroachDB, Google Spanner, TiDB. Distributed transactions using Paxos/Raft consensus. Global ACID transactions at scale. Spanner uses TrueTime API for globally consistent timestamps. Higher latency than NoSQL.' },
  ],
  qa: [
    { q: 'How would you decide whether to use SQL or NoSQL?', a: 'SQL if: need ACID transactions (payments, banking), complex relational queries, schema is well-defined. NoSQL if: need massive horizontal scale (MongoDB, Cassandra), flexible/evolving schema (document store), very high write throughput (time series, logs), graph relationships (Neo4j), key-value lookups (Redis, DynamoDB). Ask: What are the access patterns? How will data grow? What consistency is required?' },
    { q: 'How does database sharding work, and what are the challenges?', a: 'Sharding horizontally partitions data across multiple DB instances using a shard key. Challenges: 1) Choosing the right shard key (avoid hot spots — e.g., "created_at" causes all new data on one shard). 2) Cross-shard queries require scatter-gather. 3) Cross-shard transactions are hard. 4) Resharding when you add shards requires data migration. 5) Global unique IDs needed (Twitter Snowflake, UUID). Use consistent hashing to minimize resharding impact.' },
    { q: 'What is the N+1 query problem?', a: 'Fetching N records then making N additional queries (one per record). Example: fetch 100 posts, then for each post fetch the author — 101 queries. Fix: JOIN (SQL), eager loading (Mongoose .populate(), Prisma include), DataLoader (batching for GraphQL). Always check query count in logs — N+1 silently kills performance.' },
    { q: 'Explain the difference between optimistic and pessimistic locking.', a: 'Pessimistic: Lock row on read, other transactions wait. SELECT ... FOR UPDATE. Safe but causes contention and deadlocks. Good for high conflict scenarios. Optimistic: No lock. On update, check version number (WHERE version=5). If version changed, retry. Good for low-conflict scenarios. Used in JPA @Version, MongoDB findOneAndUpdate with conditions.' },
    { q: 'How do you prevent database hotspots when sharding?', a: 'Hash-based sharding distributes evenly. Avoid time-based shard keys (all new data on one shard). Choose high-cardinality, evenly distributed shard key (user_id is good; country is bad). Add salt to keys if needed. Monitor shard sizes and rebalance. Celeb problem (one user has 100M followers) — use separate "whale" shards.' },
  ],
  tips: [
    'Design for reads: most apps are read-heavy. Optimize read paths with indexes, caching, read replicas.',
    'Schema migrations are dangerous at scale — use online schema change tools (pt-online-schema-change, gh-ost).',
    'Never do SELECT * in production — transfers unused data, breaks on schema changes.',
    'Connection pool size ≈ CPU cores × 2 + disk spindles (Hikari formula). Bigger is not always better.',
    'Index cardinality matters — index on boolean column is nearly useless (only 2 values).',
  ]
},

{
  id: 'sd-distributed',
  emoji: '🌐',
  title: 'System Design: Distributed Systems & CAP',
  category: 'System Design',
  tags: [{ label: 'System Design', cls: 'ml' }],
  desc: 'Distributed systems fundamentals — CAP theorem, consistency models, consensus, and the hard problems of distributed computing.',
  concepts: [
    { name: 'CAP Theorem', desc: 'A distributed system can guarantee only 2 of 3: Consistency (all nodes see same data at same time), Availability (every request gets a response), Partition Tolerance (system continues during network partition). Since network partitions always happen, real choice is CP vs AP.' },
    { name: 'CP Systems', desc: 'Consistency + Partition Tolerance. During partition, refuse requests rather than serve stale data. Examples: HBase, Zookeeper, etcd, MongoDB (with w:majority). Good for: banking, inventory, anything requiring strong consistency.' },
    { name: 'AP Systems', desc: 'Availability + Partition Tolerance. During partition, continue serving (may return stale data). Eventually consistent. Examples: Cassandra, CouchDB, DynamoDB (default), DNS. Good for: social media, shopping carts, user sessions.' },
    { name: 'PACELC Theorem', desc: 'Extends CAP: Even when system is running normally (no partition), trade-off between Latency and Consistency. PA/EL (Dynamo) or PC/EC (HBase). Better model for real-world decisions.' },
    { name: 'Consistency Models', desc: 'Strong: read always returns latest write. Linearizability: operations appear instantaneous, globally ordered. Sequential: all nodes see same order of operations. Causal: causally related operations ordered. Eventual: all nodes converge eventually. Read-your-writes: you always see your own writes.' },
    { name: 'Consensus Algorithms', desc: 'Paxos: original consensus algorithm, hard to understand. Raft: simpler, used in etcd, CockroachDB, Consul. Leader election + log replication. Requires majority (quorum) = (N/2 + 1) nodes. ZAB: used in Zookeeper.' },
    { name: 'Vector Clocks', desc: 'Track causality in distributed systems. Each node maintains a clock. On event: increment own clock. On receive: take max of each component. Detect conflicting writes. Used in Dynamo/Riak for conflict detection.' },
    { name: 'Two-Phase Commit (2PC)', desc: 'Distributed transaction protocol. Phase 1 (Prepare): coordinator asks all participants to prepare. Phase 2 (Commit): if all say yes, commit; else abort. Problem: coordinator failure leaves participants blocked (blocking protocol). Used in distributed DBs.' },
    { name: 'Saga Pattern', desc: 'Manage distributed transactions without 2PC. Break transaction into sequence of local transactions, each publishing an event. On failure: compensating transactions roll back. Choreography (events) or Orchestration (central coordinator). Used in microservices.' },
    { name: 'Leader Election', desc: 'Choose one node to coordinate. Bully algorithm, Ring algorithm. Raft: node with most up-to-date log wins. Zookeeper ephemeral nodes for leader election. Leader is single point of failure — needs failover mechanism.' },
    { name: 'Idempotency', desc: 'Operation that can be applied multiple times with same result. Critical for retry logic in distributed systems. GET is idempotent; POST usually is not. Make POST idempotent with idempotency key (UUID in header). At-least-once delivery + idempotent consumer = exactly-once semantics.' },
    { name: 'Eventual Consistency', desc: 'All updates propagate to all nodes eventually if no new updates. Timing depends on network, replication lag. Conflict resolution: Last Write Wins (timestamp), Multi-Value (keep both, resolve on read), CRDTs (data structures designed to merge without conflict).' },
  ],
  qa: [
    { q: 'Explain the CAP theorem with an example.', a: 'Example: distributed bank. Network partition happens between nodes. CP system (e.g., Zookeeper): refuse reads/writes during partition to avoid inconsistency — bank goes down rather than serve wrong balance. AP system (e.g., Cassandra): continue serving — you might see stale balance but system stays up. DNS is AP — it serves cached (possibly stale) records during partition. Google Spanner is externally consistent — achieves near-CAP through TrueTime API.' },
    { q: 'How does Raft achieve distributed consensus?', a: 'Raft elects a leader who handles all client requests. Leader appends entries to its log and replicates to followers. Entry is committed when majority (quorum) acknowledges it. On leader failure, follower with most up-to-date log becomes new leader via election. Log matching property ensures all committed entries are identical across nodes.' },
    { q: 'What is the difference between at-most-once, at-least-once, and exactly-once delivery?', a: 'At-most-once: message sent once, may be lost (fire and forget). At-least-once: retry until acknowledged — may deliver duplicates. Requires idempotent consumers. Exactly-once: hardest — requires distributed transaction or idempotency key + deduplication. Kafka offers exactly-once with transactions + idempotent producer. Most systems use at-least-once + idempotent processing.' },
    { q: 'How would you detect and handle split-brain in a distributed system?', a: 'Split-brain: network partition causes two nodes to think they are both leader. Solutions: 1) Quorum (majority) — a partition with minority of nodes cannot elect a leader or serve writes. 2) Fencing tokens — each leader gets incrementing token, old leader\'s writes rejected. 3) STONITH (Shoot The Other Node In The Head) — power off suspected node. 4) Heartbeat + lease timeout.' },
  ],
  tips: [
    'In interviews, always clarify consistency requirements before designing — they drive all other decisions.',
    'Network partitions are not rare — cloud regions lose connectivity, NICs fail, firewalls misfire.',
    'Design for failure: assume any node can crash, any network call can fail or be delayed.',
    'Idempotency key pattern: client generates UUID, server stores it, duplicate requests return cached response.',
  ]
},

);
