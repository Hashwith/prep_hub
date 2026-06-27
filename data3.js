// data3.js — MongoDB, SQL, Redis, Python
TOPICS.push(

{
  id: 'mongodb',
  emoji: '🍃',
  title: 'MongoDB',
  category: 'Databases',
  tags: [{ label: 'Database', cls: 'db' }],
  desc: 'NoSQL document database used in your MERN projects. Schema-flexible JSON-like documents stored in collections.',
  concepts: [
    { name: 'Documents & Collections', desc: 'Documents are BSON objects (like JSON). Collections are groups of documents (like tables). No fixed schema — each doc can have different fields.' },
    { name: 'CRUD operations', desc: 'insertOne/insertMany, find/findOne (with filter), updateOne/updateMany ($set, $push, $pull), deleteOne/deleteMany.' },
    { name: 'Query Operators', desc: '$eq, $gt, $lt, $in, $nin, $and, $or, $not. Regex: { field: /pattern/i }. Projection: { field: 1 } to include, { field: 0 } to exclude.' },
    { name: 'Aggregation Pipeline', desc: 'Chain of stages: $match (filter), $group (group + aggregate), $sort, $limit, $skip, $lookup (join), $project (shape output), $unwind (flatten arrays).' },
    { name: 'Indexes', desc: 'db.collection.createIndex({ field: 1 }). Compound indexes, text indexes, TTL indexes (auto-delete). Without index: O(n) collection scan. EXPLAIN to analyse queries.' },
    { name: 'Mongoose (ODM)', desc: 'Schema definition, validation, middleware (pre/post hooks), virtuals, populate (references between collections). Model.find().populate(\'userId\').' },
  ],
  qa: [
    { q: 'When would you use MongoDB over a relational DB?', a: 'When data is document-oriented (nested objects), schema evolves frequently, horizontal scaling is needed, or you\'re storing unstructured/semi-structured data like logs, catalogs, user profiles.' },
    { q: 'What is the aggregation pipeline?', a: 'A framework for data transformation. Documents pass through a sequence of stages. Example: $match filters → $group sums → $sort orders → $limit paginates. More powerful and efficient than multiple queries.' },
    { q: 'How does MongoDB handle transactions?', a: 'Multi-document ACID transactions are supported since v4.0 (replica sets) and v4.2 (sharded clusters). Use session.startTransaction(), session.commitTransaction(). Single document ops are always atomic.' },
    { q: 'What is the difference between $lookup and embedding?', a: '$lookup performs a join across collections (like SQL JOIN). Embedding puts related data in the same document. Embed when data is accessed together and doesn\'t grow unbounded; reference when data is shared or large.' },
    { q: 'What indexes would you add to a users collection?', a: 'Unique index on email, index on createdAt for sorting, compound index on frequently filtered fields like { role: 1, status: 1 }. Use EXPLAIN() to verify index usage.' },
  ],
  code: [
    {
      label: 'Aggregation pipeline example',
      body: `<span class="cm">// Total sales per category, sorted descending</span>
db.orders.<span class="fn">aggregate</span>([
  { <span class="str">$match</span>: { status: <span class="str">'completed'</span> } },
  { <span class="str">$group</span>: {
      _id: <span class="str">'$category'</span>,
      total: { <span class="str">$sum</span>: <span class="str">'$amount'</span> },
      count: { <span class="str">$sum</span>: <span class="num">1</span> }
  }},
  { <span class="str">$sort</span>: { total: -<span class="num">1</span> } },
  { <span class="str">$limit</span>: <span class="num">5</span> }
]);

<span class="cm">// Mongoose — find with populate</span>
<span class="kw">const</span> orders = <span class="kw">await</span> Order
  .<span class="fn">find</span>({ userId: req.user.id })
  .<span class="fn">populate</span>(<span class="str">'userId'</span>, <span class="str">'name email'</span>)
  .<span class="fn">sort</span>({ createdAt: -<span class="num">1</span> })
  .<span class="fn">limit</span>(<span class="num">20</span>);`
    }
  ],
  tips: [
    'Design schema around query patterns — not around normalisation like in SQL.',
    'Use $explain() to check if queries hit an index. COLLSCAN = no index = slow.',
    'TTL indexes auto-delete documents after a set time — useful for sessions, OTPs, logs.',
    'Mongoose pre-save hooks are great for hashing passwords or setting defaults.',
  ]
},

{
  id: 'sql',
  emoji: '🗄️',
  title: 'SQL & Databases',
  category: 'Databases',
  tags: [{ label: 'Database', cls: 'db' }],
  desc: 'Relational databases with ACID transactions. SQL is mandatory for any backend role — know JOINs, indexes, and query optimisation.',
  concepts: [
    { name: 'SELECT & Filtering', desc: 'SELECT cols FROM table WHERE condition ORDER BY col LIMIT n OFFSET m. Aliases: AS. Wildcards: LIKE \'%pattern%\'.' },
    { name: 'JOINs', desc: 'INNER JOIN: matching rows in both. LEFT JOIN: all from left + matching right (NULLs for no match). RIGHT JOIN: opposite. FULL OUTER: all rows from both. CROSS JOIN: cartesian product.' },
    { name: 'Aggregates & GROUP BY', desc: 'COUNT, SUM, AVG, MIN, MAX. GROUP BY groups rows. HAVING filters groups (like WHERE but post-aggregation). SELECT dept, COUNT(*) FROM emp GROUP BY dept HAVING COUNT(*) > 5.' },
    { name: 'Indexes', desc: 'B-tree index speeds up SELECT/WHERE. Clustered index: physical row order (primary key). Non-clustered: separate structure. Composite index: column order matters for query matching.' },
    { name: 'Transactions & ACID', desc: 'Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent txns don\'t interfere), Durability (committed = persisted). BEGIN; ops; COMMIT; or ROLLBACK.' },
    { name: 'Normalisation', desc: '1NF: atomic values, no repeating groups. 2NF: no partial dependency on composite key. 3NF: no transitive dependency. Denormalise for read performance when needed.' },
  ],
  qa: [
    { q: 'What is the difference between WHERE and HAVING?', a: 'WHERE filters rows before aggregation. HAVING filters groups after GROUP BY. You can\'t use aggregate functions in WHERE — use HAVING for that.' },
    { q: 'What is a database index and when should you avoid it?', a: 'An index speeds up reads by creating a lookup structure. Avoid on: small tables (full scan is fine), columns with low cardinality (e.g. boolean), tables with heavy write load (indexes slow down INSERT/UPDATE/DELETE).' },
    { q: 'Explain the difference between DELETE, TRUNCATE, and DROP.', a: 'DELETE: removes specific rows, logged, can be rolled back, triggers fire. TRUNCATE: removes all rows, minimal logging, faster, resets auto-increment, can\'t be rolled back easily. DROP: removes the entire table structure.' },
    { q: 'What is a subquery vs a JOIN?', a: 'Subquery runs independently and passes result to the outer query. JOIN combines tables into one result set. JOINs are usually more efficient — the query planner can optimise them better.' },
    { q: 'What is SQL injection and how do you prevent it?', a: 'Attacker injects malicious SQL through user input. Prevent with: parameterised queries/prepared statements (never string concatenation), ORM usage, input validation, least privilege DB user.' },
  ],
  code: [
    {
      label: 'Common SQL patterns',
      body: `<span class="cm">-- JOIN with aggregation</span>
<span class="kw">SELECT</span> u.name, <span class="fn">COUNT</span>(o.id) <span class="kw">AS</span> order_count,
       <span class="fn">SUM</span>(o.total) <span class="kw">AS</span> revenue
<span class="kw">FROM</span> users u
<span class="kw">LEFT JOIN</span> orders o <span class="kw">ON</span> u.id = o.user_id
<span class="kw">GROUP BY</span> u.id, u.name
<span class="kw">HAVING</span> <span class="fn">COUNT</span>(o.id) > <span class="num">0</span>
<span class="kw">ORDER BY</span> revenue <span class="kw">DESC</span>
<span class="kw">LIMIT</span> <span class="num">10</span>;

<span class="cm">-- Window function (rank users by spend)</span>
<span class="kw">SELECT</span> name, total,
  <span class="fn">RANK</span>() <span class="kw">OVER</span> (<span class="kw">ORDER BY</span> total <span class="kw">DESC</span>) <span class="kw">AS</span> rank
<span class="kw">FROM</span> users;`
    }
  ],
  tips: [
    'Use EXPLAIN/EXPLAIN ANALYZE to see query execution plan and spot missing indexes.',
    'Composite index (a, b, c) helps queries on (a), (a,b), (a,b,c) — not on (b) alone.',
    'N+1 problem: fetching N records then querying for each → fix with JOIN or eager loading.',
    'Use connection pooling (pg-pool, HikariCP) — opening a new DB connection per request is expensive.',
  ]
},

{
  id: 'redis',
  emoji: '🔴',
  title: 'Redis',
  category: 'Databases',
  tags: [{ label: 'Database', cls: 'db' }],
  desc: 'In-memory data store used for caching and session management in your AI Customer Support project. Blazing fast — O(1) for most ops.',
  concepts: [
    { name: 'Data Structures', desc: 'String, List, Set, Sorted Set (ZSet), Hash, HyperLogLog, Streams. Each has specific commands. Use the right structure for the use case.' },
    { name: 'Expiry (TTL)', desc: 'SET key value EX 3600 (expire in 1h). EXPIRE key 60. PERSIST removes expiry. TTL key returns remaining seconds (-1 = no expiry, -2 = not found).' },
    { name: 'Caching Patterns', desc: 'Cache-aside: app checks cache, on miss fetches DB + stores in cache. Write-through: write to cache + DB simultaneously. Write-behind: write to cache, async write to DB.' },
    { name: 'Pub/Sub', desc: 'Publisher sends messages to channels. Subscribers receive. SUBSCRIBE channel, PUBLISH channel message. Used for real-time notifications. Not persistent — messages lost if no subscriber.' },
    { name: 'Sessions', desc: 'Store session data in Redis Hash. Expire after inactivity. Fast lookup by session ID. Used in your project for real-time agent sessions with Socket.IO.' },
    { name: 'Atomic Operations', desc: 'INCR/DECR are atomic — safe for counters without race conditions. MULTI/EXEC for transactions. Lua scripts for complex atomic operations.' },
  ],
  qa: [
    { q: 'Why use Redis instead of a regular database for caching?', a: 'Redis stores data in memory — microsecond latency vs milliseconds for disk-based DBs. Perfect for frequently read, rarely changed data (user sessions, API responses, computed results).' },
    { q: 'What is cache invalidation and why is it hard?', a: 'Deciding when to remove/update cached data when the source changes. Hard because: stale data can be served, invalidating too eagerly hurts performance. Strategies: TTL expiry, explicit invalidation on write, event-driven invalidation.' },
    { q: 'How did you use Redis in your AI Customer Support project?', a: 'Used Redis-backed sessions for Socket.IO connections — storing agent session state for low-latency, high-throughput concurrent connections in the real-time escalation pipeline.' },
    { q: 'What is the difference between Redis EXPIRE and TTL?', a: 'EXPIRE sets the expiry time on a key. TTL reads the remaining time. PEXPIRE/PTTL work in milliseconds. PERSIST removes the expiry making the key permanent.' },
  ],
  code: [
    {
      label: 'Redis caching pattern (Node.js)',
      body: `<span class="kw">const</span> redis = <span class="kw">require</span>(<span class="str">'redis'</span>);
<span class="kw">const</span> client = redis.<span class="fn">createClient</span>();

<span class="kw">async function</span> <span class="fn">getUser</span>(id) {
  <span class="kw">const</span> cacheKey = <span class="str">\`user:\${id}\`</span>;
  <span class="cm">// 1. Check cache</span>
  <span class="kw">const</span> cached = <span class="kw">await</span> client.<span class="fn">get</span>(cacheKey);
  <span class="kw">if</span> (cached) <span class="kw">return</span> <span class="cls">JSON</span>.<span class="fn">parse</span>(cached);

  <span class="cm">// 2. Cache miss — fetch from DB</span>
  <span class="kw">const</span> user = <span class="kw">await</span> db.<span class="fn">findUser</span>(id);

  <span class="cm">// 3. Store in cache with TTL</span>
  <span class="kw">await</span> client.<span class="fn">setEx</span>(cacheKey, <span class="num">3600</span>, <span class="cls">JSON</span>.<span class="fn">stringify</span>(user));
  <span class="kw">return</span> user;
}`
    }
  ],
  tips: [
    'Always set a TTL — unbounded cache growth will exhaust memory (Redis evicts with LRU by default).',
    'Use namespaced keys: "user:123", "session:abc" — easier to scan and bulk-delete.',
    'Redis is single-threaded for commands — no race conditions on individual commands.',
    'Redis persistence: RDB (snapshots) vs AOF (append-only log). AOF is safer for sessions.',
  ]
},

{
  id: 'python',
  emoji: '🐍',
  title: 'Python',
  category: 'AI / ML',
  tags: [{ label: 'Python', cls: 'python' }],
  desc: 'Your primary language for AI/ML work. Master the core language features interviewers love to test.',
  concepts: [
    { name: 'List Comprehensions', desc: '[expr for item in iterable if condition]. Dict: {k:v for k,v in d.items()}. Generator: (expr for x in ...) — lazy, memory-efficient.' },
    { name: 'Decorators', desc: 'Functions that wrap other functions. @functools.wraps preserves metadata. Used for logging, auth, timing, caching (@lru_cache).' },
    { name: 'Generators & yield', desc: 'yield pauses function, returns value, resumes on next(). Memory-efficient for large data streams. Generator expressions are lazy.' },
    { name: '*args & **kwargs', desc: '*args: variable positional arguments (tuple). **kwargs: variable keyword arguments (dict). Order: positional → *args → keyword → **kwargs.' },
    { name: 'OOP in Python', desc: '__init__, __str__, __repr__, __len__, __eq__. Multiple inheritance via MRO (C3 linearisation). @classmethod, @staticmethod, @property.' },
    { name: 'Exception Handling', desc: 'try/except/else/finally. except (TypeError, ValueError) catches multiple. raise re-raises. Custom exceptions: class MyError(Exception): pass.' },
  ],
  qa: [
    { q: 'What is the difference between a list and a tuple in Python?', a: 'List is mutable (can change elements), tuple is immutable. Tuples are faster and hashable (can be dict keys). Use tuples for fixed data, lists for mutable collections.' },
    { q: 'What is a Python decorator? Give an example.', a: 'A function that takes a function and returns a modified function. Example: @timer decorator wraps a function to measure execution time. Uses closure to capture the original function.' },
    { q: 'Explain GIL (Global Interpreter Lock).', a: 'The GIL ensures only one thread runs Python bytecode at a time — prevents true parallelism for CPU-bound tasks. Use multiprocessing for CPU parallelism, threading/asyncio for I/O-bound tasks.' },
    { q: 'What is the difference between deepcopy and copy?', a: 'copy.copy() is a shallow copy — copies the object but not nested objects (they share references). copy.deepcopy() recursively copies everything — completely independent.' },
  ],
  code: [
    {
      label: 'Decorators, generators, comprehensions',
      body: `<span class="kw">import</span> functools, time

<span class="cm"># Timer decorator</span>
<span class="kw">def</span> <span class="fn">timer</span>(func):
    @functools.<span class="fn">wraps</span>(func)
    <span class="kw">def</span> <span class="fn">wrapper</span>(*args, **kwargs):
        start = time.<span class="fn">perf_counter</span>()
        result = <span class="fn">func</span>(*args, **kwargs)
        <span class="fn">print</span>(<span class="str">f"{func.__name__}: {time.perf_counter()-start:.3f}s"</span>)
        <span class="kw">return</span> result
    <span class="kw">return</span> wrapper

<span class="cm"># Generator — read large file line by line</span>
<span class="kw">def</span> <span class="fn">read_lines</span>(path):
    <span class="kw">with</span> <span class="fn">open</span>(path) <span class="kw">as</span> f:
        <span class="kw">for</span> line <span class="kw">in</span> f:
            <span class="kw">yield</span> line.<span class="fn">strip</span>()

<span class="cm"># Dict comprehension — invert a map</span>
d = {<span class="str">'a'</span>: <span class="num">1</span>, <span class="str">'b'</span>: <span class="num">2</span>}
inv = {v: k <span class="kw">for</span> k, v <span class="kw">in</span> d.<span class="fn">items</span>()}`
    }
  ],
  tips: [
    'Use enumerate() instead of range(len(list)) — cleaner and more Pythonic.',
    'zip() pairs elements from multiple iterables — great for parallel iteration.',
    'defaultdict(list) avoids KeyError for missing keys — perfect for grouping.',
    'Use f-strings (f"Hello {name}") over .format() or % — faster and more readable.',
  ]
},

);
