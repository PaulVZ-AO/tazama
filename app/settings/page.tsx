"use client"

import React, { useContext, useEffect, useState } from "react"
import EntityContext from "store/entities/entity.context"
import { UIConfiguration } from "store/entities/entity.interface"
import ResetModal from "./ResetModal"

const Settings = () => {
  const entityCtx = useContext(EntityContext);
  const [config, setConfig] = useState<UIConfiguration>();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let lsConfig: string;
    lsConfig = localStorage.getItem("UI_CONFIG") || "";

    if (lsConfig !== "") {
      let updateConfig: any = JSON.parse(lsConfig);
      setConfig(updateConfig);
    }
  }, [entityCtx.uiConfig]);

  useEffect(() => {
    console.log("CONFIG: ", config);
  }, [config]);

  const handleReset = async () => {
    await entityCtx.reset();
    window.location.replace("/");
  };

  return (
    <div className="bg-slate-300/25 p-10">
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-4"></div>
        <div className="col-span-4">
          <h1 className="text-center">UI Configuration</h1>

          <div className="col-span-full">
            <label htmlFor="tms_id">TMS API Host URL</label>
            <div className="my-2">
              <input id="tms_id" type="text" className="w-full rounded-lg p-2" placeholder={config?.tmsServerUrl} />
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
              <input id="tms_key" type="text" className="w-full rounded-lg p-2" placeholder={config?.cmsNatsHosting} />
            </div>
          </div>
          <div className="col-span-full">
            <label htmlFor="cms_usr">Name</label>
            <div className="my-2">
              <input id="tms_key" type="text" className="w-full rounded-lg p-2" placeholder={config?.natsUsername} />
            </div>
          </div>
          <div className="col-span-full">
            <label htmlFor="cms_pwd">Password</label>
            <div className="my-2">
              <input id="tms_key" type="text" className="w-full rounded-lg p-2" placeholder={config?.natsPassword} />
            </div>
          </div>

          <div className="col-span-full">
            <hr className="mb-2 border-black" />
          </div>

          <div className="col-span-full">
            <label htmlFor="argo_host">Arango DB hosting</label>
            <div className="my-2">
              <input id="tms_key" type="text" className="w-full rounded-lg p-2" placeholder={config?.arangoDBHosting} />
            </div>
          </div>
          <div className="col-span-full">
            <label htmlFor="argo_usr">Name</label>
            <div className="my-2">
              <input id="tms_key" type="text" className="w-full rounded-lg p-2" placeholder={config?.dbUser} />
            </div>
          </div>
          <div className="col-span-full">
            <label htmlFor="argo_pwd">Password</label>
            <div className="my-2">
              <input id="tms_key" type="text" className="w-full rounded-lg p-2" placeholder={config?.dbPassword} />
            </div>
          </div>
          <div className="col-span-full">
            <label htmlFor="argo_db">Data Base Name</label>
            <div className="my-2">
              <input id="tms_key" type="text" className="w-full rounded-lg p-2" placeholder={config?.dbName} />
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
          />
        </div>
        <div className="col-span-2">
          <input
            className="w-full rounded-lg py-3 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]"
            type="button"
            value="Update"
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

      <ResetModal show={showModal} onClose={() => setShowModal(false)} onConfirm={handleReset} />
    </div>
  )
}

export default Settings
