"use client"
import React, { ReactNode, useReducer } from "react"
import { ACTIONS } from "./entity.actions"
import EntityContext from "./entity.context"
import { DebtorEntity } from "./entity.interface"
import EntityReducer from "./entity.reducer"
import { GenerateBirthDate, RandomCellNumber, RandomName, RandomSurname } from "./entity.utils"

interface Props {
  children: ReactNode
}

const EntityProvider = ({ children }: Props) => {
  const initialEntityState = {
    createEntityLoading: false,
    entities: [],
  }
  const [state, dispatch] = useReducer(EntityReducer, initialEntityState)

  const createEntity = async () => {
    try {
      dispatch({ type: ACTIONS.CREATE_ENTITY_LOADING })

      const newEntity: DebtorEntity = {
        Dbtr: {
          Nm: `${await RandomName()} ${await RandomSurname()}`,
          Id: {
            PrvId: {
              DtAndPlcOfBirth: {
                BirthDt: await GenerateBirthDate(),
                CityOfBirth: "Unknown",
                CtryOfBirth: "ZZ",
              },
              Othr: {
                Id: crypto.randomUUID().replaceAll("-", ""),
                SchmeNm: {
                  Prtry: "TAZAMA_EID",
                },
              },
            },
          },
          CtctDtls: { MobNb: await RandomCellNumber() },
        },
      }

      let entitiesList: Array<DebtorEntity> = state.entities

      entitiesList.push(newEntity)

      dispatch({ type: ACTIONS.CREATE_ENTITY_SUCCESS, payload: [...entitiesList] })
    } catch (error) {
      dispatch({ type: ACTIONS.CREATE_ENTITY_FAIL })
    }
  }

  return (
    <EntityContext.Provider
      value={{
        createEntityLoading: state.createEntityLoading,
        entities: state.entities,
        createEntity,
      }}
    >
      {children}
    </EntityContext.Provider>
  )
}

export default EntityProvider
