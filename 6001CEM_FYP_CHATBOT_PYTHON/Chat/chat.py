import numpy as np
from nltk.stem.porter import PorterStemmer
import random
import json
import torch
import os

import torch.nn as nn
import nltk
nltk.download('punkt')
stemmer = PorterStemmer()


def tokenize(sentence):
    return nltk.word_tokenize(sentence)


def stem(word):
    return stemmer.stem(word.lower())


def bag_of_words(tokenized_sentence, all_words):
    tokenized_sentence = [stem(w) for w in tokenized_sentence]

    # set bag to all 0
    bag = np.zeros(len(all_words), dtype=np.float32)
    for idx, w in enumerate(all_words):
        if w in tokenized_sentence:
            bag[idx] = 1.0

    return bag


class NeuralNet(nn.Module):
    def __init__(self, input_size, hidden_size, num_classes):
        super(NeuralNet, self).__init__()
        self.l1 = nn.Linear(input_size, hidden_size)
        self.l2 = nn.Linear(hidden_size, hidden_size)
        self.l3 = nn.Linear(hidden_size, num_classes)
        self.relu = nn.ReLU()

    def forward(self, x):
        out = self.l1(x)
        out = self.relu(out)
        out = self.l2(out)
        out = self.relu(out)
        out = self.l3(out)
        # no activation and no softmax at the end
        return out


def ChatBot(Message):
    current_path = os.path.dirname(__file__) + '/'
    with open(current_path + 'intents.json', 'r') as f:
        intents = json.load(f)

    with open(current_path + 'suggestion.json', 'r') as suggestion:
        suggestionData = json.load(suggestion)

    ignore_tag = ['greeting', 'goodbye', 'thanks',
                  'noanswer', 'options', 'Identity']
    FILE = "model.pth"
    data = torch.load(current_path + FILE, map_location='cpu')
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    input_size = data["input_size"]
    hidden_size = data["hidden_size"]
    output_size = data["output_size"]
    all_words = data['all_words']
    tags = data['tags']
    model_state = data["model_state"]
    model = NeuralNet(input_size, hidden_size, output_size).to(device)
    model.load_state_dict(model_state)
    model.eval()

    sentence = Message
    sentence = tokenize(sentence)
    X = bag_of_words(sentence, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

    output = model(X)
    _, predicted = torch.max(output, dim=1)
    tag = tags[predicted.item()]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]

    print(prob)
    botMessage = {'message': '', 'tag': '', 'description': '',
                  'suggestionsText': '', 'suggestions': []}
    if prob.item() > 0.80:
        for intent in intents['intents']:
            if tag == intent["tag"]:
                botMessage['tag'] = tag
                if(tag not in ignore_tag):
                    botMessage['description'] = suggestionData[tag]['Description']
                    botMessage['suggestionsText'] = suggestionData[tag]['SuggestionsText']
                    botMessage['suggestions'] = suggestionData[tag]['Suggestions']
                botMessage['message'] = random.choice(intent['responses'])
                return botMessage

    elif prob.item() > 0.65:
        if(tag not in ignore_tag):
            for intent in intents['intents']:
                if tag == intent["tag"]:
                    botMessage['tag'] = tag
                    botMessage[
                        'message'] = f"I don't quite understand what you're describing, but it could be {random.choice(intent['responses'])}"
                    return botMessage
        else:
            botMessage[
                'message'] = f"I do not understand..."
            return botMessage
    else:
        botMessage[
            'message'] = f"I do not understand..."
        return botMessage


def getAllChatClass():
    current_path = os.path.dirname(__file__) + '/'
    with open(current_path + 'suggestion.json', 'r') as f:
        allKey = []
        intents = json.load(f)
        for i in intents:
            allKey.append(i)
        print(allKey)
    return allKey


if __name__ == '__main__':
    print(ChatBot("hi"))
