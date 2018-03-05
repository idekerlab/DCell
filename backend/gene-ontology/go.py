from goatools import obo_parser

GOID2NAME_FILE = 'id2name.tab' 

class Go:

    def __init__(self):
        self.go = self.__loadObo()
        self.__id2name = self.__load_id2name()

    def __loadObo(self):
        obo = obo_parser.GODag('./go.obo', optional_attrs=['defn'])
        return obo

    def __load_id2name(self):
        id2name = {}        
        f = open(GOID2NAME_FILE)
 
        for line in f:
            parts = line.split('\t')
            id2name[parts[0]] = parts[1].strip()
        f.close
        return id2name

    def getGoDag(self):
        return self.go

    def get_name(self, goId):
        return self.__id2name[goId]

    def get_children(self, goid):

        term = self.go[goid]
        children = term.get_all_child_edges()

        net = {
            'data': {'name': 'children of ' + goid},
            'elements': {
                'nodes': [],
                'edges': []
            }
        }

        nodeSet = set()

        edges = []
        for edge in children:
            nodeSet.add(edge[0])
            nodeSet.add(edge[1])

            e = {
                'data': {
                    'source': edge[0],
                    'target': edge[1]
                }
            }
            edges.append(e)

        nodes = []
        for node in nodeSet:
            n = {
                'data': {
                    'id': node,
                    'name': self.go[node].name
                }
            }
            nodes.append(n)


        net['elements']['nodes'] = nodes
        net['elements']['edges'] = edges

        return net

