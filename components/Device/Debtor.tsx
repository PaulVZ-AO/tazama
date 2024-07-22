import Image from "next/image"

export function DebtorDevice() {
  return (
    <div className="col-span-4 relative" style={{ height: "505px" }}>
      <Image
        src="/device.svg"
        width="250"
        height="505"
        className="absolute top-0 left-20 "
        alt=""
        priority={true}
      />
      <div className="absolute" style={{ marginLeft:"94px", width: "222px", top: "15px"}}>

        <div className="flex">
          <div className="font-bold py-1 pl-7 text-xs">
            11:32
          </div>
          <div className="font-bold py-1 pl-7 text-xs">

          </div>
        </div>

        {/* device profile */}
        <div className="bg-gray-400 text-blue-500 py-2 pl-2 flex">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-white ml-2">Sarine Gaelan</span>
        </div>

        <div className="border m-2 p-2 rounded-md text-sm">
          <p>Account: &quot;Sarine&lsquo;s first account&quot;</p>
          <p>Balance: $156</p>
          <p>Purpose: Transfer</p>
          <p>Lat & Lng: -33.918352,18.401656</p>
          <hr className="mt-2"/>
          <button className="text-blue-500 flex items-center m-auto mt-2">
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

      </div>
    </div>
  )
}