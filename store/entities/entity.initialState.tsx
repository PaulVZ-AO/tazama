import { PACS008, SelectedCreditor, SelectedDebtor } from "./entity.interface"

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
  FIToFICstmrCdt: {
    GrpHdr: {
      MsgId: "%",
      CreDtTm: "%",
      NbOfTxs: 1,
      SttlmInf: {
        SttlmMtd: "CLRG",
      },
    },
    CdtTrfTxInf: {
      PmtId: {
        InstrId: "%",
        EndToEndId: "%",
      },
      IntrBkSttlmAmt: {
        Amt: {
          Amt: "%",
          Ccy: "USD",
        },
      },
      InstdAmt: {
        Amt: {
          Amt: "%",
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
              MmbId: "dfsp001",
            },
          },
        },
      },
      InitgPty: {
        Nm: "%",
        Id: {
          PrvtId: {
            DtAndPlcOfBirth: {
              BirthDt: "%",
              CityOfBirth: "Unknown",
              CtryOfBirth: "ZZ",
            },
            Othr: {
              Id: "%",
              SchmeNm: {
                Prtry: "TAZAMA_EID",
              },
            },
          },
        },
        CtctDtls: {
          MobNb: "%",
        },
      },
      Dbtr: {
        Nm: "%",
        Id: {
          PrvtId: {
            DtAndPlcOfBirth: {
              BirthDt: "%",
              CityOfBirth: "Unknown",
              CtryOfBirth: "ZZ",
            },
            Othr: {
              Id: "%",
              SchmeNm: {
                Prtry: "TAZAMA_EID",
              },
            },
          },
        },
        CtctDtls: {
          MobNb: "%",
        },
      },
      DbtrAcct: {
        Id: {
          Othr: {
            Id: "%",

            SchmeNm: {
              Prtry: "Tazama_AID",
            },
          },
        },
        Nm: "%",
      },
      DbtrAgt: {
        FinInstnId: {
          ClrSysMmbId: {
            MmbId: "dfsp001",
          },
        },
      },
      CdtrAgt: {
        FinInstnId: {
          ClrSysMmbId: {
            MmbId: "dfsp002",
          },
        },
      },
      Cdtr: {
        Nm: "%",
        Id: {
          PrvtId: {
            DtAndPlcOfBirth: {
              BirthDt: "%",
              CityOfBirth: "Unknown",
              CtryOfBirth: "ZZ",
            },
            Othr: {
              Id: "%",
              SchmeNm: {
                Prtry: "TAZAMA_EID",
              },
            },
          },
        },
        CtctDtls: {
          MobNb: "%",
        },
      },
      CdtrAcct: {
        Id: {
          Othr: {
            Id: "%",
            SchmeNm: {
              Prtry: "Tazama_AID",
            },
          },
        },
        Nm: "%",
      },
      Purp: {
        Cd: "%",
      },
    },
    RgltryRptg: {
      Dtls: {
        Tp: "BALANCE OF PAYMENTS",
        Cd: "100",
      },
    },
    RmtInf: {
      Ustrd: "%",
    },
    SplmtryData: {
      Envlp: {
        Doc: {
          Xprtn: "2021-11-30T10:38:56.000Z",
          InitgPty: {
            Glctn: {
              Lat: "%",
              Long: "%",
            },
          },
        },
      },
    },
  },
}
