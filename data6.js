// data6.js — System Design Part 2: Microservices, Messaging, Security, Observability
TOPICS.push(

{
  id: 'sd-microservices',
  emoji: '🧩',
  title: 'System Design: Microservices & Architecture',
  category: 'System Design',
  tags: [{ label: 'System Design', cls: 'ml' }],
  desc: 'Microservices split a monolith into independently deployable services. Understanding when to use them and how to design them is critical.',
  concepts: [
    { name: 'Monolith vs Microservices', desc: 'Monolith: single deployable unit. Simple to develop/debug/deploy initially. Scaling requires scaling entire app. Tightly coupled. Microservices: each service does one thing, independent deploy, own DB, own tech stack. Operationally complex. Start with monolith, extract services when pain points emerge.' },
    { name: 'Service Decomposition', desc: 'By business capability: OrderService, UserService, PaymentService. By subdomain (DDD): bounded contexts. By team (Conway\'s Law): services align with team boundaries. Rule: a service should be changeable without coordinating with other teams. Avoid too-fine-grained services (nanoservices).' },
    { name: 'API Gateway', desc: 'Single entry point for all clients. Handles: routing, auth, rate limiting, SSL termination, request aggregation, response transformation, caching. Examples: Kong, AWS API Gateway, Nginx. Prevents clients from knowing internal service topology. Can become bottleneck — keep it thin.' },
    { name: 'Service Discovery', desc: 'Services need to find each other dynamically (IPs change). Client-side: service queries registry (Eureka, Consul), picks instance, calls directly. Server-side: LB queries registry, routes for client (AWS ALB + ECS). Registry keeps healthy instances via heartbeat.' },
    { name: 'Inter-Service Communication', desc: 'Sync: REST/gRPC (direct call, immediate response). Async: message queue (fire and forget, decoupled). gRPC: Protocol Buffers, HTTP/2, strongly typed, faster than JSON REST. Use sync for user-facing real-time; async for background processing, notifications, data pipelines.' },
    { name: 'Circuit Breaker Pattern', desc: 'Prevent cascade failure. States: Closed (requests flow), Open (requests fail immediately without calling service), Half-Open (allow some through to test recovery). Threshold: open after N failures in window. Libraries: Netflix Hystrix, Resilience4j. Combine with timeout and retry.' },
    { name: 'Bulkhead Pattern', desc: 'Isolate failures — like bulkheads in a ship. Separate thread pools per downstream service. If one dependency hangs, only its thread pool exhausts, not entire app. Also: separate DB connection pools per service priority.' },
    { name: 'Strangler Fig Pattern', desc: 'Incrementally migrate monolith to microservices. Add a proxy in front. New features go to microservice. Gradually move old endpoints to microservice. Eventually strangle the monolith. Reduces migration risk vs big-bang rewrite.' },
    { name: 'Database per Service', desc: 'Each microservice owns its data — no shared DB. Enables independent deployment and scaling. Choose best DB type per service (user service: PostgreSQL, product catalog: Elasticsearch, session: Redis). Cross-service queries done via API calls or eventual consistency through events.' },
    { name: 'Distributed Tracing', desc: 'Track request as it flows through multiple services. Each request gets a trace ID, each service hop creates a span. Visualize latency, find bottlenecks. Tools: Jaeger, Zipkin, AWS X-Ray, OpenTelemetry (standard). Propagate trace context in HTTP headers.' },
  ],
  qa: [
    { q: 'When should you NOT use microservices?', a: 'Small team (< 10 engineers) — operational overhead outweighs benefits. Early-stage product — domain boundaries unknown, services will need to be restructured. Simple domain — no independent scaling needed. Microservices add: network latency, distributed tracing complexity, deployment orchestration, service discovery, distributed transactions. Start monolith, extract services when: specific part needs different scaling, different tech, separate team, or clear boundary.' },
    { q: 'How do you handle transactions across multiple microservices?', a: '1) Saga pattern — choreography (services react to events) or orchestration (central coordinator). Each step has compensating transaction for rollback. 2) Two-phase commit — works but blocks on coordinator failure. 3) Outbox pattern: write event to DB table in same transaction as domain update, separate process publishes events. 4) Try to design services with boundaries that avoid cross-service transactions.' },
    { q: 'What is the outbox pattern?', a: 'Guarantees event is published if DB write succeeds. In same DB transaction: 1) Update domain entity. 2) Insert event into outbox table. Separate process (or CDC like Debezium) reads outbox table and publishes to message broker. Deletes/marks events as processed. Solves dual-write problem: can\'t atomically write to DB AND publish to Kafka.' },
    { q: 'How does a circuit breaker prevent cascade failures?', a: 'Service A calls Service B. B is slow/down. Without circuit breaker: A\'s threads block waiting for B → A\'s thread pool exhausts → A fails → C (calling A) fails → cascade. With circuit breaker: after B fails N times, circuit opens. A immediately returns error without calling B. B gets time to recover. Circuit half-opens periodically to test recovery.' },
    { q: 'Design a notification service for a microservices system.', a: 'Event-driven: services publish events (OrderPlaced, PaymentFailed). NotificationService subscribes via Kafka. Routes to email/SMS/push based on user preferences. Idempotent: dedup by event ID. Rate limit per user. Retry with backoff for failed deliveries. Dead letter queue for permanently failed notifications. Track delivery status in DB. Support templates with personalization.' },
  ],
  tips: [
    'Service mesh (Istio, Linkerd) handles: mTLS, circuit breaking, observability — without code changes.',
    'Health endpoints: /health/live (is process up?) and /health/ready (is it ready to serve traffic?).',
    'Versioning APIs between services: URL versioning (/v1/) or content negotiation.',
    'gRPC is 5-10x faster than JSON REST for internal service communication.',
  ]
},

{
  id: 'sd-messaging',
  emoji: '📨',
  title: 'System Design: Message Queues & Event-Driven',
  category: 'System Design',
  tags: [{ label: 'System Design', cls: 'ml' }],
  desc: 'Async communication via message queues decouples services, enables scale, and handles traffic spikes gracefully.',
  concepts: [
    { name: 'Why Message Queues?', desc: 'Decoupling: producer does not need consumer to be available. Buffer: absorb traffic spikes (queue 1M orders, process at steady rate). Async: user does not wait for processing. Retry: failed messages can be retried. Fan-out: one message → multiple consumers. Load leveling: prevent downstream overload.' },
    { name: 'Kafka Architecture', desc: 'Distributed commit log. Topics divided into partitions. Each partition is an ordered, immutable sequence. Producers append to partition end. Consumers read at their own pace (offset-based). Retention: messages kept for configured time (default 7 days). Replication: each partition has leader + follower replicas.' },
    { name: 'Kafka vs RabbitMQ', desc: 'Kafka: high throughput (millions/sec), durable log, multiple consumers read independently, replay messages, stream processing. RabbitMQ: complex routing (exchanges, bindings), message acknowledgement, priority queues, lower throughput but more features. Kafka for event streaming/log; RabbitMQ for task queues.' },
    { name: 'Consumer Groups (Kafka)', desc: 'Multiple consumers in a group collectively consume a topic. Each partition assigned to one consumer in group. Parallelism limited by partition count. Different groups = independent consumption. Add consumers up to partition count for parallelism. Rebalance when consumers join/leave.' },
    { name: 'Dead Letter Queue (DLQ)', desc: 'Messages that fail processing after N retries go to DLQ. Allows: debugging failed messages without losing them, manual inspection, selective retry. Every queue should have a DLQ. Alert on DLQ depth growing.' },
    { name: 'Event Sourcing', desc: 'Store all changes as events (immutable log), not current state. Rebuild state by replaying events. Full audit trail. Can reconstruct state at any point in time. Enables temporal queries. Downside: complex, eventual consistency, large event store. Examples: banking ledger, Git history.' },
    { name: 'Competing Consumers Pattern', desc: 'Multiple instances of a consumer pulling from the same queue. Work distributed across instances. Each message processed by exactly one consumer (queue guarantees). Add consumers for scale. Queue provides natural load leveling. Used for: email sending, image processing, background jobs.' },
    { name: 'Pub/Sub vs Queue', desc: 'Queue: point-to-point, message consumed by one consumer, acknowledgement-based. Pub/Sub: broadcast, message delivered to all subscribers, no acknowledgement. Kafka topics are pub/sub with durable replay. RabbitMQ fanout exchange is pub/sub. SNS (AWS) = pub/sub; SQS = queue. Often combined: SNS → SQS.' },
    { name: 'Backpressure', desc: 'Consumer slower than producer → queue grows unbounded → OOM. Solutions: reject at producer (429), block producer, drop messages (lossy but bounded). Reactive streams: consumer signals capacity to producer. Kafka: consumer pull model naturally handles backpressure.' },
    { name: 'Message Ordering', desc: 'Queue: FIFO generally, not guaranteed. Kafka: ordering guaranteed within partition. To order all messages of a user: use user_id as partition key. All user events go to same partition → in order. Trade-off: one partition = one consumer = limited parallelism for that user.' },
  ],
  qa: [
    { q: 'How does Kafka guarantee message ordering?', a: 'Kafka guarantees ordering within a single partition only. Producer sends to a specific partition (based on key hash). All messages with the same key go to same partition — they are ordered. Across partitions, no ordering guarantee. Design: use order_id as key for order events, user_id for user events. Consumer processes partition sequentially.' },
    { q: 'What is the difference between a message queue and an event stream?', a: 'Message queue (RabbitMQ, SQS): message consumed and deleted. Point-to-point or pub/sub. Transient storage. Good for task distribution. Event stream (Kafka): messages retained as a log. Multiple consumers read independently. Replay from any offset. Temporal — represents what happened. Good for event sourcing, stream processing, audit logs.' },
    { q: 'How would you design a reliable email sending system?', a: 'User action triggers email event → publish to Kafka (ordered, durable). Email worker consumes event, sends via SMTP/SendGrid. On failure: retry with exponential backoff (1s, 2s, 4s, 8s). After 5 retries: dead letter queue + alert. Idempotency: dedup by event_id to prevent double-send. Rate limit per domain. Unsubscribe management. Track delivery via webhooks from email provider.' },
    { q: 'Explain the Saga choreography pattern vs orchestration.', a: 'Choreography: each service publishes events and reacts to others\' events. No central coordinator. Decoupled but hard to visualize flow. Example: OrderService publishes OrderCreated → PaymentService listens and charges → publishes PaymentSucceeded → InventoryService reserves → etc. Orchestration: central saga orchestrator tells each service what to do and listens for responses. Easier to understand, single point of failure risk.' },
  ],
  tips: [
    'Kafka partition count is a ceiling on consumer parallelism — you cannot add more consumers than partitions.',
    'Always serialize messages with schema (Avro + Schema Registry) — prevents incompatible changes from breaking consumers.',
    'Consumer offset commit: auto-commit risks duplicates; manual commit after processing ensures at-least-once.',
    'Monitor consumer lag (current offset vs latest offset) — growing lag = consumer falling behind.',
  ]
},

{
  id: 'sd-security',
  emoji: '🔒',
  title: 'System Design: Security & Auth',
  category: 'System Design',
  tags: [{ label: 'System Design', cls: 'ml' }],
  desc: 'Security must be designed in from the start — authentication, authorization, encryption, and protection against common attacks.',
  concepts: [
    { name: 'Authentication vs Authorization', desc: 'Authentication: who are you? (username+password, OAuth, biometrics). Authorization: what are you allowed to do? (RBAC, ABAC, ACL). Auth (authn) precedes authz. JWT contains claims for both. OAuth2 = authorization framework; OpenID Connect = authentication layer on top.' },
    { name: 'JWT (JSON Web Tokens)', desc: 'Header.Payload.Signature. Stateless — server verifies signature without DB lookup. Payload: user_id, roles, exp. Signed with secret (HMAC) or private key (RS256). Problem: cannot revoke before expiry. Solution: short expiry (15min) + refresh token (long-lived, stored in DB). Store in httpOnly cookie, not localStorage (XSS risk).' },
    { name: 'OAuth 2.0 Flow', desc: 'Authorization Code: user redirected to provider, gets auth code, exchanges for token (server-side, secure). Implicit: token directly (deprecated — insecure). Client Credentials: service-to-service (no user). Password: user gives credentials to your app (avoid). PKCE: Authorization Code + code verifier for SPAs/mobile.' },
    { name: 'HTTPS / TLS', desc: 'TLS 1.3: handshake in 1 RTT (vs 2 in TLS 1.2). Certificate: CA signs server\'s public key. Client verifies chain. Symmetric key for data (AES-256). Forward secrecy: compromise of server key doesn\'t decrypt past traffic. Certificate pinning: app only trusts specific cert.' },
    { name: 'RBAC & ABAC', desc: 'RBAC (Role-Based): user has roles, roles have permissions. Simple, widely used. ABAC (Attribute-Based): permissions based on user attributes, resource attributes, environment. More flexible. Policy: "manager can approve requests under $10K in their department during business hours".' },
    { name: 'SQL Injection Prevention', desc: 'Never concatenate user input into SQL. Use parameterized queries / prepared statements. ORMs parameterize by default. Input validation: whitelist, not blacklist. Least privilege DB user. WAF (Web Application Firewall) as extra layer. Stored procedures can also be vulnerable if they concat input.' },
    { name: 'XSS & CSRF', desc: 'XSS (Cross-Site Scripting): attacker injects script into page. Prevent: Content-Security-Policy header, escape all user output, httpOnly cookies, DOMPurify for rich text. CSRF (Cross-Site Request Forgery): forged request from another site. Prevent: CSRF token (synced with session), SameSite cookie attribute, check Origin/Referer header.' },
    { name: 'Encryption at Rest & in Transit', desc: 'In transit: TLS for all network traffic. At rest: AES-256 for DB, files. Key management: HSM (Hardware Security Module), AWS KMS, HashiCorp Vault. Field-level encryption for PII (encrypt before storing). Never store passwords — use bcrypt/Argon2 (adaptive hash with salt).' },
    { name: 'Secrets Management', desc: 'Never hardcode secrets. Use: environment variables (basic), secrets manager (AWS Secrets Manager, HashiCorp Vault), Kubernetes Secrets (base64, not encrypted by default — use Sealed Secrets or ESO). Rotate secrets regularly. Audit access. Dynamic secrets: Vault generates short-lived DB credentials per request.' },
    { name: 'Defense in Depth', desc: 'Multiple security layers — if one fails, others compensate. Network (firewall, VPC, private subnets), Transport (TLS), Application (input validation, auth), Data (encryption, backups), Monitoring (intrusion detection, anomaly detection). Assume breach mentality.' },
  ],
  qa: [
    { q: 'How would you secure a REST API?', a: '1) Authentication: JWT or OAuth2 bearer token. 2) Authorization: RBAC, check permissions per endpoint. 3) HTTPS only, redirect HTTP → HTTPS. 4) Rate limiting per user/IP. 5) Input validation and sanitization. 6) CORS: whitelist allowed origins. 7) Security headers: CSP, HSTS, X-Frame-Options. 8) API versioning to deprecate vulnerable endpoints. 9) Audit logging. 10) Dependency scanning (Dependabot, Snyk).' },
    { q: 'What is the difference between symmetric and asymmetric encryption?', a: 'Symmetric: same key for encryption and decryption. Fast. Used for bulk data (AES-256). Problem: how to securely share the key? Asymmetric: public key encrypts, private key decrypts (or vice versa for signing). Slow. Used for key exchange (TLS handshake) and digital signatures (JWT RS256). TLS uses asymmetric for key exchange, then switches to symmetric for speed.' },
    { q: 'How do you handle password storage securely?', a: 'Never store plaintext or reversible encryption. Use adaptive hash: bcrypt (cost factor 10-12), Argon2id (preferred — memory-hard, resists GPU attacks), scrypt. Each password gets unique random salt (prevents rainbow tables). On login: hash entered password with stored salt, compare hashes. bcrypt automatically handles salt. Rehash on login if cost factor outdated.' },
    { q: 'What is SSRF and how do you prevent it?', a: 'Server-Side Request Forgery: attacker tricks server into making requests to internal services. Example: URL parameter "http://169.254.169.254/latest/meta-data/" (AWS metadata). Prevention: validate/whitelist URLs, block private IP ranges (10.x, 172.16.x, 192.168.x, 169.254.x), use allowlist for external domains, run services with least-privilege network access.' },
  ],
  tips: [
    'OWASP Top 10 is your security interview cheat sheet — know all 10 vulnerabilities.',
    'Rotate JWT signing keys periodically — support multiple valid keys during rotation period.',
    'Use security.txt file at /.well-known/security.txt to document vulnerability disclosure policy.',
    'Penetration test your own APIs with OWASP ZAP or Burp Suite before interview — shows initiative.',
  ]
},

{
  id: 'sd-observability',
  emoji: '🔭',
  title: 'System Design: Observability',
  category: 'System Design',
  tags: [{ label: 'System Design', cls: 'ml' }],
  desc: 'You cannot fix what you cannot see. The three pillars of observability — metrics, logs, traces — are essential in any production system design.',
  concepts: [
    { name: 'Three Pillars of Observability', desc: 'Metrics: numeric measurements over time (request rate, latency percentiles, error rate, CPU usage). Logs: timestamped records of events. Traces: request flow across services. Together they answer: Is the system healthy? What happened? Why did it happen? Where is the bottleneck?' },
    { name: 'The Four Golden Signals', desc: 'Google SRE defined: 1) Latency — how long requests take (separate successful vs error). 2) Traffic — requests per second. 3) Errors — error rate (% 5xx, exception count). 4) Saturation — how full the system is (CPU%, queue depth, disk usage). Monitor all four; alert on meaningful thresholds.' },
    { name: 'SLI, SLO, SLA', desc: 'SLI (Service Level Indicator): actual measured metric (e.g., 99.5% requests < 200ms). SLO (Service Level Objective): target (e.g., 99.9% availability over 30 days). SLA (Service Level Agreement): contractual commitment with penalties. Error budget: 100% - SLO = allowed downtime. Burn error budget too fast → freeze releases.' },
    { name: 'Prometheus & Grafana', desc: 'Prometheus: pull-based metrics. Scrapes /metrics endpoints. PromQL for queries. Alertmanager for alerts. Grafana: dashboards, visualization. Common exporters: node_exporter (system), postgres_exporter, custom app metrics (Counter, Gauge, Histogram, Summary).' },
    { name: 'Structured Logging', desc: 'Log as JSON: { level, timestamp, traceId, message, userId, latencyMs }. Enables filtering and aggregation. Log levels: DEBUG (dev), INFO (business events), WARN (unexpected but recoverable), ERROR (needs attention), FATAL (crash). ELK Stack (Elasticsearch + Logstash + Kibana) or Grafana Loki for log aggregation.' },
    { name: 'Distributed Tracing', desc: 'Trace ID generated at entry point, propagated via headers (B3, W3C TraceContext). Each service creates spans with timings. Visualize waterfall of service calls. Find where latency comes from. OpenTelemetry (OTel) is the standard — instrument once, export to Jaeger/Tempo/DataDog.' },
    { name: 'Alerting Best Practices', desc: 'Alert on symptoms (user impact), not causes (CPU high). Page on: SLO breach imminent, error budget burning fast, complete outage. Alert fatigue: too many alerts → engineers ignore them → missed real incidents. Every alert should have a runbook. Use multi-window, multi-burn-rate alerts.' },
    { name: 'Health Checks', desc: '/health/live (liveness): process is alive, return 200. /health/ready (readiness): can serve traffic (DB connected, cache warm). Kubernetes uses both. Liveness failure → restart pod. Readiness failure → remove from LB. Startup probe for slow-starting apps.' },
  ],
  qa: [
    { q: 'How would you debug a latency spike in production?', a: '1) Check dashboards: which service has high latency? What changed? (deploy, traffic spike). 2) Check error rate — is it latency or errors? 3) Distributed traces: find which span is slow. 4) Check resource saturation: CPU, memory, DB connections. 5) Check DB slow query log. 6) Check dependencies: is downstream slow? 7) Correlate with deployments, config changes. 8) Check logs for exceptions or unusual patterns.' },
    { q: 'What is the difference between p50, p95, p99 latency?', a: 'p50 (median): 50% of requests faster than this. Not a great metric — hides tail latency. p95: 95% of requests faster — represents most users\' experience. p99: 99% faster — shows worst cases (10ms p99 means 1% of users wait >10ms). p99.9: extreme tail. Always monitor p95/p99 — averages hide outliers that real users experience.' },
    { q: 'How do you set up alerting for a production API?', a: 'Define SLOs first: 99.9% availability, p99 latency < 500ms, error rate < 0.1%. Alert on: error rate > 1% for 5min (page), p99 latency > 1s for 5min (page), availability < 99.5% (page). Info alerts: disk > 80%, CPU > 90% for 15min. Runbook for each alert. Test alerts regularly with chaos engineering.' },
  ],
  tips: [
    'Instrument applications with OpenTelemetry from day one — standard SDK, swap backends later.',
    'Log correlation: always include traceId and userId in every log line.',
    'Cardinality in metrics: never use user_id as a label — millions of series will crash Prometheus.',
    'Synthetic monitoring: scheduled checks from external locations simulate user experience even when no real traffic.',
  ]
},

{
  id: 'sd-realtime',
  emoji: '⚡',
  title: 'System Design: Real-Time & High Availability',
  category: 'System Design',
  tags: [{ label: 'System Design', cls: 'ml' }],
  desc: 'Designing for real-time communication, fault tolerance, and high availability — critical patterns for production systems.',
  concepts: [
    { name: 'WebSockets vs Long Polling vs SSE', desc: 'Long Polling: client requests, server holds response until data available, client immediately re-requests. High overhead. HTTP/1.1 only. SSE (Server-Sent Events): one-way server→client push over HTTP. Simple, auto-reconnect. No binary. WebSocket: full-duplex, persistent TCP. Best for two-way real-time. Use: SSE for notifications/feeds, WebSocket for chat/gaming/collaboration.' },
    { name: 'Fault Tolerance', desc: 'System continues operating when components fail. Techniques: redundancy (N+1 servers), replication (data on multiple nodes), failover (automatic switch to backup), retry with backoff, circuit breaker, bulkhead. Design for partial failure — isolate failures so they don\'t cascade.' },
    { name: 'High Availability (HA)', desc: 'Uptime percentage: 99% = 87.6h downtime/year. 99.9% (three-nines) = 8.76h. 99.99% = 52min. 99.999% (five-nines) = 5min. Achieve via: eliminate single points of failure, redundancy at every layer, automatic failover, multi-AZ/region. Maintenance windows count as downtime.' },
    { name: 'Disaster Recovery', desc: 'RTO (Recovery Time Objective): how quickly must system recover? RPO (Recovery Point Objective): how much data loss is acceptable? Strategies: Backup & Restore (slow, cheap), Pilot Light (minimal running infra), Warm Standby (scaled-down running copy), Multi-Site Active-Active (near-zero RTO/RPO, expensive).' },
    { name: 'Consistent Hashing', desc: 'Map nodes and keys to a ring (0 to 2^32). Key belongs to first node clockwise. Add/remove node: only adjacent keys remapped (not all). Virtual nodes: each physical node has multiple points on ring → better distribution. Used in: Cassandra, Dynamo, Memcached, CDN edge selection.' },
    { name: 'Data Replication Strategies', desc: 'Synchronous: write to all replicas before acknowledging. No data loss but high latency. Asynchronous: acknowledge after primary write, replicate in background. Low latency but potential data loss. Semi-synchronous: wait for at least one replica (MySQL semi-sync). Quorum: wait for majority (Cassandra write quorum).' },
    { name: 'Graceful Degradation', desc: 'System continues with reduced functionality when component fails. Example: recommendation engine down → show popular items. Payment service slow → queue payment, process later. Feature flags to disable non-critical features under load. Better than complete failure.' },
    { name: 'Chaos Engineering', desc: 'Deliberately inject failures in production to find weaknesses. Netflix Chaos Monkey: randomly terminates EC2 instances. Practice: kill random pods, introduce network latency, fill disk. Build confidence in system resilience. GameDay: scheduled chaos exercises with team ready.' },
  ],
  qa: [
    { q: 'How would you design a chat system (like WhatsApp)?', a: 'WebSocket connections per user. Connection manager maps user_id → WebSocket server. When A sends to B: find B\'s server via Redis hash, forward message. Message stored in Cassandra (append-heavy, time-series). Delivery receipt: ACK from recipient. Offline: push notification + store in message queue. Groups: fan-out to all members. E2E encryption: keys exchanged on device registration. Media: upload to S3, send URL.' },
    { q: 'How do you achieve zero-downtime deployments?', a: 'Blue-Green: maintain two identical environments, switch traffic at once. Instant rollback. Requires 2x resources. Canary: gradually route traffic (5% → 25% → 100%). Monitor error rate at each step. Rollback if metrics degrade. Rolling: update instances one at a time. Kubernetes: RollingUpdate strategy. Feature flags: deploy code, enable for subset of users.' },
    { q: 'Design a notification system for 100M users.', a: 'Event bus (Kafka): services publish events. Notification service consumes. User preferences DB (Redis): which channels each user wants. Priority queue: critical notifications bypass queue. Fan-out workers: parallelize sending to email/SMS/push. Push: FCM/APNs. Rate limit per user. Template engine for personalization. Delivery tracking. Unsubscribe management. DLQ for failures. Horizontal scale workers independently.' },
  ],
  tips: [
    'Avoid single points of failure: load balancer HA pair, multi-AZ DB, replicated cache.',
    'Health check your health check endpoint — if it goes down, LB removes all servers.',
    'Canary releases + feature flags give you fine-grained control over risk.',
    'RTO/RPO trade-off: lower both = more expensive. Match to business requirements (e-commerce vs blog).',
  ]
},

);
