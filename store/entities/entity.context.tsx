import { createContext } from "react"
import { DebtorEntity, Entity } from "./entity.interface"

interface Context {
  createEntityLoading: boolean
  updateEntityLoading: boolean
  createAccountLoading: boolean
  entities: Array<Entity>
  createEntity: () => void
  updateEntity: (entity: DebtorEntity, entityIndex: number) => void
  createEntityAccount: (entityIndex: number) => void
}

const EntityContext = createContext<Context>({
  createEntityLoading: false,
  updateEntityLoading: false,
  createAccountLoading: false,
  entities: [],
  createEntity: () => {},
  updateEntity: () => {},
  createEntityAccount: () => {},
})

export default EntityContext
