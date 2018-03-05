from flask import Flask
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin


from go import Go
import logging

go = Go()
app = Flask(__name__)
CORS(app)

app.logger.setLevel(logging.INFO)

api = Api(app)



class Status(Resource):

    def get(self):
        app.logger.info('* Get called')

        return {
            'serviceName': 'Gene Ontology Utility Service',
            'description': 'GO Util'
        }

class Details(Resource):

    def get(self, goid):

        term = go.getGoDag()[goid]

        app.logger.info(term)

        result = {
            'id': goid,
            'name': term.name,
            'definition': term.defn
        }

        return result


class Children(Resource):

    def get(self, goid):
        return go.get_children(goid)

class Name(Resource):

    def get(self, goid):
        return go.get_name(goid)


api.add_resource(Status, '/')
api.add_resource(Details, '/<goid>')
api.add_resource(Name, '/<goid>/name')
api.add_resource(Children, '/<goid>/children')



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')