from flask import Flask, render_template
from flask.ext.restless import APIManager
from flask.ext.sqlalchemy import SQLAlchemy
from flask.json import JSONEncoder
from flask import jsonify
from flask import request
import json

app = Flask(__name__, static_url_path='/static')
app.config.from_pyfile('config.py')
db = SQLAlchemy(app)

class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        if hasattr(obj, 'jsonable'):
            return obj.jsonable()
        else:
            return JSONEncoder.default(self, obj)

class Channel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20))
    backend = db.Column(db.String(20))
    url = db.Column(db.String(50))

    def __init__(self, name, backend, url):
        self.name = name
        self.backend = backend
        self.url = url

    def jsonable(self):
        return { 'id': self.id, 'name' : self.name, 'backend' : self.backend, 'url' : self.url }


app.json_encoder = CustomJSONEncoder

@app.route('/ch/', methods = ['GET'])
def index():
    chans =  Channel.query.all()
    j = jsonify({'channel': chans })
    return j

@app.route('/ch/<int:id>/')
def get_ch(id):
    return jsonify({'channel': Channel.query.get(id)})

@app.route('/ch/', methods = ['POST'])
def create_ch():
    if not request.json or not 'name' in request.json:
        abort(400)
    dev = Channel(request.json.get('name'), request.json.get('backend', ''), request.json.get('url',''))
    db.session.add(dev)
    db.session.commit()
    return jsonify( { 'channel': dev } ), 201

@app.route('/ch/<int:id>', methods = ['DELETE'])
def delete_ch(id):
    db.session.delete(Users.query.get(id))
    db.session.commit()
    return jsonify( { 'result': True } )

@app.route('/ch/<int:id>', methods = ['PUT'])
def update_ch(id):
    dev = Channel.query.get(id)
    dev.name = request.json.get('name', dev.name)
    dev.backend = request.json.get('backend',dev.backend)
    dev.url = request.json.get('url', dev.url)
    db.session.commit()
    return jsonify( { 'channel': dev } )


db.create_all( )
if __name__ == '__main__':
    c = Channel('rtl', 'test', 'http://google.de')
    db.session.add(c)
    app.run()