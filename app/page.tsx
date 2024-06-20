"use client"
import { useState } from "react";

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
    let c
    let t = props.rule.t.map(function(type: any) {
      return type.t
    });

    switch (props.rule.s) {
      case "r":
        c = "text-red-500"
        break
      case "g":
        c = "text-green-500"
        break
      case "y":
        c = "text-yellow-500"
        break
      default:
        c = "text-slate-500"
    }

    let typeRel = "";

    if (hoveredType) {
      for (let index = 0; index < hoveredType.r.length; index++) {        
        if (hoveredType.r[index].r === props.rule.r) {
          typeRel = "bg-slate-500";
        }        
      }
    }

    return (
      <li
        className={`flex px-2 rounded-md hover:bg-slate-500 ${typeRel}`}
        data-type={t}
        key={`r-${props.rule.r}`}
        onMouseEnter={() => handleRuleMouseEnter(props.rule)}
        onMouseLeave={handleRuleMouseLeave}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-6 ${c}`}>
          <path fillRule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" clipRule="evenodd" />
        </svg>
        {props.rule.v}
      </li>
    )
  }

  function TypeRow(props: any) {
    let c
    let r = props.rule.r.map(function(type: any) {
      return type.r
    });

    switch (props.rule.s) {
      case "r":
        c = "text-red-500"
        break
      case "g":
        c = "text-green-500"
        break
      case "y":
        c = "text-yellow-500"
        break
      default:
        c = "text-slate-500"
    }

    let ruleRel = "";

    if (hoveredRule) {
      for (let index = 0; index < hoveredRule.t.length; index++) {        
        if (hoveredRule.t[index].t === props.rule.t) {
          ruleRel = "bg-slate-500";
        }        
      }
    }

    return (
      <li
        className={`flex px-2 rounded-md hover:bg-slate-500 ${ruleRel}`}
        data-rule={r}
        key={`t-${props.rule.t}`}
        onMouseEnter={() => handleTypeMouseEnter(props.rule)}
        onMouseLeave={handleTypeMouseLeave}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-6 ${c}`}>
          <path fillRule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" clipRule="evenodd" />
        </svg>
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
    return (
      <div className="rounded-lg bg-emerald-700 p-5">
        <div className="mb-2 border border-black p-2">
          {hoveredRule && hoveredRule.r ? hoveredRule.r : ""}=
          {hoveredRule ? (hoveredRule.s === "g" ? "true" : "false") : ""}
        </div>
        <div className="mb-2 border border-black p-2">
          {hoveredRule && hoveredRule.s !== "g" && hoveredRule.d ? hoveredRule.d : ""}
        </div>
      </div>
    )
  }

  function TypeResult() {
    return (
      <div className="bg-emerald-700 rounded-lg p-5">
        <div className="border border-black mb-2 p-2">
          {hoveredType && hoveredType.t ? hoveredType.t : ""}=
          {hoveredType ? (hoveredType.s === "g" ? "true" : "false") : ""}
        </div>
        <div className="border border-black flex mb-2 p-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          500
        </div>
        <div className="border border-black flex mb-2 p-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002" />
          </svg>
          none
        </div>
        <div className="border border-black mb-2 p-2">
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
      <div className={`mb-2 p-2 ${props.colour} flex ${reverse}`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>

        <button data-modal-target="default-modal" data-modal-toggle="default-modal">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </button>

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      </div>
    );
  }
  return (
  <>
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-2 bg-emerald-700 p-5 rounded-md shadow-xl">From
        <Profile colour="text-blue-800" />

        <Profile colour="text-green-600" />

        <Profile colour="text-yellow-400" />

        <Profile colour="text-orange-600" />
      </div>
      <div className="col-span-8 bg-emerald-700 p-5 rounded-md shadow-xl">
        <div className="grid grid-cols-12 gap-1">
          <div className="col-span-4">
            <div className="device border-2 border-white bg-black text-white py-5 px-2">
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
                  <button className="bg-emerald-500 rounded-md m-5 px-5">SEND</button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-4 flex items-center justify-center">
            <i className="fas fa-spinner fa-2xl fa-pulse"></i>
          </div>
          <div className="col-span-4">
            <div className="device border-2 border-white bg-black text-white py-5 px-2">
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
      <div className="col-span-2 bg-emerald-700 p-5 rounded-md shadow-xl">
        To
        <Profile colour="text-blue-800" reverse={true} />

        <Profile colour="text-green-600" reverse={true} />

        <Profile colour="text-yellow-400" reverse={true} />

        <Profile colour="text-orange-600" reverse={true} />
      </div>
    </div>

    <div className="grid grid-cols-12 gap-5 pt-10">
      <div className="col-span-1 bg-emerald-800 p-5 rounded-md shadow-xl">
        Status

        <div className="flex items-center justify-center min-h-80">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div className="col-span-5 bg-emerald-800 p-5 rounded-md shadow-xl">
        Dataset 1
        <div className="grid grid-cols-12">
          <div className="col-span-6">
            <div className="grid grid-cols-3">
              <ul id="rule_list">
                {rule_list}
              </ul>
            </div>
          </div>
          <div className="col-span-6">
            Results
            <RuleResult />
          </div>
        </div>
      </div>
      <div className="col-span-5 bg-emerald-800 p-5 rounded-md shadow-xl">
        Dataset 2
        <div className="grid grid-cols-12">
          <div className="col-span-6">
            <div className="grid grid-cols-3">
              <ul id="type_list">
                {type_list}
              </ul>
            </div>
          </div>
          <div className="col-span-6">
            Results
            <TypeResult />
          </div>
        </div>
      </div>
      <div className="col-span-1 bg-emerald-800 p-5 rounded-md shadow-xl">
        Status

        <div className="flex items-center justify-center min-h-80">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" clipRule="evenodd" />
          </svg>
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
    </>
  )
}
