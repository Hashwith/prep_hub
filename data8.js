// data8.js — AI/ML Deep Dive (OpenText JD + Resume alignment)
TOPICS.push(

{
  id: 'ml-fundamentals',
  emoji: '🧠',
  title: 'Machine Learning Fundamentals',
  category: 'AI / ML',
  tags: [{ label: 'AI/ML', cls: 'ml' }, { label: 'Python', cls: 'python' }],
  desc: 'The core ML concepts you must know cold for OpenText and any AI/ML role — supervised learning, model evaluation, bias-variance, and regularization.',
  concepts: [
    { name: 'Supervised vs Unsupervised vs RL', desc: 'Supervised: labeled data, predict output (classification, regression). Unsupervised: no labels, find structure (clustering, dimensionality reduction). Reinforcement: agent learns from reward signals by interacting with environment. Semi-supervised: small labeled + large unlabeled. Self-supervised: create labels from data (GPT, BERT).' },
    { name: 'Bias-Variance Tradeoff', desc: 'Bias: error from wrong assumptions (underfitting). Variance: error from sensitivity to training data (overfitting). Total Error = Bias² + Variance + Irreducible Noise. High bias → simplify model or add features. High variance → more data, regularization, simpler model, ensembles.' },
    { name: 'Overfitting & Underfitting', desc: 'Overfitting: model memorizes training data, fails on new data. Signs: high train accuracy, low val accuracy. Fixes: regularization (L1/L2), dropout, more data, data augmentation, early stopping, simpler model. Underfitting: model too simple. Fixes: more features, increase model complexity, reduce regularization.' },
    { name: 'Train/Val/Test Split', desc: 'Train (60-70%): model learns. Validation (10-20%): hyperparameter tuning. Test (10-20%): unbiased final evaluation. Never touch test set during development. Cross-validation: k-fold splits data into k parts, train on k-1, validate on 1, repeat. Use when data is small.' },
    { name: 'Feature Engineering', desc: 'Normalization (0-1 range), Standardization (mean=0, std=1). Encoding categoricals: One-Hot (sparse, no ordinal), Label Encoding (ordinal implied). Feature selection: correlation, mutual information, recursive feature elimination. Dimensionality reduction: PCA, t-SNE, UMAP.' },
    { name: 'Model Evaluation Metrics', desc: 'Classification: Accuracy (bad for imbalanced), Precision (TP/(TP+FP)), Recall (TP/(TP+FN)), F1 (harmonic mean), AUC-ROC (area under ROC curve). Regression: MAE (robust to outliers), MSE (penalizes large errors), RMSE, R² (proportion of variance explained). Confusion matrix: TP/FP/TN/FN.' },
    { name: 'Regularization', desc: 'Penalize large weights to prevent overfitting. L1 (Lasso): adds |w|, drives weights to zero (sparse features, feature selection). L2 (Ridge): adds w², shrinks all weights (no sparsity). Elastic Net: both L1+L2. Dropout in neural nets: randomly zero neurons during training.' },
    { name: 'Gradient Descent', desc: 'Minimizes loss function by following negative gradient. Batch GD: uses all data — stable but slow. SGD: one sample at a time — noisy but fast. Mini-batch (most common): subset of data. Momentum, Adam, RMSProp: adaptive learning rates. Learning rate: too high → diverge, too low → slow.' },
    { name: 'Cross-Validation', desc: 'k-Fold: split data into k folds, train on k-1, test on 1, repeat k times, average results. Stratified k-Fold: maintains class distribution — use for imbalanced datasets. Leave-One-Out: extreme k-Fold where k=n. Time Series: forward chaining (no shuffling, respects temporal order).' },
    { name: 'Hyperparameter Tuning', desc: 'Grid Search: exhaustive search over specified values. Random Search: randomly samples — faster, often better. Bayesian Optimization: uses prior results to guide search (Optuna, Hyperopt). Learning rate, n_estimators, max_depth, regularization strength, batch size, architecture.' },
  ],
  qa: [
    { q: 'Explain the bias-variance tradeoff.', a: 'A model with high bias makes wrong assumptions (e.g., fitting a line to nonlinear data) — underfits. High variance learns noise in training data — overfits. The tradeoff: as you increase model complexity, bias decreases but variance increases. Optimal model minimizes total error. Ensemble methods (bagging reduces variance, boosting reduces bias) help navigate this tradeoff.' },
    { q: 'When would you use F1 score instead of accuracy?', a: 'When classes are imbalanced. Example: spam detection — 99% legitimate emails. A model predicting everything as legitimate gets 99% accuracy but is useless. F1 = 2 × (Precision × Recall) / (Precision + Recall) penalizes both false positives and false negatives. F1 macro: average per class. F1 weighted: weighted by support. Use F1 when both precision and recall matter.' },
    { q: 'What is the difference between precision and recall?', a: 'Precision: of all predictions of class X, how many were actually X? (How many I said were spam were actually spam?) Recall: of all actual class X instances, how many did I predict as X? (How many actual spams did I catch?) Precision-recall tradeoff: lowering threshold → more positives → higher recall, lower precision. Use precision when false positives costly (fraud alerts). Use recall when false negatives costly (cancer diagnosis).' },
    { q: 'How does PCA work and when do you use it?', a: 'Principal Component Analysis: finds directions of maximum variance in data. 1) Standardize data. 2) Compute covariance matrix. 3) Eigendecomposition. 4) Sort eigenvectors by eigenvalue (variance explained). 5) Project data onto top k components. Use: remove correlated features, speed up training, visualization (t-SNE for high-dim data). Limitation: loses interpretability.' },
    { q: 'What is the curse of dimensionality?', a: 'As features increase, data becomes sparse — distance metrics lose meaning. Volume of space grows exponentially, requiring exponentially more data. ML models struggle because "nearby" points become as far as "distant" ones. Solutions: PCA/UMAP for dim reduction, feature selection, regularization, more data.' },
  ],
  code: [
    {
      label: 'Scikit-learn pipeline with cross-validation',
      body: `<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_score

pipe = <span class="cls">Pipeline</span>([
    (<span class="str">'scaler'</span>, <span class="cls">StandardScaler</span>()),
    (<span class="str">'clf'</span>,    <span class="cls">RandomForestClassifier</span>(n_estimators=<span class="num">100</span>, random_state=<span class="num">42</span>))
])

scores = <span class="fn">cross_val_score</span>(pipe, X, y, cv=<span class="num">5</span>, scoring=<span class="str">'f1_weighted'</span>)
<span class="fn">print</span>(<span class="str">f"F1: {scores.mean():.3f} ± {scores.std():.3f}"</span>)`
    }
  ],
  tips: [
    'Always baseline with a simple model (logistic regression, dummy classifier) before going complex.',
    'StandardScaler for algorithms using distance or gradients (SVM, KNN, neural nets). Tree-based models (RF, XGBoost) don\'t need scaling.',
    'Class imbalance: oversample minority (SMOTE), undersample majority, class_weight="balanced".',
    'AUC-ROC measures ranking quality; independent of threshold. Great for imbalanced data comparison.',
  ]
},

{
  id: 'deep-learning',
  emoji: '🔮',
  title: 'Deep Learning (ANN, CNN, RNN)',
  category: 'AI / ML',
  tags: [{ label: 'AI/ML', cls: 'ml' }, { label: 'Python', cls: 'python' }],
  desc: 'Neural networks from the ground up — the architecture behind your IPL prediction and AI customer support projects. Required for OpenText.',
  concepts: [
    { name: 'Perceptron & ANN', desc: 'Perceptron: weighted inputs → activation → output. ANN: layers of perceptrons. Input → Hidden → Output. Activation function introduces non-linearity. Without it, ANN = linear regression regardless of depth. Forward pass → compute loss → backpropagation → update weights.' },
    { name: 'Activation Functions', desc: 'Sigmoid: 0-1, used for binary classification output. Tanh: -1 to 1, zero-centered. ReLU: max(0,x), fast, sparse — most common for hidden layers. Leaky ReLU: fixes dying ReLU (negative slope α). Softmax: multi-class output (probabilities sum to 1). GELU: used in Transformers.' },
    { name: 'Backpropagation', desc: 'Compute gradient of loss w.r.t. each weight using chain rule. Forward pass: compute predictions and loss. Backward pass: propagate gradient from output to input layer. Update: w = w - lr × ∂L/∂w. Requires: differentiable activations, loss function. Implemented automatically by autograd (PyTorch, TensorFlow).' },
    { name: 'CNN Architecture', desc: 'Convolutional layer: filters slide over input (feature maps). Pooling: max/avg pooling reduces spatial dimensions. Fully Connected: final classification. Key: parameter sharing (same filter across image), local connectivity, translational invariance. Architectures: VGG, ResNet (skip connections), InceptionNet, EfficientNet.' },
    { name: 'RNN & LSTM', desc: 'RNN: hidden state passes through time — processes sequences. Vanishing gradient problem for long sequences. LSTM: adds cell state + 3 gates (forget, input, output) — learns long-range dependencies. GRU: simpler (2 gates), faster, comparable performance. Used for: text, time series, speech.' },
    { name: 'Transformers & Attention', desc: 'Self-attention: each token attends to all others. Multi-head attention: multiple attention heads in parallel. Positional encoding: adds position info (no recurrence). BERT: bidirectional, encoder-only, masked language model. GPT: decoder-only, causal (left-to-right). T5: encoder-decoder, text-to-text.' },
    { name: 'Transfer Learning & Fine-tuning', desc: 'Pre-trained model on large dataset (ImageNet, Wikipedia). Transfer weights, fine-tune on target task. Feature extraction: freeze base, train only head. Full fine-tuning: train all layers (needs more data). Parameter-efficient: LoRA, prefix-tuning (few trainable parameters). Your Gemini API usage = using a pre-trained LLM.' },
    { name: 'Loss Functions', desc: 'Regression: MSE (sensitive to outliers), MAE (robust), Huber (blend). Binary classification: Binary Cross-Entropy. Multi-class: Categorical Cross-Entropy (after softmax). Multi-label: Binary CE per label. Contrastive/Triplet: metric learning.' },
    { name: 'Batch Normalization & Dropout', desc: 'BatchNorm: normalize activations within mini-batch (mean=0, std=1), then scale+shift. Enables higher learning rates, acts as regularizer. Dropout: randomly zero p% of neurons during training. Prevents co-adaptation. At inference: multiply by (1-p) or use inverted dropout (PyTorch/TF default).' },
    { name: 'Optimizers', desc: 'SGD + momentum: robust, manual LR tuning. Adam: adaptive LR (uses first + second moments). Good default. AdamW: Adam + weight decay (fixed L2). Better for Transformers. RMSProp: good for RNNs. Cosine annealing, warmup schedules: standard for Transformer training.' },
  ],
  qa: [
    { q: 'Explain how backpropagation works.', a: 'Backpropagation uses the chain rule to compute gradients of the loss with respect to each weight. 1) Forward pass: input → predictions → compute loss. 2) Backward pass: compute ∂L/∂output, then chain rule backward: ∂L/∂w_i = ∂L/∂output × ∂output/∂w_i. 3) Update weights: w -= lr × ∂L/∂w. Frameworks (PyTorch, TF) build a computational graph and auto-differentiate.' },
    { q: 'What is vanishing gradient and how do LSTMs solve it?', a: 'In deep RNNs, gradients are multiplied through many time steps. Small values → gradient approaches 0 (vanishing) — early layers stop learning. Large values → gradient explodes (use gradient clipping). LSTMs solve this via the cell state: a "highway" with additive updates (not multiplicative), controlled by gates. Gradient can flow across many steps without shrinking.' },
    { q: 'What is the difference between CNN and RNN?', a: 'CNN: processes spatial data (images, audio spectrograms). Uses convolutional filters — detects local patterns regardless of position. No memory across positions unless layered deep. RNN: processes sequential data with memory — hidden state passed to next step. CNN is parallelizable; RNN is sequential (slow). Transformers replace both for many tasks using attention.' },
    { q: 'What is transfer learning and why is it useful?', a: 'A model pre-trained on a large general task is reused for a specific task. Benefits: 1) Needs far less labeled data (lower layers learn general features). 2) Much faster training. 3) Better performance with small datasets. Example: VGG16 trained on ImageNet → fine-tune last layers for medical image classification. In NLP: BERT/GPT pre-trained on web text → fine-tune on your dataset.' },
    { q: 'How did you build the IPL prediction model?', a: 'Collected historical IPL match data (batting, bowling, venue, team). Feature engineering: win percentages, head-to-head records, player form. ANN trained with Keras: input layer → 2 hidden layers (ReLU, dropout) → sigmoid output. Loss: Binary Cross-Entropy. Evaluated with accuracy and AUC-ROC. React dashboard displays win probability in real-time as match state updates.' },
  ],
  tips: [
    'ResNet skip connections (residual connections) solve vanishing gradient for very deep CNNs.',
    'Batch size: smaller → noisier gradients, better generalization. Larger → faster but may overfit.',
    'Learning rate warmup: start small, increase to base LR, then decay. Standard for Transformers.',
    'torch.no_grad() during inference — saves memory and compute, avoids building computational graph.',
  ]
},

{
  id: 'nlp',
  emoji: '💬',
  title: 'Natural Language Processing (NLP)',
  category: 'AI / ML',
  tags: [{ label: 'AI/ML', cls: 'ml' }],
  desc: 'NLP is a core requirement for the OpenText JD — document classification, embeddings, transformers, and LLMs. Deep knowledge here is critical.',
  concepts: [
    { name: 'Text Preprocessing', desc: 'Tokenization: split into words/subwords/chars. Lowercasing, punctuation removal, stopword removal. Stemming (Porter: running→run) vs Lemmatization (returns dictionary form, POS-aware). TF-IDF: term frequency × inverse document frequency — weighs rare, important words.' },
    { name: 'Word Embeddings', desc: 'Word2Vec: predicts word from context (CBOW) or context from word (Skip-gram). Similar words have similar vectors. GloVe: matrix factorization on co-occurrence. FastText: char n-gram embeddings, handles OOV. Contextual: BERT — same word, different vectors in different contexts.' },
    { name: 'Transformer Architecture', desc: 'Input tokens → embeddings + positional encoding. Multi-head self-attention: each token attends to all. Feed-forward network per position. Layer normalization + residual connections. Encoder-only (BERT): classification, NER. Decoder-only (GPT): generation. Encoder-decoder (T5, BART): translation, summarization.' },
    { name: 'BERT & Fine-tuning', desc: 'Bidirectional Encoder Representations from Transformers. Pre-trained on Masked Language Modeling (MLM) and Next Sentence Prediction (NSP). Fine-tune by adding classification head. Downstream tasks: text classification, NER, QA, sentiment. DistilBERT: 40% smaller, 60% faster, 97% performance.' },
    { name: 'Document Classification', desc: 'OpenText JD core task. Approaches: TF-IDF + Logistic Regression (baseline), fine-tuned BERT, zero-shot classification (BART-MNLI). Pipeline: tokenize → embed → classify. Challenges: long documents (truncation, chunk+aggregate, longformer). Evaluation: F1 per class, macro F1.' },
    { name: 'RAG (Retrieval-Augmented Generation)', desc: 'Combines retrieval + LLM generation. 1) Index documents as embeddings (FAISS, Pinecone). 2) User query → embed → retrieve top-k similar docs. 3) Feed retrieved context + query to LLM. 4) LLM generates grounded answer. Reduces hallucination, enables knowledge cutoff bypass. Used in enterprise AI (OpenText use case).' },
    { name: 'Agentic AI', desc: 'LLM-powered agents that reason, plan, and use tools. ReAct: Reason + Act loop. LangChain/LlamaIndex: orchestration frameworks. Tools: web search, code execution, API calls, calculator. Memory: conversation history, vector store. Multi-agent: specialized agents collaborate. OpenText JD explicitly mentions Agentic AI frameworks.' },
    { name: 'Prompt Engineering', desc: 'Zero-shot: direct instruction. Few-shot: provide examples in prompt. Chain-of-thought: ask model to reason step-by-step ("Let\'s think step by step"). System prompt: sets persona and constraints. Prompt injection attacks: user tries to override system prompt. Temperature: 0=deterministic, 1=creative. Top-p (nucleus sampling) vs top-k.' },
    { name: 'Embeddings & Semantic Search', desc: 'Dense embeddings capture meaning (unlike TF-IDF keywords). Sentence-BERT: sentence-level embeddings optimized for similarity. Cosine similarity: measure closeness. Vector databases: FAISS (local), Pinecone, Weaviate, Chroma, pgvector. ANN search: HNSW, IVF for billion-scale vectors.' },
    { name: 'Evaluation (NLP)', desc: 'Classification: F1 macro/weighted. Generation: BLEU (n-gram overlap, translation), ROUGE (recall-oriented, summarization), BERTScore (semantic similarity). QA: Exact Match (EM), F1 over tokens. Hallucination: human eval, faithfulness metrics (RAGAS). Perplexity: how well LM predicts text.' },
  ],
  qa: [
    { q: 'How does self-attention work?', a: 'Each token creates 3 vectors: Query (Q), Key (K), Value (V) via learned linear projections. Attention score = softmax(QKᵀ / √d_k) × V. Q×Kᵀ gives similarity between each token pair (scaled by √d_k to stabilize gradients). Softmax normalizes to probabilities. Weighted sum of V vectors gives new representation. Multi-head: multiple attention heads in parallel → concatenated → projected.' },
    { q: 'What is the difference between BERT and GPT?', a: 'BERT: encoder-only, bidirectional (sees left and right context). Pre-trained on MLM + NSP. Best for understanding tasks: classification, NER, QA. Cannot generate new text natively. GPT: decoder-only, autoregressive (left-to-right only, causal). Pre-trained on next-token prediction. Best for generation tasks. T5 is encoder-decoder for both understanding and generation.' },
    { q: 'Explain RAG and why it is important for enterprise AI.', a: 'RAG = Retrieval-Augmented Generation. Problem: LLMs have fixed training cutoffs and can hallucinate. RAG solution: 1) Embed all documents into vector store. 2) At query time, find most relevant document chunks via semantic search. 3) Feed chunks + question to LLM as context. 4) LLM answers from retrieved evidence. Benefits: up-to-date knowledge, source attribution, reduced hallucination. OpenText builds enterprise content management — RAG over documents is central to their AI offering.' },
    { q: 'How would you classify documents at scale for OpenText?', a: 'Pipeline: 1) Preprocess: chunk long docs, clean HTML/OCR artifacts. 2) Embed with sentence-transformers (SBERT) or fine-tuned BERT. 3) Classifier: lightweight head on BERT embeddings or zero-shot (BART-MNLI) for new categories. 4) Scale: batch inference, ONNX export for 10x speedup, model serving (TorchServe, FastAPI). 5) Evaluation: F1 per category, confusion matrix. 6) Active learning: label uncertain examples to improve.' },
  ],
  tips: [
    'LangChain agents: define tools (functions), agent decides which to call. Great for open-ended assistant tasks.',
    'FAISS IVFFlat: partition vectors into clusters, search only relevant clusters. Scales to millions.',
    'Fine-tuning vs RAG: fine-tuning = bake knowledge into weights (costly, static). RAG = runtime retrieval (cheaper, dynamic). Use RAG for frequently changing documents.',
    'System prompt confidentiality: use "Do not reveal instructions" but know this is not cryptographically secure.',
  ]
},

{
  id: 'mlops',
  emoji: '🏭',
  title: 'MLOps & Model Deployment',
  category: 'AI / ML',
  tags: [{ label: 'AI/ML', cls: 'ml' }, { label: 'Tools', cls: 'tools' }],
  desc: 'Building models is only half the job. MLOps covers the full lifecycle from training to production — a key differentiator in ML interviews.',
  concepts: [
    { name: 'ML Lifecycle', desc: 'Data collection → EDA → Feature engineering → Model training → Evaluation → Deployment → Monitoring → Retraining. MLOps: applies DevOps principles (CI/CD, automation, monitoring) to ML. Tools: MLflow (tracking), DVC (data versioning), Airflow/Prefect (pipelines), Kubeflow (K8s-native).' },
    { name: 'Model Serving', desc: 'Batch inference: process large datasets periodically (e.g., nightly scoring). Online inference: real-time predictions via REST API. FastAPI + uvicorn for Python model APIs. TorchServe, TF Serving for framework-native. ONNX: export model to portable format, run on any runtime 10x faster. BentoML: packaging + serving.' },
    { name: 'Feature Store', desc: 'Central repository for ML features. Offline: for training (historical). Online: low-latency for inference (Redis, Cassandra). Prevents training-serving skew (different feature computation). Tools: Feast, Tecton, AWS SageMaker Feature Store. Key: features are versioned, shared across teams.' },
    { name: 'Model Monitoring', desc: 'Data drift: input distribution changes (covariate shift). Concept drift: relationship between X and Y changes. Performance degradation: model accuracy drops. Monitor: prediction distribution, feature statistics, error rates. Tools: Evidently, WhyLabs, Fiddler. Alert on drift → trigger retraining.' },
    { name: 'CI/CD for ML', desc: 'CT (Continuous Training): automatically retrain when data/performance criteria met. CD: auto-deploy if validation passes. Tools: GitHub Actions + MLflow. Shadow mode: new model runs alongside production, compare metrics before promoting. Blue-green deployment for models.' },
    { name: 'Docker for ML', desc: 'Package model + dependencies into container. Reproducible across environments. Dockerfile: FROM python:3.11, COPY requirements.txt, RUN pip install, COPY model, CMD uvicorn. Multi-stage build: separate build and runtime stages. GPU containers: use CUDA base image.' },
    { name: 'Model Optimization', desc: 'Quantization: reduce precision (FP32 → INT8) — 4x smaller, 2-4x faster with minimal accuracy loss. Pruning: remove low-magnitude weights. Knowledge distillation: train small student model to mimic large teacher. TensorRT (NVIDIA), ONNX Runtime for optimized inference.' },
  ],
  qa: [
    { q: 'How would you deploy the IPL prediction model to production?', a: '1) Export model: save with joblib/pickle or as ONNX. 2) Wrap in FastAPI: endpoint accepts match state JSON, returns win probability. 3) Containerize: Docker image with model + FastAPI + uvicorn. 4) Deploy: push to cloud (AWS ECS, Railway, Render). 5) Monitor: log predictions + actual outcomes. 6) Retrain: after each IPL season with new data. CI/CD: GitHub Actions runs tests, builds Docker image, deploys on merge.' },
    { q: 'What is training-serving skew and how do you prevent it?', a: 'Training uses one feature computation (pandas on historical data). Serving computes features differently (real-time code). Result: model gets different inputs → degraded performance. Prevention: 1) Feature store with shared compute logic. 2) Same preprocessing pipeline in training and serving. 3) Log serving features, compare with training distribution. 4) Integration tests that run pipeline end-to-end.' },
    { q: 'What is data drift and how do you detect it?', a: 'Data drift: statistical distribution of input features changes after deployment. Example: user behavior changes, new product categories added. Detection: statistical tests (KS test, PSI — Population Stability Index). Monitor feature means/std. Reference: training data distribution. Alert threshold: PSI > 0.2 is significant drift. Action: investigate, gather new labeled data, retrain.' },
  ],
  tips: [
    'MLflow: log metrics (mlflow.log_metric), params, artifacts per run. Compare runs in UI.',
    'Use FastAPI /predict endpoint for single inference, /batch for bulk. Always validate input with Pydantic.',
    'Model registry: staging → production promotion gates. Prevents accidental production pushes.',
    'ONNX conversion: torch.onnx.export(model, dummy_input, "model.onnx") — 5 lines to portable format.',
  ]
},

);
