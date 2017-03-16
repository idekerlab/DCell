FROM nginx


# Download ontology files from remote server
RUN apt-get update
RUN apt-get install -y wget

COPY ./static /usr/share/nginx/html
COPY ./dc.conf /etc/nginx/conf.d/default.conf

RUN mkdir /usr/share/nginx/html/data
WORKDIR /usr/share/nginx/html/data

RUN wget http://chianti.ucsd.edu/~kono/ci/data/deep-cell/tree/tree-go.json
RUN wget http://chianti.ucsd.edu/~kono/ci/data/deep-cell/tree/tree-clixo.json
