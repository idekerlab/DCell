import {RUN_SIMULATION, RECEIVE_SIMULATION_RESULT, ADD_GENE, DELETE_GENE, CLEAR_GENES} from '../actions/query-genes'
import {Map, Set} from 'immutable'


const RUNNING = 'running'

const SERVICE_URL = 'http://localhost:8888'

const defState = Map({
  serviceURL: SERVICE_URL,
  genes: Set(),
  running: false,
  result: null
})


export default function queryGeneState(state = defState, action) {

  switch (action.type) {
    case ADD_GENE:
      console.log('+++++ADDING gene: ')
      console.log(action)
      console.log(state)

      return state
        .set('genes', state.get('genes').add(action.payload))
    case DELETE_GENE:
      console.log('+++++DELETING gene: ' + action)
      return state.set('genes', state.get('genes').delete(action.payload))
    case CLEAR_GENES:
      console.log('+++++ CLEAR: ')

      return state.set('genes', Set())

    case RUN_SIMULATION:
      console.log('+++++++++++++++ Run simulation! ++++++++++++++')
      return state
        .set(RUNNING, true)
        .set('serviceURL', action.serviceUrl)
        .set('genes', action.genes)

    case RECEIVE_SIMULATION_RESULT:
      console.log('+++++++++++++++ Simulation finished ++++++++++++++')

      return state
        .set(RUNNING, false)
        .set('result', action.result)
    default:
      return state
  }
}

