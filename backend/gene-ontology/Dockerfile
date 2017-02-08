FROM continuumio/anaconda3

RUN apt-get update -y
RUN apt-get install -y wget


WORKDIR /app
RUN wget http://purl.obolibrary.org/obo/go.obo -O ./go.obo

COPY . /app

RUN pip install -r requirements.txt

EXPOSE 5000

ENTRYPOINT ["python"]
CMD ["app.py"]