import { createContext } from "react"
import { CdtrEntity, CreditorEntity, DebtorEntity, Entity } from "./entity.interface"

interface Context {
  createEntityLoading: boolean
  updateEntityLoading: boolean
  createAccountLoading: boolean
  createCreditorAccountLoading: boolean
  creditorEntities: Array<CdtrEntity>
  entities: Array<Entity>
  createEntity: () => void
  updateEntity: (entity: DebtorEntity, entityIndex: number) => void
  createEntityAccount: (entityIndex: number) => void
  createCreditorEntity: () => void
  updateCreditorEntity: (entity: CreditorEntity, entityIndex: number) => void
  createCreditorEntityAccount: (entityIndex: number) => void
}

const EntityContext = createContext<Context>({
  createEntityLoading: false,
  updateEntityLoading: false,
  createAccountLoading: false,
  createCreditorAccountLoading: false,
  creditorEntities: [],
  entities: [],
  createEntity: () => {},
  updateEntity: () => {},
  createEntityAccount: () => {},
  createCreditorEntity: () => {},
  updateCreditorEntity: () => {},
  createCreditorEntityAccount: () => {},
})

export default EntityContext
