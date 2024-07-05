import React from 'react'

const settings = () => {
  return (
    <div className="bg-slate-300/25 p-10">
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-4"></div>
        <div className="col-span-4">
          <h1 className="text-center">UI Configuration</h1>

          <div className="col-span-full">
            <label htmlFor="tms_id">TMS API Host URL</label>
            <div className="my-2">
              <input id="tms_id" type="text" className="rounded-lg p-2 w-full" placeholder="https://tms.com" />
            </div>
          </div>

          <div className="col-span-full">
            <label htmlFor="tms_key">Key / Token</label>
            <div className="my-2">
              <input id="tms_key" type="text" className="rounded-lg p-2" placeholder="1234567890" />
            </div>
          </div>

          <div className="col-span-full">
            <hr className="border-black mb-2" />
          </div>

          <div className="col-span-full">
          <label htmlFor="cms_host">CMS NATS Hosting</label>
            <div className="my-2">
              <input id="tms_key" type="text" className="rounded-lg p-2" placeholder="1234567890" />
            </div>
          </div>
          <div className="col-span-full">
          <label htmlFor="cms_usr">Name</label>
            <div className="my-2">
              <input id="tms_key" type="text" className="rounded-lg p-2" placeholder="1234567890" />
            </div>
          </div>
          <div className="col-span-full">
          <label htmlFor="cms_pwd">Password</label>
            <div className="my-2">
              <input id="tms_key" type="text" className="rounded-lg p-2" placeholder="1234567890" />
            </div>
          </div>

          <div className="col-span-full">
            <hr className="border-black mb-2" />
          </div>

          <div className="col-span-full">
            <label htmlFor="argo_host">Arango DB hosting</label>
            <div className="my-2">
              <input id="tms_key" type="text" className="rounded-lg p-2" placeholder="1234567890" />
            </div>
          </div>
          <div className="col-span-full">
            <label htmlFor="argo_usr">Name</label>
            <div className="my-2">
              <input id="tms_key" type="text" className="rounded-lg p-2" placeholder="1234567890" />
            </div>
          </div>
          <div className="col-span-full">
            <label htmlFor="argo_pwd">Password</label>
            <div className="my-2">
              <input id="tms_key" type="text" className="rounded-lg p-2" placeholder="1234567890" />
            </div>
          </div>
          <div className="col-span-full">
            <label htmlFor="argo_db">Data Base Name</label>
            <div className="my-2">
              <input id="tms_key" type="text" className="rounded-lg p-2" placeholder="1234567890" />
            </div>
          </div>          
        </div>

        <div className="col-span-4"></div>

        <div className="col-span-4"></div>
        <div className="col-span-2">
          <input className="shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)] rounded-lg py-3 w-full" type="button" value="Cancel Update" />
        </div>
        <div className="col-span-2">
          <input className="shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)] rounded-lg py-3 w-full" type="button" value="Update" />
        </div>
        <div className="col-span-2"></div>
        <div className="col-span-2">
          <input className="shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)] rounded-lg py-3 w-full" type="button" value="Reset" />
        </div>
      </div>
    </div>
  )
}

export default settings