#!flask/bin/python
from flask import Flask, jsonify
from flask import request,abort
import random

app = Flask(__name__)

players = []

winners = []

inicards = []

deck = []

next_to_play = [0]

last_card = [{
          "color": "red",
          "number": "+2",
          "special": "Yes"
        }]

current_card = []

clock = [True]

colors = ["red","blue","green","yellow"]
numbers = ["0","1","2","3","4","5","6","7","8","9"]
specials = ["reverse","skip","+2"]
wilds = ["wild","+4"]

@app.route('/getinitialcards/<string:task_id>', methods=['GET'])
def get_inicards(task_id):
    player = [player for player in players if player['name'] == task_id]
    if len(player) == 0:
        abort(404)
    print(inicards)
    for x in range(0,inicards[0]):
        i = random.randint(0,len(deck)-1)
        player[0]['cards'].append(deck[i])
        deck.pop(i)
    return jsonify({'player': player[0]})

@app.route('/getgame', methods=['GET'])
def get_game():
    print(current_card)
    print(next_to_play)
    print(winners)
    print(players)
    return jsonify({'players': players,'winners':winners,'current_card':current_card[0],'next_to_play':next_to_play[0],'decklength': len(deck),'deck':deck})

@app.route('/getdeck', methods=['GET'])
def get_deck():
    return jsonify({'decklength': len(deck),'deck':deck})

@app.route('/drawcards/<string:task_id>', methods=['POST'])
def draw_cards(task_id):
    player = [player for player in players if player['name'] == task_id]
    for x in range(0,request.json["num_to_draw"]):
        i = random.randint(0,len(deck)-1)
        player[0]['cards'].append(deck[i])
        deck.pop(i)
    return jsonify({'player': player[0]})

@app.route('/updatecards/<string:task_id>', methods=['POST'])
def update_card(task_id):
    player = [player for player in players if player['name'] == task_id]
    player[0]["cards"] = []
    for x in range(0,len(request.json["player"]["cards"])):
        player[0]["cards"].append(request.json["player"]["cards"][x])
    return jsonify({'task': "done"}), 201

@app.route('/playcard/<string:task_id>', methods=['POST'])
def play_card(task_id):
    flag = False
    if not request.json or not 'card' in request.json:
        abort(400)
    player = [player for player in players if player['name'] == task_id]
    if request.json['card']["color"]=="No card":
        flag = True
    elif request.json['card']["number"]=="wild" or request.json['card']["number"]=="+4":
        flag = True
    elif request.json['card']["number"]==current_card[0]['number'] or request.json['card']["color"]==current_card[0]["color"]:
        flag = True
    if task_id != players[next_to_play[0]]["name"]:
        flag = False
    if not flag:
        return jsonify({"accepted":"No","win:":"No"}),201
    else:
        if request.json["card"]["color"]=="No card":
        	print("hole")
        elif request.json["card"]["number"]=="wild" or request.json["card"]["number"]=="+4":
            deck.append(last_card[0])
            last_card[0] = current_card[0]
            current_card[0] = request.json["card"]
            # request.json["card"]["color"] = ""
            #print(players[next_to_play[0]]["cards"].index(request.json["card"]))
            players[next_to_play[0]]["cards"].remove({"color":"","number":request.json["card"]["number"],"special":"Yes"})
        else:
            deck.append(last_card[0])
            last_card[0] = current_card[0]
            current_card[0] = request.json["card"]
            print(players[next_to_play[0]]["cards"].index(request.json["card"]))
            players[next_to_play[0]]["cards"].remove(request.json["card"])

        if clock[0]:
            if request.json["card"]["number"]=="skip":
                next_to_play[0] = (next_to_play[0]+2)%len(players)
            elif request.json["card"]["number"]=="reverse":
                next_to_play[0] = (next_to_play[0]-1)%len(players)
                clock[0]=False
            else:
                next_to_play[0] = (next_to_play[0]+1)%len(players)
        else:
            if request.json["card"]["number"]=="skip":
                next_to_play[0] = (next_to_play[0]-2)%len(players)
            elif request.json["card"]["number"]=="reverse":
                next_to_play[0] = (next_to_play[0]+1)%len(players)
                clock[0]=True
            else:
                next_to_play[0] = (next_to_play[0]-1)%len(players)

        if len(player[0]["cards"])==1:
            winners.append(player)
            players.pop(players.index(player))
            return jsonify({"accepted":"Yes","win":"Yes"}),201
        else:    
            return jsonify({"accepted":"Yes","win":"No"}),201

@app.route('/creategame', methods=['POST'])
def create_game():
    print("ass")
    print(request.json)
    if not 'players' in request.json:
        abort(400)
    print(request)
    inicards.append(request.json['inicards'])
    for x in range(0,len(request.json['players'])):
        player = {
            'id': x,
            'name': request.json['players'][x]['name'],
            'cards': []
        }
        players.append(player)

    for x in range(0,4):
        for y in range(0,10):
            card = {
                'color':colors[x],
                'number':numbers[y],
                'special':"No"
            }
            deck.append(card)
            if numbers[y]!="0":
                deck.append(card)
    for x in range(0,4):
        for y in range(0,3):
            card = {
                'color':colors[x],
                'number':specials[y],
                'special':"Yes"
            }
            deck.append(card)
            deck.append(card)
    for x in range(0,2):
        card = {
            'color':"",
            'number':wilds[x],
            'special':"Yes"
        }
        deck.append(card)
        deck.append(card)
        deck.append(card)
        deck.append(card)
    tlag = True
    global current_card
    while(tlag):
        current_card = []
        i = random.randint(0,len(deck)-1)
        if deck[i]["special"]=="No":
            current_card.append(deck[i])
            deck.pop(i)
            tlag = False
    return jsonify({'task': "done"}), 201

if __name__ == '__main__':
    app.run(debug=True)