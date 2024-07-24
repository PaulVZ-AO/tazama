import { PACS002, PACS008, SelectedCreditor, SelectedDebtor } from "./entity.interface"

export const creditorInitialState: SelectedCreditor = {
  creditorSelectedIndex: undefined,
  creditorAccountsLength: undefined,
  creditorAccountSelectedIndex: undefined,
}
export const debtorInitialState: SelectedDebtor = {
  debtorSelectedIndex: undefined,
  debtorAccountsLength: undefined,
  debtorAccountSelectedIndex: undefined,
}

export const pacs008InitialState: PACS008 = {
  TxTp: "pacs.008.001.10",
  FIToFICstmrCdtTrf: {
    GrpHdr: {
      MsgId: "",
      CreDtTm: "",
      NbOfTxs: 1,
      SttlmInf: {
        SttlmMtd: "CLRG",
      },
    },
    CdtTrfTxInf: {
      PmtId: {
        InstrId: "",
        EndToEndId: "",
      },
      IntrBkSttlmAmt: {
        Amt: {
          Amt: 0,
          Ccy: "USD",
        },
      },
      InstdAmt: {
        Amt: {
          Amt: 0,
          Ccy: "USD",
        },
      },
      ChrgBr: "DEBT",
      ChrgsInf: {
        Amt: {
          Amt: 0.0,
          Ccy: "USD",
        },
        Agt: {
          FinInstnId: {
            ClrSysMmbId: {
              MmbId: "fsp001",
            },
          },
        },
      },
      InitgPty: {
        Nm: "",
        Id: {
          PrvtId: {
            DtAndPlcOfBirth: {
              BirthDt: "",
              CityOfBirth: "Unknown",
              CtryOfBirth: "ZZ",
            },
            Othr: [
              {
                Id: "",
                SchmeNm: {
                  Prtry: "MSISDN",
                },
              },
            ],
          },
        },
        CtctDtls: {
          MobNb: "",
        },
      },
      Dbtr: {
        Nm: "",
        Id: {
          PrvtId: {
            DtAndPlcOfBirth: {
              BirthDt: "",
              CityOfBirth: "Unknown",
              CtryOfBirth: "ZZ",
            },
            Othr: [
              {
                Id: "",
                SchmeNm: {
                  Prtry: "TAZAMA_EID",
                },
              },
            ],
          },
        },
        CtctDtls: {
          MobNb: "",
        },
      },
      DbtrAcct: {
        Id: {
          Othr: [
            {
              Id: "",

              SchmeNm: {
                Prtry: "MSISDN",
              },
            },
          ],
        },
        Nm: "",
      },
      DbtrAgt: {
        FinInstnId: {
          ClrSysMmbId: {
            MmbId: "fsp001",
          },
        },
      },
      CdtrAgt: {
        FinInstnId: {
          ClrSysMmbId: {
            MmbId: "fsp002",
          },
        },
      },
      Cdtr: {
        Nm: "",
        Id: {
          PrvtId: {
            DtAndPlcOfBirth: {
              BirthDt: "",
              CityOfBirth: "Unknown",
              CtryOfBirth: "ZZ",
            },
            Othr: [
              {
                Id: "",
                SchmeNm: {
                  Prtry: "TAZAMA_EID",
                },
              },
            ],
          },
        },
        CtctDtls: {
          MobNb: "",
        },
      },
      CdtrAcct: {
        Id: {
          Othr: [
            {
              Id: "",
              SchmeNm: {
                Prtry: "MSISDN",
              },
            },
          ],
        },
        Nm: "",
      },
      Purp: {
        Cd: "",
      },
    },
    RgltryRptg: {
      Dtls: {
        Tp: "BALANCE OF PAYMENTS",
        Cd: "100",
      },
    },
    RmtInf: {
      Ustrd: "",
    },
    SplmtryData: {
      Envlp: {
        Doc: {
          Xprtn: "2021-11-30T10:38:56.000Z",
          InitgPty: {
            Glctn: {
              Lat: "",
              Long: "",
            },
          },
        },
      },
    },
  },
}

export const pacs002InitialState: PACS002 = {
  FIToFIPmtSts: {
    GrpHdr: { MsgId: "", CreDtTm: "" },
    TxInfAndSts: {
      OrgnlInstrId: "",
      OrgnlEndToEndId: "",
      TxSts: "ACCC",
      ChrgsInf: [
        { Amt: { Amt: 0, Ccy: "USD" }, Agt: { FinInstnId: { ClrSysMmbId: { MmbId: "fsp001" } } } },
        { Amt: { Amt: 0, Ccy: "USD" }, Agt: { FinInstnId: { ClrSysMmbId: { MmbId: "fsp001" } } } },
        { Amt: { Amt: 0, Ccy: "USD" }, Agt: { FinInstnId: { ClrSysMmbId: { MmbId: "fsp002" } } } },
      ],
      AccptncDtTm: "",
      InstgAgt: { FinInstnId: { ClrSysMmbId: { MmbId: "fsp001" } } },
      InstdAgt: { FinInstnId: { ClrSysMmbId: { MmbId: "fsp002" } } },
    },
  },
}

let test = {
  TxTp: "pacs.008.001.10",
  FIToFICstmrCdtTrf: {
    GrpHdr: {
      MsgId: "3b042ed1e5b745989d7da3e3e0131380",
      CreDtTm: "2024-07-22T13:02:26.820Z",
      NbOfTxs: 1,
      SttlmInf: { SttlmMtd: "CLRG" },
    },
    CdtTrfTxInf: {
      PmtId: { InstrId: "5ab4fc7355de4ef8a75b78b00a681ed2", EndToEndId: "d11d18c60784485dbd9d8c8b1d9dd0f8" },
      IntrBkSttlmAmt: { Amt: { Amt: 280.54, Ccy: "XTS" } },
      InstdAmt: { Amt: { Amt: 280.54, Ccy: "XTS" } },
      ChrgBr: "DEBT",
      ChrgsInf: { Amt: { Amt: 0, Ccy: "XTS" }, Agt: { FinInstnId: { ClrSysMmbId: { MmbId: "fsp001" } } } },
      InitgPty: {
        Nm: "April Blake Grant",
        Id: {
          PrvtId: {
            DtAndPlcOfBirth: { BirthDt: "1968-02-01", CityOfBirth: "Unknown", CtryOfBirth: "ZZ" },
            Othr: [{ Id: "+27730975224", SchmeNm: { Prtry: "MSISDN" } }],
          },
        },
        CtctDtls: { MobNb: "+27-730975224" },
      },
      Dbtr: {
        Nm: "April Blake Grant",
        Id: {
          PrvtId: {
            DtAndPlcOfBirth: { BirthDt: "1999-07-04", CityOfBirth: "Unknown", CtryOfBirth: "ZZ" },
            Othr: [{ Id: "aac94c61dfa44d19beb9cc4ccf01b133", SchmeNm: { Prtry: "TAZAMA_EID" } }],
          },
        },
        CtctDtls: { MobNb: "+27-730975224" },
      },
      DbtrAcct: {
        Id: { Othr: [{ Id: "c13420d61bff4ef5a85f576f3386dbf3", SchmeNm: { Prtry: "MSISDN" } }] },
        Nm: "April Grant",
      },
      DbtrAgt: { FinInstnId: { ClrSysMmbId: { MmbId: "fsp001" } } },
      CdtrAgt: { FinInstnId: { ClrSysMmbId: { MmbId: "fsp002" } } },
      Cdtr: {
        Nm: "Felicia Easton Quill",
        Id: {
          PrvtId: {
            DtAndPlcOfBirth: { BirthDt: "1935-05-08", CityOfBirth: "Unknown", CtryOfBirth: "ZZ" },
            Othr: [{ Id: "a9f383858e2941d0bdd37a70343ecf86", SchmeNm: { Prtry: "TAZAMA_EID" } }],
          },
        },
        CtctDtls: { MobNb: "+27-707650428" },
      },
      CdtrAcct: {
        Id: { Othr: [{ Id: "e0910b9ee7a64591bdca6a4f365600f0", SchmeNm: { Prtry: "MSISDN" } }] },
        Nm: "Felicia Quill",
      },
      Purp: { Cd: "MP2P" },
    },
    RgltryRptg: { Dtls: { Tp: "BALANCE OF PAYMENTS", Cd: "100" } },
    RmtInf: { Ustrd: "Generic payment description" },
    SplmtryData: {
      Envlp: { Doc: { Xprtn: "2021-11-30T10:38:56.000Z", InitgPty: { Glctn: { Lat: "-3.1609", Long: "38.3588" } } } },
    },
  },
}
