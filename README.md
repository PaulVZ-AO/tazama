<img width="400px" height="100px" src="https://tazama.org/logo.svg" alt="tazama logo"> </br>

![typescript][typescript] <img height="28.5px" width="auto" src="./public/next.jpeg"> <img height="28.5px" width="auto" src="./public/node.png">

# Tazama Demo Application</br>
>
> [!NOTE]
> **[`Tazama`](https://tazama.org/index.html)** Open Source Real-Time Transaction Monitoring Software for Fraud and Money Laundering Detection

![GitHub License][github-license-badge] </br>

>
Welcome to the Tazama Demo Application. This demo app is used to demo the Tazama Open Source Real-Time Transaction Monitoring System built to support any Financial Services Provider (FSP) that requires Transaction Monitoring for Fraud and Money Laundering detection. Whether that FSP is a small provider running one or 2 transactions per day or a national payment switch running at over 3,000 Transactions per second. With Tazama they can implement simple or complex rules, implement Fraud Detection controls or support Anti-Money Laundering activities. 🌍

## Requirements

What you need:

- <img width="15px" height="15px" src="./public/square_logo.png" alt="tazama logo"> **[Full-Stack-Tazama-Docker](https://github.com/tazama-lf/Full-Stack-Docker-Tazama)** - Setup the Rules and Typologies Using Docker Compose from the Tazama Repository. Follow the instructions in the readme.md
- 💻 **[Demo UI](#)** - Clone this repository and use the easy to setup UI to demo the Tazama Open Source Real-Time Transaction Monitoring System that dynamically builds the UI based on the configured rules and typologies

## Table of Contents

- [Tazama Demo Application](#tazama-demo-application)
  - [Requirements](#requirements)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Local Setup](#local-setup)
    - [Network Setup](#network-setup)
    - [Setup UI](#setup-ui)
    - [Settings Screen](#settings-screen)
  - [License](#license)
  - [Contributors](#contributors)

## Getting Started

### Local Setup

To get started by running the demo locally, follow these steps:

1. Fork & clone repository:

```bash
## Don't forget to ⭐ star and fork it first :)
git clone git@github.com:tazama-lf/tazama-demo.git
```

2. Setup

```bash
add your GH_TOKEN to the .npmrc file ${GH_TOKEN}
```

3. Install the dependencies:

```bash
yarn install --frozen-lockfile
```

4. Create a new .env file and copy the contents of the `env_sample` file to the newly created .env

```text
NODE_ENV=dev
NEXT_PUBLIC_URL="http://localhost:3001"
PORT="3001"
NEXT_PUBLIC_TMS_SERVER_URL="http://localhost:5000"
NEXT_PUBLIC_TMS_KEY="no_key_set"
NEXT_PUBLIC_CMS_NATS_HOSTING="nats://localhost:14222"
NEXT_PUBLIC_NATS_USERNAME=""
NEXT_PUBLIC_NATS_PASSWORD=""
NEXT_PUBLIC_ARANGO_DB_HOSTING="http://localhost:18529"
NEXT_PUBLIC_DB_USER="root"
NEXT_PUBLIC_DB_PASSWORD=""
NEXT_PUBLIC_WS_URL="http://localhost:3001"

NEXT_PUBLIC_NATS_SUBSCRIPTIONS="['connection', '>', 'typology-999@1.0.0']"
```

5. Run the development server:

```bash
yarn dev
```

6. Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

<a><div align="right">[Top](#table-of-contents)</div></a>

### Network Setup

1. Follow the **[Full-Stack-Tazama-Docker](https://github.com/tazama-lf/Full-Stack-Docker-Tazama)** setup guide.
2. Add the following to the **[Full-Stack-Tazama-Docker](https://github.com/tazama-lf/Full-Stack-Docker-Tazama)** docker-compose.yaml

```yaml
demo:
    image: ruhfuskdev/tazama-demo:v1.0.16
    env_file:
      - path: ./env/demo.env
        required: true
    restart: always
    depends_on:
      - tms
      - arango
      - nats
    ports:
      - '3001:3001'
```

> **Note* - Make sure to update the image to the most recent version
> ruhfuskdev/tazama-demo:`{current_version}` eg: `v1.0.16`

<a><div align="right">[Top](#table-of-contents)</div></a>

### Setup UI

1. First Load

>  <img width="60%" height="full" src="./public/first_load.png" alt="main"><br/>

2. Click the gear icon on the top right for Settings

> <img width="60%" height="full" src="./public/settings.png" alt="settings"><br/>

### Settings Screen

- TMS API Host URL: `http://localhost:5000`

  > **Check what port number is being used by the TMS server on the docker instance **(Default Port: 5000)***

- CMS NATS Hosting: `http://localhost:14222` if run outside of docker-compose else `nats://nats:4222`
  
  > **Check what port number is being used by the NATS server on the docker instance **(Default Port: 4222)***

- Arango DB Hosting: `http://localhost:18529`
  > **Check what port number is being used by the TMS server on the docker instance **(Default Port: 8529)***

- Websocket IP Address: `http://localhost:3001`
  > **If run locally use `http://localhost:3001` else if run on a network or hosted use `http://{your_ip_address}:3001` **(Default Port: 3001)***

<a><div align="right">[Top](#table-of-contents)</div></a>

## License

This project is licensed under the Apache License Version 2.0. For more information, see the [LICENSE](./LICENSE) file.

## Contributors

<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/KamikaziD"><img src="https://avatars.githubusercontent.com/u/29978394?s=140&v=4" width="100px;" alt="Detmar Ruhfus"/><br /><sub><b>Detmar Ruhfus</b></sub></a><br />💻 📖</td>
       <td align="center" valign="top" width="14.28%"><a href="https://github.com/paul-vz"><img src="https://avatars.githubusercontent.com/u/11425911?v=4&s=140" width="100px;" alt="Paul Von Zeuner"/><br /><sub><b>Paul Von Zeuner</b></sub></a><br />💻</td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/sahra-amir"><img src="https://avatars.githubusercontent.com/u/126757479?v=4&s=140" width="100px;" alt="Sahra Amir"/><br /><sub><b>Sahra Amir</b></sub></a><br />💻</td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Oliver-AO-GH"><img src="https://avatars.githubusercontent.com/u/127955247?v=4$s=140" width="100px;" alt="Oliver Vermeulen"/><br /><sub><b>Oliver Vermeulen</b></sub></a><br />💻</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<a><div align="right">[Top](#table-of-contents)</div></a>
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

<!-- Badges and links -->

[typescript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[github-license-badge]: https://img.shields.io/github/license/tazama-lf/tazama-demo?link=https%3A%2F%2Fgithub.com%2FBlazity%2Fnext-enterprise%2Fblob%2Fmain%2FLICENSE
