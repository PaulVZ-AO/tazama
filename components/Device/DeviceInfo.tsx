import { useContext } from "react"
import EntityContext from "store/entities/entity.context"

interface DeviceProps {
  selectedEntity: number
  isDebtor?: boolean
}

export function DeviceInfo(props: DeviceProps) {
  const entityCtx = useContext(EntityContext)

  const accountIndex = entityCtx.selectedDebtorEntity.debtorAccountSelectedIndex

  const creditorAccountIndex = entityCtx.selectedCreditorEntity.creditorAccountSelectedIndex

  const entity = entityCtx.entities[props.selectedEntity]

  const creditorEntity = entityCtx.creditorEntities[props.selectedEntity]

  const data = entityCtx.pacs008.FIToFICstmrCdtTrf

  const location = data.SplmtryData.Envlp.Doc.InitgPty.Glctn

  let fillColour

  switch (props.selectedEntity) {
    case 0: {
      fillColour = "rgba(68, 114, 196, 1)"
      break
    }
    case 1: {
      fillColour = "rgba(112, 173, 71, 1)"
      break
    }
    case 2: {
      fillColour = "rgba(255, 192, 0, 1)"
      break
    }
    case 3: {
      fillColour = "rgba(237, 125, 49, 1)"
      break
    }
    default: {
      fillColour = "rgba(68, 114, 196, 1)"
      break
    }
  }

  if (props.isDebtor) {
    return (
      <>
        {entity !== undefined ? (
          <>
            <div className="flex bg-gray-400 py-2 pl-2 text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={fillColour} className="size-6">
                <path
                  fillRule="evenodd"
                  d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-2 text-white">{entity?.Entity.Dbtr.Nm || "Name"}</span>
            </div>

            <div className="bg-gray-100 m-2 rounded-md border p-2 text-sm shadow-sm">
              <p className="truncate">Id:{entity.Entity.Dbtr.Id.PrvtId.Othr[0].Id || " Account Name"} </p>
              <p>Date of birth: {entity?.Entity.Dbtr.Id.PrvtId.DtAndPlcOfBirth.BirthDt}</p>
            </div>
            <div className="bg-gray-100 m-2 rounded-md border p-2 text-sm shadow-sm">
              <p className="font-bold">{entity?.Accounts[accountIndex || 0]?.DbtrAcct.Nm || " Account Name"} </p>
              <p className="truncate">Account:{entity?.Accounts[accountIndex || 0]?.DbtrAcct.Id.Othr[0].Id}</p>
            </div>
            <div className="bg-gray-100 m-2 rounded-md border p-2 text-sm shadow-sm">
              <p>Amount: {data.CdtTrfTxInf.InstdAmt.Amt.Ccy} {data.CdtTrfTxInf.InstdAmt.Amt.Amt}</p>
              <p className="truncate">Description: {data.RmtInf.Ustrd}</p>
              <p>Purpose: {data.CdtTrfTxInf.Purp.Cd} </p>
              <p>Latitude: {location.Lat}</p>
              <p>Longitude: {location.Long}</p>
              <hr className="mt-2" />
              <button className="m-auto mt-2 flex items-center text-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
                edit
              </button>
            </div>
          </>
        ) : null}
      </>
    )
  } else {
    return (
      <>
        {creditorEntity !== undefined ? (
          <>
            <div className="flex bg-gray-400 py-2 pl-2 text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={fillColour} className="size-6">
                <path
                  fillRule="evenodd"
                  d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-2 text-white">{creditorEntity?.CreditorEntity.Cdtr.Nm || "Name"}</span>
            </div>

            <div className="m-2 rounded-md border p-2 text-sm">
              <p>
                Name: {creditorEntity?.CreditorAccounts[creditorAccountIndex || 0]?.CdtrAcct.Nm || " Account Name"}{" "}
              </p>
              <p>Id:{creditorEntity.CreditorEntity.Cdtr.Id.PrvtId.Othr[0].Id}</p>
              <p>Date of birth: {creditorEntity?.CreditorEntity.Cdtr.Id.PrvtId.DtAndPlcOfBirth.BirthDt}</p>
              <p>Account: {creditorEntity?.CreditorAccounts[creditorAccountIndex || 0]?.CdtrAcct.Id.Othr[0].Id}</p>
              <p>Status: ????</p>
              <hr className="mt-2" />
              <button className="m-auto mt-2 flex items-center text-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
                edit
              </button>
            </div>
          </>
        ) : null}
      </>
    )
  }
}
