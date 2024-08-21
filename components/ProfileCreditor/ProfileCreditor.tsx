"use client"

import { useContext, useState } from "react"
import EntityContext from "store/entities/entity.context"
import { CreditorAccount, CreditorEntity } from "store/entities/entity.interface"
import ResetModal from "components/Modal/ResetModal"

export interface ProfileProps {
  reverse?: boolean
  colour?: string
  entity?: CreditorEntity
  creditorAccounts?: Array<CreditorAccount>
  selectedEntity: number
  index: number
  setModalVisible: (value: boolean) => void
  setSelectedEntity: (index: number) => void
  addAccount: () => void
}

interface AccountProps {
  index: number
  selected: number
  setSelected: (value: number) => void
  selectedEntityIndex: number
  setSelectedEntity: (value: number) => void
}

const CreditorAccountsComponent = ({ index, setSelected, selectedEntityIndex, setSelectedEntity }: AccountProps) => {
  let colour = ""
  const entCtx = useContext(EntityContext)
  const handleClick = async () => {
    console.log("############## CREDITOR SELECTION TEST START #############")
    await entCtx.selectCreditorEntity(selectedEntityIndex, index)
    console.log("############### CREDITOR SELECTION TEST END ##############")
    setSelectedEntity(selectedEntityIndex)
    console.log("ACCOUNT INDEX CLICKED: ", index)
    setSelected(index)
  }

  if (
    entCtx.selectedCreditorEntity.creditorSelectedIndex === selectedEntityIndex &&
    entCtx.selectedCreditorEntity.creditorAccountSelectedIndex === index
  ) {
    switch (entCtx.selectedCreditorEntity.creditorSelectedIndex) {
      case 0:
        colour = "text-blue-700"
        break
      case 1:
        colour = "text-green-700"
        break
      case 2:
        colour = "text-yellow-600"
        break
      case 3:
        colour = "text-orange-700"
        break
      default:
        break
    }
  }

  return (
    <button onClick={handleClick}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-6 ${colour}`}>
        <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
        <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
      </svg>
    </button>
  )
}

export const CreditorProfile = ({ ...props }: ProfileProps) => {
  const entityCtx = useContext(EntityContext)
  const [selectedAccountIndex, setSelectedAccountIndex] = useState(0)
  const [showModal, setShowModal] = useState(false);

  let reverse = ""
  if (props.reverse) {reverse = "flex-row-reverse text-right"}

  const handleReset = async () => {
    // Reset the selected entity
    await entityCtx.resetCreditorEntity(props.index)
    await entityCtx.selectCreditorEntity(props.index, 0)
    setShowModal(false)
  };


  return (
    <>
      <div className={`mb-7 rounded-lg bg-gradient-to-r from-gray-200 to-gray-100 px-3 py-1 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)] ${props.colour} flex w-full justify-between ${reverse}`}>
        {/* Edit Button */}
        <button
          className="text-black"
          onClick={async () => {
            if (props.entity !== undefined) {
              props.setSelectedEntity(props.index); // Ensure the entity is selected
              await entityCtx.selectCreditorEntity(props.index, 0); // Select the first account for the entity (or modify as needed)
              props.setModalVisible(true); // Open the modal
            }
          }}
          style={props.entity !== undefined ? { cursor: "pointer" } : { cursor: "default" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
        </button>

        {/* Profile Button */}
        <button style={props.entity !== undefined ? { cursor: "grab" } : { cursor: "default" }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
          </svg>
        </button>

        {props?.creditorAccounts?.map((account, index) => {
          if (account !== null && account !== undefined) {
            return (
              <CreditorAccountsComponent key={crypto.randomUUID().replaceAll("-", "")} index={index} selected={selectedAccountIndex} setSelected={setSelectedAccountIndex} selectedEntityIndex={props.index} setSelectedEntity={props.setSelectedEntity} />
            )
          } else {
            return null
          }
        })}

        {props?.creditorAccounts !== null && props.creditorAccounts !== undefined && props?.creditorAccounts.length < 4 && (
          <button data-modal-target="default-modal" data-modal-toggle="default-modal" onClick={async () => {await props.addAccount()}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
          </button>
        )}

        {/* D6 button */}
        <button
          onClick={async () => {
            // Ensure the correct entity is selected
            props.setSelectedEntity(props.index);
            if (!props.entity && entityCtx.creditorEntities?.length < 4) {
              // Create a new entity and select it
              await entityCtx.createCreditorEntity()
              await entityCtx.selectCreditorEntity(props.index, 0)
              await entityCtx.setCreditorPacs008(props.index)
            } else if (props.entity) {
              // Show reset modal
              setShowModal(true)
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
          </svg>
        </button>

        
      </div>
      
      <ResetModal show={showModal} onClose={() => setShowModal(false)} onConfirm={handleReset} modalTitle="Reset Entity" modalContent="Are you sure you want to reset this Entity?"/>
    </>
  )
}
