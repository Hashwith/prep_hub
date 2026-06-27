// =====================================================
//  CHEATSHEET DATA  —  Part 1: Java, DSA, JavaScript
// =====================================================

const TOPICS = [

// ─────────────────────────────────────────────────
//  1. JAVA OOP
// ─────────────────────────────────────────────────
{
  id: 'java-oop',
  emoji: '☕',
  title: 'Java OOP',
  category: 'Java',
  tags: [{ label: 'Java', cls: 'java' }],
  desc: 'Object-Oriented Programming is the backbone of Java. Every class, interface, and pattern you build relies on these four pillars.',
  concepts: [
    { name: 'Encapsulation', desc: 'Bundling data + methods inside a class, hiding internal state with private fields and public getters/setters.' },
    { name: 'Inheritance', desc: 'A subclass inherits fields and methods from a superclass using `extends`. Promotes code reuse.' },
    { name: 'Polymorphism', desc: 'Same method name behaves differently. Compile-time (method overloading) vs runtime (method overriding + @Override).' },
    { name: 'Abstraction', desc: 'Hiding implementation details. Achieved via abstract classes (partial impl) and interfaces (full contract).' },
    { name: 'Interface vs Abstract Class', desc: 'Interface: all abstract (Java 8+ allows default/static). Abstract class: can have constructors, state, partial impl. A class can implement multiple interfaces but extend only one class.' },
    { name: 'static & final', desc: '`static` — belongs to class, not instance. `final` — variable is constant, method can\'t be overridden, class can\'t be extended.' },
    { name: 'Constructor Chaining', desc: 'this() calls another constructor in the same class; super() calls the parent class constructor. Must be first statement.' },
    { name: 'Object class methods', desc: 'toString(), equals(), hashCode(), clone(), getClass(). Always override equals() + hashCode() together.' },
  ],
  qa: [
    { q: 'What is the difference between method overloading and overriding?', a: 'Overloading: same method name, different parameters — resolved at compile time (static polymorphism). Overriding: subclass redefines a parent method with the same signature — resolved at runtime (dynamic polymorphism). @Override annotation is best practice.' },
    { q: 'Can an abstract class have a constructor?', a: 'Yes. Abstract classes can have constructors — they are called when a concrete subclass is instantiated via super(). They are used to initialise shared fields.' },
    { q: 'Why can\'t we instantiate an interface in Java?', a: 'Interfaces define a contract (abstract methods) without implementation. Java 8 added default methods but the type itself is still incomplete. You can only instantiate a class that implements the interface.' },
    { q: 'What is the diamond problem and how does Java solve it?', a: 'If a class inherits from two classes that both define the same method, ambiguity arises. Java prevents this by disallowing multiple class inheritance. With interfaces, if both define the same default method, the implementing class must override it to resolve the conflict.' },
    { q: 'Difference between == and .equals()?', a: '== compares references (memory addresses). .equals() compares content/value. For String, use .equals(). Objects that override equals() (like String, Integer) compare values with .equals().' },
    { q: 'What is the `this` keyword?', a: 'Refers to the current object instance. Used to resolve naming conflicts between fields and parameters, call another constructor (this()), or pass current object as argument.' },
  ],
  code: [
    {
      label: 'OOP Example — Shape hierarchy',
      body: `<span class="kw">abstract class</span> <span class="cls">Shape</span> {
  <span class="kw">private</span> <span class="cls">String</span> color;

  <span class="cls">Shape</span>(<span class="cls">String</span> color) { <span class="kw">this</span>.color = color; }
  <span class="kw">public</span> <span class="cls">String</span> <span class="fn">getColor</span>() { <span class="kw">return</span> color; }
  <span class="kw">public abstract double</span> <span class="fn">area</span>();  <span class="cm">// must override</span>
}

<span class="kw">class</span> <span class="cls">Circle</span> <span class="kw">extends</span> <span class="cls">Shape</span> {
  <span class="kw">private double</span> radius;
  <span class="cls">Circle</span>(<span class="cls">String</span> color, <span class="kw">double</span> radius) {
    <span class="kw">super</span>(color);  <span class="cm">// parent constructor</span>
    <span class="kw">this</span>.radius = radius;
  }
  <span class="kw">@Override public double</span> <span class="fn">area</span>() { <span class="kw">return</span> <span class="cls">Math</span>.PI * radius * radius; }
}`
    }
  ],
  tips: [
    'Always override hashCode() when you override equals() — HashMap/HashSet depend on both.',
    'Prefer interfaces for defining APIs; use abstract classes when you have shared state/logic.',
    'Mark fields private by default, expose only what\'s needed — principle of least privilege.',
    'Constructors are NOT inherited. Every subclass must call super() explicitly if the parent has no no-arg constructor.',
  ]
},

// ─────────────────────────────────────────────────
//  2. JAVA COLLECTIONS
// ─────────────────────────────────────────────────
{
  id: 'java-collections',
  emoji: '📦',
  title: 'Java Collections',
  category: 'Java',
  tags: [{ label: 'Java', cls: 'java' }],
  desc: 'The Collections Framework provides ready-to-use data structures. Choosing the right one is a key interview skill.',
  concepts: [
    { name: 'ArrayList vs LinkedList', desc: 'ArrayList: dynamic array, O(1) get, O(n) insert/delete. LinkedList: doubly-linked, O(1) insert/delete at ends, O(n) get.' },
    { name: 'HashMap', desc: 'Key-value pairs, O(1) avg get/put. Uses hashing. Not thread-safe. Allows null key. Java 8+: uses tree (red-black) for buckets with >8 entries.' },
    { name: 'LinkedHashMap', desc: 'HashMap + maintains insertion order. Good for LRU cache (extend it, override removeEldestEntry).' },
    { name: 'TreeMap', desc: 'Sorted map (natural or custom Comparator). O(log n) operations. Backed by red-black tree.' },
    { name: 'HashSet / TreeSet / LinkedHashSet', desc: 'No duplicates. HashSet: O(1), unordered. TreeSet: sorted O(log n). LinkedHashSet: insertion order.' },
    { name: 'Queue & Deque', desc: 'Queue: FIFO — offer/poll/peek. ArrayDeque: faster than LinkedList for stack/queue. PriorityQueue: min-heap by default.' },
    { name: 'Stack', desc: 'Legacy class; prefer Deque<> with ArrayDeque. push/pop/peek operations.' },
    { name: 'Iterator & for-each', desc: 'All Collections implement Iterable. Use Iterator to safely remove during traversal. ConcurrentModificationException thrown if you modify while iterating without Iterator.remove().' },
  ],
  qa: [
    { q: 'What happens if two keys have the same hashCode in a HashMap?', a: 'A hash collision — both entries go into the same bucket. Java uses chaining (linked list, or tree in Java 8+). equals() is used to distinguish keys within the bucket.' },
    { q: 'What is the difference between HashMap and ConcurrentHashMap?', a: 'HashMap is not thread-safe. ConcurrentHashMap uses segment-level locking (Java 7) or CAS operations (Java 8+) for thread safety without locking the whole map.' },
    { q: 'When would you use a TreeMap over a HashMap?', a: 'When you need keys in sorted order, or need range queries (subMap, headMap, tailMap). TreeMap is O(log n) vs O(1) for HashMap.' },
    { q: 'How does PriorityQueue work?', a: 'It\'s a min-heap by default — poll() returns the smallest element. You can pass a Comparator for custom ordering (e.g., max-heap: (a,b) -> b-a).' },
    { q: 'What is the load factor in HashMap?', a: 'Default is 0.75. When (size / capacity) exceeds load factor, the map is resized (rehashed) to 2x capacity. Lower load factor = fewer collisions but more memory.' },
  ],
  code: [
    {
      label: 'Common Collection patterns',
      body: `<span class="cm">// Frequency map</span>
<span class="cls">Map</span>&lt;<span class="cls">String</span>, <span class="cls">Integer</span>&gt; freq = <span class="kw">new</span> <span class="cls">HashMap</span>&lt;&gt;();
freq.<span class="fn">getOrDefault</span>(key, <span class="num">0</span>) + <span class="num">1</span>;  <span class="cm">// avoid null check</span>
freq.<span class="fn">merge</span>(key, <span class="num">1</span>, <span class="cls">Integer</span>::sum); <span class="cm">// cleaner</span>

<span class="cm">// Min-heap (e.g. k smallest elements)</span>
<span class="cls">PriorityQueue</span>&lt;<span class="cls">Integer</span>&gt; minH = <span class="kw">new</span> <span class="cls">PriorityQueue</span>&lt;&gt;();

<span class="cm">// Max-heap</span>
<span class="cls">PriorityQueue</span>&lt;<span class="cls">Integer</span>&gt; maxH = <span class="kw">new</span> <span class="cls">PriorityQueue</span>&lt;&gt;(<span class="cls">Collections</span>.reverseOrder());

<span class="cm">// Iterate map</span>
<span class="kw">for</span> (<span class="cls">Map</span>.<span class="cls">Entry</span>&lt;<span class="cls">String</span>,<span class="cls">Integer</span>&gt; e : map.<span class="fn">entrySet</span>())
  <span class="cls">System</span>.out.<span class="fn">println</span>(e.<span class="fn">getKey</span>() + <span class="str">" → "</span> + e.<span class="fn">getValue</span>());`
    }
  ],
  tips: [
    'Use Map.getOrDefault() or merge() instead of null-checking manually.',
    'Prefer ArrayDeque over Stack class — it\'s faster and not synchronized.',
    'Collections.unmodifiableList() wraps a list to make it read-only (throws UnsupportedOperationException on mutation).',
    'Use List.of(), Map.of() (Java 9+) for immutable collections — they also disallow null.',
  ]
},

// ─────────────────────────────────────────────────
//  3. DSA — Data Structures
// ─────────────────────────────────────────────────
{
  id: 'dsa-structures',
  emoji: '🌲',
  title: 'Data Structures',
  category: 'DSA',
  tags: [{ label: 'Java', cls: 'java' }, { label: 'Python', cls: 'python' }],
  desc: 'Core data structures — understanding time/space complexity and when to use each is critical for coding interviews.',
  concepts: [
    { name: 'Array', desc: 'Contiguous memory, O(1) index access, O(n) insert/delete. Use when size is fixed or random access is needed.' },
    { name: 'Linked List', desc: 'Nodes with pointers. Singly / Doubly. O(1) insert at head, O(n) search. No random access.' },
    { name: 'Stack (LIFO)', desc: 'push/pop/peek — O(1). Used for: undo, brackets matching, DFS, expression evaluation.' },
    { name: 'Queue (FIFO)', desc: 'enqueue/dequeue — O(1). Used for BFS, task scheduling. Deque = double-ended queue.' },
    { name: 'Binary Tree', desc: 'Each node has at most 2 children. BST: left < root < right. Height: O(log n) balanced, O(n) skewed.' },
    { name: 'Heap', desc: 'Complete binary tree. Min-heap: parent ≤ children. Max-heap: parent ≥ children. O(log n) insert/delete, O(1) peek.' },
    { name: 'Hash Table', desc: 'Key-value, O(1) avg. Collisions handled by chaining or open addressing.' },
    { name: 'Graph', desc: 'Nodes + edges. Directed / Undirected. Weighted / Unweighted. Represented as adjacency list or matrix.' },
  ],
  qa: [
    { q: 'What is the time complexity of BST operations?', a: 'Average O(log n) for search, insert, delete. Worst case O(n) for a skewed tree (like inserting sorted data). Balanced BSTs (AVL, Red-Black) guarantee O(log n).' },
    { q: 'How do you detect a cycle in a linked list?', a: 'Floyd\'s Cycle Detection (slow/fast pointers). Slow moves 1 step, fast moves 2. If they meet, there\'s a cycle. To find the start: reset slow to head, both move 1 step — they meet at the cycle start.' },
    { q: 'What is a trie and when do you use it?', a: 'A prefix tree where each node represents a character. Used for autocomplete, spell-check, prefix search. O(m) lookup where m is string length — faster than HashMap for prefix queries.' },
    { q: 'Explain heap sort and its complexity.', a: 'Build a max-heap O(n), then repeatedly extract max and place at end O(n log n). Overall O(n log n) time, O(1) space (in-place). Not stable.' },
    { q: 'When would you use a graph over a tree?', a: 'When data has arbitrary relationships (not hierarchical), possible cycles, or multiple parents. Examples: social networks, maps, dependency resolution.' },
  ],
  code: [
    {
      label: 'Tree traversals (Java)',
      body: `<span class="kw">void</span> <span class="fn">inorder</span>(<span class="cls">TreeNode</span> node) {
  <span class="kw">if</span> (node == <span class="kw">null</span>) <span class="kw">return</span>;
  <span class="fn">inorder</span>(node.left);
  <span class="cls">System</span>.out.<span class="fn">print</span>(node.val + <span class="str">" "</span>);  <span class="cm">// L, Root, R</span>
  <span class="fn">inorder</span>(node.right);
}

<span class="cm">// BFS — Level Order</span>
<span class="cls">Queue</span>&lt;<span class="cls">TreeNode</span>&gt; q = <span class="kw">new</span> <span class="cls">LinkedList</span>&lt;&gt;();
q.<span class="fn">offer</span>(root);
<span class="kw">while</span> (!q.<span class="fn">isEmpty</span>()) {
  <span class="cls">TreeNode</span> node = q.<span class="fn">poll</span>();
  <span class="kw">if</span> (node.left != <span class="kw">null</span>) q.<span class="fn">offer</span>(node.left);
  <span class="kw">if</span> (node.right != <span class="kw">null</span>) q.<span class="fn">offer</span>(node.right);
}`
    }
  ],
  tips: [
    'Inorder of a BST gives sorted output — use this to verify BST property.',
    'For "k-th smallest" problems: min-heap of size k, or inorder traversal.',
    'Two-pointer technique works on sorted arrays and linked lists — reduces O(n²) to O(n).',
    'Always draw the data structure before coding — helps visualise pointer changes.',
  ]
},

// ─────────────────────────────────────────────────
//  4. DSA — ALGORITHMS
// ─────────────────────────────────────────────────
{
  id: 'dsa-algorithms',
  emoji: '⚙️',
  title: 'Algorithms & Complexity',
  category: 'DSA',
  tags: [{ label: 'Java', cls: 'java' }, { label: 'Python', cls: 'python' }],
  desc: 'Key algorithms, sorting techniques, recursion, and dynamic programming — the core of any coding interview.',
  concepts: [
    { name: 'Big-O Notation', desc: 'Describes worst-case growth rate. O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ). Ignore constants and lower-order terms.' },
    { name: 'Binary Search', desc: 'Works on sorted arrays. O(log n). Find mid, compare, eliminate half. Template: lo=0, hi=n-1, mid=(lo+hi)/2.' },
    { name: 'Sorting', desc: 'QuickSort: O(n log n) avg, O(n²) worst. MergeSort: O(n log n) stable. HeapSort: O(n log n) in-place. Java Arrays.sort() uses Dual-Pivot QuickSort for primitives.' },
    { name: 'BFS vs DFS', desc: 'BFS: uses queue, explores level-by-level, finds shortest path in unweighted graph. DFS: uses stack/recursion, explores depth-first, good for cycle detection, topological sort.' },
    { name: 'Dynamic Programming', desc: 'Break problem into overlapping subproblems, store results (memoization/tabulation). Identify: optimal substructure + overlapping subproblems.' },
    { name: 'Greedy', desc: 'Make locally optimal choice at each step. Works when greedy choice leads to global optimum. Examples: interval scheduling, Huffman coding, Dijkstra.' },
    { name: 'Recursion', desc: 'Base case + recursive case. Stack depth = O(n). Tail recursion optimisation (not in Java). Convert to iterative with explicit stack if needed.' },
    { name: 'Sliding Window', desc: 'Two pointers defining a window over array/string. Expand right, shrink left on condition. O(n) for many substring/subarray problems.' },
  ],
  qa: [
    { q: 'How does binary search work on a rotated sorted array?', a: 'Find mid. Check which half is sorted (compare mid with lo). If target is in the sorted half, search there; else search the other half. O(log n).' },
    { q: 'What is memoization vs tabulation?', a: 'Memoization (top-down): recursive + cache results in a map/array. Tabulation (bottom-up): iterative, fill a DP table from base cases up. Tabulation avoids recursion overhead and stack overflow.' },
    { q: 'Explain Dijkstra\'s algorithm.', a: 'Finds shortest path from source to all nodes in a weighted graph (non-negative weights). Uses a min-heap (priority queue). O((V+E) log V). Doesn\'t work with negative edges — use Bellman-Ford instead.' },
    { q: 'What is the difference between divide and conquer vs DP?', a: 'Divide & conquer splits into independent subproblems (e.g. merge sort). DP solves overlapping subproblems and reuses solutions. The overlap is key — without it, DP is just divide & conquer with memoization.' },
    { q: 'How would you find all permutations of a string?', a: 'Backtracking: fix one character at each position, recurse on the rest. Time O(n!). Use a visited array or swap-in-place technique.' },
  ],
  code: [
    {
      label: 'Binary Search template',
      body: `<span class="kw">int</span> <span class="fn">binarySearch</span>(<span class="kw">int</span>[] arr, <span class="kw">int</span> target) {
  <span class="kw">int</span> lo = <span class="num">0</span>, hi = arr.length - <span class="num">1</span>;
  <span class="kw">while</span> (lo <= hi) {
    <span class="kw">int</span> mid = lo + (hi - lo) / <span class="num">2</span>; <span class="cm">// avoids overflow</span>
    <span class="kw">if</span> (arr[mid] == target) <span class="kw">return</span> mid;
    <span class="kw">else if</span> (arr[mid] < target) lo = mid + <span class="num">1</span>;
    <span class="kw">else</span> hi = mid - <span class="num">1</span>;
  }
  <span class="kw">return</span> -<span class="num">1</span>; <span class="cm">// not found</span>
}`
    },
    {
      label: 'DP — Fibonacci (tabulation)',
      body: `<span class="kw">int</span> <span class="fn">fib</span>(<span class="kw">int</span> n) {
  <span class="kw">if</span> (n <= <span class="num">1</span>) <span class="kw">return</span> n;
  <span class="kw">int</span> a = <span class="num">0</span>, b = <span class="num">1</span>;
  <span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">2</span>; i <= n; i++) {
    <span class="kw">int</span> tmp = a + b; a = b; b = tmp;
  }
  <span class="kw">return</span> b; <span class="cm">// O(n) time, O(1) space</span>
}`
    }
  ],
  tips: [
    'For shortest path: BFS (unweighted) → Dijkstra (weighted, +ve) → Bellman-Ford (negative edges).',
    'Sliding window and two-pointer are O(n) tricks — always check if the problem is about subarrays/substrings.',
    'DP hint: if the problem says "minimum/maximum number of ways" or "can you achieve X" → likely DP.',
    'Quicksort pivot selection matters — random pivot avoids worst-case O(n²) on sorted input.',
  ]
},

// ─────────────────────────────────────────────────
//  5. JAVASCRIPT ES6+
// ─────────────────────────────────────────────────
{
  id: 'javascript',
  emoji: '🟨',
  title: 'JavaScript (ES6+)',
  category: 'Frontend',
  tags: [{ label: 'JavaScript', cls: 'js' }],
  desc: 'Modern JavaScript is the language of the web. Deep understanding of closures, the event loop, and async patterns sets you apart.',
  concepts: [
    { name: 'var / let / const', desc: 'var: function-scoped, hoisted (undefined). let: block-scoped, not hoisted (TDZ). const: block-scoped, must be initialised, can\'t reassign (but object contents can change).' },
    { name: 'Closures', desc: 'A function that remembers variables from its outer scope even after the outer function has returned. Foundation of module pattern, data hiding, currying.' },
    { name: 'Event Loop', desc: 'JS is single-threaded. Call stack runs synchronous code. Web APIs handle async tasks. Callback queue (macrotask) vs microtask queue (Promises). Microtasks always run before next macrotask.' },
    { name: 'Promises & async/await', desc: 'Promise: represents a future value (.then/.catch/.finally). async/await: syntactic sugar over Promises. await pauses only inside async function.' },
    { name: 'Prototypal Inheritance', desc: 'Every object has a [[Prototype]]. Object.create(), class syntax (syntactic sugar). The prototype chain is how property lookup works.' },
    { name: 'Destructuring & Spread', desc: 'const {a, b} = obj; const [x, y] = arr. Spread: ...arr copies/merges arrays/objects. Rest: ...args collects remaining arguments.' },
    { name: 'Array methods', desc: 'map (transform), filter (subset), reduce (accumulate), find (first match), some/every (predicates), flat/flatMap. All return new arrays except forEach/find.' },
    { name: 'this keyword', desc: 'Value depends on how function is called. Arrow functions don\'t have their own this — they inherit from enclosing lexical scope.' },
  ],
  qa: [
    { q: 'What is the difference between null and undefined?', a: 'undefined: variable declared but not assigned, or missing function return. null: explicitly assigned to represent "no value". typeof null === "object" is a known JS bug.' },
    { q: 'What is hoisting?', a: 'JS moves declarations to the top of their scope before execution. var declarations are hoisted and initialised to undefined. Function declarations are fully hoisted. let/const are hoisted but stay in the Temporal Dead Zone until the declaration line.' },
    { q: 'Explain the difference between == and ===.', a: '== performs type coercion before comparison (0 == false → true). === checks both value and type without coercion (0 === false → false). Always prefer ===.' },
    { q: 'What does Promise.all() do? What about Promise.allSettled()?', a: 'Promise.all(): resolves when ALL promises resolve; rejects immediately if any one rejects. Promise.allSettled(): waits for all to settle (resolve or reject), returns array of results — no short-circuit.' },
    { q: 'What is event delegation?', a: 'Instead of attaching listeners to each child element, attach one listener to the parent. Use event.target to identify which child was clicked. Efficient for dynamic lists.' },
    { q: 'What is a closure? Give a real use case.', a: 'A closure captures variables from its outer scope. Example use case: a counter factory function — each call creates a private count variable only the inner function can access. Also used in memoization, partial application.' },
  ],
  code: [
    {
      label: 'Closures, async/await, array methods',
      body: `<span class="cm">// Closure — private counter</span>
<span class="kw">function</span> <span class="fn">makeCounter</span>() {
  <span class="kw">let</span> count = <span class="num">0</span>;
  <span class="kw">return</span> () => ++count; <span class="cm">// count lives in closure</span>
}
<span class="kw">const</span> counter = <span class="fn">makeCounter</span>();
counter(); <span class="cm">// 1</span>, counter(); <span class="cm">// 2</span>

<span class="cm">// async/await with error handling</span>
<span class="kw">async function</span> <span class="fn">fetchData</span>(url) {
  <span class="kw">try</span> {
    <span class="kw">const</span> res = <span class="kw">await</span> <span class="fn">fetch</span>(url);
    <span class="kw">const</span> data = <span class="kw">await</span> res.<span class="fn">json</span>();
    <span class="kw">return</span> data;
  } <span class="kw">catch</span> (err) { console.<span class="fn">error</span>(err); }
}

<span class="cm">// Array methods chain</span>
<span class="kw">const</span> result = [<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>,<span class="num">4</span>,<span class="num">5</span>]
  .<span class="fn">filter</span>(n => n % <span class="num">2</span> === <span class="num">0</span>)   <span class="cm">// [2, 4]</span>
  .<span class="fn">map</span>(n => n * n)             <span class="cm">// [4, 16]</span>
  .<span class="fn">reduce</span>((acc, n) => acc + n, <span class="num">0</span>); <span class="cm">// 20</span>`
    }
  ],
  tips: [
    'Arrow functions are ideal for callbacks — they don\'t rebind `this`.',
    'Use optional chaining `?.` to safely access nested properties: user?.address?.city.',
    'Nullish coalescing `??` returns the right side only if left is null/undefined (unlike || which triggers on any falsy).',
    'Event loop: Promises (microtasks) resolve before setTimeout callbacks (macrotasks).',
  ]
},

];  // END OF TOPICS ARRAY — Part 1
// data2.js will push more topics into this array
