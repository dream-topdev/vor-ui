# vor-ui

## VOR Randomness Portal Contract Addresses

**Mainnet**: TBD  
**Rinkeby**: [0xE0a19E5F0b0393E32BAf295D6e32Ea5786D26E4b](https://rinkeby.etherscan.io/address/0xE0a19E5F0b0393E32BAf295D6e32Ea5786D26E4b#contracts)  

## Install project

Install the Node packages and dependencies
```
npm run install
````
## Running project
Migrate the database
```
npm run db:migrate
```

Run the service
```
npm run service
```

Run the frontend UI
```
npm run start
```

## Development envirionment

A self-contained VOR development environment is available via Docker. The environment includes:

- Ganache CLI private EVM chain
- Compiled & deployed Mock ERC20 and VORCoordinator smart contracts
- All Ganache accounts pre-loaded with Mock ERC20 tokens
- Fully configured, registered and running VOR Oracle service

It is configured as follows:

- Ganache CLI wallet mnemonic: `myth like bonus scare over problem client lizard pioneer submit female collect`
- Ganache CLI URL: `http://127.0.0.1:8545`
- Ganache CLI Network/Chain ID: `696969`
- Mock xFUND ERC20 address: `0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab`  
- VORCoordinator Contract address: `0xCfEB869F69431e42cdB54A4F4f105C19C080A601`
- BlockHashStore contract address: `0x5b1869D9A4C187F2EAa108f3062412ecf0526b24`
- VOR Oracle Wallet Address: `0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0` (account #1)
- VOR Oracle KeyHash: `0x1a7a24165e904cb38eb8344affcf8fdee72ac11b5c542428b35eef5769c409f0`

Run either using the make target:

```bash
make vor-env
```

or with the following Docker commands:

```bash
$ docker build -t vor_env -f docker/vor.Dockerfile ./docker
$ docker run -it -p 8545:8545 vor_env
```

Once running, the ERC20 and VORCoordinator ABIs can be obtained using:

```bash
$ docker run vor_env erc20abi
$ docker run vor_env vorabi
```

Deploy the XYDistribute contract
```
npx truffle migrate --network=develop
```

Test and increase allowance of contract
```
npm run test:distribute
```
