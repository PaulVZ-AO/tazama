"use client"

interface Props {
  modal: boolean
  showModal: boolean
  setModal: (value: boolean) => void
}
export function Modal(props: Props) {
  let modalProp = {
    modalTitle: "Modal Title",
  }

  function handleClick() {
    props.setModal(!props.showModal)
  }

  return (
    <div
      className={props.showModal ? "relative z-10" : "hidden"}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex  min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative overflow-hidden rounded-lg bg-gray-200 p-5">
            <div className="grid grid-cols-12">
              <div className="col-span-10">
                <h2 className="text-left">{modalProp.modalTitle}</h2>
              </div>

              <div className="col-span-2">
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

              <div className="col-span-3 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-20">
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div
                className="col-span-9 text-left
                [&>div>input]:rounded-lg [&>div>input]:bg-gray-200
                [&>div>input]:p-2 [&>div>input]:shadow-inner [&>div]:mb-2 [&>div]:pr-5
              "
              >
                <div className="mt-5">
                  <label htmlFor="modal-Nm">Full Name</label>
                  <input type="text" id="modal-Nm" className="w-full" />
                </div>

                <div>
                  <label htmlFor="modal-BirthDt">Birth Date</label>
                  <input type="text" id="modal-BirthDt" className="w-full" />
                </div>
                <div>
                  <label htmlFor="modal-CityOfBirth">City of Birth</label>
                  <input type="text" id="modal-CityOfBirth" className="w-full" />
                </div>
                <div>
                  <label htmlFor="modal-CtryOfBirth">Country of Birth</label>
                  <input type="text" id="modal-CtryOfBirth" className="w-full" />
                </div>

                <div>
                  <label htmlFor="modal-ID">ID number</label>
                  <input type="text" id="modal-ID" className="w-full" />
                </div>

                <div>
                  <label htmlFor="modal-MobNb">Mobile number</label>
                  <input type="text" id="modal-MobNb" className="w-full" value="+27821231234" />
                </div>
              </div>

              {/* box-shadow: inset 20px 20px 60px #bebebe,
            inset -20px -20px 60px #ffffff; */}

              <div className="col-span-6 m-5">
                <button
                  type="button"
                  className="w-full rounded-lg bg-gradient-to-r from-gray-200 to-gray-100 py-2 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)] hover:shadow-inner"
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
