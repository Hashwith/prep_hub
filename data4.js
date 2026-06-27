// data4.js — AI/ML, NLP & LLMs, Docker, Git, Socket.IO
TOPICS.push(

{
  id: 'aiml',
  emoji: '🧠',
  title: 'AI / ML Fundamentals',
  category: 'AI / ML',
  tags: [{ label: 'ML', cls: 'ml' }, { label: 'Python', cls: 'python' }],
  desc: 'Core ML concepts — the training pipeline, neural network types (ANN/CNN/RNN), and evaluation metrics from your resume and the JD.',
  concepts: [
    { name: 'Supervised vs Unsupervised', desc: 'Supervised: labeled data, predict output (classification, regression). Unsupervised: no labels, find patterns (clustering, dimensionality reduction). Semi-supervised: mix of both.' },
    { name: 'Training Pipeline', desc: 'Data → Preprocessing → Feature Engineering → Model Selection → Training → Evaluation → Hyperparameter Tuning → Deployment.' },
    { name: 'ANN (Artificial Neural Net)', desc: 'Layers of neurons: Input → Hidden → Output. Each neuron: weighted sum + activation function. Backpropagation updates weights via gradient descent.' },
    { name: 'CNN (Convolutional NN)', desc: 'For image/spatial data. Convolutional layers learn local patterns (edges, shapes). Pooling reduces spatial size. Fully connected layers at end for classification.' },
    { name: 'RNN (Recurrent NN)', desc: 'For sequential data (time series, text). Hidden state carries context from previous steps. Problem: vanishing gradients. LSTM/GRU solve this with gating mechanisms.' },
    { name: 'Overfitting & Regularisation', desc: 'Overfitting: model memorises training data, fails on new data. Solutions: more data, dropout, L1/L2 regularisation, early stopping, data augmentation.' },
    { name: 'Evaluation Metrics', desc: 'Classification: Accuracy, Precision, Recall, F1-Score, AUC-ROC. Regression: MAE, MSE, RMSE, R². Use F1 when classes are imbalanced.' },
    { name: 'Feature Engineering', desc: 'Normalisation (0-1), Standardisation (z-score), one-hot encoding, handling missing values (mean/median/drop), PCA for dimensionality reduction.' },
  ],
  qa: [
    { q: 'What is the bias-variance tradeoff?', a: 'Bias: error from wrong assumptions (underfitting). Variance: error from sensitivity to training data noise (overfitting). Increasing model complexity reduces bias but increases variance. Goal: find the sweet spot with good generalisation.' },
    { q: 'What is gradient descent and its variants?', a: 'Gradient descent iteratively updates weights in the direction of the negative gradient to minimise loss. Batch GD: uses all data. SGD: one sample at a time. Mini-batch: small batches (most common). Adam: adaptive learning rates — most popular optimizer.' },
    { q: 'Explain how you trained your IPL prediction ANN.', a: 'Collected historical IPL data, performed EDA and feature engineering on match conditions, teams, players. Trained an ANN model using Keras, evaluated with accuracy/F1, and deployed via a React dashboard for win-probability visualisation.' },
    { q: 'What is the vanishing gradient problem?', a: 'In deep networks, gradients shrink exponentially as they flow back through layers — early layers learn very slowly. Solutions: ReLU activation, batch normalisation, LSTM/GRU gates, residual connections (ResNets).' },
    { q: 'What is cross-validation?', a: 'K-fold CV splits data into K folds, trains on K-1 folds, validates on the remaining fold, repeats K times. Gives a more reliable performance estimate than a single train/test split.' },
  ],
  code: [
    {
      label: 'Scikit-learn ML pipeline',
      body: `<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_score

pipe = <span class="fn">Pipeline</span>([
    (<span class="str">'scaler'</span>, <span class="fn">StandardScaler</span>()),
    (<span class="str">'model'</span>, <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">100</span>))
])

scores = <span class="fn">cross_val_score</span>(pipe, X, y, cv=<span class="num">5</span>, scoring=<span class="str">'f1'</span>)
<span class="fn">print</span>(<span class="str">f"F1: {scores.mean():.3f} ± {scores.std():.3f}"</span>)

pipe.<span class="fn">fit</span>(X_train, y_train)
preds = pipe.<span class="fn">predict</span>(X_test)`
    }
  ],
  tips: [
    'Always split data BEFORE any preprocessing — prevent data leakage from test set into training.',
    'Use confusion matrix to understand false positives vs false negatives — not just accuracy.',
    'Random state / seeds for reproducibility: random_state=42 in sklearn, tf.random.set_seed(42).',
    'Feature importance from tree models helps identify which features matter most.',
  ]
},

{
  id: 'nlp-llm',
  emoji: '💬',
  title: 'NLP & LLMs',
  category: 'AI / ML',
  tags: [{ label: 'ML', cls: 'ml' }, { label: 'Python', cls: 'python' }],
  desc: 'Natural Language Processing + Large Language Models. Directly required by the OpenText JD — document classification, intelligent search, prompt engineering.',
  concepts: [
    { name: 'NLP Pipeline', desc: 'Tokenisation → Lowercasing → Stop word removal → Stemming/Lemmatisation → Vectorisation (TF-IDF, word2vec) → Model.' },
    { name: 'Tokenisation', desc: 'Splitting text into tokens (words, subwords, chars). Subword tokenisers (BPE, WordPiece) handle unknown words — used by BERT, GPT.' },
    { name: 'Embeddings', desc: 'Dense vector representations. Word2Vec, GloVe: static per-word. BERT: contextual (same word, different meaning = different vector). Used for semantic search, similarity.' },
    { name: 'Transformers', desc: 'Self-attention mechanism — each token attends to all others. Encoder (BERT): understanding. Decoder (GPT): generation. Encoder-Decoder (T5, BART): translation, summarisation.' },
    { name: 'LLMs & Prompt Engineering', desc: 'Large pre-trained models (GPT-4, Gemini, LLaMA). Prompt engineering: zero-shot, few-shot, chain-of-thought. System/user/assistant roles. Temperature controls randomness.' },
    { name: 'RAG (Retrieval-Augmented Generation)', desc: 'Combine vector search (find relevant docs) + LLM (generate answer from context). Reduces hallucination, adds private knowledge without fine-tuning.' },
    { name: 'Document Classification', desc: 'Assign category to a document. Approaches: TF-IDF + logistic regression (fast), fine-tuned BERT (accurate), zero-shot with LLM. Used in the JD for metadata tagging.' },
    { name: 'Agentic AI', desc: 'LLM as reasoning engine that uses tools (web search, code exec, APIs). ReAct pattern: Reason → Act → Observe. Frameworks: LangChain, AutoGen, CrewAI.' },
  ],
  qa: [
    { q: 'What is the attention mechanism in transformers?', a: 'Attention computes a weighted sum of all token representations, where weights reflect relevance. Self-attention: query, key, value from the same sequence. Multi-head: run attention multiple times in parallel to capture different relationships.' },
    { q: 'What is TF-IDF?', a: 'Term Frequency × Inverse Document Frequency. TF: how often a word appears in a doc. IDF: penalises words appearing in many docs (common words like "the"). Result: high score for words distinctive to a document.' },
    { q: 'How would you build a document classifier for the JD role?', a: 'Collect labelled documents, extract features (TF-IDF or BERT embeddings), train classifier (Logistic Regression for baseline, fine-tuned BERT for production). Evaluate with F1-score on each category. Deploy as a Flask API.' },
    { q: 'What is prompt engineering?', a: 'Crafting input prompts to elicit desired behaviour from LLMs. Techniques: zero-shot (just ask), few-shot (give examples), chain-of-thought (ask to reason step-by-step), system prompts (set context/persona), structured output (ask for JSON).' },
    { q: 'What is the difference between fine-tuning and RAG?', a: 'Fine-tuning: update model weights on domain-specific data — expensive, bakes in knowledge. RAG: retrieve relevant docs at inference time and feed as context — flexible, updatable, no training needed. RAG is preferred for frequently changing data.' },
  ],
  code: [
    {
      label: 'Gemini AI API call (Python)',
      body: `<span class="kw">import</span> google.generativeai <span class="kw">as</span> genai

genai.<span class="fn">configure</span>(api_key=<span class="str">"YOUR_API_KEY"</span>)
model = genai.<span class="fn">GenerativeModel</span>(<span class="str">"gemini-1.5-flash"</span>)

<span class="cm"># Zero-shot classification</span>
prompt = <span class="str">"""Classify the following document into one of:
[invoice, contract, report, email].
Document: {doc_text}
Reply with only the category label."""</span>

response = model.<span class="fn">generate_content</span>(prompt.<span class="fn">format</span>(doc_text=doc))
<span class="fn">print</span>(response.text)  <span class="cm"># e.g. "invoice"</span>`
    }
  ],
  tips: [
    'For the JD: mention document classification, metadata tagging, and intelligent search in every answer.',
    'Chain-of-thought prompting significantly improves LLM accuracy on reasoning tasks.',
    'Vector databases (Pinecone, Chroma, FAISS) store embeddings for semantic search in RAG systems.',
    'Hallucination: LLMs confidently output wrong info. Always ground responses with retrieved context or source citations.',
  ]
},

{
  id: 'docker',
  emoji: '🐳',
  title: 'Docker',
  category: 'Tools',
  tags: [{ label: 'Tools', cls: 'tools' }],
  desc: 'Containerisation tool that packages your app with all its dependencies — runs the same everywhere.',
  concepts: [
    { name: 'Images vs Containers', desc: 'Image: read-only blueprint (Dockerfile → image). Container: running instance of an image. Multiple containers can run from one image.' },
    { name: 'Dockerfile', desc: 'FROM (base image), RUN (execute command during build), COPY (copy files), WORKDIR (set working dir), ENV (env vars), EXPOSE (document port), CMD (default command at runtime).' },
    { name: 'docker-compose', desc: 'Define multi-container apps in YAML. Services, networks, volumes. docker-compose up -d to start. Perfect for dev: app + DB + Redis together.' },
    { name: 'Volumes', desc: 'Persist data outside container lifecycle. Bind mounts: mount host dir into container. Named volumes: managed by Docker. Useful for DB data persistence.' },
    { name: 'Networking', desc: 'Containers in the same compose network communicate by service name (e.g. http://redis:6379). Bridge network by default. Expose port to host: ports: "3000:3000".' },
    { name: 'Layers & Caching', desc: 'Each Dockerfile instruction creates a layer. Layers are cached — unchanged layers aren\'t rebuilt. Put frequently changing instructions (COPY src) after stable ones (npm install).' },
  ],
  qa: [
    { q: 'What is the difference between CMD and ENTRYPOINT?', a: 'CMD: default command/args — can be overridden at runtime. ENTRYPOINT: always runs, CMD becomes default args to it. Use ENTRYPOINT for the executable, CMD for default arguments.' },
    { q: 'How do you reduce Docker image size?', a: 'Use slim/alpine base images, multi-stage builds (build in one stage, copy only artifacts to final stage), combine RUN commands to reduce layers, use .dockerignore to exclude node_modules/build artifacts.' },
    { q: 'What is a multi-stage build?', a: 'Use multiple FROM statements. First stage: build environment (compilers, dev deps). Second stage: minimal runtime image that only copies the built artifact. Result: much smaller production image.' },
    { q: 'How would you containerise a Node.js + MongoDB app?', a: 'Write Dockerfile for Node app. Create docker-compose.yml with two services: app (Node) and db (mongo). Link them on the same network. Use volume for MongoDB data. Set env vars for DB connection string.' },
  ],
  code: [
    {
      label: 'Node.js Dockerfile + docker-compose.yml',
      body: `<span class="cm"># Dockerfile</span>
FROM node:<span class="num">20</span>-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production  <span class="cm"># install before copying src</span>
COPY . .
EXPOSE <span class="num">3000</span>
CMD [<span class="str">"node"</span>, <span class="str">"src/index.js"</span>]

<span class="cm"># docker-compose.yml</span>
services:
  app:
    build: .
    ports: [<span class="str">"3000:3000"</span>]
    env_file: .env
    depends_on: [mongo, redis]
  mongo:
    image: mongo:<span class="num">7</span>
    volumes: [mongo_data:/data/db]
  redis:
    image: redis:<span class="num">7</span>-alpine
volumes:
  mongo_data:`
    }
  ],
  tips: [
    'Always use .dockerignore — exclude node_modules, .env, .git to keep images small.',
    'Pin image versions (node:20-alpine not node:latest) for reproducible builds.',
    'docker logs <container> and docker exec -it <container> sh for debugging.',
    'Use health checks in compose: healthcheck: test: ["CMD", "curl", "-f", "http://localhost:3000/health"].',
  ]
},

{
  id: 'git',
  emoji: '🌿',
  title: 'Git & GitHub',
  category: 'Tools',
  tags: [{ label: 'Tools', cls: 'tools' }],
  desc: 'Version control is non-negotiable. Know the common commands, branching strategies, and how to recover from mistakes.',
  concepts: [
    { name: 'Core concepts', desc: 'Working directory → Staging area (git add) → Repository (git commit). HEAD: current commit. Branch: lightweight pointer to a commit.' },
    { name: 'Branching', desc: 'git branch feature/x, git checkout -b feature/x (create+switch), git switch (modern). Branches are cheap — use them for every feature/fix.' },
    { name: 'Merge vs Rebase', desc: 'Merge: creates a merge commit, preserves history. Rebase: replays commits on top of another branch, linear history. Never rebase shared/public branches.' },
    { name: 'Common Commands', desc: 'git stash (save WIP), git cherry-pick (apply specific commit), git reset (move HEAD), git revert (create undo commit), git reflog (recover "lost" commits).' },
    { name: 'Git Flow', desc: 'main (production), develop (integration), feature/* (new features), hotfix/* (prod fixes), release/* (prep for release). Popular structured workflow.' },
    { name: 'Pull Requests', desc: 'Fork/clone → branch → commit → push → open PR → code review → merge. Squash commits for clean history. Link issues in PR description.' },
  ],
  qa: [
    { q: 'What is the difference between git merge and git rebase?', a: 'Merge creates a new merge commit combining two branches — history shows the branch. Rebase moves/replays your commits on top of the target branch — creates linear history. Rebase for local cleanup, merge for integrating public branches.' },
    { q: 'How do you undo the last commit without losing changes?', a: 'git reset --soft HEAD~1 — undoes commit, keeps changes staged. git reset --mixed HEAD~1 (default) — keeps changes unstaged. git reset --hard HEAD~1 — discards changes entirely.' },
    { q: 'What is git stash?', a: 'Temporarily saves your uncommitted changes (working dir + staging) so you can switch branches. git stash pop restores them. git stash list shows all stashed states.' },
    { q: 'How do you resolve a merge conflict?', a: 'Git marks conflicts with <<<<<<, =======, >>>>>> in the file. Edit the file to keep the correct code, remove the markers. Then git add <file> and git commit to complete the merge.' },
  ],
  code: [
    {
      label: 'Useful Git commands',
      body: `<span class="cm"># Undo last commit, keep changes staged</span>
git reset --soft HEAD~<span class="num">1</span>

<span class="cm"># Interactive rebase (squash last 3 commits)</span>
git rebase -i HEAD~<span class="num">3</span>

<span class="cm"># Stash and apply later</span>
git stash push -m <span class="str">"WIP: auth feature"</span>
git stash pop

<span class="cm"># See what changed in a commit</span>
git show &lt;commit-hash&gt;

<span class="cm"># Find which commit introduced a bug</span>
git bisect start
git bisect bad          <span class="cm"># current is broken</span>
git bisect good v1.0    <span class="cm"># this was fine</span>
<span class="cm"># git bisect auto binary-searches commits</span>`
    }
  ],
  tips: [
    'Commit messages: "feat: add JWT auth" not "fix stuff". Use Conventional Commits.',
    'git log --oneline --graph --all — visualise branch history in terminal.',
    'Never force push to main/develop — only to your own feature branches.',
    '.gitignore: add node_modules/, .env, __pycache__, .DS_Store from day one.',
  ]
},

{
  id: 'socketio',
  emoji: '⚡',
  title: 'Socket.IO & Real-Time',
  category: 'Backend',
  tags: [{ label: 'JavaScript', cls: 'js' }],
  desc: 'WebSocket library used in your AI Customer Support project for real-time escalation pipelines with concurrent connections.',
  concepts: [
    { name: 'WebSockets vs HTTP', desc: 'HTTP: request-response, stateless. WebSocket: persistent bidirectional connection over TCP. Socket.IO adds fallback (long-polling), rooms, namespaces, auto-reconnect on top of WebSocket.' },
    { name: 'Events', desc: 'socket.emit(\'event\', data) sends. socket.on(\'event\', callback) receives. Both server and client can emit/listen. io.emit broadcasts to everyone.' },
    { name: 'Rooms', desc: 'socket.join(\'room-1\'), io.to(\'room-1\').emit(). Organise connections into groups. Used for chat rooms, per-user notifications, agent sessions.' },
    { name: 'Namespaces', desc: '/chat, /admin — separate communication channels on the same server. Each namespace has own events, rooms, middleware. socket.of(\'/chat\').' },
    { name: 'Scaling with Redis Adapter', desc: 'Single server: Socket.IO works fine. Multiple servers: use @socket.io/redis-adapter — Redis pub/sub syncs events across server instances.' },
    { name: 'Connection lifecycle', desc: 'connect → (events) → disconnect. io.on(\'connection\', socket => { ... }). socket.id is unique per connection. socket.data for per-socket storage.' },
  ],
  qa: [
    { q: 'What is the difference between socket.emit and io.emit?', a: 'socket.emit: sends to that specific client only. io.emit: broadcasts to ALL connected clients. socket.to(room).emit: sends to everyone in a room except the sender. io.to(room).emit: sends to everyone in the room including sender.' },
    { q: 'How did you use Socket.IO in your AI project?', a: 'Built a real-time escalation pipeline — when AI couldn\'t resolve a query, it escalated to a human agent via Socket.IO events. Redis-backed sessions maintained agent connection state for low-latency, high-throughput concurrent connections.' },
    { q: 'How do you handle Socket.IO across multiple Node.js instances?', a: 'Socket.IO state is in-memory per instance. With multiple servers (load balanced), use the Redis adapter (@socket.io/redis-adapter) — it uses Redis pub/sub to relay events between all server instances.' },
    { q: 'What is the Socket.IO handshake?', a: 'Socket.IO first attempts WebSocket upgrade. If it fails (proxies, firewalls), it falls back to HTTP long-polling. The handshake exchanges session info and authentication data (query params or auth object).' },
  ],
  code: [
    {
      label: 'Socket.IO server + client setup',
      body: `<span class="cm">// Server (Node.js)</span>
<span class="kw">const</span> io = <span class="fn">require</span>(<span class="str">'socket.io'</span>)(server, {
  cors: { origin: <span class="str">'http://localhost:3000'</span> }
});

io.<span class="fn">on</span>(<span class="str">'connection'</span>, socket => {
  console.<span class="fn">log</span>(<span class="str">'connected:'</span>, socket.id);

  socket.<span class="fn">on</span>(<span class="str">'join-room'</span>, (roomId) => {
    socket.<span class="fn">join</span>(roomId);
    io.<span class="fn">to</span>(roomId).<span class="fn">emit</span>(<span class="str">'user-joined'</span>, socket.id);
  });

  socket.<span class="fn">on</span>(<span class="str">'message'</span>, ({ room, text }) => {
    io.<span class="fn">to</span>(room).<span class="fn">emit</span>(<span class="str">'message'</span>, { text, from: socket.id });
  });

  socket.<span class="fn">on</span>(<span class="str">'disconnect'</span>, () => console.<span class="fn">log</span>(<span class="str">'left'</span>));
});

<span class="cm">// Client (React)</span>
<span class="kw">const</span> socket = <span class="fn">io</span>(<span class="str">'http://localhost:5000'</span>);
socket.<span class="fn">emit</span>(<span class="str">'join-room'</span>, <span class="str">'support-123'</span>);
socket.<span class="fn">on</span>(<span class="str">'message'</span>, (msg) => console.<span class="fn">log</span>(msg));`
    }
  ],
  tips: [
    'Always handle the disconnect event to clean up rooms, notify other users.',
    'Use socket.data to attach per-socket state (user info after auth).',
    'Middleware: io.use((socket, next) => { /* auth check */ next(); }) — runs before connection event.',
    'Emit acknowledgements: socket.emit("event", data, (response) => {}) — confirm delivery.',
  ]
},

);
