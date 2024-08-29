import fs from "fs"
import readline from "readline"
import shell from "shelljs"

const dockerPath = "../docker-compose.dev.yml"

const readDockerFile = async () => {
  console.log("\nFetching Docker image Tag Version:")
  const file = readline.createInterface({
    input: fs.createReadStream(dockerPath),
    output: process.stdout,
    terminal: false,
  })

  file.on("line", async (line) => {
    if (line.includes("image: ruhfuskdev/tazama-demo:")) {
      let image = line.split(" ")
      image = image[image.length - 1]
      shell.exec(`docker push ${image}`)
    }
  })
}
await readDockerFile()
