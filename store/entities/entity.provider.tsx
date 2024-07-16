"use client"
import React, { ReactNode, useReducer } from "react"
import { ACTIONS } from "./entity.actions"
import EntityContext from "./entity.context"
import { DebtorAccount, DebtorEntity, Entity } from "./entity.interface"
import EntityReducer from "./entity.reducer"
import { GenerateBirthDate, RandomCellNumber, RandomName, RandomSurname } from "./entity.utils"

interface Props {
  children: ReactNode
}

const EntityProvider = ({ children }: Props) => {
  const initialEntityState = {
    createEntityLoading: false,
    updateEntityLoading: false,
    createAccountLoading: false,
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

      const newAccount: DebtorAccount = {
        DbtrAcct: {
          Id: {
            Othr: {
              Id: crypto.randomUUID().replaceAll("-", ""),

              SchmeNm: {
                Prtry: "TAZAMA_EID",
              },
            },
          },
          Nm: newEntity.Dbtr.Nm.split(" ")[0] + "'s first account",
        },
      }

      const payload: Entity = {
        Entity: newEntity,
        Accounts: [newAccount],
      }

      let entitiesList: Array<Entity> = state.entities

      entitiesList.push(payload)

      dispatch({ type: ACTIONS.CREATE_ENTITY_SUCCESS, payload: [...entitiesList] })
    } catch (error) {
      dispatch({ type: ACTIONS.CREATE_ENTITY_FAIL })
    }
  }

  const updateEntity = async (entity: DebtorEntity, entityIndex: number) => {
    try {
      dispatch({ type: ACTIONS.UPDATE_ENTITY_LOADING })

      let updatedEntity: Entity = {
        Entity: entity,
        Accounts: state.entities[entityIndex]?.Accounts,
      }

      let entitiesList: Array<Entity> = state.entities
      if (entitiesList[entityIndex]?.Entity && typeof entityIndex === "number") {
        entitiesList.splice(entityIndex, 1, updatedEntity)
      }

      console.log("UPDATED ENTITIES: ", entitiesList)
      //   entitiesList.push(newEntity)

      dispatch({ type: ACTIONS.UPDATE_ENTITY_SUCCESS, payload: [...entitiesList] })
    } catch (error) {
      dispatch({ type: ACTIONS.UPDATE_ENTITY_FAIL })
    }
  }

  const createEntityAccount = async (entityIndex: number) => {
    try {
      dispatch({ type: ACTIONS.CREATE_ENTITY_ACCOUNT_LOADING })

      let accountsList: Array<DebtorAccount> = state.entities[entityIndex].Accounts

      const AccountName: any = () => {
        if (accountsList.length === 0) {
          return `${state.entities[entityIndex].Entity.Dbtr.Nm.split(" ")[0]}'s first account`
        } else if (accountsList.length === 1) {
          return `${state.entities[entityIndex].Entity.Dbtr.Nm.split(" ")[0]}'s second account`
        } else if (accountsList.length === 2) {
          return `${state.entities[entityIndex].Entity.Dbtr.Nm.split(" ")[0]}'s third account`
        } else if (accountsList.length === 3) {
          return `${state.entities[entityIndex].Entity.Dbtr.Nm.split(" ")[0]}'s forth account`
        }
      }

      const newAccount: DebtorAccount = {
        DbtrAcct: {
          Id: {
            Othr: {
              Id: crypto.randomUUID().replaceAll("-", ""),

              SchmeNm: {
                Prtry: "TAZAMA_EID",
              },
            },
          },
          Nm: AccountName(),
        },
      }

      accountsList.push(newAccount)

      let updatedEntityAccounts: Entity = {
        Entity: state.entities[entityIndex]?.Entity,
        Accounts: accountsList,
      }

      let entitiesList: Array<Entity> = state.entities
      if (entitiesList[entityIndex]?.Entity && typeof entityIndex === "number") {
        entitiesList.splice(entityIndex, 1, updatedEntityAccounts)
      }

      console.log("UPDATED ENTITIES: ", entitiesList)

      dispatch({ type: ACTIONS.CREATE_ENTITY_ACCOUNT_SUCCESS, payload: [...entitiesList] })
    } catch (error) {
      dispatch({ type: ACTIONS.CREATE_ENTITY_ACCOUNT_FAIL })
    }
  }

  return (
    <EntityContext.Provider
      value={{
        createEntityLoading: state.createEntityLoading,
        updateEntityLoading: state.updateEntityLoading,
        createAccountLoading: state.createAccountLoading,
        entities: state.entities,
        createEntity,
        updateEntity,
        createEntityAccount,
      }}
    >
      {children}
    </EntityContext.Provider>
  )
}

export default EntityProvider
