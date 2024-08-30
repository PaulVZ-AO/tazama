"use client"
import React, { ReactNode, useEffect, useReducer } from "react"
import { ACTIONS } from "./entity.actions"
import EntityContext from "./entity.context"
import {
  creditorInitialState,
  debtorInitialState,
  pacs002InitialState,
  pacs008InitialState,
  rulesLightsInitialState,
  uiConfigInitialState,
} from "./entity.initialState"
import {
  CdtrEntity,
  CreditorAccount,
  CreditorEntity,
  DebtorAccount,
  DebtorEntity,
  Entity,
  PACS002,
  PACS008,
  SelectedCreditor,
  SelectedDebtor,
  UIConfigs,
  UIConfiguration,
} from "./entity.interface"
import EntityReducer from "./entity.reducer"
import {
  cloneCreditorAccountToDebtorAccount,
  cloneCreditorToDebtor,
  cloneDebtorAccountToCreditorAccount,
  cloneDebtorToCreditor,
  createAnCreditorEntity,
  createAnEntity,
  GenerateBirthDate,
  RandomCellNumber,
  RandomName,
  RandomNumbers,
  RandomSurname,
} from "./entity.utils"

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
    pacs002Loading: false,
    selectedDebtorEntity: debtorInitialState,
    selectedCreditorEntity: creditorInitialState,
    pacs008: pacs008InitialState,
    pacs002: pacs002InitialState,
    uiConfig: uiConfigInitialState,
    ruleLights: rulesLightsInitialState,
  }
  const [state, dispatch] = useReducer(EntityReducer, initialEntityState)

  useEffect(() => {
    let entities: string
    let creditorEntities: string
    let selectedDebtor: string
    let selectedCreditor: string
    let pacs008: string
    let pacs002: string
    // let uiConfig: string

    entities = localStorage.getItem("DEBTOR_ENTITIES") || "[]"
    creditorEntities = localStorage.getItem("CREDITOR_ENTITIES") || "[]"

    selectedDebtor = localStorage.getItem("SELECTED_DEBTOR") || ""
    selectedCreditor = localStorage.getItem("SELECTED_CREDITOR") || ""

    pacs008 = localStorage.getItem("PACS008") || ""
    pacs002 = localStorage.getItem("PACS002") || ""

    // uiConfig = localStorage.getItem("UI_CONFIG") || ""

    if (JSON.parse(entities) !== "") {
      dispatch({ type: ACTIONS.UPDATE_ENTITY_SUCCESS, payload: JSON.parse(entities) })
      console.log("ENTITIES FROM LS: ", JSON.parse(entities))
    }
    if (JSON.parse(creditorEntities) !== "") {
      dispatch({ type: ACTIONS.UPDATE_CREDITOR_ENTITY_SUCCESS, payload: JSON.parse(creditorEntities) })
      console.log("CREDITOR ENTITIES FROM LS: ", JSON.parse(creditorEntities))
    }
    if (selectedDebtor !== "") {
      dispatch({ type: ACTIONS.SELECT_DEBTOR_ENTITY, payload: JSON.parse(selectedDebtor) })
      console.log("SELECTED DEBTOR FROM LS: ", JSON.parse(selectedDebtor))
    }
    if (selectedCreditor !== "") {
      dispatch({ type: ACTIONS.SELECT_CREDITOR_ENTITY, payload: JSON.parse(selectedCreditor) })
      console.log("SELETED CREDITOR FROM LS: ", JSON.parse(selectedCreditor))
    }

    if (pacs008 !== "") {
      dispatch({ type: ACTIONS.SET_DEBTOR_PACS008_SUCCESS, payload: JSON.parse(pacs008) })
      console.log("PACS008 FROM LS: ", JSON.parse(pacs008))
      if (JSON.parse(creditorEntities) !== "") {
        console.log("PASSED PHASE 1")
        let parsedCreditor: any = JSON.parse(creditorEntities)
        if (parsedCreditor.length > 0) {
          console.log("PASSED PHASE 2")
          buildPacs002()
        }
      }
    }
    if (pacs002 !== "") {
      dispatch({ type: ACTIONS.GENERATE_PACS002_SUCCESS, payload: JSON.parse(pacs002) })
      console.log("PACS002 FROM LS: ", JSON.parse(pacs002))
    }
  }, [])

  const reset = async () => {
    localStorage.clear()
  }

  const setRuleLights = async (rules: any[]) => {
    try {
      dispatch({ type: ACTIONS.SET_RULE_LIGHTS_LOADING })
      const array: any[] = []
      rules.forEach((rule: any) => {
        let newRule = { id: rule.id, color: "n", title: rule.title, result: null }
        console.log("CREATING RULE: ", newRule.title)
        array.push(newRule)
      })
      dispatch({ type: ACTIONS.SET_RULE_LIGHTS_SUCCESS, payload: array })
      return state.ruleLights
    } catch (err) {
      dispatch({ type: ACTIONS.SET_RULE_LIGHTS_FAIL })
    }
  }

  const handleDebtorEntityChange = async (debtorIndex: number | undefined, accountIndex: number | undefined) => {
    try {
      if (debtorIndex !== undefined && accountIndex !== undefined) {
        console.log("handleDebtorEntityChange Active")
        await setDebtorPacs008(debtorIndex)
        await setDebtorAccountPacs008(debtorIndex, accountIndex)
      } else {
        console.log("handleDebtorEntityChange Active")
        await setDebtorPacs008(state.selectedDebtorEntity.debtorSelectedIndex)
        await setDebtorAccountPacs008(
          state.selectedDebtorEntity.debtorSelectedIndex,
          state.selectedDebtorEntity.debtorAccountSelectedIndex
        )
      }

      // await generateTransaction()
      console.log("handleDebtorEntityChange Done")
      console.log("PACS008: ", state.pacs008)
    } catch (error) {
      console.log("ERROR happened on Debtor Change")
    }
  }

  const handleCreditorEntityChange = async (creditorIndex: number | undefined, accountIndex: number | undefined) => {
    if (creditorIndex !== undefined && accountIndex !== undefined) {
      console.log("handleCreditorEntityChange Active")
      await setCreditorPacs008(creditorIndex)
      await setCreditorAccountPacs008(creditorIndex, accountIndex)
    }
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
        handleDebtorEntityChange(undefined, undefined)
        buildPacs002()
      }
    }
  }, [state.selectedDebtorEntity.debtorSelectedIndex, state.selectedDebtorEntity.debtorAccountSelectedIndex])

  useEffect(() => {
    if (state.selectedCreditorEntity.creditorSelectedIndex !== undefined) {
      console.log("Selected Creditor Changed: ", state.selectedCreditorEntity)

      if (state.creditorEntities.length > 0) {
        handleCreditorEntityChange(undefined, undefined)
        buildPacs002()
      }
    }
  }, [state.selectedCreditorEntity.creditorSelectedIndex, state.selectedCreditorEntity.creditorAccountSelectedIndex])

  const buildPacs002 = async () => {
    try {
      dispatch({ type: ACTIONS.GENERATE_PACS002_LOADING })
      let pacs002Payload: PACS002 = state.pacs002
      let pacs008Data: PACS008 = state.pacs008

      // GrpHdr
      pacs002Payload.FIToFIPmtSts.GrpHdr.MsgId = crypto.randomUUID().replaceAll("-", "")
      pacs002Payload.FIToFIPmtSts.GrpHdr.CreDtTm = new Date().toISOString()

      // TxInfAndSts
      pacs002Payload.FIToFIPmtSts.TxInfAndSts.OrgnlInstrId = pacs008Data.FIToFICstmrCdtTrf.CdtTrfTxInf.PmtId.InstrId
      pacs002Payload.FIToFIPmtSts.TxInfAndSts.OrgnlEndToEndId =
        pacs008Data.FIToFICstmrCdtTrf.CdtTrfTxInf.PmtId.EndToEndId
      pacs002Payload.FIToFIPmtSts.TxInfAndSts.TxSts = "ACCC"
      pacs002Payload.FIToFIPmtSts.TxInfAndSts.AccptncDtTm = new Date().toISOString()
      dispatch({ type: ACTIONS.GENERATE_PACS002_SUCCESS, payload: pacs002Payload })
      console.log("PACS002: ", state.pacs002)
      localStorage.setItem("PACS002", JSON.stringify(state.pacs002))
    } catch (error) {
      dispatch({ type: ACTIONS.GENERATE_PACS002_FAIL })
      console.log("PACS002 ERROR: ", error)
    }
  }

  const selectDebtorEntity = async (index: number = 0, accountIndex: number = 0) => {
    try {
      if (state.entities[index]) {
        const selectedDebtor: SelectedDebtor = state.selectedDebtorEntity
        const accountsLength: number = state.entities[index].Accounts.length
        selectedDebtor.debtorSelectedIndex = index
        selectedDebtor.debtorAccountSelectedIndex = accountIndex
        selectedDebtor.debtorAccountsLength = accountsLength
        dispatch({ type: ACTIONS.SELECT_DEBTOR_ENTITY, payload: selectedDebtor })
        localStorage.setItem("SELECTED_DEBTOR", JSON.stringify(state.selectedDebtorEntity))
        console.log("############# DEBTOR RESULT #############")
        console.log("SELECTED DEBTOR: ", selectedDebtor)
        console.log("############## END RESULT ##############")
      }
    } catch (error) {
      console.log("ERROR happened on Debtor")
      console.log(error)
    }
  }

  const selectCreditorEntity = async (index: number = 0, accountIndex: number = 0) => {
    try {
      if (state.creditorEntities[index]) {
        const selectedCreditor: SelectedCreditor = state.selectedCreditorEntity

        const accountsLength: number = state.creditorEntities[index].CreditorAccounts.length
        selectedCreditor.creditorSelectedIndex = index
        selectedCreditor.creditorAccountSelectedIndex = accountIndex
        selectedCreditor.creditorAccountsLength = accountsLength
        dispatch({ type: ACTIONS.SELECT_CREDITOR_ENTITY, payload: selectedCreditor })
        localStorage.setItem("SELECTED_CREDITOR", JSON.stringify(state.selectedCreditorEntity))
      }
    } catch (error) {
      console.log("ERROR happened on Creditors")
      console.log(error)
    }
  }

  const createEntity = async () => {
    try {
      dispatch({ type: ACTIONS.CREATE_ENTITY_LOADING })

      const payload = await createAnEntity()

      let entitiesList: Array<Entity> = state.entities

      entitiesList.push(payload)

      dispatch({ type: ACTIONS.CREATE_ENTITY_SUCCESS, payload: [...entitiesList] })
      localStorage.setItem("DEBTOR_ENTITIES", JSON.stringify(state.entities))
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
      console.log(state.entities, "------??")

      dispatch({ type: ACTIONS.UPDATE_ENTITY_SUCCESS, payload: [...entitiesList] })
      localStorage.setItem("DEBTOR_ENTITIES", JSON.stringify(state.entities))
    } catch (error) {
      dispatch({ type: ACTIONS.UPDATE_ENTITY_FAIL })
    }
  }

  const deleteEntity = async (entityIndex: number) => {
    try {
      dispatch({ type: ACTIONS.DELETE_DEBTOR_ENTITY_LOADING })

      let entitiesList: Array<Entity> = state.entities

      if (entitiesList[entityIndex]?.Entity && typeof entityIndex === "number") {
        entitiesList.splice(entityIndex, 1)
      }

      dispatch({ type: ACTIONS.DELETE_DEBTOR_ENTITY_SUCCESS, payload: [...entitiesList] })
      localStorage.setItem("DEBTOR_ENTITIES", JSON.stringify(entitiesList))
    } catch (error) {
      dispatch({ type: ACTIONS.DELETE_DEBTOR_ENTITY_FAIL })
    }
  }

  const createEntityAccount = async (entityIndex: number) => {
    try {
      dispatch({ type: ACTIONS.CREATE_DEBTOR_ACCOUNT_LOADING })

      let accountsList: Array<DebtorAccount> = state.entities[entityIndex].Accounts

      const AccountName: any = () => {
        if (accountsList.length === 0) {
          return `${state.entities[entityIndex].Entity.Dbtr.Nm.split(" ")[0]}'s first account`
        } else if (accountsList.length === 1) {
          return `${state.entities[entityIndex].Entity.Dbtr.Nm.split(" ")[0]}'s second account`
        } else if (accountsList.length === 2) {
          return `${state.entities[entityIndex].Entity.Dbtr.Nm.split(" ")[0]}'s third account`
        } else if (accountsList.length === 3) {
          return `${state.entities[entityIndex].Entity.Dbtr.Nm.split(" ")[0]}'s fourth account`
        }
      }

      const newAccount: DebtorAccount = {
        DbtrAcct: {
          Id: {
            Othr: [
              {
                Id: crypto.randomUUID().replaceAll("-", ""),

                SchmeNm: {
                  Prtry: "MSISDN",
                },
              },
            ],
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

      dispatch({ type: ACTIONS.CREATE_DEBTOR_ACCOUNT_SUCCESS, payload: [...entitiesList] })
      localStorage.setItem("DEBTOR_ENTITIES", JSON.stringify(state.entities))
    } catch (error) {
      dispatch({ type: ACTIONS.CREATE_DEBTOR_ACCOUNT_FAIL })
    }
  }

  const updateAccounts = async (updatedAccounts: Array<DebtorAccount>, entityIndex: number) => {
    try {
      dispatch({ type: ACTIONS.UPDATE_DEBTOR_ACCOUNT_LOADING })

      // Get the current accounts for the entity
      const currentAccounts = state.entities[entityIndex]?.Accounts || []

      // Create a new accounts array by merging current accounts with updated accounts
      const mergedAccounts = currentAccounts.map((account: any) => {
        return (
          updatedAccounts.find(
            (updatedAccount) => updatedAccount.DbtrAcct.Id.Othr[0].Id === account.DbtrAcct.Id.Othr[0].Id
          ) || account
        )
      })

      let updatedEntity: Entity = {
        Entity: state.entities[entityIndex]?.Entity,
        Accounts: mergedAccounts,
      }

      let accountsList: Array<Entity> = state.entities
      if (accountsList[entityIndex]?.Entity && typeof entityIndex === "number") {
        accountsList.splice(entityIndex, 1, updatedEntity)
      }

      dispatch({ type: ACTIONS.UPDATE_DEBTOR_ACCOUNT_SUCCESS, payload: [...accountsList] })
      localStorage.setItem("DEBTOR_ENTITIES", JSON.stringify(accountsList))
    } catch (error) {
      dispatch({ type: ACTIONS.UPDATE_DEBTOR_ACCOUNT_FAIL })
    }
  }

  // const deleteAccount = async (entityIndex: number) => {
  //   try {
  //     dispatch({ type: ACTIONS.DELETE_DEBTOR_ACCOUNT_LOADING });

  //     // Retrieve the list of accounts for the specified entity
  //     let accountsList: Array<DebtorAccount> = state.entities[entityIndex].Accounts;

  //     // Proceed if there are accounts to delete
  //     if (accountsList.length > 0) {
  //       // Remove the last account from the list
  //       accountsList.pop();

  //       if (accountsList.length === 0) {
  //         // If all accounts are deleted, call deleteEntity to remove the entire entity
  //         await deleteEntity(entityIndex);
  //       } else {
  //         // Update the entity's account list after deletion
  //         let updatedEntityAccounts: Entity = {
  //           Entity: state.entities[entityIndex]?.Entity,
  //           Accounts: accountsList,
  //         };

  //         // Update the entities list with the modified entity
  //         let entitiesList: Array<Entity> = [...state.entities];
  //         entitiesList[entityIndex] = updatedEntityAccounts;

  //         // Dispatch success action with the updated entities list
  //         dispatch({ type: ACTIONS.DELETE_DEBTOR_ACCOUNT_SUCCESS, payload: entitiesList });

  //         // Persist the updated entities list to localStorage
  //         localStorage.setItem("DEBTOR_ENTITIES", JSON.stringify(entitiesList));
  //       }
  //     }

  //   } catch (error) {
  //     // Dispatch failure action if an error occurs
  //     dispatch({ type: ACTIONS.DELETE_DEBTOR_ACCOUNT_FAIL });
  //   }
  // };

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
              Othr: [
                {
                  Id: crypto.randomUUID().replaceAll("-", ""),
                  SchmeNm: {
                    Prtry: "TAZAMA_EID",
                  },
                },
              ],
            },
          },
          CtctDtls: { MobNb: await RandomCellNumber() },
        },
      }

      const newAccount: CreditorAccount = {
        CdtrAcct: {
          Id: {
            Othr: [
              {
                Id: crypto.randomUUID().replaceAll("-", ""),

                SchmeNm: {
                  Prtry: "MSISDN",
                },
              },
            ],
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
      localStorage.setItem("CREDITOR_ENTITIES", JSON.stringify(state.creditorEntities))
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
      localStorage.setItem("CREDITOR_ENTITIES", JSON.stringify(state.creditorEntities))
    } catch (error) {
      dispatch({ type: ACTIONS.UPDATE_CREDITOR_ENTITY_FAIL })
    }
  }

  const deleteCreditorEntity = async (entityIndex: number) => {
    try {
      dispatch({ type: ACTIONS.DELETE_CREDITOR_ENTITY_LOADING })

      let entitiesList: Array<CdtrEntity> = state.creditorEntities

      if (entitiesList[entityIndex]?.CreditorEntity && typeof entityIndex === "number") {
        entitiesList.splice(entityIndex, 1)
      }

      dispatch({ type: ACTIONS.DELETE_CREDITOR_ENTITY_SUCCESS, payload: [...entitiesList] })
      localStorage.setItem("CREDITOR_ENTITIES", JSON.stringify(entitiesList))
    } catch (error) {
      dispatch({ type: ACTIONS.DELETE_CREDITOR_ENTITY_FAIL })
    }
  }

  const createCreditorEntityAccount = async (entityIndex: number) => {
    try {
      dispatch({ type: ACTIONS.CREATE_CREDITOR_ACCOUNT_LOADING })

      let accountsList: Array<CreditorAccount> = state.creditorEntities[entityIndex].CreditorAccounts

      const AccountName: any = () => {
        if (accountsList.length === 0) {
          return `${state.creditorEntities[entityIndex].CreditorEntity.Cdtr.Nm.split(" ")[0]}'s first account`
        } else if (accountsList.length === 1) {
          return `${state.creditorEntities[entityIndex].CreditorEntity.Cdtr.Nm.split(" ")[0]}'s second account`
        } else if (accountsList.length === 2) {
          return `${state.creditorEntities[entityIndex].CreditorEntity.Cdtr.Nm.split(" ")[0]}'s third account`
        } else if (accountsList.length === 3) {
          return `${state.creditorEntities[entityIndex].CreditorEntity.Cdtr.Nm.split(" ")[0]}'s fourth account`
        }
      }

      const newAccount: CreditorAccount = {
        CdtrAcct: {
          Id: {
            Othr: [
              {
                Id: crypto.randomUUID().replaceAll("-", ""),

                SchmeNm: {
                  Prtry: "MSISDN",
                },
              },
            ],
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

      dispatch({ type: ACTIONS.CREATE_CREDITOR_ACCOUNT_SUCCESS, payload: [...entitiesList] })
      localStorage.setItem("CREDITOR_ENTITIES", JSON.stringify(state.creditorEntities))
    } catch (error) {
      dispatch({ type: ACTIONS.CREATE_CREDITOR_ACCOUNT_FAIL })
    }
  }

  const updateCreditorAccount = async (updatedCreditorAccounts: Array<CreditorAccount>, entityIndex: number) => {
    try {
      dispatch({ type: ACTIONS.UPDATE_CREDITOR_ACCOUNT_LOADING })

      const currentCdtrAccounts = state.creditorEntities[entityIndex]?.CreditorAccounts || []

      const mergedCdtrAccounts = currentCdtrAccounts.map((cdtrAccount: any) => {
        return (
          updatedCreditorAccounts.find(
            (updatedCreditorAccount) =>
              updatedCreditorAccount.CdtrAcct.Id.Othr[0].Id === cdtrAccount.CdtrAcct.Id.Othr[0].Id
          ) || cdtrAccount
        )
      })

      let updatedCdtrEntity: CdtrEntity = {
        CreditorEntity: state.creditorEntities[entityIndex]?.CreditorEntity,
        CreditorAccounts: mergedCdtrAccounts,
      }

      let accountsList: Array<CdtrEntity> = state.creditorEntities
      if (accountsList[entityIndex]?.CreditorEntity && typeof entityIndex === "number") {
        accountsList.splice(entityIndex, 1, updatedCdtrEntity)
      }

      dispatch({ type: ACTIONS.UPDATE_CREDITOR_ACCOUNT_SUCCESS, payload: [...accountsList] })
      localStorage.setItem("CREDITOR_ENTITIES", JSON.stringify(accountsList))
    } catch (error) {
      dispatch({ type: ACTIONS.UPDATE_CREDITOR_ACCOUNT_FAIL })
    }
  }

  // const deleteCreditorAccount = async (entityIndex: number) => {
  //   try {
  //     dispatch({ type: ACTIONS.DELETE_CREDITOR_ACCOUNT_LOADING });

  //     let accountsList: Array<CreditorAccount> = state.creditorEntities[entityIndex].CreditorAccounts;

  //     if (accountsList.length > 0) {
  //       accountsList.pop();

  //       if (accountsList.length === 0) {
  //         await deleteCreditorEntity(entityIndex);
  //       } else {

  //         let updatedEntityAccounts: CdtrEntity = {
  //           CreditorEntity: state.creditorEntities[entityIndex]?.CreditorEntity,
  //           CreditorAccounts: accountsList,
  //         };

  //         let entitiesList: Array<CdtrEntity> = [...state.creditorEntities];
  //         entitiesList[entityIndex] = updatedEntityAccounts;

  //         dispatch({ type: ACTIONS.DELETE_CREDITOR_ACCOUNT_SUCCESS, payload: entitiesList });

  //         localStorage.setItem("CREDITOR_ENTITIES", JSON.stringify(entitiesList));
  //       }
  //     }

  //   } catch (error) {
  //     // Dispatch failure action if an error occurs
  //     dispatch({ type: ACTIONS.DELETE_CREDITOR_ACCOUNT_FAIL });
  //   }
  // };

  const setDebtorPacs008 = async (entityIndex: number) => {
    try {
      dispatch({ type: ACTIONS.SET_DEBTOR_PACS008_LOADING })
      const debtor: Entity = state.entities[entityIndex]
      const setPacs008: PACS008 = state.pacs008

      // TO BE SET WHEN THE BUTTON SEND IS CLICKED!!!
      // Move to a send function TODO!!!
      setPacs008.FIToFICstmrCdtTrf.GrpHdr.MsgId = crypto.randomUUID().replaceAll("-", "")
      setPacs008.FIToFICstmrCdtTrf.GrpHdr.CreDtTm = new Date().toISOString()

      // Set Debtor Details
      setPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.InitgPty.Nm = debtor.Entity.Dbtr.Nm
      setPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.InitgPty.Id.PrvtId = { ...debtor.Entity.Dbtr.Id.PrvtId }
      setPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.InitgPty.CtctDtls = { ...debtor.Entity.Dbtr.CtctDtls }

      setPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.Dbtr.Nm = debtor.Entity.Dbtr.Nm
      setPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.Dbtr.Id.PrvtId = { ...debtor.Entity.Dbtr.Id.PrvtId }
      setPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.Dbtr.CtctDtls = { ...debtor.Entity.Dbtr.CtctDtls }
      setPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.PmtId.InstrId = crypto.randomUUID().replaceAll("-", "")
      setPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.PmtId.EndToEndId = crypto.randomUUID().replaceAll("-", "")

      // Set Debtor Account Details

      if (debtor.Accounts[0] !== undefined) {
        setPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.DbtrAcct = { ...debtor.Accounts[0].DbtrAcct }
      }

      // Set Random Details
      setPacs008.FIToFICstmrCdtTrf.RmtInf.Ustrd = crypto.randomUUID().replaceAll("-", "")
      setPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.IntrBkSttlmAmt.Amt.Amt = RandomNumbers()
      setPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.InstdAmt.Amt.Amt =
        setPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.IntrBkSttlmAmt.Amt.Amt

      // Set Defaults
      setPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.Purp.Cd = "MP2P"
      setPacs008.FIToFICstmrCdtTrf.SplmtryData.Envlp.Doc.Xprtn = new Date().toISOString()
      setPacs008.FIToFICstmrCdtTrf.SplmtryData.Envlp.Doc.InitgPty.Glctn.Lat = "-3.0677"
      setPacs008.FIToFICstmrCdtTrf.SplmtryData.Envlp.Doc.InitgPty.Glctn.Long = "37.3552"

      dispatch({ type: ACTIONS.SET_DEBTOR_PACS008_SUCCESS, payload: setPacs008 })
      console.log("PACS008: ", setPacs008)
      localStorage.setItem("PACS008", JSON.stringify(state.pacs008))
    } catch (error) {
      dispatch({ type: ACTIONS.SET_DEBTOR_PACS008_FAIL })
      console.log("ERROR DEBTOR PACS008: ", error)
    }
  }

  const setDebtorAccountPacs008 = (entityIndex: number, accountIndex: number) => {
    try {
      dispatch({ type: ACTIONS.SET_DEBTOR_ACCOUNT_PACS008_LOADING })
      const debtor: Entity = state.entities[entityIndex]
      const selectedDebtor: SelectedDebtor = state.selectedDebtorEntity
      console.log("DEBTOR: ", debtor)
      const setPacs008: PACS008 = state.pacs008
      if (accountIndex !== undefined) {
        let idx = accountIndex
        let debtorAccount: any = { ...debtor.Accounts[idx]?.DbtrAcct }
        setPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.DbtrAcct = { ...debtorAccount }
      }

      dispatch({ type: ACTIONS.SET_DEBTOR_ACCOUNT_PACS008_SUCCESS, payload: setPacs008 })
      dispatch({ type: ACTIONS.SELECT_DEBTOR_ENTITY, payload: selectedDebtor })
      console.log("PACS008: ", setPacs008)
      selectedDebtor.debtorAccountSelectedIndex = accountIndex
      localStorage.setItem("SELECTED_DEBTOR", JSON.stringify(state.selectedDebtorEntity))
      localStorage.setItem("PACS008", JSON.stringify(state.pacs008))
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

      setPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.Cdtr.Nm = creditor.CreditorEntity.Cdtr.Nm
      setPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.Cdtr.Id.PrvtId = { ...creditor.CreditorEntity.Cdtr.Id.PrvtId }
      setPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.Cdtr.CtctDtls = { ...creditor.CreditorEntity.Cdtr.CtctDtls }

      // Set Creditor Account Details

      if (creditor.CreditorAccounts[0] !== undefined) {
        setPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.CdtrAcct = { ...creditor.CreditorAccounts[0].CdtrAcct }
      }

      dispatch({ type: ACTIONS.SET_CREDITOR_PACS008_SUCCESS, payload: setPacs008 })
      console.log("PACS008: ", setPacs008)
      localStorage.setItem("PACS008", JSON.stringify(state.pacs008))
    } catch (error) {
      dispatch({ type: ACTIONS.SET_CREDITOR_PACS008_FAIL })
      console.log("ERROR CREDITOR PACS008: ", error)
    }
  }

  const setCreditorAccountPacs008 = (entityIndex: number, accountIndex: number) => {
    try {
      dispatch({ type: ACTIONS.SET_CREDITOR_ACCOUNT_PACS008_LOADING })
      const creditor: CdtrEntity = state.creditorEntities[entityIndex]
      const selectedCreditor: SelectedCreditor = state.selectedCreditorEntity
      console.log("CREDITOR: ", creditor, entityIndex, accountIndex)
      const setPacs008: PACS008 = state.pacs008
      if (accountIndex !== undefined) {
        let creditorAccount: any = { ...creditor.CreditorAccounts[accountIndex]?.CdtrAcct }
        setPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.CdtrAcct = { ...creditorAccount }
      }
      //   setPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.CdtrAcct = { ...creditor.CreditorAccounts[accountIndex].CdtrAcct }

      dispatch({ type: ACTIONS.SET_CREDITOR_ACCOUNT_PACS008_SUCCESS, payload: setPacs008 })
      dispatch({ type: ACTIONS.SELECT_CREDITOR_ENTITY, payload: selectedCreditor })

      localStorage.setItem("SELECTED_CREDITOR", JSON.stringify(state.selectedCreditorEntity))
      console.log("PACS008: ", setPacs008)
      localStorage.setItem("PACS008", JSON.stringify(state.pacs008))
    } catch (error) {
      dispatch({ type: ACTIONS.SET_CREDITOR_ACCOUNT_PACS008_FAIL })
      console.log("ERROR SET CREDITOR ACCOUNT PACS008: ", error)
    }
  }

  const generateTransaction = async () => {
    try {
      dispatch({ type: ACTIONS.GENERATE_TRANSACTION_PACS008_LOADING })
      const setPacs008: PACS008 = state.pacs008

      setPacs008.FIToFICstmrCdtTrf.GrpHdr.MsgId = crypto.randomUUID().replaceAll("-", "")
      setPacs008.FIToFICstmrCdtTrf.GrpHdr.CreDtTm = new Date().toISOString()
      // Set Random Details
      setPacs008.FIToFICstmrCdtTrf.RmtInf.Ustrd = crypto.randomUUID().replaceAll("-", "")
      setPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.IntrBkSttlmAmt.Amt.Amt = RandomNumbers()
      setPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.InstdAmt.Amt.Amt =
        setPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.IntrBkSttlmAmt.Amt.Amt
      setPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.PmtId.InstrId = crypto.randomUUID().replaceAll("-", "")
      setPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.PmtId.EndToEndId = crypto.randomUUID().replaceAll("-", "")

      await buildPacs002()

      dispatch({ type: ACTIONS.GENERATE_TRANSACTION_PACS008_SUCCESS, payload: setPacs008 })
      console.log("PACS008 NEW GENERATED: ", setPacs008)
      localStorage.setItem("PACS008", JSON.stringify(state.pacs008))
    } catch (error) {
      dispatch({ type: ACTIONS.GENERATE_TRANSACTION_PACS008_FAIL })
      console.log("ERROR TRANSACTION PACS008: ", error)
    }
  }

  const updateTransaction = async (updates: Partial<PACS008>) => {
    try {
      dispatch({ type: ACTIONS.UPDATE_TRANSACTION_LOADING })

      const updatedPacs008: PACS008 = { ...state.pacs008 }

      updatedPacs008.FIToFICstmrCdtTrf.GrpHdr.MsgId = crypto.randomUUID().replaceAll("-", "")
      updatedPacs008.FIToFICstmrCdtTrf.GrpHdr.CreDtTm = new Date().toISOString()

      updatedPacs008.FIToFICstmrCdtTrf.RmtInf.Ustrd =
        updates.FIToFICstmrCdtTrf?.RmtInf?.Ustrd || crypto.randomUUID().replaceAll("-", "")
      updatedPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.IntrBkSttlmAmt.Amt.Amt =
        updates.FIToFICstmrCdtTrf?.CdtTrfTxInf?.IntrBkSttlmAmt?.Amt?.Amt || RandomNumbers()
      updatedPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.InstdAmt.Amt.Amt =
        updates.FIToFICstmrCdtTrf?.CdtTrfTxInf?.InstdAmt?.Amt?.Amt ||
        updatedPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.IntrBkSttlmAmt.Amt.Amt
      updatedPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.PmtId.InstrId =
        updates.FIToFICstmrCdtTrf?.CdtTrfTxInf?.PmtId?.InstrId || crypto.randomUUID().replaceAll("-", "")
      updatedPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.PmtId.EndToEndId =
        updates.FIToFICstmrCdtTrf?.CdtTrfTxInf?.PmtId?.EndToEndId || crypto.randomUUID().replaceAll("-", "")
      updatedPacs008.FIToFICstmrCdtTrf.CdtTrfTxInf.Purp.Cd = updates.FIToFICstmrCdtTrf?.CdtTrfTxInf?.Purp?.Cd || ""
      updatedPacs008.FIToFICstmrCdtTrf.SplmtryData.Envlp.Doc.InitgPty.Glctn.Lat =
        updates.FIToFICstmrCdtTrf?.SplmtryData?.Envlp?.Doc?.InitgPty?.Glctn?.Lat || ""
      updatedPacs008.FIToFICstmrCdtTrf.SplmtryData.Envlp.Doc.InitgPty.Glctn.Long =
        updates.FIToFICstmrCdtTrf?.SplmtryData?.Envlp?.Doc?.InitgPty?.Glctn?.Long || ""

      await buildPacs002()

      dispatch({ type: ACTIONS.UPDATE_TRANSACTION_SUCCESS, payload: updatedPacs008 })

      localStorage.setItem("PACS008", JSON.stringify(updatedPacs008))

      console.log("PACS008 UPDATED: ", updatedPacs008)
    } catch (error) {
      dispatch({ type: ACTIONS.UPDATE_TRANSACTION_FAIL })
      console.log("ERROR UPDATING TRANSACTION PACS008: ", error)
    }
  }

  const resetEntity = async (entityIndex: number) => {
    try {
      dispatch({ type: ACTIONS.RESET_ENTITY_LOADING })

      const newEntity = await createAnEntity()

      let entitiesList: Array<Entity> = state.entities

      if (entityIndex >= -1) {
        entitiesList.splice(entityIndex, 1, newEntity)
      }

      dispatch({ type: ACTIONS.RESET_ENTITY_SUCCESS, payload: [...entitiesList] })

      localStorage.setItem("DEBTOR_ENTITIES", JSON.stringify(state.entities))
      handleDebtorEntityChange(entityIndex, 0)
    } catch (error) {
      dispatch({ type: ACTIONS.RESET_ENTITY_FAIL })
    }
  }

  const resetCreditorEntity = async (entityIndex: number) => {
    try {
      dispatch({ type: ACTIONS.RESET_CREDITOR_ENTITY_LOADING })

      const newEntity = await createAnCreditorEntity()

      let entitiesList: Array<CdtrEntity> = state.creditorEntities

      if (entityIndex >= -1) {
        entitiesList.splice(entityIndex, 1, newEntity)
      }

      dispatch({ type: ACTIONS.RESET_CREDITOR_ENTITY_SUCCESS, payload: [...entitiesList] })

      localStorage.setItem("CREDITOR_ENTITIES", JSON.stringify(state.creditorEntities))
      handleCreditorEntityChange(entityIndex, 0)
    } catch (error) {
      dispatch({ type: ACTIONS.RESET_CREDITOR_ENTITY_FAIL })
    }
  }

  const cloneEntity = async (entity: any, account: any) => {
    try {
      dispatch({ type: ACTIONS.CLONE_ENTITY_LOADING })

      const newEntity = cloneDebtorToCreditor(entity)
      const newAccount = cloneDebtorAccountToCreditorAccount(account)

      const payload: CdtrEntity = {
        CreditorEntity: newEntity,
        CreditorAccounts: newAccount,
      }

      let entitiesList: Array<CdtrEntity> = state.creditorEntities

      if (state.creditorEntities.length < 4) {
        entitiesList.push(payload)
      }

      dispatch({ type: ACTIONS.CLONE_ENTITY_SUCCESS, payload: [...entitiesList] })
      localStorage.setItem("CREDITOR_ENTITIES", JSON.stringify(state.creditorEntities))
    } catch (error) {
      dispatch({ type: ACTIONS.CLONE_ENTITY_FAIL })
    }
  }

  const cloneCreditorEntity = async (entity: any, account: any) => {
    try {
      dispatch({ type: ACTIONS.CLONE_CREDITOR_ENTITY_LOADING })

      const newEntity = cloneCreditorToDebtor(entity)
      const newAccount = cloneCreditorAccountToDebtorAccount(account)

      console.log(newAccount, "<====")

      const payload: Entity = {
        Entity: newEntity,
        Accounts: newAccount,
      }

      let entitiesList: Array<Entity> = state.entities

      if (state.entities.length < 4) {
        entitiesList.push(payload)
      }

      dispatch({ type: ACTIONS.CLONE_CREDITOR_ENTITY_SUCCESS, payload: [...entitiesList] })
      localStorage.setItem("DEBTOR_ENTITIES", JSON.stringify(state.entities))
    } catch (error) {
      dispatch({ type: ACTIONS.CLONE_CREDITOR_ENTITY_FAIL })
    }
  }

  const setUiConfig = async (uiConfig: UIConfiguration) => {
    try {
      dispatch({ type: ACTIONS.SET_UI_CONFIG_LOADING })

      dispatch({ type: ACTIONS.SET_UI_CONFIG_SUCCESS, payload: uiConfig })

      localStorage.setItem("UI_CONFIG", JSON.stringify(uiConfig))
    } catch (error) {
      dispatch({ type: ACTIONS.SET_UI_CONFIG_FAIL })
    }
  }

  return (
    <EntityContext.Provider
      value={{
        createEntityLoading: state.createEntityLoading,
        updateEntityLoading: state.updateEntityLoading,
        deleteEntityLoading: state.deleteEntityLoading,
        createCreditorEntityLoading: state.createEntityLoading,
        updateCreditorEntityLoading: state.updateCreditorEntityLoading,
        deleteCreditorEntityLoading: state.deleteCreditorEntityLoading,
        createAccountLoading: state.createAccountLoading,
        updateAccountLoading: state.updateAccountLoading,
        // deleteAccountLoading: state.deleteAccountLoading,
        createCreditorAccountLoading: state.createCreditorAccountLoading,
        updateCreditorAccountLoading: state.updateCreditorAccountLoading,
        // deleteCreditorAccountLoading: state.deleteCreditorAccountLoading,
        resetEntityLoading: state.resetEntityLoading,
        resetCreditorEntityLoading: state.resetCreditorEntityLoading,
        cloneEntityLoading: state.cloneEntityLoading,
        cloneCreditorEntityLoading: state.cloneCreditorEntityLoading,
        setUiConfigLoading: state.setUiConfigLoading,
        pacs008Loading: state.pacs008Loading,
        pacs002Loading: state.pacs002Loading,
        creditorEntities: state.creditorEntities,
        entities: state.entities,
        pacs008: state.pacs008,
        pacs002: state.pacs002,
        selectedDebtorEntity: state.selectedDebtorEntity,
        selectedCreditorEntity: state.selectedCreditorEntity,
        uiConfig: state.uiConfig,
        ruleLights: state.ruleLights,
        selectDebtorEntity,
        selectCreditorEntity,
        createEntity,
        updateEntity,
        deleteEntity,
        createEntityAccount,
        updateAccounts,
        createCreditorEntity,
        updateCreditorEntity,
        deleteCreditorEntity,
        // deleteAccount,
        createCreditorEntityAccount,
        updateCreditorAccount,
        // deleteCreditorAccount,
        setDebtorPacs008,
        setDebtorAccountPacs008,
        setCreditorPacs008,
        setCreditorAccountPacs008,
        generateTransaction,
        updateTransaction,
        buildPacs002,
        setRuleLights,
        reset,
        resetEntity,
        resetCreditorEntity,
        cloneEntity,
        cloneCreditorEntity,
        setUiConfig,
      }}
    >
      {children}
    </EntityContext.Provider>
  )
}

export default EntityProvider
