import { ACTIONS } from "./entity.actions"

const EntityReducer = (state: any, action: any) => {
  switch (action.type) {
    case ACTIONS.SELECT_DEBTOR_ENTITY:
      return {
        ...state,
        selectedDebtorEntity: action.payload,
      }

    case ACTIONS.SELECT_CREDITOR_ENTITY:
      return {
        ...state,
        selectedCreditorEntity: action.payload,
      }

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

    case ACTIONS.UPDATE_ACCOUNTS_LOADING:
      return {
        ...state,
        updateAccountsLoading: true,
        entities: [],
      }
    case ACTIONS.UPDATE_ACCOUNTS_SUCCESS:
      return {
        ...state,
        updateAccountsLoading: false,
        entities: action.payload,
      }
    case ACTIONS.UPDATE_ACCOUNTS_FAIL:
      return {
        ...state,
        updateAccountsLoading: false,
        entities: [],
      }

    case ACTIONS.RESET_ENTITY_LOADING:
      return {
        ...state,
        resetEntityLoading: true,
        entities: [],
      }
    case ACTIONS.RESET_ENTITY_SUCCESS:
      return {
        ...state,
        resetEntityLoading: false,
        entities: action.payload,
      }
    case ACTIONS.RESET_ENTITY_FAIL:
      return {
        ...state,
        resetEntityLoading: false,
        entities: [],
      }

    case ACTIONS.RESET_CREDITOR_ENTITY_LOADING:
      return {
        ...state,
        resetCreditorEntityLoading: true,
        creditorEntities: [],
      }
    case ACTIONS.RESET_CREDITOR_ENTITY_SUCCESS:
      return {
        ...state,
        resetCreditorEntityLoading: false,
        creditorEntities: action.payload,
      }
    case ACTIONS.RESET_CREDITOR_ENTITY_FAIL:
      return {
        ...state,
        resetCreditorEntityLoading: false,
        creditorEntities: [],
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

    case ACTIONS.UPDATE_CREDITOR_ACCOUNTS_LOADING:
      return {
        ...state,
        updateCreditorAccountsLoading: true,
        creditorEntities: [],
      }
    case ACTIONS.UPDATE_CREDITOR_ACCOUNTS_SUCCESS:
      return {
        ...state,
        updateCreditorAccountsLoading: false,
        creditorEntities: action.payload,
      }
    case ACTIONS.UPDATE_CREDITOR_ACCOUNTS_FAIL:
      return {
        ...state,
        updateCreditorAccountsLoading: false,
        creditorEntities: [],
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

    case ACTIONS.SET_DEBTOR_PACS008_LOADING:
      return {
        ...state,
        pacs008Loading: true,
      }
    case ACTIONS.SET_DEBTOR_PACS008_SUCCESS:
      return {
        ...state,
        pacs008Loading: false,
        pacs008: action.payload,
      }
    case ACTIONS.SET_DEBTOR_PACS008_FAIL:
      return {
        ...state,
        pacs008Loading: false,
      }
    case ACTIONS.SET_DEBTOR_ACCOUNT_PACS008_LOADING:
      return {
        ...state,
        pacs008Loading: true,
      }
    case ACTIONS.SET_DEBTOR_ACCOUNT_PACS008_SUCCESS:
      return {
        ...state,
        pacs008Loading: false,
        pacs008: action.payload,
      }
    case ACTIONS.SET_DEBTOR_ACCOUNT_PACS008_FAIL:
      return {
        ...state,
        pacs008Loading: false,
      }

    case ACTIONS.SET_CREDITOR_PACS008_LOADING:
      return {
        ...state,
        pacs008Loading: true,
      }
    case ACTIONS.SET_CREDITOR_PACS008_SUCCESS:
      return {
        ...state,
        pacs008Loading: false,
        pacs008: action.payload,
      }
    case ACTIONS.SET_CREDITOR_PACS008_FAIL:
      return {
        ...state,
        pacs008Loading: false,
      }
    case ACTIONS.SET_CREDITOR_ACCOUNT_PACS008_LOADING:
      return {
        ...state,
        pacs008Loading: true,
      }
    case ACTIONS.SET_CREDITOR_ACCOUNT_PACS008_SUCCESS:
      return {
        ...state,
        pacs008Loading: false,
        pacs008: action.payload,
      }
    case ACTIONS.SET_CREDITOR_ACCOUNT_PACS008_FAIL:
      return {
        ...state,
        pacs008Loading: false,
      }
    case ACTIONS.GENERATE_TRANSACTION_PACS008_LOADING:
      return {
        ...state,
        pacs008Loading: true,
      }
    case ACTIONS.GENERATE_TRANSACTION_PACS008_SUCCESS:
      return {
        ...state,
        pacs008Loading: false,
        pacs008: action.payload,
      }
    case ACTIONS.GENERATE_TRANSACTION_PACS008_FAIL:
      return {
        ...state,
        pacs008Loading: false,
      }

    case ACTIONS.UPDATE_TRANSACTION_LOADING:
      return {
        ...state,
        pacs008Loading: true,
      }
    case ACTIONS.UPDATE_TRANSACTION_SUCCESS:
      return {
        ...state,
        pacs008Loading: false,
        pacs008: action.payload,
      }
    case ACTIONS.UPDATE_TRANSACTION_FAIL:
      return {
        ...state,
        pacs008Loading: false,
      }

    case ACTIONS.GENERATE_PACS002_LOADING:
      return {
        ...state,
        pacs002Loading: true,
      }
    case ACTIONS.GENERATE_PACS002_SUCCESS:
      return {
        ...state,
        pacs002Loading: false,
        pacs002: action.payload,
      }
    case ACTIONS.GENERATE_PACS002_FAIL:
      return {
        ...state,
        pacs002Loading: false,
      }

    case ACTIONS.SET_RULE_LIGHTS_LOADING:
      return {
        ...state,
        ruleLights: null,
      }
    case ACTIONS.SET_RULE_LIGHTS_SUCCESS:
      return {
        ...state,
        ruleLights: action.payload,
      }
    case ACTIONS.SET_RULE_LIGHTS_FAIL:
      return {
        ...state,
        ruleLights: null,
      }

    case ACTIONS.CLONE_ENTITY_LOADING:
      return {
        ...state,
        cloneEntityLoading: true,
        creditorEntities: [],
      }
    case ACTIONS.CLONE_ENTITY_SUCCESS:
      return {
        ...state,
        cloneEntityLoading: false,
        creditorEntities: action.payload,
      }
    case ACTIONS.CLONE_ENTITY_FAIL:
      return {
        ...state,
        cloneEntityLoading: false,
        creditorEntities: [],
      }

    case ACTIONS.CLONE_CREDITOR_ENTITY_LOADING:
      return {
        ...state,
        cloneCreditorEntityLoading: true,
        entities: [],
      }
    case ACTIONS.CLONE_CREDITOR_ENTITY_SUCCESS:
      return {
        ...state,
        cloneCreditorEntityLoading: false,
        entities: action.payload,
      }
    case ACTIONS.CLONE_CREDITOR_ENTITY_FAIL:
      return {
        ...state,
        cloneCreditorEntityLoading: false,
        entities: [],
      }

    case ACTIONS.SET_UI_CONFIG_LOADING:
      return {
        ...state,
        setUiConfigLoading: true,
      }
    case ACTIONS.SET_UI_CONFIG_SUCCESS:
      return {
        ...state,
        setUiConfigLoading: false,
        uiConfig: action.payload,
      }
    case ACTIONS.SET_UI_CONFIG_FAIL:
      return {
        ...state,
        setUiConfigLoading: false,
      }
  }
}

export default EntityReducer
