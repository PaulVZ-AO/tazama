import { ACTIONS } from "./processor.actions"
import { defaultTadProcLights } from "./processor.initialState"

const ProcessorReducer = (state: any, action: any) => {
  switch (action.type) {
    case ACTIONS.CREATE_RULES_LOADING:
      return {
        ...state,
        rulesLoading: true,
      }
    case ACTIONS.CREATE_RULES_SUCCESS:
      return {
        ...state,
        rulesLoading: true,
        rules: action.payload,
      }
    case ACTIONS.CREATE_RULES_FAIL:
      return {
        ...state,
        rulesLoading: true,
        rules: [],
      }

    case ACTIONS.UPDATE_RULES_LOADING:
      return {
        ...state,
        rulesLoading: true,
      }
    case ACTIONS.UPDATE_RULES_SUCCESS:
      return {
        ...state,
        rulesLoading: false,
        rules: action.payload,
      }
    case ACTIONS.UPDATE_RULES_FAIL:
      return {
        ...state,
        rulesLoading: false,
        rules: [],
      }

    case ACTIONS.UPDATE_TADPROC_LOADING:
      return {
        ...state,
        tadprocLoading: true,
      }
    case ACTIONS.UPDATE_TADPROC_SUCCESS:
      return {
        ...state,
        tadprocLoading: false,
        tadpLights: action.payload,
      }
    case ACTIONS.UPDATE_TADPROC_FAIL:
      return {
        ...state,
        tadprocLoading: false,
        tadpLights: defaultTadProcLights,
      }

    case ACTIONS.RESET_ALL_LIGHTS:
      return {
        ...state,
        tadpLights: defaultTadProcLights,
        rules: state.rules.map((rule: any) => ({ ...rule, color: "n" })),
      }
  }
}

export default ProcessorReducer
