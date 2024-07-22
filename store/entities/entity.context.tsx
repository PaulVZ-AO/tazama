import { createContext } from "react"
import {
  CdtrEntity,
  CreditorEntity,
  DebtorEntity,
  Entity,
  PACS008,
  SelectedCreditor,
  SelectedDebtor,
} from "./entity.interface"
import { creditorInitialState, debtorInitialState, pacs008InitialState } from "./entity.initialState"

interface Context {
  createEntityLoading: boolean
  updateEntityLoading: boolean
  createAccountLoading: boolean
  createCreditorAccountLoading: boolean
  creditorEntities: Array<CdtrEntity>
  entities: Array<Entity>
  pacs008Loading: boolean
  pacs008: PACS008
  selectedDebtorEntity: SelectedDebtor
  selectedCreditorEntity: SelectedCreditor
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
}

const EntityContext = createContext<Context>({
  createEntityLoading: false,
  updateEntityLoading: false,
  createAccountLoading: false,
  createCreditorAccountLoading: false,
  creditorEntities: [],
  entities: [],
  pacs008Loading: false,
  pacs008: pacs008InitialState,
  selectedDebtorEntity: debtorInitialState,
  selectedCreditorEntity: creditorInitialState,
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
})

export default EntityContext
