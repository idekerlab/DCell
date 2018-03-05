FROM continuumio/anaconda3

RUN apt-get update -y
RUN apt-get install -y wget


WORKDIR /app
RUN wget http://purl.obolibrary.org/obo/go.obo -O ./go.obo

# ID to GO Name map
RUN wget http://chianti.ucsd.edu/~kono/ci/data/deep-cell/goID_2_name.tab -O ./id2name.tab

COPY . /app

RUN pip install -r requirements.txt

EXPOSE 5000

ENTRYPOINT ["python"]
CMD ["app.py"]