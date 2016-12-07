import {Client} from 'elasticsearch'

const client = new Client({
  host: 'localhost:9200',
  log: 'trace'
});

export const SET_PROPERTY = 'SET_PROPERTY'


export const setProperty = (id, property) => {
  return {
    type: SET_PROPERTY,
    id,
    property
  }
}

export const fetchProperty = id => {

  return dispatch =>
    client.get({
      index: 'terms',
      type: 'go_term',
      id: id
    }).then(function (body) {
      console.log("%%%%%%%%% Prop OK!!!!!!!!!!!!!")
      console.log(body)
      console.log(body._source)
      dispatch(setProperty(id, body._source))
    }, function (error) {
      console.trace(error.message);
    });

}
