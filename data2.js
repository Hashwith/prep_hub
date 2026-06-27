// data2.js — React, Node/Express, REST, Flask
TOPICS.push(

{
  id: 'react',
  emoji: '⚛️',
  title: 'React.js',
  category: 'Frontend',
  tags: [{ label: 'JavaScript', cls: 'js' }],
  desc: 'Component-based UI library. Understanding hooks, the rendering model, and state management is essential.',
  concepts: [
    { name: 'JSX', desc: 'Syntax extension — looks like HTML, compiles to React.createElement(). Expressions go in {}. className not class.' },
    { name: 'useState', desc: 'const [val, setVal] = useState(initial). State is immutable — never mutate directly. Triggers re-render on change.' },
    { name: 'useEffect', desc: 'Side effects (fetch, subscriptions, DOM). Runs after render. Return cleanup fn. [] = run once, [dep] = on dep change.' },
    { name: 'useRef', desc: 'Persists value across renders without triggering re-render. Also accesses DOM nodes (ref.current).' },
    { name: 'useContext', desc: 'Consume a Context without prop drilling. createContext() → Provider → useContext(ctx) in any child.' },
    { name: 'useMemo / useCallback', desc: 'useMemo: caches expensive computed value. useCallback: caches function reference. Both take dependency arrays.' },
    { name: 'Props & lifting state', desc: 'Props flow down (parent → child). To share state between siblings, lift it to the common ancestor.' },
    { name: 'Keys in lists', desc: 'Unique key prop helps React identify changed items during reconciliation. Never use array index as key for dynamic lists.' },
  ],
  qa: [
    { q: 'What is the virtual DOM?', a: 'A lightweight JS copy of the real DOM. React diffs the new virtual DOM against the previous one (reconciliation) and only updates the real DOM where things changed — making updates efficient.' },
    { q: 'What are the rules of Hooks?', a: '1) Only call Hooks at the top level — not inside loops, conditions, or nested functions. 2) Only call Hooks from React function components or custom Hooks.' },
    { q: 'How do you prevent unnecessary re-renders?', a: 'React.memo() for components, useMemo() for values, useCallback() for functions. Also use proper key props and avoid creating objects/arrays inline in JSX.' },
    { q: 'Controlled vs Uncontrolled components?', a: 'Controlled: form element value is driven by React state (value + onChange). Uncontrolled: DOM manages its own state, accessed via useRef. Controlled is preferred for validation.' },
    { q: 'What is useEffect cleanup?', a: 'The function returned from useEffect runs before the next effect and on unmount. Used to clear timers, cancel fetch requests, remove event listeners — prevents memory leaks.' },
  ],
  code: [
    {
      label: 'useState + useEffect + fetch',
      body: `<span class="kw">function</span> <span class="cls">UserList</span>() {
  <span class="kw">const</span> [users, setUsers] = <span class="fn">useState</span>([]);
  <span class="kw">const</span> [loading, setLoading] = <span class="fn">useState</span>(<span class="kw">true</span>);

  <span class="fn">useEffect</span>(() => {
    <span class="kw">let</span> cancelled = <span class="kw">false</span>;
    <span class="fn">fetch</span>(<span class="str">'/api/users'</span>)
      .<span class="fn">then</span>(r => r.<span class="fn">json</span>())
      .<span class="fn">then</span>(data => { <span class="kw">if</span> (!cancelled) <span class="fn">setUsers</span>(data); })
      .<span class="fn">finally</span>(() => <span class="fn">setLoading</span>(<span class="kw">false</span>));
    <span class="kw">return</span> () => { cancelled = <span class="kw">true</span>; }; <span class="cm">// cleanup</span>
  }, []); <span class="cm">// empty array = run once</span>

  <span class="kw">if</span> (loading) <span class="kw">return</span> &lt;<span class="cls">p</span>&gt;Loading...&lt;/<span class="cls">p</span>&gt;;
  <span class="kw">return</span> &lt;<span class="cls">ul</span>&gt;{users.<span class="fn">map</span>(u => &lt;<span class="cls">li</span> key={u.id}&gt;{u.name}&lt;/<span class="cls">li</span>&gt;)}&lt;/<span class="cls">ul</span>&gt;;
}`
    }
  ],
  tips: [
    'Never mutate state directly — always create a new copy: setList([...list, newItem]).',
    'useEffect with no deps runs every render — almost never what you want.',
    'Custom hooks (useXxx) let you extract and reuse stateful logic between components.',
    'React.StrictMode renders twice in dev to detect side effects — expect double console logs.',
  ]
},

{
  id: 'nodejs',
  emoji: '🟢',
  title: 'Node.js & Express.js',
  category: 'Backend',
  tags: [{ label: 'JavaScript', cls: 'js' }],
  desc: 'Node.js runs JS on the server using an event-driven, non-blocking I/O model. Express is the minimal web framework on top of it.',
  concepts: [
    { name: 'Event Loop', desc: 'Node runs on a single thread. I/O is offloaded to libuv. Phases: timers → I/O callbacks → idle → poll → check (setImmediate) → close. process.nextTick runs before each phase.' },
    { name: 'Modules (CommonJS / ESM)', desc: 'CommonJS: require() / module.exports. ESM: import/export (use "type":"module" in package.json). Both coexist but mixing needs care.' },
    { name: 'Middleware', desc: 'Functions with (req, res, next). Called in order. Call next() to pass to next middleware, next(err) to skip to error handler.' },
    { name: 'Error Handling', desc: 'Express error middleware has 4 args: (err, req, res, next). Must be defined last. Async errors need try/catch + next(err).' },
    { name: 'Router', desc: 'express.Router() creates mini-apps for route grouping. Mount with app.use(\'/api\', router).' },
    { name: 'Streams', desc: 'Readable, Writable, Transform, Duplex. Used for large file processing without loading into memory. pipe() chains streams.' },
  ],
  qa: [
    { q: 'Why is Node.js good for I/O-heavy applications?', a: 'Non-blocking I/O means Node doesn\'t wait for disk/network — it registers a callback and continues processing. Excellent for APIs, real-time apps. Not great for CPU-heavy tasks (blocks the event loop).' },
    { q: 'What is the difference between process.nextTick() and setImmediate()?', a: 'nextTick fires before the next event loop iteration (highest priority). setImmediate fires in the check phase after I/O callbacks. nextTick can starve I/O if used recursively.' },
    { q: 'How do you handle async errors in Express?', a: 'Wrap async route handlers in try/catch and call next(err), or use a wrapper like express-async-handler. Define a 4-param error middleware at the end of your app.' },
    { q: 'What is CORS and how do you enable it?', a: 'Cross-Origin Resource Sharing — browser security that blocks requests from different origins. Enable with the cors npm package: app.use(cors({ origin: \'http://frontend.com\' })).' },
  ],
  code: [
    {
      label: 'Express REST API structure',
      body: `<span class="kw">const</span> express = <span class="fn">require</span>(<span class="str">'express'</span>);
<span class="kw">const</span> app = <span class="fn">express</span>();
app.<span class="fn">use</span>(express.<span class="fn">json</span>());

<span class="cm">// Middleware</span>
app.<span class="fn">use</span>((req, res, next) => {
  console.<span class="fn">log</span>(<span class="str">\`\${req.method} \${req.path}\`</span>);
  <span class="fn">next</span>();
});

<span class="cm">// Async route with error handling</span>
app.<span class="fn">get</span>(<span class="str">'/users/:id'</span>, <span class="kw">async</span> (req, res, next) => {
  <span class="kw">try</span> {
    <span class="kw">const</span> user = <span class="kw">await</span> User.<span class="fn">findById</span>(req.params.id);
    <span class="kw">if</span> (!user) <span class="kw">return</span> res.<span class="fn">status</span>(<span class="num">404</span>).<span class="fn">json</span>({ error: <span class="str">'Not found'</span> });
    res.<span class="fn">json</span>(user);
  } <span class="kw">catch</span> (err) { <span class="fn">next</span>(err); }
});

<span class="cm">// Global error handler (4 params!)</span>
app.<span class="fn">use</span>((err, req, res, next) => {
  res.<span class="fn">status</span>(err.status || <span class="num">500</span>).<span class="fn">json</span>({ error: err.message });
});`
    }
  ],
  tips: [
    'Never put business logic in routes — use service/controller layers.',
    'Use helmet for security headers, morgan for request logging.',
    'Environment variables via dotenv — never hardcode secrets.',
    'Rate limiting (express-rate-limit) prevents brute force and DoS.',
  ]
},

{
  id: 'rest-api',
  emoji: '🔌',
  title: 'REST APIs',
  category: 'Backend',
  tags: [{ label: 'JavaScript', cls: 'js' }],
  desc: 'REST (Representational State Transfer) is the dominant API design style. Know the principles, HTTP semantics, and best practices cold.',
  concepts: [
    { name: 'HTTP Methods', desc: 'GET (read), POST (create), PUT (replace), PATCH (partial update), DELETE (remove). GET/HEAD/OPTIONS are safe+idempotent. PUT/DELETE are idempotent.' },
    { name: 'Status Codes', desc: '2xx success (200 OK, 201 Created, 204 No Content). 3xx redirect. 4xx client error (400 Bad Request, 401 Unauth, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable). 5xx server error.' },
    { name: 'REST Constraints', desc: 'Stateless (no server-side session), Client-Server separation, Cacheable, Uniform Interface (nouns not verbs in URLs), Layered System.' },
    { name: 'Authentication', desc: 'JWT: stateless token (header.payload.signature). Sent as Bearer token. OAuth2: delegated authorization. API Keys: simple, for server-to-server.' },
    { name: 'Pagination', desc: 'Offset/limit: ?page=2&limit=20. Cursor-based: ?cursor=lastId (better for large datasets, no drift). Return total count and next cursor in response.' },
    { name: 'Versioning', desc: 'URL versioning (/api/v1/), header versioning (Accept: application/vnd.api+json;version=1), query param (?version=1). URL versioning is most common.' },
  ],
  qa: [
    { q: 'What is the difference between PUT and PATCH?', a: 'PUT replaces the entire resource (send all fields). PATCH partially updates (send only changed fields). PUT is idempotent — calling it multiple times gives the same result.' },
    { q: 'How does JWT authentication work?', a: 'Server creates a signed token (header.payload.signature) using a secret key. Client stores it and sends it in Authorization: Bearer <token> header. Server verifies signature on each request — no DB lookup needed for stateless auth.' },
    { q: 'What is idempotency and why does it matter?', a: 'An operation is idempotent if repeating it multiple times has the same effect as calling it once. GET, PUT, DELETE are idempotent. POST is not. Important for retry logic in distributed systems.' },
    { q: 'How would you design an API for creating a user?', a: 'POST /api/users with JSON body {name, email, password}. Validate input, hash password, save to DB, return 201 with the created user (minus password). Include Location header with /api/users/{id}.' },
  ],
  code: [
    {
      label: 'RESTful URL design',
      body: `<span class="cm">// ✅ Good REST design (nouns, hierarchical)</span>
GET    /api/users          <span class="cm">// list users</span>
POST   /api/users          <span class="cm">// create user</span>
GET    /api/users/:id      <span class="cm">// get one user</span>
PATCH  /api/users/:id      <span class="cm">// update user</span>
DELETE /api/users/:id      <span class="cm">// delete user</span>
GET    /api/users/:id/orders  <span class="cm">// nested resource</span>

<span class="cm">// ❌ Avoid (verbs in URLs)</span>
POST /api/createUser
GET  /api/getUser?id=1`
    }
  ],
  tips: [
    '401 Unauthorized = not authenticated. 403 Forbidden = authenticated but not permitted.',
    'Always return consistent error shape: { error: { code, message, details } }.',
    'Use plural nouns for collections (/users not /user).',
    'Include API versioning from day one — retrofitting is painful.',
  ]
},

{
  id: 'flask',
  emoji: '🐍',
  title: 'Flask (Python)',
  category: 'Backend',
  tags: [{ label: 'Python', cls: 'python' }],
  desc: 'Flask is a lightweight Python web microframework. Used in your AI Customer Support project for RESTful backend APIs.',
  concepts: [
    { name: 'App & Routes', desc: 'app = Flask(__name__). @app.route(\'/path\', methods=[\'GET\',\'POST\']). Route functions return response string, JSON, or Response object.' },
    { name: 'Blueprints', desc: 'Modular routing — define routes in separate files, register with app.register_blueprint(bp, url_prefix=\'/api\'). Essential for large apps.' },
    { name: 'Request & Response', desc: 'request.json, request.args (query params), request.form, request.headers. Return jsonify(data) with status: return jsonify(obj), 201.' },
    { name: 'Error Handling', desc: '@app.errorhandler(404) decorator. abort(404) triggers error handlers. Flask-specific: use custom AppError class + error handler to standardise responses.' },
    { name: 'CORS', desc: 'flask-cors: CORS(app) or CORS(app, origins=["http://localhost:3000"]). Required when React frontend is on a different port.' },
    { name: 'Application Context', desc: 'app.app_context() / g object for per-request globals. current_app proxy accesses the app in blueprints.' },
  ],
  qa: [
    { q: 'What is the difference between Flask and Django?', a: 'Flask is a microframework — minimal, you add what you need (ORM, auth, etc.). Django is batteries-included (ORM, admin, auth built in). Flask is better for APIs and ML services; Django for full-featured web apps.' },
    { q: 'How do you handle authentication in Flask?', a: 'Commonly with flask-jwt-extended (JWT tokens) or flask-login (session-based). Decorate protected routes with @jwt_required() or @login_required.' },
    { q: 'What is a Flask application factory?', a: 'A create_app() function that creates and configures the Flask app. Allows different configs (dev/test/prod) and makes the app testable — you can create multiple instances without global state.' },
    { q: 'How did you use Flask in your AI Customer Support project?', a: 'Designed RESTful Flask APIs with clean separation of concerns, modular blueprint architecture, and structured error handling to interface the Gemini AI backend with the React frontend.' },
  ],
  code: [
    {
      label: 'Flask Blueprint + error handler',
      body: `<span class="cm"># routes/users.py</span>
<span class="kw">from</span> flask <span class="kw">import</span> Blueprint, jsonify, request
<span class="kw">from</span> services.user_service <span class="kw">import</span> get_user

bp = <span class="fn">Blueprint</span>(<span class="str">'users'</span>, __name__, url_prefix=<span class="str">'/api/users'</span>)

@bp.<span class="fn">route</span>(<span class="str">'/<int:user_id>'</span>, methods=[<span class="str">'GET'</span>])
<span class="kw">def</span> <span class="fn">user_detail</span>(user_id):
    user = <span class="fn">get_user</span>(user_id)
    <span class="kw">if not</span> user:
        <span class="kw">return</span> <span class="fn">jsonify</span>({<span class="str">'error'</span>: <span class="str">'Not found'</span>}), <span class="num">404</span>
    <span class="kw">return</span> <span class="fn">jsonify</span>(user)

<span class="cm"># app.py — application factory</span>
<span class="kw">def</span> <span class="fn">create_app</span>(config=<span class="kw">None</span>):
    app = <span class="fn">Flask</span>(__name__)
    <span class="kw">from</span> routes.users <span class="kw">import</span> bp
    app.<span class="fn">register_blueprint</span>(bp)
    <span class="kw">return</span> app`
    }
  ],
  tips: [
    'Use flask-smorest or flask-restx for automatic OpenAPI/Swagger docs.',
    'Never use app.run() in production — use gunicorn or uwsgi.',
    'flask.g is per-request storage (not per-app). Great for storing DB connections.',
    'Set FLASK_ENV=development for debug mode and auto-reload.',
  ]
},

);
