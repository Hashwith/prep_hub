// data7.js — OS, Concurrency, Memory/JVM, Networking (Zeta Global JD)
TOPICS.push(

{
  id: 'os-fundamentals',
  emoji: '🖥️',
  title: 'OS Fundamentals',
  category: 'CS Fundamentals',
  tags: [{ label: 'System Design', cls: 'ml' }],
  desc: 'Operating system concepts directly required by the Zeta Global JD — processes, threads, scheduling, memory management, and I/O.',
  concepts: [
    { name: 'Process vs Thread', desc: 'Process: independent program in execution, own memory space (heap, stack, code, data). Heavy to create (fork). Threads: lightweight, share process memory. Faster to create and switch. One process can have many threads. Process isolation = safety; thread sharing = risk of race conditions.' },
    { name: 'Context Switching', desc: 'OS saves state of running process (registers, PC, stack) and loads state of next. CPU overhead — cache invalidation. Thread context switch cheaper than process (shared address space). Avoid excessive context switching — hurts throughput. Green threads (user-space) even cheaper.' },
    { name: 'CPU Scheduling Algorithms', desc: 'FCFS: First Come First Served — simple, convoy effect. SJF: Shortest Job First — optimal avg wait, requires knowing burst time. Round Robin: fixed time quantum, fair, high context switch overhead. Priority: starvation risk (aging fixes). Multilevel Queue: separate queues per priority.' },
    { name: 'Memory Management', desc: 'Virtual memory: each process sees own address space. OS maps virtual → physical via page table (MMU). Paging: divide into fixed-size pages. Segmentation: variable-size segments. Page fault: page not in RAM → load from disk (expensive ~10ms). Working set: pages currently in use.' },
    { name: 'Stack vs Heap', desc: 'Stack: LIFO, fast allocation/deallocation (just move SP), stores local vars + function call frames + return addresses. Fixed size (default 1-8MB, StackOverflow on overflow). Heap: dynamic allocation (malloc/new), slower, garbage collected or manual free. Fragmentation over time.' },
    { name: 'Demand Paging & Thrashing', desc: 'Demand paging: load pages only when needed. Page replacement: LRU, FIFO, Clock algorithm. Thrashing: too many processes → constant page faults → CPU spends more time paging than executing. Fix: reduce multiprogramming, add RAM, use working-set model.' },
    { name: 'File System', desc: 'inode: metadata (permissions, timestamps, block locations) — not filename. Directory: maps name → inode. Journaling (ext4, NTFS): log changes before applying — faster recovery after crash. Hard links: multiple names for same inode. Soft links: pointer to filename.' },
    { name: 'Interrupt & System Calls', desc: 'Interrupt: hardware signal to CPU (I/O complete, timer). CPU stops, runs ISR (interrupt service routine). System call: user-space program requests kernel service (read, write, fork, exec). Transitions from user mode → kernel mode. Expensive (~microsecond). Batch syscalls when possible.' },
    { name: 'IPC (Inter-Process Communication)', desc: 'Pipes: one-way byte stream. Named pipes (FIFO): between unrelated processes. Message queues: structured messages. Shared memory: fastest IPC, needs synchronization. Sockets: network or local. Signals: async notifications (SIGKILL, SIGTERM, SIGSEGV).' },
  ],
  qa: [
    { q: 'What is a deadlock and what are the four necessary conditions?', a: 'Deadlock: two or more processes wait for each other indefinitely. Four conditions (Coffman): 1) Mutual Exclusion: resources held exclusively. 2) Hold and Wait: process holds resource while waiting for another. 3) No Preemption: resources cannot be forcibly taken. 4) Circular Wait: P1 waits for P2, P2 waits for P1. Prevention: break any one condition. Detection + recovery: kill a process.' },
    { q: 'Explain virtual memory and why it is useful.', a: 'Virtual memory gives each process the illusion of a large, private address space. OS maps virtual addresses to physical RAM pages. Benefits: 1) Process isolation — processes can\'t access each other\'s memory. 2) More processes than physical RAM can fit (swap to disk). 3) Shared libraries loaded once, mapped to multiple processes. 4) Simplified programming — process doesn\'t care where physically loaded.' },
    { q: 'What happens when you execute a program?', a: 'Shell forks a child process. exec() loads program: reads ELF header, maps code segment (text), data segment (initialized globals), BSS (zero-init globals), allocates stack. Dynamic linker loads shared libraries (.so). Sets up main() args. Jumps to entry point (_start → __libc_start_main → main). Stack grows down, heap grows up.' },
    { q: 'What is the difference between a mutex and a semaphore?', a: 'Mutex (mutual exclusion): binary, ownership — only the thread that locked it can unlock. Prevents simultaneous access to critical section. Semaphore: counter-based, no ownership. Binary semaphore ≈ mutex. Counting semaphore: allows N threads simultaneously (e.g., connection pool of 10). Mutex for resource protection; semaphore for signaling and capacity control.' },
    { q: 'How does the OS handle a page fault?', a: '1) MMU detects virtual address not mapped → trap (page fault interrupt). 2) OS page fault handler: check if address is valid (segfault if not). 3) Find a free frame (or evict using LRU). 4) Read page from swap/disk into frame. 5) Update page table. 6) Resume instruction that faulted. Cost: ~10ms (disk seek). Major fault: page not in RAM; Minor: page in RAM but not mapped.' },
  ],
  tips: [
    'fork() copies entire process address space (COW — copy-on-write until write). exec() replaces it.',
    'Zombie process: exited but parent hasn\'t called wait(). Orphan: parent died before child.',
    'ulimit -s shows stack size limit. ulimit -n shows open file descriptor limit.',
    'mmap() maps file directly into address space — faster than read/write for large files.',
  ]
},

{
  id: 'concurrency',
  emoji: '🔀',
  title: 'Concurrency & Multithreading',
  category: 'CS Fundamentals',
  tags: [{ label: 'Java', cls: 'java' }],
  desc: 'Concurrency is one of the hardest topics in CS. Race conditions, deadlocks, and synchronization are heavily tested in senior interviews.',
  concepts: [
    { name: 'Race Condition', desc: 'Two threads access shared data simultaneously, outcome depends on execution order. Example: counter++ is not atomic (read-modify-write). Fix: synchronization (mutex), atomic operations, immutability. Java: synchronized, AtomicInteger, volatile.' },
    { name: 'Java synchronized keyword', desc: 'Marks method/block as critical section. Only one thread at a time. Method-level: synchronized on `this`. Block-level: synchronized(lock) for finer granularity. Reentrant: same thread can re-acquire. Downsides: blocking, deadlock risk, no read/write distinction.' },
    { name: 'Java Locks (ReentrantLock)', desc: 'More flexible than synchronized. tryLock() — non-blocking acquire attempt. lockInterruptibly() — can be interrupted. Separate ReadWriteLock: multiple readers OR one writer. StampedLock: optimistic reading. Always unlock in finally block.' },
    { name: 'volatile keyword', desc: 'Guarantees visibility: writes to volatile variable are immediately visible to all threads. Prevents CPU/compiler reordering. Does NOT make compound operations atomic (i++ still a race). Use for: flags (isRunning), double-checked locking idiom, simple state shared between threads.' },
    { name: 'Java Atomic Classes', desc: 'AtomicInteger, AtomicLong, AtomicReference — use hardware CAS (compare-and-swap) instruction. Lock-free, thread-safe. AtomicInteger.incrementAndGet() is atomic. AtomicReference.compareAndSet(expected, update) — optimistic concurrency. Better performance than synchronized for simple counters.' },
    { name: 'Thread Pool (ExecutorService)', desc: 'Creating threads is expensive. Pool reuses threads. Executors.newFixedThreadPool(n), newCachedThreadPool(), newScheduledThreadPool(). Submit Callable (returns Future) or Runnable. CompletableFuture for async composition. Virtual threads (Java 21): lightweight, millions possible.' },
    { name: 'Deadlock Prevention', desc: '1) Lock ordering: always acquire locks in same order. 2) Lock timeout: tryLock(timeout). 3) Deadlock detection: graph algorithm, kill a thread. 4) Avoid nested locks when possible. 5) Use higher-level concurrency utilities (ConcurrentHashMap, BlockingQueue) instead of explicit locks.' },
    { name: 'Java Concurrency Utilities', desc: 'ConcurrentHashMap: thread-safe map, segment-level locking. BlockingQueue: ArrayBlockingQueue, LinkedBlockingQueue — producer-consumer. CountDownLatch: wait for N events. CyclicBarrier: N threads meet at barrier. Semaphore: limit concurrent access. Phaser: flexible barrier.' },
    { name: 'Java Memory Model (JMM)', desc: 'Defines visibility and ordering guarantees. Happens-before relationship: if A happens-before B, B sees A\'s writes. synchronized blocks, volatile writes, thread start/join establish happens-before. Without it: CPU reordering makes behavior unpredictable. JMM ensures programs with proper synchronization behave correctly across architectures.' },
    { name: 'async/await vs Threads', desc: 'Threads: OS-level, preemptive, blocking I/O wastes thread. Good for CPU work. async/await (JS, Python asyncio): cooperative, single thread, non-blocking I/O. Event loop. Good for I/O-bound concurrency. Java virtual threads: async performance with synchronous code style. Use right model for workload.' },
  ],
  qa: [
    { q: 'Implement a thread-safe singleton in Java.', a: 'Double-checked locking with volatile: private static volatile Singleton instance; in getInstance(): if (instance==null) { synchronized(Singleton.class) { if (instance==null) { instance = new Singleton(); }}} return instance; Volatile prevents instruction reordering during initialization. Better: Enum singleton (thread-safe by JVM class loading). Or initialization-on-demand holder idiom (static inner class).' },
    { q: 'What is a race condition? Give an example and fix.', a: 'Example: balance = 1000. Thread A reads balance (1000), Thread B reads balance (1000). A adds 100, writes 1100. B adds 200, writes 1200. Final: 1200 (should be 1300). Fix: synchronized method, AtomicInteger, or database optimistic locking (WHERE balance=1000 in UPDATE). Identifies that read-modify-write must be atomic.' },
    { q: 'How does Java\'s ConcurrentHashMap differ from HashTable?', a: 'HashTable: synchronized entire map on every operation — single lock, serialized access. ConcurrentHashMap (Java 7): segment-level locking (16 segments). Java 8+: CAS + synchronized on individual buckets. Allows concurrent reads without locking. Concurrent writes to different keys happen in parallel. HashTable is effectively deprecated — use ConcurrentHashMap.' },
    { q: 'Explain the producer-consumer problem and how to solve it in Java.', a: 'Producer adds items to buffer; consumer takes items. Problem: producer blocks when full, consumer blocks when empty. Solution with BlockingQueue: ArrayBlockingQueue<T> queue = new ArrayBlockingQueue<>(capacity). Producer: queue.put(item) — blocks if full. Consumer: queue.take() — blocks if empty. No explicit synchronization needed. BlockingQueue handles all coordination internally.' },
  ],
  code: [
    {
      label: 'Thread-safe counter and producer-consumer (Java)',
      body: `<span class="cm">// Atomic counter — no synchronized needed</span>
<span class="cls">AtomicInteger</span> counter = <span class="kw">new</span> <span class="cls">AtomicInteger</span>(<span class="num">0</span>);
counter.<span class="fn">incrementAndGet</span>(); <span class="cm">// thread-safe</span>

<span class="cm">// Producer-Consumer with BlockingQueue</span>
<span class="cls">BlockingQueue</span>&lt;<span class="cls">String</span>&gt; queue = <span class="kw">new</span> <span class="cls">ArrayBlockingQueue</span>&lt;&gt;(<span class="num">100</span>);

<span class="cm">// Producer thread</span>
<span class="kw">new</span> <span class="cls">Thread</span>(() -> {
  <span class="kw">try</span> { queue.<span class="fn">put</span>(<span class="str">"task"</span>); } <span class="kw">catch</span> (<span class="cls">InterruptedException</span> e) { Thread.<span class="fn">currentThread</span>().<span class="fn">interrupt</span>(); }
}).<span class="fn">start</span>();

<span class="cm">// Consumer thread</span>
<span class="kw">new</span> <span class="cls">Thread</span>(() -> {
  <span class="kw">try</span> { <span class="cls">String</span> task = queue.<span class="fn">take</span>(); } <span class="kw">catch</span> (<span class="cls">InterruptedException</span> e) { Thread.<span class="fn">currentThread</span>().<span class="fn">interrupt</span>(); }
}).<span class="fn">start</span>();`
    }
  ],
  tips: [
    'Prefer immutable objects — they are inherently thread-safe (String, Integer).',
    'ThreadLocal gives each thread its own variable instance — useful for request context (user ID, trace ID).',
    'Never call Thread.stop() — use a volatile boolean flag or interrupt(). check Thread.interrupted() in loops.',
    'Java 21 virtual threads: Thread.ofVirtual().start(() -> ...) — use for high-concurrency I/O workloads.',
  ]
},

{
  id: 'networking',
  emoji: '🌍',
  title: 'Computer Networking',
  category: 'CS Fundamentals',
  tags: [{ label: 'System Design', cls: 'ml' }],
  desc: 'Networking fundamentals — TCP/IP, DNS, HTTP/HTTPS, and how the web actually works. Required for both system design and backend roles.',
  concepts: [
    { name: 'OSI Model (7 Layers)', desc: '7-Physical, 6-Data Link, 5-Network (IP), 4-Transport (TCP/UDP), 3-Session, 2-Presentation, 1-Application (HTTP/DNS). Remember: "Please Do Not Throw Sausage Pizza Away". In practice: TCP/IP model (4 layers) is what matters.' },
    { name: 'TCP vs UDP', desc: 'TCP: connection-oriented (3-way handshake), reliable delivery (ACK + retransmit), ordered, congestion control, flow control. Overhead ~20 bytes header. UDP: connectionless, no delivery guarantee, no ordering, faster, lower overhead (~8 bytes). TCP: HTTP, email, file transfer. UDP: DNS, video streaming, gaming, VoIP.' },
    { name: 'TCP 3-Way Handshake', desc: 'SYN → SYN-ACK → ACK. Client sends SYN (random seq). Server responds SYN-ACK (its own seq + client seq+1). Client ACKs. Connection established. 1.5 RTT overhead. TLS adds 1-2 more RTTs. TCP Fast Open reduces to 0.5 RTT on repeat connections.' },
    { name: 'HTTP/1.1 vs HTTP/2 vs HTTP/3', desc: 'HTTP/1.1: text protocol, one request per connection (pipelining unreliable). Head-of-line blocking. HTTP/2: binary framing, multiplexed streams (multiple requests on one TCP connection), header compression (HPACK), server push. HTTP/3: runs on QUIC (UDP-based), 0-RTT, solves TCP head-of-line blocking, better mobile performance.' },
    { name: 'DNS Resolution', desc: 'Browser → Recursive resolver → Root nameserver → TLD nameserver → Authoritative nameserver → IP. Cached at each level with TTL. OS cache → browser cache → router → ISP resolver. DNS types: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), TXT (verification), NS (nameservers). DNS-based load balancing: multiple A records.' },
    { name: 'HTTPS & TLS Handshake', desc: 'Client Hello (supported ciphers). Server Hello (chosen cipher, certificate). Client verifies cert (CA chain). Key exchange (ECDHE). Client/Server Finished. TLS 1.3: 1 RTT handshake. HSTS: browser always uses HTTPS for domain. Certificate Transparency: public log of certificates.' },
    { name: 'HTTP Methods & Status Codes', desc: 'GET (read, idempotent, cacheable), POST (create), PUT (replace, idempotent), PATCH (partial update), DELETE (idempotent), OPTIONS (CORS preflight). 1xx info, 2xx success, 3xx redirect, 4xx client error, 5xx server error. 301 permanent, 302 temporary, 304 not modified, 429 rate limited.' },
    { name: 'Sockets', desc: 'Endpoint for network communication: IP + Port. TCP socket: connection-oriented (bind, listen, accept, connect). UDP socket: connectionless (sendto, recvfrom). Port 0-1023: well-known (80 HTTP, 443 HTTPS, 22 SSH, 5432 PostgreSQL). Ephemeral ports (49152-65535): assigned by OS to clients.' },
    { name: 'CDN & Edge', desc: 'Content cached at PoPs (Points of Presence) near users. Anycast routing: DNS returns same IP, network routes to nearest PoP. Edge computing: run code at PoP (Cloudflare Workers, Lambda@Edge). Reduces origin load and latency for static/dynamic content.' },
    { name: 'Network Latency', desc: 'Speed of light: ~200km/ms in fiber. NY to London RTT: ~70ms. NY to Tokyo: ~150ms. Within datacenter: <1ms. In-region: 1-5ms. Cross-region: 50-200ms. Latency vs bandwidth: latency = time for first byte, bandwidth = throughput. CDN reduces latency; compression reduces bandwidth.' },
  ],
  qa: [
    { q: 'What happens when you type google.com in a browser?', a: '1) DNS: browser cache → OS cache → recursive resolver → root → .com TLD → google.com authoritative → returns 216.58.x.x. 2) TCP: 3-way handshake to port 443. 3) TLS: certificate verification, key exchange. 4) HTTP: GET / HTTP/2. 5) Server processes request, returns HTML. 6) Browser parses HTML, fetches CSS/JS/images (parallel). 7) Render tree, layout, paint, composite. Total: <200ms for fast sites.' },
    { q: 'What is the difference between TCP and UDP? When would you use UDP?', a: 'TCP: guaranteed delivery, ordering, congestion control. Use when: correctness matters (HTTP, file transfer, email). UDP: no guarantee, no ordering, low latency. Use when: speed > correctness (live video streaming — dropped frame is fine, late frame is not). DNS (fast, small, can retry). Online gaming (latest position matters more than old missed packet). VoIP. WebRTC uses UDP with SRTP for encryption.' },
    { q: 'How does HTTP/2 multiplexing work?', a: 'HTTP/1.1: multiple TCP connections (6-8 per browser) to parallelize requests. HTTP/2: one TCP connection with multiple logical streams. Each request = a stream. Frames interleaved on same connection. No head-of-line blocking at HTTP level (but TCP HOL blocking remains). Server push: send CSS before client requests it. 40% improvement in page load.' },
    { q: 'What is CORS and how does it work?', a: 'Cross-Origin Resource Sharing: browser blocks JS from making requests to different origin (protocol+domain+port). Preflight: browser sends OPTIONS request with Origin header. Server responds with Access-Control-Allow-Origin. If allowed, browser sends actual request. Simple requests (GET, POST with text/plain) skip preflight. Server sets: Access-Control-Allow-Origin, -Methods, -Headers, -Credentials.' },
  ],
  tips: [
    'Latency numbers: L1 cache 1ns, L2 10ns, RAM 100ns, SSD 100μs, network (same region) 500μs, disk seek 10ms.',
    'Keep-Alive: HTTP/1.1 reuses TCP connection for multiple requests. Saves handshake overhead.',
    'Time to First Byte (TTFB) measures server response time. < 200ms is good. CDN + caching reduces it.',
    'WebSockets use HTTP Upgrade header to switch protocols. Start as HTTP request on port 80/443.',
  ]
},

{
  id: 'memory-jvm',
  emoji: '🧬',
  title: 'Memory Management & JVM',
  category: 'CS Fundamentals',
  tags: [{ label: 'Java', cls: 'java' }],
  desc: 'How the JVM manages memory, garbage collection, and compilation — directly required by the Zeta Global JD.',
  concepts: [
    { name: 'JVM Architecture', desc: 'ClassLoader: loads .class files. Runtime Data Areas: Method Area (class metadata), Heap (objects), Stack (frames per thread), PC Register, Native Method Stack. Execution Engine: interpreter + JIT compiler + GC.' },
    { name: 'JVM Heap Structure', desc: 'Young Generation: Eden + Survivor S0/S1. Old (Tenured) Generation. Metaspace (replaced PermGen in Java 8): class metadata, grows dynamically. Most objects die young (generational hypothesis). Minor GC: young gen. Major/Full GC: entire heap (stop-the-world).' },
    { name: 'Garbage Collection', desc: 'Mark-and-Sweep: mark live objects from GC roots, sweep unmarked. Generational: young gen GC frequent but fast. Copying: compact memory, eliminate fragmentation. G1GC (default Java 9+): region-based, predictable pause times. ZGC/Shenandoah: sub-millisecond pauses (concurrent collection).' },
    { name: 'JIT Compilation', desc: 'Java: interpreted bytecode → JIT compiles hot methods to native code. C1 compiler: fast compilation, basic optimizations. C2 compiler: slower but aggressive optimization (inlining, loop unrolling). Tiered compilation: start with C1, promote to C2 for hot code. AOT (GraalVM): compile at build time → faster startup.' },
    { name: 'Memory Leaks in Java', desc: 'GC prevents most leaks but not all. Common causes: static collections holding references, unclosed resources (streams, connections), listeners not removed, ThreadLocal not cleared, caches without eviction. Use: WeakHashMap for caches, try-with-resources for closures, profiler (JVisualVM, async-profiler) to find leaks.' },
    { name: 'Compilation vs Interpretation', desc: 'Compiled (C, C++, Go): source → machine code at compile time. Fast execution, no runtime overhead. Interpreted (Python): execute source/bytecode line by line at runtime. Slower, more flexible. JVM hybrid: compile to bytecode (platform-independent), JIT to native at runtime. GraalVM: compile Java to native binary (no JVM at runtime).' },
    { name: 'Java Stack Frame', desc: 'Each method call creates a stack frame: local variable array, operand stack, frame data (reference to runtime constant pool). Method return: frame popped. StackOverflowError: too many frames (deep recursion). Each thread has its own stack (default 512KB-1MB).' },
    { name: 'GC Tuning', desc: '-Xms (initial heap) -Xmx (max heap). -XX:+UseG1GC. -XX:MaxGCPauseMillis=200. -Xss (thread stack size). GC logs: -Xlog:gc*. Watch: GC pause time, GC throughput (% time not in GC), heap occupancy after GC. Full GC too frequent → increase heap or tune generation sizes.' },
  ],
  qa: [
    { q: 'What is the difference between JDK, JRE, and JVM?', a: 'JVM (Java Virtual Machine): executes bytecode, provides runtime environment. JRE (Java Runtime Environment): JVM + standard library classes (rt.jar) — for running Java apps. JDK (Java Development Kit): JRE + compiler (javac) + tools (jstack, jmap, jar) — for developing Java apps. Distribution: Java 11+, JDK includes JRE.' },
    { q: 'How does garbage collection work in Java?', a: 'GC roots: static fields, local vars on thread stacks, JNI references. Mark phase: traverses object graph from roots, marks reachable objects. Sweep: reclaims unmarked objects. Generational: Young gen (Eden → S0/S1 → Old) — objects that survive multiple minor GCs promoted to old gen. G1GC divides heap into equal regions, prioritizes regions with most garbage first.' },
    { q: 'What is a memory leak in Java and how do you diagnose it?', a: 'Memory leak: objects no longer needed but still referenced — GC cannot collect. Symptoms: heap grows over time, eventually OutOfMemoryError. Diagnosis: 1) Heap dump (jmap -dump:heap.hprof). 2) Analyze with Eclipse MAT or JVisualVM. 3) Look for large retained object graphs. 4) Check for collections that only grow. Fix: remove references (clear collections, cancel listeners, close resources).' },
    { q: 'Explain the difference between stack and heap memory in Java.', a: 'Stack: per-thread, stores method frames (local primitives, object references). LIFO. Fixed size. Access fast (pointer arithmetic). Not GC managed. Heap: shared across threads, stores all objects (new keyword). GC managed. Slower access (pointer dereference). Primitives in local vars → stack. Objects always on heap. int x = 5 (stack). new Integer(5) → reference on stack, object on heap.' },
  ],
  tips: [
    '-XX:+PrintGCDetails and GCViewer help understand GC behavior in production.',
    'String pool: string literals are interned. "hello" == "hello" is true; new String("hello") == "hello" is false.',
    'Escape analysis: JIT may allocate short-lived objects on stack instead of heap — no GC needed.',
    'Java 21 records are immutable value objects — GC-friendly, no defensive copying needed.',
  ]
},

);
