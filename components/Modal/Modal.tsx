"use client"
import React, { useContext, useEffect, useState } from "react"
import EntityContext from "store/entities/entity.context"
import { DebtorEntity, Entity } from "store/entities/entity.interface"
import { custom, number } from "zod"

interface Props {
  colour?: string
  entity?: DebtorEntity | undefined
  selectedEntity: number | undefined
  showModal: boolean
  setModal: (value: boolean) => void
}
export function Modal(props: Props) {
  const entityCtx = useContext(EntityContext)
  const [customEntity, setCustomEntity] = useState<DebtorEntity | undefined>(undefined)

  let modalProp = {
    modalTitle: "Modal Title",
  }

  function handleClick() {
    setCustomEntity(undefined)
    props.setModal(!props.showModal)
  }

  useEffect(() => {
    console.log(customEntity)
  }, [customEntity])

  useEffect(() => {
    if (props.entity !== undefined) {
      if (entityCtx.entities.length > 0 && typeof props.selectedEntity === "number") {
        setCustomEntity(entityCtx.entities[props.selectedEntity]?.Entity)
      }
    }
  }, [props.entity])

  const accounts = typeof props.selectedEntity === "number" ? entityCtx.entities[props.selectedEntity]?.Accounts : []
  const accountDetails = accounts ? accounts.map((account: any) => account) : []

  return (
    <div className={props.showModal ? "relative z-10" : "hidden"} aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity" aria-hidden="true"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex  min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative overflow-hidden rounded-lg bg-gray-200 p-5">
            <div className="grid grid-cols-12">
              <div className="col-span-10">
                <h2 className="text-left">{modalProp.modalTitle}</h2>
              </div>

              <div className="col-span-2">
                <button className="absolute right-5 rounded-full bg-gradient-to-r from-gray-200 to-gray-100 p-1 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]" onClick={handleClick}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="col-span-3 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={props.colour} className="size-20">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                </svg>
              </div>

              <div className="col-span-9 text-left [&>div>input]:rounded-lg [&>div>input]:bg-gray-200 [&>div>input]:p-2 [&>div>input]:shadow-inner [&>div]:mb-2 [&>div]:pr-5">
                <div className="mt-5">
                  <label htmlFor="modal-Nm">Full Name</label>
                  <input
                    type="text"
                    id="modal-Nm"
                    className="w-full"
                    defaultValue={props.entity?.Dbtr.Nm}
                    value={customEntity?.Dbtr.Nm}
                    onChange={(e) => {
                      if (customEntity !== undefined) {
                        setCustomEntity({
                          ...customEntity,
                          Dbtr: {
                            ...customEntity.Dbtr,
                            Nm: e.target.value,
                          },
                        })
                      }
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="modal-BirthDt">Birth Date</label>
                  <input
                    type="text"
                    id="modal-BirthDt"
                    className="w-full"
                    defaultValue={props.entity?.Dbtr.Id.PrvtId.DtAndPlcOfBirth.BirthDt}
                    value={customEntity?.Dbtr.Id.PrvtId.DtAndPlcOfBirth.BirthDt}
                    onChange={(e) => {
                      if (customEntity !== undefined) {
                        setCustomEntity({
                          ...customEntity,
                          Dbtr: {
                            ...customEntity?.Dbtr,
                            ...customEntity?.Dbtr.Id,
                            Id: {
                              PrvtId: {
                                ...customEntity?.Dbtr.Id.PrvtId,
                                DtAndPlcOfBirth: {
                                  ...customEntity?.Dbtr.Id.PrvtId.DtAndPlcOfBirth,
                                  BirthDt: e.target.value,
                                },
                              },
                            },
                          },
                        })
                      }
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="modal-CityOfBirth">City of Birth</label>
                  <input
                    type="text"
                    id="modal-CityOfBirth"
                    className="w-full"
                    defaultValue={props.entity?.Dbtr.Id.PrvtId.DtAndPlcOfBirth.CityOfBirth}
                    value={customEntity?.Dbtr.Id.PrvtId.DtAndPlcOfBirth.CityOfBirth}
                    onChange={(e) => {
                      if (customEntity !== undefined) {
                        setCustomEntity({
                          ...customEntity,
                          Dbtr: {
                            ...customEntity.Dbtr,
                            ...customEntity.Dbtr.Id,
                            Id: {
                              PrvtId: {
                                ...customEntity.Dbtr.Id.PrvtId,
                                DtAndPlcOfBirth: {
                                  ...customEntity.Dbtr.Id.PrvtId.DtAndPlcOfBirth,
                                  CityOfBirth: e.target.value,
                                },
                              },
                            },
                          },
                        })
                      }
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="modal-CtryOfBirth">Country of Birth</label>
                  <input
                    type="text"
                    id="modal-CtryOfBirth"
                    className="w-full"
                    defaultValue={props.entity?.Dbtr.Id.PrvtId.DtAndPlcOfBirth.CtryOfBirth}
                    value={customEntity?.Dbtr.Id.PrvtId.DtAndPlcOfBirth.CtryOfBirth}
                    onChange={(e) => {
                      if (customEntity !== undefined) {
                        setCustomEntity({
                          ...customEntity,
                          Dbtr: {
                            ...customEntity.Dbtr,
                            ...customEntity.Dbtr.Id,
                            Id: {
                              PrvtId: {
                                ...customEntity.Dbtr.Id.PrvtId,
                                DtAndPlcOfBirth: {
                                  ...customEntity.Dbtr.Id.PrvtId.DtAndPlcOfBirth,
                                  CtryOfBirth: e.target.value,
                                },
                              },
                            },
                          },
                        })
                      }
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="modal-ID">ID number</label>
                  <input
                    type="text"
                    id="modal-ID"
                    className="w-full"
                    defaultValue={props.entity?.Dbtr.Id.PrvtId.Othr[0].Id}
                    value={customEntity?.Dbtr.Id.PrvtId.Othr[0].Id}
                    onChange={(e) => {
                      if (customEntity !== undefined) {
                        setCustomEntity({
                          ...customEntity,
                          Dbtr: {
                            ...customEntity.Dbtr,
                            ...customEntity.Dbtr.Id,
                            Id: {
                              PrvtId: {
                                ...customEntity.Dbtr.Id.PrvtId,
                                Othr: {
                                  ...customEntity.Dbtr.Id.PrvtId.Othr[0],
                                  Id: e.target.value,
                                },
                              },
                            },
                          },
                        })
                      }
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="modal-MobNb">Mobile number</label>
                  <input
                    type="text"
                    id="modal-MobNb"
                    className="w-full"
                    defaultValue={props.entity?.Dbtr.CtctDtls.MobNb}
                    value={customEntity?.Dbtr.CtctDtls.MobNb}
                    onChange={(e) => {
                      if (customEntity !== undefined) {
                        setCustomEntity({
                          ...customEntity,
                          Dbtr: {
                            ...customEntity.Dbtr,
                            ...customEntity.Dbtr.CtctDtls,
                            CtctDtls: {
                              MobNb: e.target.value,
                            },
                          },
                        })
                      }
                    }}
                  />
                </div>
              </div>

              {/* <div className="col-span-12 m-5">
                <h5>Accounts</h5>
                Loop through the account details.
                <div>
                  <label htmlFor="modal-ID">name</label>
                </div>
                read only
                Id Prtry
              </div> */}

              {/* box-shadow: inset 20px 20px 60px #bebebe,
            inset -20px -20px 60px #ffffff; */}

             
                <h5 className="text-center w-[100%]">Accounts</h5>
                {accountDetails.map((accountDetail, index) => (
                  <div className="col-span-12 text-left [&>div>input]:rounded-lg [&>div>input]:bg-gray-200 [&>div>input]:p-2 [&>div>input]:shadow-inner [&>div]:mb-2 [&>div]:pr-5">
                    <div className="mt-5">
                      <label htmlFor={`modal-Account-Number-${index}`}>Full Name</label>
                      <input
                        type="text"
                        id="modal-Nm"
                        className="w-full"
                        defaultValue={props.entity?.Dbtr.Nm}
                        value={accountDetail.DbtrAcct.Nm}
                        onChange={(e) => {
                          if (customEntity !== undefined) {
                            setCustomEntity({
                              ...customEntity,
                              Dbtr: {
                                ...customEntity.Dbtr,
                                Nm: e.target.value,
                              },
                            })
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label htmlFor={`modal-Account-ID-${index}`}>ID number</label>
                      <input
                        type="text"
                        id={`modal-Account-ID-${index}`}
                        className="w-full"
                        defaultValue={props.entity?.Dbtr.Id.PrvtId.Othr[0]?.Id}
                        value={accountDetail.DbtrAcct.Id.Othr[0]?.Id}
                        readOnly
                      />
                    </div>
                    <div>
                      <label htmlFor={`modal-Account-Prtry-${index}`}>Prtry</label>
                      <input
                        type="text"
                        id={`modal-Account-Prtry-${index}`}
                        className="w-full"
                        defaultValue={props.entity?.Dbtr.Id.PrvtId.Othr[0]?.Id}
                        value={accountDetail.DbtrAcct.Id.Othr[0]?.SchmeNm.Prtry}
                        readOnly
                      />
                    </div>
                  </div>
                ))}
            
              <div className="col-span-6 m-5">
                <button
                  type="button"
                  className="w-full rounded-lg bg-gradient-to-r from-gray-200 to-gray-100 py-2 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)] hover:shadow-inner"
                  onClick={async () => {
                    if (customEntity !== undefined && typeof props.selectedEntity === "number") {
                      console.log("HIT")
                      await entityCtx.updateEntity(customEntity, props.selectedEntity)
                      handleClick()
                    }
                  }}
                >
                  Save
                </button>
              </div>
              <div className="col-span-6 m-5">
                <button
                  type="button"
                  className="w-full rounded-lg bg-gradient-to-r from-gray-200 to-gray-100 py-2 shadow-inner"
                  onClick={handleClick}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
