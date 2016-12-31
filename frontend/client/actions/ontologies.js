import { createAction } from 'redux-actions'

export const ADD_ONTOLOGY = 'ADD_ONTOLOGY'
export const REMOVE_ONTOLOGY = 'REMOVE_ONTOLOGY'

export const addOntology = createAction(ADD_ONTOLOGY)
export const removeOntology = createAction(REMOVE_ONTOLOGY)

