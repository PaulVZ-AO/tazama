export interface DebtorEntity {
  Dbtr: {
    Nm: string
    Id: {
      PrvId: {
        DtAndPlcOfBirth: {
          BirthDt: string
          CityOfBirth: string
          CtryOfBirth: string
        }
        Othr: {
          Id: string
          SchmeNm: {
            Prtry: string
          }
        }
      }
    }
    CtctDtls: { MobNb: string }
  }
}

export interface DebtorAccount {
  DbtrAcct: {
    Id: {
      Othr: {
        Id: string
        SchmeNm: {
          Prtry: string
        }
      }
    }
    Nm: string
  }
}

export interface Entity {
  Entity: DebtorEntity
  Accounts: Array<DebtorAccount>
}

export interface CreditorEntity {
  Cdtr: {
    Nm: string
    Id: {
      PrvId: {
        DtAndPlcOfBirth: {
          BirthDt: string
          CityOfBirth: string
          CtryOfBirth: string
        }
        Othr: {
          Id: string
          SchmeNm: {
            Prtry: string
          }
        }
      }
    }
    CtctDtls: { MobNb: string }
  }
}

export interface Country {
  name: string
  dial_code: string
  emoji: string
  code: string
}
