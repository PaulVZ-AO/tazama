"use client"
import React, { ReactNode, useEffect, useReducer } from "react"
import { ACTIONS } from "./entity.actions"
import EntityContext from "./entity.context"
import { creditorInitialState, debtorInitialState, pacs008InitialState } from "./entity.initialState"
import {
  CdtrEntity,
  CreditorAccount,
  CreditorEntity,
  DebtorAccount,
  DebtorEntity,
  Entity,
  PACS008,
  SelectedCreditor,
  SelectedDebtor,
} from "./entity.interface"
import EntityReducer from "./entity.reducer"
import { GenerateBirthDate, RandomCellNumber, RandomName, RandomNumbers, RandomSurname } from "./entity.utils"

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
    pacs008Loading: false,
    selectedDebtorEntity: debtorInitialState,
    selectedCreditorEntity: creditorInitialState,
    pacs008: pacs008InitialState,
  }
  const [state, dispatch] = useReducer(EntityReducer, initialEntityState)

  const handleDebtorEntityChange = async () => {
    console.log("handleDebtorEntityChange Active")
    await setDebtorPacs008(state.selectedDebtorEntity.debtorSelectedIndex)
    await setDebtorAccountPacs008(
      state.selectedDebtorEntity.debtorSelectedIndex,
      state.selectedDebtorEntity.debtorAccountSelectedIndex
    )
    // await generateTransaction()
    console.log("handleDebtorEntityChange Done")
    console.log("PACS008: ", state.pacs008)
  }

  const handleCreditorEntityChange = async () => {
    console.log("handleCreditorEntityChange Active")
    await setCreditorPacs008(state.selectedCreditorEntity.creditorSelectedIndex)
    await setCreditorAccountPacs008(
      state.selectedCreditorEntity.creditorSelectedIndex,
      state.selectedCreditorEntity.creditorAccountSelectedIndex
    )
    // await generateTransaction()
    console.log("handleCreditorEntityChange Done")
    console.log("PACS008: ", state.pacs008)
  }

  useEffect(() => {
    if (state.selectedDebtorEntity.debtorSelectedIndex !== undefined) {
      console.log("Selected Debtor Changed: ", state.selectedDebtorEntity)
      if (state.entities.length > 0) {
        handleDebtorEntityChange()
      }
    }
  }, [state.selectedDebtorEntity.debtorSelectedIndex, state.selectedDebtorEntity.debtorAccountSelectedIndex])

  useEffect(() => {
    if (state.selectedCreditorEntity.creditorSelectedIndex !== undefined) {
      console.log("Selected Creditor Changed: ", state.selectedCreditorEntity)

      if (state.creditorEntities.length > 0) {
        handleCreditorEntityChange()
      }
    }
  }, [state.selectedCreditorEntity.creditorSelectedIndex, state.selectedCreditorEntity.creditorAccountSelectedIndex])

  const selectDebtorEntity = async (index: number = 0, accountIndex: number = 0) => {
    try {
      if (state.entities[index]) {
        const selectedDebtor: SelectedDebtor = state.selectedDebtorEntity
        const accountsLength: number = state.entities[index].Accounts.length
        selectedDebtor.debtorSelectedIndex = index
        selectedDebtor.debtorAccountSelectedIndex = accountIndex
        selectedDebtor.debtorAccountsLength = accountsLength
        dispatch({ type: ACTIONS.SELECT_DEBTOR_ENTITY, payload: selectedDebtor })
        console.log("############# DEBTOR RESULT #############")
        console.log("SELECTED DEBTOR: ", selectedDebtor)
        console.log("############## END RESULT ##############")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const selectCreditorEntity = async (index: number = 0, accountIndex: number = 0) => {
    try {
      if (state.entities[index]) {
        const selectedCreditor: SelectedCreditor = state.selectedCreditorEntity

        const accountsLength: number = state.creditorEntities[index].CreditorAccounts.length
        selectedCreditor.creditorSelectedIndex = index
        selectedCreditor.creditorAccountSelectedIndex = accountIndex
        selectedCreditor.creditorAccountsLength = accountsLength
        dispatch({ type: ACTIONS.SELECT_CREDITOR_ENTITY, payload: selectedCreditor })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const createEntity = async () => {
    try {
      dispatch({ type: ACTIONS.CREATE_ENTITY_LOADING })

      const newEntity: DebtorEntity = {
        Dbtr: {
          Nm: `${await RandomName()} ${await RandomSurname()}`,
          Id: {
            PrvtId: {
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
            PrvtId: {
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

  const setDebtorPacs008 = async (entityIndex: number) => {
    try {
      dispatch({ type: ACTIONS.SET_DEBTOR_PACS008_LOADING })
      const debtor: Entity = state.entities[entityIndex]
      const setPacs008: PACS008 = state.pacs008

      // Set Debtor Details
      setPacs008.FIToFICstmrCdt.CdtTrfTxInf.Dbtr.Nm = debtor.Entity.Dbtr.Nm
      setPacs008.FIToFICstmrCdt.CdtTrfTxInf.Dbtr.Id.PrvtId = { ...debtor.Entity.Dbtr.Id.PrvtId }
      setPacs008.FIToFICstmrCdt.CdtTrfTxInf.Dbtr.CtctDtls = { ...debtor.Entity.Dbtr.CtctDtls }
      setPacs008.FIToFICstmrCdt.CdtTrfTxInf.PmtId.EndToEndId = crypto.randomUUID().replaceAll("-", "")

      // Set Debtor Account Details

      if (debtor.Accounts[0] !== undefined) {
        setPacs008.FIToFICstmrCdt.CdtTrfTxInf.DbtrAcct = { ...debtor.Accounts[0].DbtrAcct }
      }

      // Set Random Details
      setPacs008.FIToFICstmrCdt.RmtInf.Ustrd = crypto.randomUUID().replaceAll("-", "")
      setPacs008.FIToFICstmrCdt.CdtTrfTxInf.IntrBkSttlmAmt.Amt.Amt = RandomNumbers()
      setPacs008.FIToFICstmrCdt.CdtTrfTxInf.InstdAmt.Amt.Amt =
        setPacs008.FIToFICstmrCdt.CdtTrfTxInf.IntrBkSttlmAmt.Amt.Amt

      // Set Defaults
      setPacs008.FIToFICstmrCdt.CdtTrfTxInf.Purp.Cd = "MP2P"
      setPacs008.FIToFICstmrCdt.SplmtryData.Envlp.Doc.InitgPty.Glctn.Lat = "-3.0677"
      setPacs008.FIToFICstmrCdt.SplmtryData.Envlp.Doc.InitgPty.Glctn.Long = "37.3552"

      dispatch({ type: ACTIONS.SET_DEBTOR_PACS008_SUCCESS, payload: setPacs008 })
      console.log("PACS008: ", setPacs008)
    } catch (error) {
      dispatch({ type: ACTIONS.SET_DEBTOR_PACS008_FAIL })
      console.log("ERROR DEBTOR PACS008: ", error)
    }
  }

  const setDebtorAccountPacs008 = (entityIndex: number, accountIndex: number) => {
    try {
      dispatch({ type: ACTIONS.SET_DEBTOR_ACCOUNT_PACS008_LOADING })
      const debtor: Entity = state.entities[entityIndex]
      console.log("DEBTOR: ", debtor)
      const setPacs008: PACS008 = state.pacs008

      setPacs008.FIToFICstmrCdt.CdtTrfTxInf.DbtrAcct = { ...debtor.Accounts[accountIndex].DbtrAcct }

      dispatch({ type: ACTIONS.SET_DEBTOR_ACCOUNT_PACS008_SUCCESS, payload: setPacs008 })
      console.log("PACS008: ", setPacs008)
    } catch (error) {
      dispatch({ type: ACTIONS.SET_DEBTOR_ACCOUNT_PACS008_FAIL })
      console.log("ERROR DEBTOR ACCOUNT PACS008: ", error)
    }
  }

  const setCreditorPacs008 = async (entityIndex: number) => {
    try {
      dispatch({ type: ACTIONS.SET_CREDITOR_PACS008_LOADING })
      const creditor: CdtrEntity = state.creditorEntities[entityIndex]
      console.log("CREDITOR: ", creditor)
      const setPacs008: PACS008 = state.pacs008

      console.log("PACS008 BEFORE: ", setPacs008)

      setPacs008.FIToFICstmrCdt.CdtTrfTxInf.Cdtr.Nm = creditor.CreditorEntity.Cdtr.Nm
      setPacs008.FIToFICstmrCdt.CdtTrfTxInf.Cdtr.Id.PrvtId = { ...creditor.CreditorEntity.Cdtr.Id.PrvtId }
      setPacs008.FIToFICstmrCdt.CdtTrfTxInf.Cdtr.CtctDtls = { ...creditor.CreditorEntity.Cdtr.CtctDtls }

      // Set Creditor Account Details

      if (creditor.CreditorAccounts[0] !== undefined) {
        setPacs008.FIToFICstmrCdt.CdtTrfTxInf.CdtrAcct = { ...creditor.CreditorAccounts[0].CdtrAcct }
      }
      dispatch({ type: ACTIONS.SET_CREDITOR_PACS008_SUCCESS, payload: setPacs008 })
      console.log("PACS008: ", setPacs008)
    } catch (error) {
      dispatch({ type: ACTIONS.SET_CREDITOR_PACS008_FAIL })
      console.log("ERROR CREDITOR PACS008: ", error)
    }
  }

  const setCreditorAccountPacs008 = (entityIndex: number, accountIndex: number) => {
    try {
      dispatch({ type: ACTIONS.SET_CREDITOR_ACCOUNT_PACS008_LOADING })
      const creditor: CdtrEntity = state.creditorEntities[entityIndex]
      console.log("CREDITOR: ", creditor, entityIndex, accountIndex)
      const setPacs008: PACS008 = state.pacs008

      setPacs008.FIToFICstmrCdt.CdtTrfTxInf.CdtrAcct = { ...creditor.CreditorAccounts[accountIndex].CdtrAcct }

      dispatch({ type: ACTIONS.SET_CREDITOR_ACCOUNT_PACS008_SUCCESS, payload: setPacs008 })
      console.log("PACS008: ", setPacs008)
    } catch (error) {
      dispatch({ type: ACTIONS.SET_CREDITOR_ACCOUNT_PACS008_FAIL })
      console.log("ERROR SET CREDITOR ACCOUNT PACS008: ", error)
    }
  }

  const generateTransaction = async () => {
    try {
      dispatch({ type: ACTIONS.GENERATE_TRANSACTION_PACS008_LOADING })
      const setPacs008: PACS008 = state.pacs008

      // Set Random Details
      setPacs008.FIToFICstmrCdt.RmtInf.Ustrd = crypto.randomUUID().replaceAll("-", "")
      setPacs008.FIToFICstmrCdt.CdtTrfTxInf.IntrBkSttlmAmt.Amt.Amt = RandomNumbers()
      setPacs008.FIToFICstmrCdt.CdtTrfTxInf.InstdAmt.Amt.Amt =
        setPacs008.FIToFICstmrCdt.CdtTrfTxInf.IntrBkSttlmAmt.Amt.Amt
      dispatch({ type: ACTIONS.GENERATE_TRANSACTION_PACS008_SUCCESS })
      console.log("PACS008: ", setPacs008)
    } catch (error) {
      dispatch({ type: ACTIONS.GENERATE_TRANSACTION_PACS008_FAIL })
      console.log("ERROR TRANSACTION PACS008: ", error)
    }
  }

  return (
    <EntityContext.Provider
      value={{
        createEntityLoading: state.createEntityLoading,
        updateEntityLoading: state.updateEntityLoading,
        createAccountLoading: state.createAccountLoading,
        createCreditorAccountLoading: state.createCreditorAccountLoading,
        pacs008Loading: state.pacs008Loading,
        creditorEntities: state.creditorEntities,
        entities: state.entities,
        pacs008: state.pacs008,
        selectedDebtorEntity: state.selectedDebtorEntity,
        selectedCreditorEntity: state.selectedCreditorEntity,
        selectDebtorEntity,
        selectCreditorEntity,
        createEntity,
        updateEntity,
        createEntityAccount,
        createCreditorEntity,
        updateCreditorEntity,
        createCreditorEntityAccount,
        setDebtorPacs008,
        setDebtorAccountPacs008,
        setCreditorPacs008,
        setCreditorAccountPacs008,
        generateTransaction,
      }}
    >
      {children}
    </EntityContext.Provider>
  )
}

export default EntityProvider
