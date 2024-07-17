"use client"
import React, { ReactNode, useReducer } from "react"
import { ACTIONS } from "./entity.actions"
import EntityContext from "./entity.context"
import { CdtrEntity, CreditorAccount, CreditorEntity, DebtorAccount, DebtorEntity, Entity } from "./entity.interface"
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
    createCreditorAccountLoading: false,
    creditorEntities: [],
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

      dispatch({ type: ACTIONS.CREATE_ENTITY_ACCOUNT_SUCCESS, payload: [...entitiesList] })
    } catch (error) {
      dispatch({ type: ACTIONS.CREATE_ENTITY_ACCOUNT_FAIL })
    }
  }

  const createCreditorEntity = async () => {
    try {
      dispatch({ type: ACTIONS.CREATE_CREDITOR_ENTITY_LOADING })
      const newEntity: CreditorEntity = {
        Cdtr: {
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

      const newAccount: CreditorAccount = {
        CdtrAcct: {
          Id: {
            Othr: {
              Id: crypto.randomUUID().replaceAll("-", ""),

              SchmeNm: {
                Prtry: "TAZAMA_EID",
              },
            },
          },
          Nm: newEntity.Cdtr.Nm.split(" ")[0] + "'s first account",
        },
      }

      const payload: CdtrEntity = {
        CreditorEntity: newEntity,
        CreditorAccounts: [newAccount],
      }

      let entitiesList: Array<CdtrEntity> = state.creditorEntities

      entitiesList.push(payload)

      dispatch({ type: ACTIONS.CREATE_CREDITOR_ENTITY_SUCCESS, payload: [...entitiesList] })
    } catch (error) {
      dispatch({ type: ACTIONS.CREATE_CREDITOR_ENTITY_FAIL })
    }
  }

  const updateCreditorEntity = async (entity: CreditorEntity, entityIndex: number) => {
    try {
      dispatch({ type: ACTIONS.UPDATE_CREDITOR_ENTITY_LOADING })

      let updatedEntity: CdtrEntity = {
        CreditorEntity: entity,
        CreditorAccounts: state.creditorEntities[entityIndex].CreditorAccounts,
      }

      let entitiesList: Array<CdtrEntity> = state.creditorEntities
      if (entitiesList[entityIndex]?.CreditorEntity && typeof entityIndex === "number") {
        entitiesList.splice(entityIndex, 1, updatedEntity)
      }

      dispatch({ type: ACTIONS.UPDATE_CREDITOR_ENTITY_SUCCESS, payload: [...entitiesList] })
    } catch (error) {
      dispatch({ type: ACTIONS.UPDATE_CREDITOR_ENTITY_FAIL })
    }
  }

  const createCreditorEntityAccount = async (entityIndex: number) => {
    try {
      dispatch({ type: ACTIONS.CREATE_CREDITOR_ENTITY_ACCOUNT_LOADING })

      let accountsList: Array<CreditorAccount> = state.creditorEntities[entityIndex].CreditorAccounts

      const AccountName: any = () => {
        if (accountsList.length === 0) {
          return `${state.creditorEntities[entityIndex].CreditorEntity.Cdtr.Nm.split(" ")[0]}'s first account`
        } else if (accountsList.length === 1) {
          return `${state.creditorEntities[entityIndex].CreditorEntity.Cdtr.Nm.split(" ")[0]}'s second account`
        } else if (accountsList.length === 2) {
          return `${state.creditorEntities[entityIndex].CreditorEntity.Cdtr.Nm.split(" ")[0]}'s third account`
        } else if (accountsList.length === 3) {
          return `${state.creditorEntities[entityIndex].CreditorEntity.Cdtr.Nm.split(" ")[0]}'s forth account`
        }
      }

      const newAccount: CreditorAccount = {
        CdtrAcct: {
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

      let updatedEntityAccounts: CdtrEntity = {
        CreditorEntity: state.creditorEntities[entityIndex]?.CreditorEntity,
        CreditorAccounts: accountsList,
      }

      let entitiesList: Array<CdtrEntity> = state.creditorEntities
      if (entitiesList[entityIndex]?.CreditorEntity && typeof entityIndex === "number") {
        entitiesList.splice(entityIndex, 1, updatedEntityAccounts)
      }

      dispatch({ type: ACTIONS.CREATE_CREDITOR_ENTITY_ACCOUNT_SUCCESS, payload: [...entitiesList] })
    } catch (error) {
      dispatch({ type: ACTIONS.CREATE_CREDITOR_ENTITY_ACCOUNT_FAIL })
    }
  }

  return (
    <EntityContext.Provider
      value={{
        createEntityLoading: state.createEntityLoading,
        updateEntityLoading: state.updateEntityLoading,
        createAccountLoading: state.createAccountLoading,
        createCreditorAccountLoading: state.createCreditorAccountLoading,
        creditorEntities: state.creditorEntities,
        entities: state.entities,
        createEntity,
        updateEntity,
        createEntityAccount,
        createCreditorEntity,
        updateCreditorEntity,
        createCreditorEntityAccount,
      }}
    >
      {children}
    </EntityContext.Provider>
  )
}

export default EntityProvider
