import { countries, namesList, surnamesList } from "./mock.data"

const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split("T")[0]
}

export const RandomNumbers = () => {
  let randomNumber: number = Math.floor(Math.random() * 100000) + 10000
  let result: number = randomNumber / 100
  console.log("GENERATED NUMBER: ", result)
  return result
}

export const GenerateBirthDate = async () => {
  const currentYear = new Date().getFullYear()
  let maxYear = currentYear - 20
  let minYear = currentYear - 60

  const birthDate: any = randomDate(new Date(minYear, 0, 1), new Date(maxYear, 11, 31))

  return birthDate
}

export const RandomName = async () => {
  const randomIndex = Math.floor(Math.random() * namesList.length)
  return namesList[randomIndex]
}

export const RandomSurname = async () => {
  const randomIndex = Math.floor(Math.random() * surnamesList.length)
  return surnamesList[randomIndex]
}

export const RandomCellNumber = async () => {
  const phoneNumber: any[] = []
  for (let i = 0; i < 10; i++) {
    if (i === 0) {
      let randomIndex = Math.floor(Math.random() * countries.length)
      phoneNumber.push(countries[randomIndex]?.dial_code + "-")
    } else if (i === 1) {
      phoneNumber.push(Math.floor(Math.random() * (9 - 6 + 1) + 6))
    } else {
      phoneNumber.push(Math.floor(Math.random() * 10))
    }
  }
  return phoneNumber.join("")
}
