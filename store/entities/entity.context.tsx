import { createContext } from "react"
import {
  creditorInitialState,
  debtorInitialState,
  pacs002InitialState,
  pacs008InitialState,
  uiConfigInitialState,
} from "./entity.initialState"
import {
  CdtrEntity,
  CreditorEntity,
  DebtorEntity,
  Entity,
  PACS002,
  PACS008,
  SelectedCreditor,
  SelectedDebtor,
  UIConfiguration,
} from "./entity.interface"

interface Context {
  createEntityLoading: boolean
  updateEntityLoading: boolean
  createAccountLoading: boolean
  createCreditorAccountLoading: boolean
  creditorEntities: Array<CdtrEntity>
  entities: Array<Entity>
  pacs008Loading: boolean
  pacs002Loading: boolean
  pacs008: PACS008
  pacs002: PACS002
  selectedDebtorEntity: SelectedDebtor
  selectedCreditorEntity: SelectedCreditor
  uiConfig: UIConfiguration
  selectDebtorEntity: (index: number, accountIndex: number) => void
  selectCreditorEntity: (index: number, accountIndex: number) => void
  createEntity: () => void
  updateEntity: (entity: DebtorEntity, entityIndex: number) => void
  createEntityAccount: (entityIndex: number) => void
  createCreditorEntity: () => void
  updateCreditorEntity: (entity: CreditorEntity, entityIndex: number) => void
  createCreditorEntityAccount: (entityIndex: number) => void
  setDebtorPacs008: (entityIndex: number) => void
  setDebtorAccountPacs008: (entityIndex: number, accountIndex: number) => void
  setCreditorPacs008: (entityIndex: number) => void
  setCreditorAccountPacs008: (entityIndex: number, accountIndex: number) => void
  generateTransaction: () => void
  buildPacs002: () => void
  reset: () => void
}

const EntityContext = createContext<Context>({
  createEntityLoading: false,
  updateEntityLoading: false,
  createAccountLoading: false,
  createCreditorAccountLoading: false,
  creditorEntities: [],
  entities: [],
  pacs008Loading: false,
  pacs002Loading: false,
  pacs008: pacs008InitialState,
  pacs002: pacs002InitialState,
  selectedDebtorEntity: debtorInitialState,
  selectedCreditorEntity: creditorInitialState,
  uiConfig: uiConfigInitialState,
  selectDebtorEntity: () => {},
  selectCreditorEntity: () => {},
  createEntity: () => {},
  updateEntity: () => {},
  createEntityAccount: () => {},
  createCreditorEntity: () => {},
  updateCreditorEntity: () => {},
  createCreditorEntityAccount: () => {},
  setDebtorPacs008: () => {},
  setDebtorAccountPacs008: () => {},
  setCreditorPacs008: () => {},
  setCreditorAccountPacs008: () => {},
  generateTransaction: () => {},
  buildPacs002: () => {},
  reset: () => {},
})

export default EntityContext
