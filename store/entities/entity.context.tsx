import { createContext } from "react"
import { CdtrEntity, CreditorEntity, DebtorEntity, Entity, PACS008 } from "./entity.interface"

interface Context {
  createEntityLoading: boolean
  updateEntityLoading: boolean
  createAccountLoading: boolean
  createCreditorAccountLoading: boolean
  creditorEntities: Array<CdtrEntity>
  entities: Array<Entity>
  pacs008Loading: boolean
  pacs008: PACS008
  createEntity: () => void
  updateEntity: (entity: DebtorEntity, entityIndex: number) => void
  createEntityAccount: (entityIndex: number) => void
  createCreditorEntity: () => void
  updateCreditorEntity: (entity: CreditorEntity, entityIndex: number) => void
  createCreditorEntityAccount: (entityIndex: number) => void
  setDebtorPacs008: (entityIndex: number) => void
  setCreditorPacs008: (entityIndex: number) => void
}

const EntityContext = createContext<Context>({
  createEntityLoading: false,
  updateEntityLoading: false,
  createAccountLoading: false,
  createCreditorAccountLoading: false,
  creditorEntities: [],
  entities: [],
  pacs008Loading: false,
  pacs008: {
    TxTp: "",
    FIToFICstmrCdt: {
      GrpHdr: {
        MsgId: "",
        CreDtTm: "",
        NbOfTxs: 0,
        SttlmInf: {
          SttlmMtd: "",
        },
      },
      CdtTrfTxInf: {
        PmtId: {
          InstrId: "",
          EndToEndId: "",
        },
        IntrBkSttlmAmt: {
          Amt: {
            Amt: "",
            Ccy: "",
          },
        },
        InstdAmt: {
          Amt: {
            Amt: "",
            Ccy: "",
          },
        },
        ChrgBr: "",
        ChrgsInf: {
          Amt: {
            Amt: 0,
            Ccy: "",
          },
          Agt: {
            FinInstnId: {
              ClrSysMmbId: {
                MmbId: "",
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
                CityOfBirth: "",
                CtryOfBirth: "",
              },
              Othr: {
                Id: "",
                SchmeNm: {
                  Prtry: "",
                },
              },
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
                CityOfBirth: "",
                CtryOfBirth: "",
              },
              Othr: {
                Id: "",
                SchmeNm: {
                  Prtry: "",
                },
              },
            },
          },
          CtctDtls: {
            MobNb: "",
          },
        },
        DbtrAcct: {
          Id: {
            Othr: {
              Id: "",
              SchmeNm: {
                Prtry: "",
              },
            },
          },
          Nm: "",
        },
        DbtrAgt: {
          FinInstnId: {
            ClrSysMmbId: {
              MmbId: "",
            },
          },
        },
        CdtrAgt: {
          FinInstnId: {
            ClrSysMmbId: {
              MmbId: "",
            },
          },
        },
        Cdtr: {
          Nm: "",
          Id: {
            PrvtId: {
              DtAndPlcOfBirth: {
                BirthDt: "",
                CityOfBirth: "",
                CtryOfBirth: "",
              },
              Othr: {
                Id: "",
                SchmeNm: {
                  Prtry: "",
                },
              },
            },
          },
          CtctDtls: {
            MobNb: "",
          },
        },
        CdtrAcct: {
          Id: {
            Othr: {
              Id: "",
              SchmeNm: {
                Prtry: "",
              },
            },
          },
          Nm: "",
        },
        Purp: {
          Cd: "",
        },
      },
      RgltryRptg: {
        Dtls: {
          Tp: "",
          Cd: "",
        },
      },
      RmtInf: {
        Ustrd: "",
      },
      SplmtryData: {
        Envlp: {
          Doc: {
            Xprtn: "",
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
  },
  createEntity: () => {},
  updateEntity: () => {},
  createEntityAccount: () => {},
  createCreditorEntity: () => {},
  updateCreditorEntity: () => {},
  createCreditorEntityAccount: () => {},
  setDebtorPacs008: () => {},
  setCreditorPacs008: () => {},
})

export default EntityContext
