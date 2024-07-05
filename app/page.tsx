"use client"
import { useState } from "react";
import Image from 'next/image';

export default function Web() {
  const [hoveredRule, setHoveredRule] = useState(null);
  const [hoveredType, setHoveredType] = useState(null);

  const handleRuleMouseEnter = (type: any) => {
    setHoveredType(null); // fallback if stats is stuck
    setHoveredRule(type);
  };

  const handleRuleMouseLeave = () => {
    setHoveredRule(null);
    setHoveredType(null); // fallback if stats is stuck
  };

  const handleTypeMouseEnter = (type: any) => {
    setHoveredRule(null); // fallback if stats is stuck
    setHoveredType(type);
  };

  const handleTypeMouseLeave = () => {
    setHoveredRule(null); // fallback if stats is stuck
    setHoveredType(null);
  };

  let rules = {
    "rule": [
      {
        "r": 1,
        "v": "001",
        "s": "r",
        "d": "Payee account dormant for between 3 and 6 months",
        "t": [
          {"t": 1},
          {"t": 3}
        ]
      },
      {
        "r": 2,
        "v": "002",
        "s": "g",
        "d": "Payee account dormant for between 6 and 12 months",
        "t": [
          {"t": 2},
          {"t": 4}
        ]
      },
      {
        "r": 3,
        "v": "003",
        "s": "g",
        "d": "Payee account dormant for longer than 12 months",
        "t": [
          {"t": 8},
          {"t": 9},
          {"t": 10},
        ]
      },
      {
        "r": 4,
        "v": "004",
        "s": "y",
        "d": "Payee account not dormant in the last 3 months",
        "t": [
          {"t": 4}
        ]
      },
      {
        "r": 5,
        "v": "005",
        "s": "g",
        "d": "Inconclusive payee account dormancy - no transactions found",
        "t": [
          {"t": 1},
          {"t": 2},
          {"t": 3}
        ]
      },

    ]
  };

  let types = {
    "type": [
      {
        "t": 1,
        "v": "001",
        "s": "r",
        "r": [
          {"r": 1},
          {"r": 3}
        ]
      },
      {
        "t": 2,
        "v": "002",
        "s": "g",
        "r": [
          {"r": 2},
          {"r": 4}
        ]
      },
      {
        "t": 3,
        "v": "003",
        "s": "g",
        "r": [
          {"r": 5}
        ]
      },
      {
        "t": 4,
        "v": "004",
        "s": "y",
        "r": [
          {"r": 3},
          {"r": 4}
        ]
      },
      {
        "t": 5,
        "v": "005",
        "s": "g",
        "r": [
          {"r": 1}
        ]
      },
      {
        "t": 6,
        "v": "006",
        "s": "g",
        "r": [
          {"r": 2}
        ]
      },
      {
        "t": 7,
        "v": "007",
        "s": "g",
        "r": [
          {"r": 3}
        ]
      },
      {
        "t": 8,
        "v": "008",
        "s": "g",
        "r": [
          {"r": 5}
        ]
      },
      {
        "t": 9,
        "v": "009",
        "s": "g",
        "r": [
          {"r": 4}
        ]
      },
      {
        "t": 10,
        "v": "010",
        "s": "g",
        "r": [
          {"r": 3}
        ]
      },


    ]
  };

  function RuleRow(props: any) {
    let t = props.rule.t.map(function(type: any) {
      return type.t
    });

    let typeRel = "";

    if (hoveredType) {
      for (let index = 0; index < hoveredType.r.length; index++) {        
        if (hoveredType.r[index].r === props.rule.r) {
          typeRel = "bg-gray-200";
        }        
      }
    }

    return (
      <li
        className={`flex px-2 rounded-md hover:bg-gray-200 ${typeRel}`}
        data-type={t}
        key={`r-${props.rule.r}`}
        onMouseEnter={() => handleRuleMouseEnter(props.rule)}
        onMouseLeave={handleRuleMouseLeave}
      >
        <StatusIndicator colour={props.rule.s} /> &nbsp;
        {props.rule.v}
      </li>
    )
  }

  function TypeRow(props: any) {
    let r = props.rule.r.map(function(type: any) {
      return type.r
    });

    let ruleRel = "";

    if (hoveredRule) {
      for (let index = 0; index < hoveredRule.t.length; index++) {        
        if (hoveredRule.t[index].t === props.rule.t) {
          ruleRel = "bg-gray-200";
        }        
      }
    }

    return (
      <li
        className={`flex px-2 rounded-md hover:bg-gray-200 ${ruleRel}`}
        data-rule={r}
        key={`t-${props.rule.t}`}
        onMouseEnter={() => handleTypeMouseEnter(props.rule)}
        onMouseLeave={handleTypeMouseLeave}
      >
        <StatusIndicator colour={props.rule.s} /> &nbsp;
        {props.rule.v}
      </li>
    )
  }

  let rule_list = rules.rule.map(function(rule, index) {
    return (<RuleRow rule={rule} key={index} />);
  });

  let type_list = types.type.map(function(type, index) {
    return (<TypeRow rule={type} key={index} />);
  });

  function RuleResult() {
    if (hoveredRule == null)
      return(null);

    return (
      <div className="p-5 rounded-lg shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]">
        <h3 className="text-center uppercase">Rule Results</h3>

        <div className="rounded-lg p-5">
          <div className="mb-2 p-2">
            {hoveredRule && hoveredRule.r ? hoveredRule.r : ""}=
            {hoveredRule ? (hoveredRule.s === "g" ? "true" : "false") : ""}
          </div>
          <hr className="border-black mb-2" />
          <div className="mb-2 p-2">
            {hoveredRule && hoveredRule.s !== "g" && hoveredRule.d ? hoveredRule.d : ""}
          </div>
        </div>
      </div>
    )
  }

  function TypeResult() {
    if (hoveredType == null)
      return(null);

    return (
      <div className="p-5 rounded-lg shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]">
        <h3 className="text-center uppercase">Type Results</h3>

        <div className="border mb-2 p-2">
          {hoveredType && hoveredType.t ? hoveredType.t : ""}=
          {hoveredType ? (hoveredType.s === "g" ? "true" : "false") : ""}
        </div>
        <div className="border flex mb-2 p-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          500
        </div>
        <div className="border flex mb-2 p-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002" />
          </svg>
          none
        </div>
        <div className="border mb-2 p-2">
          Description on the hover code
        </div>
      </div>
    );
  }

  function Profile(props: any) {
    let reverse = '';
    if (props.reverse) {
      reverse = 'flex-row-reverse text-right';
    }

    return (
      <div className={`bg-gradient-to-r from-gray-200 to-gray-100 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)] rounded-lg mb-7 px-5 py-2 ${props.colour} flex ${reverse}`}>
        <button className="text-black">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
        </button>

        <button>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
          </svg>
        </button>

        <button>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
            <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
          </svg>
        </button>

        <button>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
            <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
          </svg>
        </button>

        <button data-modal-target="default-modal" data-modal-toggle="default-modal">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
        </button>

        <button>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    );
  }

  function StatusIndicator(props: any) {
    let src = ""
    let size = 20

    switch (props.colour) {
      case "r":
        src = "/red-light-1.png";
        break
      case "g":
        src = "/green-light-1.png";
        break
      case "y":
        src = "/yellow-light-1.png";
        break
      default:
        src = "/neutral-light-1.png";
    }

    if (props.large) {
      size = 40
    }

    return (<Image src={src} height={size} width={size} className={`mt-1`}  alt=""/>);

    // return (<div className={`bg-gradient-to-b ${style} rounded-full shadow-md mt-1 ${size}`}></div>);
  }

  return (
    <div className="bg-slate-300/25 px-5 pt-10">
      <div className="grid grid-cols-12 gap-5">
        {/* Debtors */}
        <div className="col-span-2">
          <div className="p-5 shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)] rounded-lg flex flex-wrap justify-center">
            <h2 className="text-center mb-5">Debtors</h2>

            <Profile colour="text-blue-800" />

            <Profile colour="text-green-600" />

            <Profile colour="text-yellow-400" />

            <Profile colour="text-orange-600" />
          </div>
        </div>

        {/* Device transactions */}
        <div className="col-span-8 p-5">
          <div className="grid grid-cols-12 gap-1">
            <div className="col-span-4">
              <div className="rounded-xl border-2 border-white bg-black text-white py-5 px-2">
                <div className="grid grid-cols-12 gap-1">
                  {/* <!-- Row Content --> */}
                  <div className="col-span-2 text-blue-600 text-center">
                    {/* <FontAwesomeIcon icon={faUser} /> */}
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div className="col-span-10">
                    <p>Name</p>
                    <p>ID</p>
                    <p>DOB</p>
                  </div>

                  {/* <!-- Row Content --> */}
                  <div className="col-span-2 text-blue-600 text-center">
                    <i className="fa-solid fa-file"></i>
                  </div>
                  <div className="col-span-10">
                    <p>Amount #</p>
                  </div>

                  {/* <!-- Row Content --> */}
                  <div className="col-span-2 text-center">
                    <i className="fa-solid fa-dollar-sign"></i>
                  </div>
                  <div className="col-span-10">
                    <p>ID</p>
                    <p>Amount</p>
                    <p>Description</p>
                    <p>Purpose</p>
                    <p>Lat</p>
                    <p>Lng</p>
                  </div>

                  {/* <!-- Submit --> */}
                  <div className="col-span-12 text-center">
                    <button className="rounded-md m-5 px-5">SEND</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-4 flex items-center justify-center">
              <i className="fas fa-spinner fa-2xl fa-pulse"></i>
            </div>
            <div className="col-span-4">
              <div className="rounded-xl border-2 border-white bg-black text-white py-5 px-2">
                <div className="grid grid-cols-12 gap-1">
                  {/* <!-- Row Content --> */}
                  <div className="col-span-2 text-yellow-600 text-center">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div className="col-span-10">
                    <p>Name</p>
                    <p>ID</p>
                    <p>DOB</p>
                  </div>

                  {/* <!-- Row Content --> */}
                  <div className="col-span-2 text-yellow-600 text-center">
                    <i className="fa-solid fa-file"></i>
                  </div>
                  <div className="col-span-10">
                    <p>Amount #</p>
                  </div>

                  {/* <!-- Row Content --> */}
                  <div className="col-span-2 text-center">
                    <i className="fa-solid fa-dollar-sign"></i>
                  </div>
                  <div className="col-span-10">
                    <p>Status</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Creditors */}
        <div className="bg-gradient-to-r from-gray-200 to-gray-100 col-span-2 p-5 rounded-xl shadow-xl">
          <h2 className="text-center mb-5">Creditors</h2>

          <Profile colour="text-blue-800" reverse={true} />

          <Profile colour="text-green-600" reverse={true} />

          <Profile colour="text-yellow-400" reverse={true} />

          <Profile colour="text-orange-600" reverse={true} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 pt-10">
        {/* CRSP */}
        <div className="col-span-2 rounded-md shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]">
          <h2 className="mb-5 py-5 rounded-t-lg uppercase bg-gradient-to-r from-gray-100 to-gray-200 shadow-lg text-center">Crsp</h2>

          <div className="flex items-center justify-center min-h-80">
            <StatusIndicator large="true" />
          </div>
        </div>

        {/* Rules */}
        <div className="col-span-4 rounded-lg shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]">
          <h2 className="mb-5 py-5 rounded-t-lg text-center uppercase bg-gradient-to-r from-gray-100 to-gray-200 shadow-lg">Rules</h2>
          <div className="grid grid-cols-12">
            <div className="col-span-6">
              <div className="grid grid-cols-3">
                <ul id="rule_list">
                  {rule_list}
                </ul>
              </div>
            </div>
            <div className="col-span-6 px-5">
              <RuleResult />
            </div>
          </div>
        </div>

        {/* Typologies */}
        <div className="col-span-4 rounded-lg shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]">
          <h2 className="mb-5 py-5 rounded-t-lg text-center uppercase bg-gradient-to-r from-gray-100 to-gray-200 shadow-lg">Typologies</h2>

          <div className="grid grid-cols-12">
            <div className="col-span-6">
              <div className="grid grid-cols-3">
                <ul id="type_list">
                  {type_list}
                </ul>
              </div>
            </div>
            <div className="col-span-6 px-5">
              <TypeResult />
            </div>
          </div>
        </div>

        {/* Tadproc */}
        <div className="col-span-2 rounded-lg shadow-[0.625rem_0.625rem_0.875rem_0_rgb(225,226,228),-0.5rem_-0.5rem_1.125rem_0_rgb(255,255,255)]">
          <h2 className="mb-5 py-5 rounded-t-lg text-center uppercase bg-gradient-to-r from-gray-100 to-gray-200 shadow-lg">Tadproc</h2>

          <div className="flex items-center justify-center min-h-80">
            <StatusIndicator large="true" />
          </div>
        </div>
      </div>

      {/* <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
          <div className="justify-center space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-3">
            {LP_GRID_ITEMS.map((singleItem) => (
              <div key={singleItem.title} className="flex flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 p-1.5 text-blue-700 dark:bg-primary-900 lg:h-12 lg:w-12">
                  {singleItem.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold dark:text-white">{singleItem.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{singleItem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  )
}
