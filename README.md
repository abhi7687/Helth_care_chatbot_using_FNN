# 🏥 Healthcare Chatbot

A symptom-based healthcare chatbot built using a **Feedforward Neural Network (FNN)** and **Natural Language Processing (NLP)**. Users describe their symptoms in natural language and receive relevant health information and advice in real time.

---

## 🚀 Live Architecture

```
React Frontend  ──POST /chatbot/──►  FastAPI Middleware  ──model.predict()──►  Keras FNN Model
    (port 3000)                          (port 8000)                          (chatbot_model.h5)
```

---

## ✨ Features

- 🤖 Intent classification using a trained FNN (98% training accuracy)
- 💬 Natural language symptom input — no rigid commands needed
- ⚡ Fast inference — model loaded once at server startup
- 🎲 Randomised responses per intent for a natural conversation feel
- 🛡️ Error threshold filtering (0.25) to handle unrecognised inputs gracefully
- 🌐 React frontend with real-time chat UI
- 🔗 FastAPI middleware with automatic OpenAPI docs at `/docs`
- 🔒 CORS configured for secure cross-origin communication

---

## 🗂️ Project Structure

```
Helth_care_chatbot_using_FNN/
│
├── Frontend/                        # React application
│   ├── build/                       # Production build output
│   ├── node_modules/                # npm dependencies
│   ├── public/                      # Static public assets
│   └── src/                         # React source code
│       ├── asserts/                 # Images and static assets
│       ├── App.css                  # Global styles
│       ├── App.js                   # Main chat component (UI + API calls)
│       ├── App.test.js              # Component tests
│       ├── index.css                # Root styles
│       ├── index.js                 # React DOM entry point
│       ├── logo.svg                 # App logo
│       ├── reportWebVitals.js       # Performance reporting
│       ├── setupTests.js            # Test configuration
│       ├── Stars.js                 # Stars UI component
│       └── starsEffect.scss         # Stars animation styles
│   ├── package.json                 # npm dependencies & scripts
│   └── package-lock.json
│
├── __pycache__/                     # Python bytecode cache
├── .ipynb_checkpoints/              # Jupyter auto-save checkpoints
├── .venv/                           # Python virtual environment
├── anaconda_projects/               # Anaconda project config
│
├── backend.py                       # FastAPI server — routes, NLP, prediction
├── chatbot_model.h5                 # Trained Keras FNN weights
├── intents2.json                    # Intent definitions (patterns + responses)
├── labels.pkl                       # Intent tag list (from training)
├── words.pkl                        # Stemmed vocabulary (from training)
├── training.ipynb                   # Model training notebook
├── abc.txt                          # Misc notes
└── README.md                        # Project documentation
```

---

## 🧠 How It Works

### Training pipeline (`training.ipynb`)

```
intents2.json
    │
    ▼
word_tokenize()  →  LancasterStemmer  →  unique sorted vocabulary  →  words.pkl
    │
    ▼
Bag of Words encoding  +  One-hot labels
    │
    ▼
FNN: Dense(128, ReLU) → Dropout(0.5) → Dense(64, ReLU) → Dropout(0.5) → Dense(N, Softmax)
    │
    ▼
SGD (lr=0.01, momentum=0.9, nesterov=True)  ×  500 epochs
    │
    ▼
chatbot_model.h5  +  labels.pkl
```

### Inference pipeline (`backend.py`)

```
User message
    │
    ▼
word_tokenize()  →  LancasterStemmer()   (same as training — must match)
    │
    ▼
bow()  →  [0, 1, 0, 0, 1, ...]           (binary vector, size = vocab)
    │
    ▼
model.predict()  →  [0.02, 0.91, 0.07]  (softmax probabilities)
    │
    ▼
filter > 0.25  →  sort by confidence
    │
    ▼
get_response()  →  random.choice(responses)
    │
    ▼
{"response": "Drink water and rest. Consult a doctor if fever persists."}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Middleware / API | FastAPI + Uvicorn |
| ML Framework | Keras (TensorFlow backend) |
| NLP | NLTK — word_tokenize, LancasterStemmer |
| Model type | Feedforward Neural Network (FNN) |
| Data format | Bag of Words (BoW) |
| Persistence | Pickle (.pkl), HDF5 (.h5), JSON |

---

## ⚙️ Setup & Installation

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

---

### 1. Clone the repository

```bash
git clone https://github.com/abhi7687/Helth_care_chatbot_using_FNN.git
cd Helth_care_chatbot_using_FNN
```

---

### 2. Backend setup (FastAPI)

The backend files (`backend.py`, `chatbot_model.h5`, `words.pkl`, `labels.pkl`, `intents2.json`) all live in the **project root**.

```bash
# From project root — activate virtual environment
source .venv/bin/activate        # macOS / Linux
.venv\Scripts\activate           # Windows

# Install dependencies
pip install fastapi uvicorn keras tensorflow nltk numpy pydantic

# Download NLTK resources
python -c "import nltk; nltk.download('punkt')"
```

> **Note:** `chatbot_model.h5`, `words.pkl`, and `labels.pkl` must be present in the root directory.  
> Run `training.ipynb` first if they are missing.

```bash
# Start the FastAPI server (from project root)
python -m uvicorn backend:app --reload
```

Server runs at: `http://localhost:8000`  
Auto docs: `http://localhost:8000/docs`

---

### 3. Frontend setup (React)

```bash
cd Frontend

# Install dependencies
npm install

# Start React dev server
npm start
```

App runs at: `http://localhost:3000`

---

### 4. Train the model (optional — if .h5 / .pkl files are missing)

Open and run all cells in `training.ipynb` (in the project root).

Outputs generated:
- `chatbot_model.h5` — trained FNN weights
- `words.pkl` — stemmed vocabulary
- `labels.pkl` — intent tag list

---

## 📡 API Reference

### `POST /chatbot/`

Accepts a user message and returns the chatbot's response.

**Request body:**
```json
{
  "message": "I have a high fever and headache"
}
```

**Response:**
```json
{
  "response": "Drink plenty of water and rest. If fever persists above 103°F, consult a doctor immediately."
}
```

**Error response (500):**
```json
{
  "detail": "Internal Server Error: <reason>"
}
```

---

## 🔬 Model Details

| Parameter | Value |
|---|---|
| Architecture | FNN (3 Dense layers) |
| Hidden layers | Dense(128, ReLU) → Dense(64, ReLU) |
| Output layer | Dense(N, Softmax) — N = number of intents |
| Regularisation | Dropout(0.5) after each hidden layer |
| Optimiser | SGD (lr=0.01, momentum=0.9, nesterov=True) |
| Loss function | Categorical cross-entropy |
| Epochs | 500 |
| Batch size | 50 |
| Training accuracy | ~98% |

---

## 🗣️ intents2.json format

```json
{
  "intents": [
    {
      "tag": "fever",
      "patterns": [
        "I have fever",
        "High temperature",
        "I am feeling hot"
      ],
      "responses": [
        "Drink plenty of fluids and rest.",
        "Take paracetamol and monitor your temperature. See a doctor if it exceeds 103°F."
      ]
    }
  ]
}
```

To add a new disease/symptom: add a new intent object with a unique `tag`, example `patterns`, and relevant `responses`. Then retrain the model.

---

## 🐛 Troubleshooting

| Problem | Solution |
|---|---|
| `CORS error` in browser | Confirm FastAPI is running on port 8000 and React on 3000 |
| `chatbot_model.h5 not found` | Run `training.ipynb` to generate model files |
| `punkt not found` NLTK error | Run `nltk.download('punkt')` in Python |
| Low prediction confidence | Add more patterns to intents2.json and retrain |
| 422 Unprocessable Entity | Request body key must be `"message"`, not `"msg"` or other |

---

## 📈 Future Improvements

- [ ] Add a validation/test split to measure generalisation accuracy
- [ ] Replace Bag of Words with TF-IDF or word embeddings (Word2Vec / GloVe)
- [ ] Integrate a doctor-finder map for nearby clinics
- [ ] Add user session history for context-aware follow-up questions
- [ ] Deploy backend to AWS / Render and frontend to Vercel
- [ ] Add HTTPS and API key authentication for production

---

## 👨‍💻 Author

**Vaitla Abhiram**  
[LinkedIn](https://linkedin.com/in/abhiramvaitla) · [GitHub](https://github.com/abhi7687) · [Portfolio](https://my-portfolio-two-livid-72.vercel.app)

---

## 📄 License

This project is licensed under the MIT License.
