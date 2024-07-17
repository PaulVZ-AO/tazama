import { ACTIONS } from "./entity.actions"

const EntityReducer = (state: any, action: any) => {
  switch (action.type) {
    case ACTIONS.CREATE_ENTITY_LOADING:
      return {
        ...state,
        createEntityLoading: true,
        entities: [],
      }
    case ACTIONS.CREATE_ENTITY_SUCCESS:
      return {
        ...state,
        createEntityLoading: false,
        entities: action.payload,
      }
    case ACTIONS.CREATE_ENTITY_FAIL:
      return {
        ...state,
        createEntityLoading: false,
        entities: [],
      }

    case ACTIONS.UPDATE_ENTITY_LOADING:
      return {
        ...state,
        updateEntityLoading: true,
        entities: [],
      }
    case ACTIONS.UPDATE_ENTITY_SUCCESS:
      return {
        ...state,
        updateEntityLoading: false,
        entities: action.payload,
      }
    case ACTIONS.UPDATE_ENTITY_FAIL:
      return {
        ...state,
        updateEntityLoading: false,
        entities: [],
      }

    case ACTIONS.CREATE_ENTITY_ACCOUNT_LOADING:
      return {
        ...state,
        createAccountLoading: true,
        entities: [],
      }
    case ACTIONS.CREATE_ENTITY_ACCOUNT_SUCCESS:
      return {
        ...state,
        createAccountLoading: false,
        entities: action.payload,
      }
    case ACTIONS.CREATE_ENTITY_ACCOUNT_FAIL:
      return {
        ...state,
        createAccountLoading: false,
        entities: [],
      }

    case ACTIONS.CREATE_CREDITOR_ENTITY_LOADING:
      return {
        ...state,
        createCreditorEntityLoading: true,
        creditorEntities: [],
      }
    case ACTIONS.CREATE_CREDITOR_ENTITY_SUCCESS:
      return {
        ...state,
        createCreditorEntityLoading: false,
        creditorEntities: action.payload,
      }
    case ACTIONS.CREATE_CREDITOR_ENTITY_FAIL:
      return {
        ...state,
        createCreditorEntityLoading: false,
        creditorEntities: [],
      }

    case ACTIONS.UPDATE_CREDITOR_ENTITY_LOADING:
      return {
        ...state,
        updateCreditorEntityLoading: true,
        creditorEntities: [],
      }
    case ACTIONS.UPDATE_CREDITOR_ENTITY_SUCCESS:
      return {
        ...state,
        updateCreditorEntityLoading: false,
        creditorEntities: action.payload,
      }
    case ACTIONS.UPDATE_CREDITOR_ENTITY_FAIL:
      return {
        ...state,
        updateCreditorEntityLoading: false,
        creditorEntities: [],
      }

    case ACTIONS.CREATE_CREDITOR_ENTITY_ACCOUNT_LOADING:
      return {
        ...state,
        createCreditorAccountLoading: true,
        creditorEntities: [],
      }
    case ACTIONS.CREATE_CREDITOR_ENTITY_ACCOUNT_SUCCESS:
      return {
        ...state,
        createCreditorAccountLoading: false,
        creditorEntities: action.payload,
      }
    case ACTIONS.CREATE_CREDITOR_ENTITY_ACCOUNT_FAIL:
      return {
        ...state,
        createCreditorAccountLoading: false,
        creditorEntities: [],
      }
  }
}

export default EntityReducer
