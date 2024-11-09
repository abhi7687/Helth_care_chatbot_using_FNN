from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import json
import random
import nltk
import pickle
from keras.models import load_model
from nltk.stem.lancaster import LancasterStemmer

# Download NLTK resources
nltk.download('punkt')

# Initialize stemmer and FastAPI app
stemmer = LancasterStemmer()
app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    ]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model, words, labels, and intents
model = load_model('chatbot_model.h5')
words = pickle.load(open('words.pkl', 'rb'))
labels = pickle.load(open('labels.pkl', 'rb'))
intents = json.loads(open('intents2.json').read())

# Pydantic model for the API
class UserMessage(BaseModel):
    message: str

# Tokenize and stem the user input
def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [stemmer.stem(word.lower()) for word in sentence_words]
    return sentence_words

# Convert user input into a bag-of-words (BoW) representation
def bow(sentence, words, show_details=True):
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)
    for s in sentence_words:
        for i, w in enumerate(words):
            if w == s:
                bag[i] = 1
                if show_details:
                    print(f"Found in bag: {w}")
    return np.array(bag)

# Predict the intent based on user input
def predict_class(sentence, model):
    p = bow(sentence, words, show_details=False)
    res = model.predict(np.array([p]))[0]
    ERROR_THRESHOLD = 0.25
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append({"intent": labels[r[0]], "probability": str(r[1])})
    return return_list

# Get a response based on the predicted intent
def get_response(ints, intents_json):
    tag = ints[0]['intent']
    list_of_intents = intents_json['intents']
    for i in list_of_intents:
        if i['tag'] == tag:
            return random.choice(i['responses'])
    return "I'm sorry, I don't understand that."

# FastAPI route to handle chatbot interactions
@app.post("/chatbot/")
async def chatbot_response(user_message: UserMessage):
    try:
        # Predict the intent
        ints = predict_class(user_message.message, model)
        # Get the corresponding response
        response = get_response(ints, intents)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

# To run the server: python -m uvicorn backend:app --reload

