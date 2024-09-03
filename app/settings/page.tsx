"use client"

import React, { useContext, useEffect, useState } from "react"
import EntityContext from "store/entities/entity.context"
import Link from "next/link"
import { UIConfiguration } from "store/entities/entity.interface"
import ResetModal from "./ResetModal"
import ConfigModal from "./ConfigModal"
import { uiConfigInitialState } from "store/entities/entity.initialState"

const Settings = () => {
  const entityCtx: any = useContext(EntityContext)
  const [config, setConfig] = useState<UIConfiguration>()
  const [showModal, setShowModal] = useState(false)
  const [showConfigModal, setShowConfigModal] = useState(false)

  useEffect(() => {
    let lsConfig: string
    lsConfig = localStorage.getItem("UI_CONFIG") || ""
    const backupConfig = localStorage.getItem("UI_CONFIG_BU")

    if (lsConfig !== "") {
      let updateConfig: any = JSON.parse(lsConfig)
      setConfig(updateConfig)

      if (backupConfig) {
        localStorage.setItem("UI_CONFIG_BU", backupConfig)
      }
    }
  }, [entityCtx.uiConfig])

  useEffect(() => {
    console.log("CONFIG: ", entityCtx.uiConfig)
  }, [config])

  useEffect(() => {
    console.log("CONFIG: ", config)
  }, [config])

  const handleReset = async () => {
    await entityCtx.reset()
    window.location.replace("/")
    localStorage.setItem("UI_CONFIG", JSON.stringify(uiConfigInitialState))
    localStorage.removeItem("UI_CONFIG_BU")
  }

  const handleConfigUpdate = async (configData: any) => {
    const currentConfig = localStorage.getItem("UI_CONFIG")
    if (currentConfig) {
      localStorage.setItem("UI_CONFIG_BU", currentConfig)
    }
    if (config !== undefined) {
      entityCtx.setUiConfig(configData)
      setShowConfigModal(false)
      setConfig(configData)
      window.location.replace("/")
    }
  }

  const handleConfigUpdateCancel = async () => {
    window.location.replace("/")
    // const backupConfig = localStorage.getItem("UI_CONFIG_BU")
    // if (backupConfig) {
    //   const backup: any = JSON.parse(backupConfig)
    //   setConfig(backup)
    //   entityCtx.setUiConfig(backup)
    //   localStorage.removeItem("UI_CONFIG_BU")
    // }
  }

  return (
    <div className="bg-slate-300/25 p-10">
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-4"></div>
        <div className="col-span-4">
          <h1 className="text-center">UI Configuration</h1>

          <div className="col-span-full">
            <label htmlFor="tms_id">TMS API Host URL</label>
            <div className="my-2">
              <input
                id="tms_id"
                type="text"
                className="w-full rounded-lg p-2"
                value={config?.tmsServerUrl || ""}
                onChange={(e) => {
                  if (config !== undefined) {
                    setConfig({
                      ...config,
                      tmsServerUrl: e.target.value,
                    })
                  }
                }}
              />
            </div>
          </div>

          {/* <div className="col-span-full">
            <label htmlFor="tms_key">Key / Token</label>
            <div className="my-2">
              <input id="tms_key" type="text" className="w-full rounded-lg p-2" placeholder={config?.tmsKey} />
            </div>
          </div> */}

          <div className="col-span-full">
            <hr className="mb-2 border-black" />
          </div>

          <div className="col-span-full">
            <label htmlFor="cms_host">CMS NATS Hosting</label>
            <div className="my-2">
              <input
                id="tms_key"
                type="text"
                className="w-full rounded-lg p-2"
                value={config?.cmsNatsHosting || ""}
                onChange={(e) => {
                  if (config !== undefined) {
                    setConfig({
                      ...config,
                      cmsNatsHosting: e.target.value,
                    })
                  }
                }}
              />
            </div>
          </div>
          <div className="col-span-full">
            <label htmlFor="cms_usr">Name</label>
            <div className="my-2">
              <input
                id="tms_key"
                type="text"
                className="w-full rounded-lg p-2"
                value={config?.natsUsername || ""}
                onChange={(e) => {
                  if (config !== undefined) {
                    setConfig({
                      ...config,
                      natsUsername: e.target.value,
                    })
                  }
                }}
              />
            </div>
          </div>
          <div className="col-span-full">
            <label htmlFor="cms_pwd">Password</label>
            <div className="my-2">
              <input
                id="tms_key"
                type="text"
                className="w-full rounded-lg p-2"
                value={config?.natsPassword || ""}
                onChange={(e) => {
                  if (config !== undefined) {
                    setConfig({
                      ...config,
                      natsPassword: e.target.value,
                    })
                  }
                }}
              />
            </div>
          </div>

          <div className="col-span-full">
            <hr className="mb-2 border-black" />
          </div>

          <div className="col-span-full">
            <label htmlFor="argo_host">Arango DB hosting</label>
            <div className="my-2">
              <input
                id="tms_key"
                type="text"
                className="w-full rounded-lg p-2"
                value={config?.arangoDBHosting || ""}
                onChange={(e) => {
                  if (config !== undefined) {
                    setConfig({
                      ...config,
                      arangoDBHosting: e.target.value,
                    })
                  }
                }}
              />
            </div>
          </div>
          <div className="col-span-full">
            <label htmlFor="argo_usr">Name</label>
            <div className="my-2">
              <input
                id="tms_key"
                type="text"
                className="w-full rounded-lg p-2"
                value={config?.dbUser || ""}
                onChange={(e) => {
                  if (config !== undefined) {
                    setConfig({
                      ...config,
                      dbUser: e.target.value,
                    })
                  }
                }}
              />
            </div>
          </div>
          <div className="col-span-full">
            <label htmlFor="argo_pwd">Password</label>
            <div className="my-2">
              <input
                id="tms_key"
                type="text"
                className="w-full rounded-lg p-2"
                value={config?.dbPassword || ""}
                onChange={(e) => {
                  if (config !== undefined) {
                    setConfig({
                      ...config,
                      dbPassword: e.target.value,
                    })
                  }
                }}
              />
            </div>
          </div>
          <div className="col-span-full">
            <hr className="mb-2 border-black" />
          </div>
          <div className="col-span-full">
            <label htmlFor="argo_pwd">Websocket IP Address</label>
            <div className="my-2">
              <input
                id="ip_address"
                type="text"
                className="w-full rounded-lg p-2"
                value={config?.wsIpAddress || ""}
                onChange={(e) => {
                  if (config !== undefined) {
                    setConfig({
                      ...config,
                      wsIpAddress: e.target.value,
                    })
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="col-span-4"></div>

        <div className="col-span-4"></div>
        <div className="col-span-2">
          <input
            className="w-full rounded-lg py-3 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]"
            type="button"
            value="Cancel Update"
            onClick={handleConfigUpdateCancel}
          />
        </div>
        <div className="col-span-2">
          <input
            className="w-full rounded-lg py-3 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]"
            type="button"
            value="Update"
            onClick={() => setShowConfigModal(true)}
          />
        </div>
        <div className="col-span-2"></div>
        <div className="col-span-2">
          <button
            className="w-full rounded-lg py-3 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]"
            type="button"
            onClick={() => setShowModal(true)}
          >
            Reset
          </button>
        </div>
      </div>
      <Link href={"https://weareao.group/"} target="_blank">
        <div className="relative mb-10 mt-10 flex w-full flex-row items-center justify-center p-5">
          <p className="absolute left-[45%] top-1/4 text-xs">Powered by:</p>
          <svg version="1.1" viewBox="0 0 2048 1637" width="180" height="180" xmlns="http://www.w3.org/2000/svg">
            <path transform="translate(0)" d="m0 0h2048v1637h-2048z" fill="none" />
            <path
              transform="translate(1290,498)"
              d="m0 0h33l32 3 30 5 20 5 31 11 25 12 15 8 17 11 19 14 14 12 10 9 15 14 7 8 12 13 15 20 14 21 9 16 8 16 10 23 8 25 6 27 4 25 2 24v31l-2 24-5 31-7 29-6 16h-135l1-4 12-23 10-28 5-22 2-15 1-15v-19l-2-22-5-25-9-26-9-19-11-18-10-13-12-14-10-10-11-9-10-8-15-10-20-11-26-10-19-5-20-3-14-1h-22l-23 2-20 4-20 6-15 6-21 11-12 8-14 11-10 9-11 10-7 8-11 14-11 17-10 19-8 21-5 19-4 23-1 10v34l4 28 6 23 8 21 10 20 2 3v3l-132 1-3-4-9-31-5-25-3-25-1-20v-28l3-34 4-23 10-36 10-25 11-23 13-22 13-18 11-14 12-14 30-30 11-9 14-11 17-12 19-11 26-13 30-11 22-6 34-6z"
              fill="#00000030"
            />
            <path
              transform="translate(681,500)"
              d="m0 0 3 1 225 450v2l-2 1h-131l-4-4-14-28-10-21-10-19-9-19-10-19-8-17-8-16-11-23-8-16v-2l-5 5-52 104-9 17-11 23-39 78-9 17-11 23-14 28-10 19-27 54-17 33-1 1h-133l1-5 333-666z"
              fill="#00000030"
            />
            <path
              transform="translate(1052,1051)"
              d="m0 0h513l-1 4-14 15-15 15-8 7-14 12-18 13-17 11-24 13-28 12-25 8-25 6-24 4-22 2h-42l-31-3-26-5-26-7-25-9-26-12-24-14-16-11-14-11-13-11-13-12-23-23z"
              fill="#00000060"
            />
            <path
              transform="translate(953,1051)"
              d="m0 0 6 2 6 10 28 56 9 17 8 16 9 17v3l-8 1h-125l-4-4-8-15-11-23-34-68-4-10 1-1z"
              fill="#00000060"
            />
          </svg>
        </div>
      </Link>

      <ResetModal show={showModal} onClose={() => setShowModal(false)} onConfirm={handleReset} />
      <ConfigModal
        show={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        onConfirm={() => handleConfigUpdate(config)}
      />
    </div>
  )
}

export default Settings
