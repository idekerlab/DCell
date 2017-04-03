import {RUN_SIMULATION, RECEIVE_SIMULATION_RESULT, FETCH_CHILDREN, RECEIVE_CHILDREN,
  ADD_GENE, DELETE_GENE, CLEAR_GENES, CLEAR_RESULTS} from '../actions/query-genes'
import {Map, Set} from 'immutable'


const RUNNING = 'running'

const SERVICE_URL = 'http://localhost:8888'

const defState = Map({
  serviceURL: SERVICE_URL,
  genes: Map(),
  running: false,
  result: null,
  pivot: null
})


export default function queryGeneState(state = defState, action) {

  switch (action.type) {
    case ADD_GENE:
      console.log('+++++ADDING gene: ')
      console.log(action)
      console.log(state)

      const value = action.payload
      const orf = value[0]
      const symbol = value[1]

      return state
        .set('genes', state.get('genes').set(orf, symbol))

    case DELETE_GENE:
      console.log('+++++DELETING gene: ' + action)
      return state.set('genes', state.get('genes').delete(action.payload))

    case CLEAR_GENES:
      console.log('+++++ CLEAR: ')

      return state
        .set('genes', Map())
        .set('result', null)
    case CLEAR_RESULTS:
      console.log('+++++ CLEAR RES: ')
      return state
        .set('result', null)

    case RUN_SIMULATION:
      console.log('+++++++++++++++ Run simulation! ++++++++++++++')
      console.log(action)
      console.log(state)

      return state
        .set(RUNNING, true)
        .set('serviceURL', action.serviceUrl)
        .set('genes', action.genes)

    case RECEIVE_SIMULATION_RESULT:
      console.log('+++++++++++++++ Simulation finished ++++++++++++++')

      return state
        .set(RUNNING, false)
        .set('result', action.result)

    case FETCH_CHILDREN:
      console.log('+++++++++++++++ Fetching children ++++++++++++++')
      return state
        .set(RUNNING, true)
        .set('serviceURL', action.serviceUrl)
        .set('pivot', action.pivot)

    case RECEIVE_CHILDREN:
      console.log('+++++++++++++++ CHILDREN finished ++++++++++++++')

      return state
        .set(RUNNING, false)
        .set('result', action.result)
    default:
      return state
  }
}
