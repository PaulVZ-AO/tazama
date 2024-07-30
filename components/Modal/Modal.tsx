import React, { useContext, useEffect, useState } from "react"
import EntityContext from "store/entities/entity.context"
import { DebtorEntity } from "store/entities/entity.interface"

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
  const [activeSection, setActiveSection] = useState<"Entity" | "Accounts">("Entity")

  let modalProp = { modalTitle: "Update Entity" }

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
    <div
      className={props.showModal ? "relative z-10" : "hidden"}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      ></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
          <div className="relative w-[470px] overflow-hidden rounded-lg bg-gray-200 p-5">
            <div className="">
              <div className="flex flex-col justify-between ">
                <h2>{modalProp.modalTitle}</h2>

                <button
                  className="absolute right-5 rounded-full bg-gradient-to-r from-gray-200 to-gray-100 p-1 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]"
                  onClick={handleClick}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path
                      fillRule="evenodd"
                      d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <div className="my-4 flex justify-around">
                <button
                  className={`rounded-lg px-4 py-2 ${
                    activeSection === "Entity"
                      ? "m-5 w-full rounded-lg bg-gradient-to-r from-gray-200 to-gray-100 py-2 shadow-inner"
                      : "m-5 w-full rounded-lg bg-gradient-to-r from-gray-200 to-gray-100 py-2 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]"
                  }`}
                  onClick={() => setActiveSection("Entity")}
                >
                  Entity
                </button>
                <button
                  className={`rounded-lg px-4 py-2 ${
                    activeSection === "Accounts"
                      ? "m-5 w-full rounded-lg bg-gradient-to-r from-gray-200 to-gray-100 py-2 shadow-inner"
                      : "m-5 w-full rounded-lg bg-gradient-to-r from-gray-200 to-gray-100 py-2 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]"
                  }`}
                  onClick={() => setActiveSection("Accounts")}
                >
                  Account(s)
                </button>
              </div>

              {/* Entities */}
              {activeSection === "Entity" && (
                <>
                  <div className="flex">
                    <div className="mx-[20px] flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={props.colour}
                        className="size-20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="text-left [&>div>input]:rounded-lg [&>div>input]:bg-gray-200 [&>div>input]:p-2 [&>div>input]:shadow-inner [&>div]:mb-2 [&>div]:pr-5">
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
                          type="date"
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
                          className="w-full"
                          defaultValue={props.entity?.Dbtr.Id.PrvtId.Othr[0].Id}
                          value={customEntity?.Dbtr.Id.PrvtId.Othr[0].Id}
                          id="modal-ID"
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
                                      Othr: [
                                        {
                                          ...customEntity.Dbtr.Id.PrvtId.Othr[0],
                                          Id: e.target.value,
                                        },
                                      ],
                                    },
                                  },
                                },
                              })
                            }
                          }}
                          readOnly
                          type="text"
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
                  </div>

                  <div className="flex">
                    <button
                      type="button"
                      className="m-5 w-full rounded-lg bg-gradient-to-r from-gray-200 to-gray-100 py-2 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)] hover:shadow-inner"
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

                    <button
                      type="button"
                      className="m-5 w-full rounded-lg bg-gradient-to-r from-gray-200 to-gray-100 py-2 shadow-inner"
                      onClick={handleClick}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}

              {/* Accounts */}
              {activeSection === "Accounts" && (
                <>
                  <div className="flex flex-col">
                    {accountDetails.map((accountDetail, index) => (
                      <>
                        <div className="flex">
                          <div className="mx-[20px] flex flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke={props.colour}
                              className="size-20"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                              />
                            </svg>
                          </div>
                          <div
                            className="text-left [&>div>input]:rounded-lg [&>div>input]:bg-gray-200 [&>div>input]:p-2 [&>div>input]:shadow-inner [&>div]:mb-2 [&>div]:pr-5"
                            key={index}
                          >
                            <div className="mt-5">
                              <label htmlFor={`modal-Account-Number-${index}`}>Account Name</label>
                              <input
                                type="text"
                                id={`modal-Account-Number-${index}`}
                                className="w-full"
                                defaultValue={accountDetail.DbtrAcct.Nm}
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
                        </div>

                        <hr className="mb-2 mt-5 border-t border-gray-300" />
                      </>
                    ))}
                  </div>

                  <div className="flex">
                    <button
                      type="button"
                      className="m-5 w-full rounded-lg bg-gradient-to-r from-gray-200 to-gray-100 py-2 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)] hover:shadow-inner"
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      className="m-5 w-full rounded-lg bg-gradient-to-r from-gray-200 to-gray-100 py-2 shadow-inner"
                      onClick={handleClick}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
