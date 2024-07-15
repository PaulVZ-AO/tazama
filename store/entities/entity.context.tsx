import { createContext } from "react"
import { DebtorEntity } from "./entity.interface"

interface Context {
  createEntityLoading: boolean
  entities: Array<DebtorEntity>
  createEntity: () => void
}

const EntityContext = createContext<Context>({
  createEntityLoading: false,
  entities: [],
  createEntity: () => {},
})

export default EntityContext
