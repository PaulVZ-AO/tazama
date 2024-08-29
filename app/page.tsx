"use client"

import axios from "axios"
import { useContext, useEffect, useState } from "react"
import Image from "next/image"
import { DebtorDevice } from "components/Device/Debtor"
import { ProcessIndicator } from "components/ProcessIndicator/ProcessIndicator"
import { Profile } from "components/Profile/Profile"
import { CreditorProfile } from "components/ProfileCreditor/ProfileCreditor"
import { StatusIndicator } from "components/StatusIndicator/StatusIndicator"
import EntityContext from "store/entities/entity.context"
import ProcessorContext from "store/processors/processor.context"
import { getTADPROCResult } from "utils/db"
import DebtorModal from "components/Modal/Modal"
import CreditorModal from "components/Modal/CreditorsModal"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { CdtrEntity, Entity } from "store/entities/entity.interface"

const Web = () => {
  // const [types, setTypes] = useState<any[] | null>(null)
  const [descriptions, setDescriptions] = useState<any[] | null>(null)
  const [hoveredRule, setHoveredRule] = useState<any>(null)
  const [hoveredType, setHoveredType] = useState<any>(null)
  const [showModal, setModal] = useState(false)
  const [started, setStarted] = useState(false)
  const [showCreditorModal, setShowCreditorModal] = useState(false)
  const entityCtx = useContext(EntityContext)
  const procCtx = useContext(ProcessorContext)

  const handleRuleMouseEnter = (type: any) => {
    setHoveredType(null) // fallback if stats is stuck
    setHoveredRule(type)
  }

  const handleRuleMouseLeave = () => {
    setHoveredRule(null)
    setHoveredType(null) // fallback if stats is stuck
  }

  const handleTypeMouseEnter = (type: any) => {
    setHoveredRule(null) // fallback if stats is stuck
    setHoveredType(type)
  }

  const handleTypeMouseLeave = () => {
    setHoveredRule(null) // fallback if stats is stuck
    setHoveredType(null)
  }

  function RuleRow(props: any) {
    let t = props.rule.t.map(function (type: any) {
      return type.t
    })

    let typeRel = ""

    if (hoveredType) {
      for (let index = 0; index < hoveredType.r.length; index++) {
        if (hoveredType.r[index].r === props.rule.r) {
          typeRel = "bg-gray-200"
        }
      }
    }

    return (
      <li
        className={`flex rounded-md px-2 hover:bg-gray-200 ${typeRel}`}
        data-type={t}
        key={`r-${props.rule.r}`}
        onMouseEnter={() => handleRuleMouseEnter(props.rule)}
        onMouseLeave={handleRuleMouseLeave}
      >
        <StatusIndicator colour={props.rule.s} rule={props.rule} /> &nbsp;
        {props.rule.v}
      </li>
    )
  }

  function TypeRow(props: any) {
    let r = props.rule.r.map(function (type: any) {
      return type.r
    })

    let ruleRel = ""

    if (hoveredRule) {
      for (let index = 0; index < hoveredRule.t.length; index++) {
        if (hoveredRule.t[index].t === props.rule.t) {
          ruleRel = "bg-gray-200"
        }
      }
    }

    return (
      <li
        className={`flex rounded-md px-2 hover:bg-gray-200 ${ruleRel}`}
        data-rule={r}
        key={`t-${props.rule.t}`}
        onMouseEnter={() => handleTypeMouseEnter(props.rule)}
        onMouseLeave={handleTypeMouseLeave}
      >
        <StatusIndicator colour={props.rule.s} rule={props.rule} /> &nbsp;
        {props.rule.v}
      </li>
    )
  }

  const getRuleDescriptions = (result: string) => {
    const description: any = descriptions!.find((item) => item.subRuleRef === result)
    return description.reason
  }

  function RuleResult() {
    if (hoveredRule === null) return null
    return (
      <div className="rounded-xl p-5 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]">
        <h3 className="text-center uppercase">Rule Results</h3>

        <div className="p-5">
          <div className="mb-2 p-2 text-center">
            {hoveredRule?.title} {/* {hoveredRule.title} {hoveredRule && hoveredRule.r ? hoveredRule.r : ""}= */}
            {hoveredRule ? (hoveredRule.color === "g" ? "= False" : "= True") : ""}
          </div>
          <hr className="mb-2 border-black" />
          <div className="mb-2 p-2 text-center">
            {/* Creditor account is less than 1 day old. */}
            {hoveredRule && hoveredRule.color !== "g" && hoveredRule.result
              ? getRuleDescriptions(hoveredRule.result)
              : ""}
          </div>
        </div>
      </div>
    )
  }

  function TypeResult() {
    return (
      <div className="rounded-xl p-5 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]">
        <h3 className="text-center uppercase">Type Results</h3>

        <div className="mb-2 p-2 text-center">
          105 {hoveredType && hoveredType.t ? hoveredType.t : ""}=
          {hoveredType ? (hoveredType.s === "g" ? "true" : "false") : ""} 600
        </div>
        <div className="mb-2 flex p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            />
          </svg>
          500
        </div>
        <div className="mb-2 flex p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002"
            />
          </svg>
          none
        </div>
        <div className="mb-2 p-2 text-center">Description on the hover code</div>
      </div>
    )
  }

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState(null)
  const [selectedEntity, setSelectedEntity] = useState<number>(0)
  const [selectedCreditorEntity, setSelectedCreditorEntity] = useState<number>(0)

  useEffect(() => {
    setSelectedEntity(entityCtx.selectedDebtorEntity.debtorSelectedIndex || 0)
  }, [entityCtx.selectedDebtorEntity.debtorSelectedIndex])

  useEffect(() => {
    setSelectedCreditorEntity(entityCtx.selectedCreditorEntity.creditorSelectedIndex || 0)
  }, [entityCtx.selectedCreditorEntity.creditorSelectedIndex])

  useEffect(() => {
    // axios
    //   .get("api/configs")
    //   .then((response) => {
    //     console.log(response)
    //     setDescriptions(response.data.rules[0].config.bands)
    //     setLoading(false)
    //   })
    //   .catch((error) => {
    //     setError(error)
    //     setLoading(false)
    //   })
    setLoading(false)
  }, [])

  const fetchResult = async (transactionID: string) => {
    const result = await getTADPROCResult(transactionID)
    return result
  }

  useEffect(() => {
    console.log("RULE DESCRIPTIONS: ", descriptions)
  }, [descriptions])

  // useEffect(() => {
  //   axios
  //     .get("api/typologies")
  //     .then((response) => {
  //       setTypes(response.data.types.type)
  //       setLoading(false)
  //     })
  //     .catch((error) => {
  //       setError(error)
  //       setLoading(false)
  //     })
  // }, [])
  useEffect(() => {
    console.log("SELECTED ENTITY: ", selectedEntity)
  }, [selectedEntity])

  useEffect(() => {
    console.log("SELECTED ENTITY: ", selectedEntity)
  }, [selectedEntity])
  useEffect(() => {
    console.log("SELECTED CREDITOR ENTITY: ", selectedCreditorEntity)
  }, [selectedCreditorEntity])
  useEffect(() => {
    console.log("DEBTORS: ", entityCtx.entities)
  }, [entityCtx.entities])
  useEffect(() => {
    console.log("CREDITORS: ", entityCtx.creditorEntities)
  }, [entityCtx.creditorEntities])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  const onDragEnd = async (result: { destination: any; source: any; draggableId: any }) => {
    const { destination, source, draggableId } = result

    // No destination (dropped outside of droppable)
    if (!destination) return

    // If dropped in the same place, do nothing
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    if (source.droppableId === "debtorProfiles" && destination.droppableId === "creditorProfiles") {
      // Clone entity from Debtor to Creditor
      const clonedEntity = { ...entityCtx.entities[source.index] }
      const exists = entityCtx.creditorEntities.some(
        (element: CdtrEntity) => element.CreditorEntity.Cdtr.Nm === clonedEntity?.Entity?.Dbtr?.Nm
      )
      console.log(exists)
      if (!exists) {
        entityCtx.cloneEntity(clonedEntity?.Entity, clonedEntity?.Accounts)
        entityCtx.selectCreditorEntity(destination.index, 0)
      } else if (exists) {
        const index = entityCtx.creditorEntities.findIndex(
          (value: CdtrEntity) => value.CreditorEntity.Cdtr.Nm === clonedEntity?.Entity?.Dbtr?.Nm
        )
        entityCtx.selectCreditorEntity(index, 0)
      }
      return
    }

    if (source.droppableId === "creditorProfiles" && destination.droppableId === "debtorProfiles") {
      // Clone entity from Creditor to Debtor
      const clonedCreditorEntity = { ...entityCtx.creditorEntities[source.index] }

      const exists =
        entityCtx.entities.find(
          (element: Entity) => element.Entity.Dbtr.Nm === clonedCreditorEntity?.CreditorEntity?.Cdtr?.Nm
        ) !== undefined
      if (!exists) {
        entityCtx.cloneCreditorEntity(clonedCreditorEntity?.CreditorEntity, clonedCreditorEntity?.CreditorAccounts)
        entityCtx.selectDebtorEntity(destination.index, 0)
      } else if (exists) {
        const index = entityCtx.entities.findIndex(
          (value: Entity) => value.Entity.Dbtr.Nm === clonedCreditorEntity?.CreditorEntity?.Cdtr?.Nm
        )
        entityCtx.selectDebtorEntity(index, 0)
      }
      return
    }

    console.log("Dropped from", source.droppableId, "to", destination.droppableId)
  }

  const iconColour = (index: number) => {
    let fillColour

    switch (index) {
      case 0: {
        return (fillColour = "text-blue-500")
        break
      }
      case 1: {
        return (fillColour = "text-green-500")
        break
      }
      case 2: {
        return (fillColour = "text-yellow-400")
        break
      }
      case 3: {
        return (fillColour = "text-orange-500")
        break
      }
      default: {
        return (fillColour = "text-blue-500")
        break
      }
    }
  }

  return (
    <div className="bg-slate-300/25 px-5 pt-10">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-12 gap-5">
          {/* Debtors */}
          <div className="col-span-2">
            <div className="flex flex-wrap flex-col justify-center rounded-lg py-5 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]">
              <div className="mb-5 text-center text-xl">Debtors</div>
              <Droppable droppableId="debtorProfiles">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                    <>
                      <Draggable key={`debtor-0`} draggableId={`debtor-0`} index={0}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <Profile
                              colour={!entityCtx.entities[0] ? "text-gray-300" : iconColour(0)}
                              entity={entityCtx.entities[0]?.Entity}
                              accounts={entityCtx.entities[0]?.Accounts}
                              index={0}
                              setModalVisible={setModal}
                              setSelectedEntity={() => setSelectedEntity(0)}
                              selectedEntity={selectedEntity}
                              addAccount={async () => {
                                await entityCtx.createEntityAccount(0)
                                await entityCtx.selectDebtorEntity(0, 0)
                              }}
                            />
                          </div>
                        )}
                      </Draggable>

                      <Draggable key={`debtor-1`} draggableId={`debtor-1`} index={1}>
                        {(provided: any, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <Profile
                              colour={!entityCtx.entities[1] ? "text-gray-300" : iconColour(1)}
                              entity={entityCtx.entities[1]?.Entity}
                              accounts={entityCtx.entities[1]?.Accounts}
                              index={1}
                              setModalVisible={setModal}
                              setSelectedEntity={() => setSelectedEntity(1)}
                              selectedEntity={selectedEntity}
                              addAccount={async () => {
                                await entityCtx.createEntityAccount(1)
                                await entityCtx.selectDebtorEntity(1, 0)
                              }}
                            />
                          </div>
                        )}
                      </Draggable>

                      {/* Repeat for other slots as needed */}
                      <Draggable key={`debtor-2`} draggableId={`debtor-2`} index={2}>
                        {(provided: any) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <Profile
                              colour={!entityCtx.entities[2] ? "text-gray-300" : iconColour(2)}
                              entity={entityCtx.entities[2]?.Entity}
                              accounts={entityCtx.entities[2]?.Accounts}
                              index={2}
                              setModalVisible={setModal}
                              setSelectedEntity={() => setSelectedEntity(2)}
                              selectedEntity={selectedEntity}
                              addAccount={async () => {
                                await entityCtx.createEntityAccount(2)
                                await entityCtx.selectDebtorEntity(2, 0)
                              }}
                            />
                          </div>
                        )}
                      </Draggable>

                      <Draggable key={`debtor-3`} draggableId={`debtor-3`} index={3}>
                        {(provided: any) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <Profile
                              colour={!entityCtx.entities[3] ? "text-gray-300" : iconColour(3)}
                              entity={entityCtx.entities[3]?.Entity}
                              accounts={entityCtx.entities[3]?.Accounts}
                              index={3}
                              setModalVisible={setModal}
                              setSelectedEntity={() => setSelectedEntity(3)}
                              selectedEntity={selectedEntity}
                              addAccount={async () => {
                                await entityCtx.createEntityAccount(3)
                                await entityCtx.selectDebtorEntity(3, 0)
                              }}
                            />
                          </div>
                        )}
                      </Draggable>
                    </>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>

          {/* Device transactions */}
          <div className="col-span-8">
            <div className="grid grid-cols-12 gap-1">
              <div className="col-span-4">
                <DebtorDevice
                  selectedEntity={selectedEntity}
                  isDebtor={true}
                  lights={procCtx.edLights}
                  setLights={procCtx.updateEDLights}
                  resetLights={procCtx.resetAllLights}
                  setStarted={setStarted}
                  resetAllLights={() => procCtx.resetAllLights()}
                />
              </div>
              <div className="col-span-4 flex items-center justify-between px-5">
                <ProcessIndicator started={started} stop={procCtx.tadpLights.TADPROC.stop} />
              </div>
              <div className="col-span-4">
                <DebtorDevice
                  selectedEntity={selectedCreditorEntity}
                  isDebtor={false}
                  lights={procCtx.edLights}
                  setLights={procCtx.updateEDLights}
                  resetLights={procCtx.resetAllLights}
                  setStarted={setStarted}
                  resetAllLights={() => procCtx.resetAllLights()}
                />
                {/* <Image src="/device.svg" height="200" width="200" className="text-center" alt="" priority={true} /> */}
              </div>
            </div>
          </div>

          {/* Creditors */}
          <div className="col-span-2">
            <div className="flex flex-wrap flex-col justify-center rounded-lg py-5 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]">
              <div className="mb-5 text-center text-xl">Creditors</div>
              <Droppable droppableId="creditorProfiles">
                {(provided: any) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                    <>
                      <Draggable key={`creditor-0`} draggableId={`creditor-0`} index={0}>
                        {(provided: any) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <CreditorProfile
                              colour={!entityCtx.creditorEntities[0] ? "text-gray-300" : "text-blue-500"}
                              reverse={true}
                              entity={entityCtx.creditorEntities[0]?.CreditorEntity}
                              creditorAccounts={entityCtx.creditorEntities[0]?.CreditorAccounts}
                              setModalVisible={setShowCreditorModal}
                              setSelectedEntity={() => setSelectedCreditorEntity(0)}
                              index={0}
                              selectedEntity={selectedCreditorEntity}
                              addAccount={async () => {
                                await entityCtx.createCreditorEntityAccount(0)
                                await entityCtx.selectCreditorEntity(0, 0)
                              }}
                            />
                          </div>
                        )}
                      </Draggable>
                      <Draggable key={`creditor-1`} draggableId={`creditor-1`} index={1}>
                        {(provided: any) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <CreditorProfile
                              colour={!entityCtx.creditorEntities[1] ? "text-gray-300" : "text-green-500"}
                              reverse={true}
                              entity={entityCtx.creditorEntities[1]?.CreditorEntity}
                              creditorAccounts={entityCtx.creditorEntities[1]?.CreditorAccounts}
                              setModalVisible={setShowCreditorModal}
                              index={1}
                              setSelectedEntity={() => setSelectedCreditorEntity(1)}
                              selectedEntity={selectedCreditorEntity}
                              addAccount={async () => {
                                await entityCtx.createCreditorEntityAccount(1)
                                await entityCtx.selectCreditorEntity(1, 0)
                              }}
                            />
                          </div>
                        )}
                      </Draggable>

                      <Draggable key={`creditor-2`} draggableId={`creditor-2`} index={2}>
                        {(provided: any) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <CreditorProfile
                              colour={!entityCtx.creditorEntities[2] ? "text-gray-300" : "text-yellow-400"}
                              reverse={true}
                              entity={entityCtx.creditorEntities[2]?.CreditorEntity}
                              creditorAccounts={entityCtx.creditorEntities[2]?.CreditorAccounts}
                              setModalVisible={setShowCreditorModal}
                              setSelectedEntity={() => setSelectedCreditorEntity(2)}
                              index={2}
                              selectedEntity={selectedCreditorEntity}
                              addAccount={async () => {
                                await entityCtx.createCreditorEntityAccount(2)
                                await entityCtx.selectCreditorEntity(2, 0)
                              }}
                            />
                          </div>
                        )}
                      </Draggable>

                      <Draggable key={`creditor-3`} draggableId={`creditor-3`} index={3}>
                        {(provided: any) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <CreditorProfile
                              colour={!entityCtx.creditorEntities[3] ? "text-gray-300" : "text-orange-500"}
                              reverse={true}
                              entity={entityCtx.creditorEntities[3]?.CreditorEntity}
                              creditorAccounts={entityCtx.creditorEntities[3]?.CreditorAccounts}
                              setModalVisible={setShowCreditorModal}
                              setSelectedEntity={() => setSelectedCreditorEntity(3)}
                              index={3}
                              selectedEntity={selectedCreditorEntity}
                              addAccount={async () => {
                                await entityCtx.createCreditorEntityAccount(3)
                                await entityCtx.selectCreditorEntity(3, 0)
                              }}
                            />
                          </div>
                        )}
                      </Draggable>
                    </>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-5 pt-10">
          {/* CRSP */}
          <div className="col-span-2 rounded-md shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]">
            <h2 className="mb-5 rounded-t-lg bg-gradient-to-r from-gray-100 to-gray-200 py-5 text-center uppercase shadow-lg">
              Event director
            </h2>

            <div className="flex min-h-80 items-center justify-center">
              <StatusIndicator large={true} colour={procCtx.edLights.ED.color} />
            </div>
          </div>

          {/* Rules */}
          <div className="col-span-4 rounded-lg shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]">
            <h2 className="mb-5 rounded-t-lg bg-gradient-to-r from-gray-100 to-gray-200 py-5 text-center uppercase shadow-lg">
              Rules
            </h2>
            <div className="grid grid-cols-12">
              <div className="col-span-6">
                <div className="grid grid-cols-3 px-5">
                  {procCtx.rulesLoading ? (
                    <p className="mb-5 w-80 rounded-t-lg py-5 text-center">Loading</p>
                  ) : (
                    procCtx.rules?.map((rule: any) => (
                      <div
                        className={`mb-1 flex rounded-md px-2 hover:bg-gray-200 hover:shadow`}
                        key={`r-${rule.id}`}
                        onMouseEnter={() => {
                          handleRuleMouseEnter(rule)
                          console.log(rule)
                        }}
                        onClick={() => {
                          handleRuleMouseLeave()
                          console.log(rule)
                        }}
                      >
                        <StatusIndicator colour={rule.color} /> &nbsp;
                        {rule.title}
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div
                className="col-span-6 px-5"
                onClick={() => {
                  handleRuleMouseLeave()
                }}
              >
                <RuleResult />
              </div>
            </div>
          </div>

          {/* Typologies */}
          <div className="col-span-4 rounded-lg shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]">
            <h2 className="mb-5 rounded-t-lg bg-gradient-to-r from-gray-100 to-gray-200 py-5 text-center uppercase shadow-lg">
              Typologies
            </h2>
            <div className="grid grid-cols-12">
              <div className="col-span-6">
                <div className="grid grid-cols-3 px-5">
                  {procCtx.typologies &&
                    procCtx.typologies.map((type: any) => (
                      <div className={`mb-1 flex rounded-md px-2 hover:bg-gray-200 hover:shadow`} key={`r-${type.id}`}>
                        <StatusIndicator colour={type.color} /> &nbsp;
                        {type.title}
                      </div>
                    ))}
                </div>
              </div>
              <div className="col-span-6 px-5">
                <TypeResult />
              </div>
            </div>
          </div>

          {/* Tadproc */}
          <div className="col-span-2 rounded-lg shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]">
            <h2 className="mb-5 rounded-t-lg bg-gradient-to-r from-gray-100 to-gray-200 py-5 text-center uppercase shadow-lg">
              Tadproc
            </h2>

            <div className="flex min-h-80 items-center justify-center">
              <StatusIndicator large={true} colour={procCtx.tadpLights.TADPROC.color} />
            </div>
          </div>
        </div>
        {procCtx.tadpLights.TADPROC.stop && (
          <Image
            src="/stop.png"
            width="250"
            height="250"
            className="absolute inset-x-0 inset-y-0 mx-auto my-auto"
            style={{
              position: "absolute",
              top: -355,
              right: `${window.innerWidth / 2}`,
              zIndex: 1,
              maxWidth: "250px",
              minWidth: "250px",
            }}
            alt="stop"
            priority={true}
          />
        )}

        {showModal && (
          <DebtorModal
            color={
              selectedEntity === 0
                ? "rgba(68, 114, 196, 1)"
                : selectedEntity === 1
                ? "rgba(112, 173, 71, 1)"
                : selectedEntity === 2
                ? "rgba(255, 192, 0, 1)"
                : "rgba(237, 125, 49, 1)"
            }
            showModal={showModal}
            setModal={setModal}
            entity={entityCtx.entities[selectedEntity]?.Entity}
            selectedEntity={selectedEntity}
            modalTitle="Update Debtor Entity"
          />
        )}

        {showCreditorModal && (
          <CreditorModal
            color={
              selectedCreditorEntity === 0
                ? "rgba(68, 114, 196, 1)"
                : selectedCreditorEntity === 1
                ? "rgba(112, 173, 71, 1)"
                : selectedCreditorEntity === 2
                ? "rgba(255, 192, 0, 1)"
                : "rgba(237, 125, 49, 1)"
            }
            showModal={showCreditorModal}
            setModal={setShowCreditorModal}
            entity={entityCtx.creditorEntities[selectedCreditorEntity]?.CreditorEntity}
            selectedEntity={selectedCreditorEntity}
            modalTitle="Update Creditor Entity"
          />
        )}
      </DragDropContext>
    </div>
  )
}

export default Web
