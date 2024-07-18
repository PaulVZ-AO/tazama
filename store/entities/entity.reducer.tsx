import { ACTIONS } from "./entity.actions"

const EntityReducer = (state: any, action: any) => {
  switch (action.type) {
    case ACTIONS.CREATE_ENTITY_LOADING:
      return {
        ...state,
        createEntityLoading: true,
        entities: [],
      }
    case ACTIONS.CREATE_ENTITY_SUCCESS:
      return {
        ...state,
        createEntityLoading: false,
        entities: action.payload,
      }
    case ACTIONS.CREATE_ENTITY_FAIL:
      return {
        ...state,
        createEntityLoading: false,
        entities: [],
      }

    case ACTIONS.UPDATE_ENTITY_LOADING:
      return {
        ...state,
        updateEntityLoading: true,
        entities: [],
      }
    case ACTIONS.UPDATE_ENTITY_SUCCESS:
      return {
        ...state,
        updateEntityLoading: false,
        entities: action.payload,
      }
    case ACTIONS.UPDATE_ENTITY_FAIL:
      return {
        ...state,
        updateEntityLoading: false,
        entities: [],
      }

    case ACTIONS.CREATE_ENTITY_ACCOUNT_LOADING:
      return {
        ...state,
        createAccountLoading: true,
        entities: [],
      }
    case ACTIONS.CREATE_ENTITY_ACCOUNT_SUCCESS:
      return {
        ...state,
        createAccountLoading: false,
        entities: action.payload,
      }
    case ACTIONS.CREATE_ENTITY_ACCOUNT_FAIL:
      return {
        ...state,
        createAccountLoading: false,
        entities: [],
      }

    case ACTIONS.CREATE_CREDITOR_ENTITY_LOADING:
      return {
        ...state,
        createCreditorEntityLoading: true,
        creditorEntities: [],
      }
    case ACTIONS.CREATE_CREDITOR_ENTITY_SUCCESS:
      return {
        ...state,
        createCreditorEntityLoading: false,
        creditorEntities: action.payload,
      }
    case ACTIONS.CREATE_CREDITOR_ENTITY_FAIL:
      return {
        ...state,
        createCreditorEntityLoading: false,
        creditorEntities: [],
      }

    case ACTIONS.UPDATE_CREDITOR_ENTITY_LOADING:
      return {
        ...state,
        updateCreditorEntityLoading: true,
        creditorEntities: [],
      }
    case ACTIONS.UPDATE_CREDITOR_ENTITY_SUCCESS:
      return {
        ...state,
        updateCreditorEntityLoading: false,
        creditorEntities: action.payload,
      }
    case ACTIONS.UPDATE_CREDITOR_ENTITY_FAIL:
      return {
        ...state,
        updateCreditorEntityLoading: false,
        creditorEntities: [],
      }

    case ACTIONS.CREATE_CREDITOR_ENTITY_ACCOUNT_LOADING:
      return {
        ...state,
        createCreditorAccountLoading: true,
        creditorEntities: [],
      }
    case ACTIONS.CREATE_CREDITOR_ENTITY_ACCOUNT_SUCCESS:
      return {
        ...state,
        createCreditorAccountLoading: false,
        creditorEntities: action.payload,
      }
    case ACTIONS.CREATE_CREDITOR_ENTITY_ACCOUNT_FAIL:
      return {
        ...state,
        createCreditorAccountLoading: false,
        creditorEntities: [],
      }

    case ACTIONS.SET_DEBTOR_PACS008_LOADING:
      return {
        ...state,
        pacs008Loading: true,
      }
    case ACTIONS.SET_DEBTOR_PACS008_SUCCESS:
      return {
        ...state,
        pacs008Loading: false,
        pacs008: action.payload,
      }
    case ACTIONS.SET_DEBTOR_PACS008_FAIL:
      return {
        ...state,
        pacs008Loading: false,
        pacs008: {
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
        },
      }
    case ACTIONS.SET_DEBTOR_ACCOUNT_PACS008_LOADING:
      return {
        ...state,
        pacs008Loading: true,
      }
    case ACTIONS.SET_DEBTOR_ACCOUNT_PACS008_SUCCESS:
      return {
        ...state,
        pacs008Loading: false,
        pacs008: action.payload,
      }
    case ACTIONS.SET_DEBTOR_ACCOUNT_PACS008_FAIL:
      return {
        ...state,
        pacs008Loading: false,
        pacs008: {
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
        },
      }

    case ACTIONS.SET_CREDITOR_PACS008_LOADING:
      return {
        ...state,
        pacs008Loading: true,
      }
    case ACTIONS.SET_CREDITOR_PACS008_SUCCESS:
      return {
        ...state,
        pacs008Loading: false,
        pacs008: action.payload,
      }
    case ACTIONS.SET_CREDITOR_PACS008_FAIL:
      return {
        ...state,
        pacs008Loading: false,
        pacs008: {
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
        },
      }
    case ACTIONS.SET_CREDITOR_ACCOUNT_PACS008_LOADING:
      return {
        ...state,
        pacs008Loading: true,
      }
    case ACTIONS.SET_CREDITOR_ACCOUNT_PACS008_SUCCESS:
      return {
        ...state,
        pacs008Loading: false,
        pacs008: action.payload,
      }
    case ACTIONS.SET_CREDITOR_ACCOUNT_PACS008_FAIL:
      return {
        ...state,
        pacs008Loading: false,
        pacs008: {
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
        },
      }
  }
}

export default EntityReducer
