const networkConfig = {
  default: {
    name: 'hardhat',
  },
  4: {
    name: 'rinkeby',
  },
  31337: {
    name: 'localhost',
  },
  1: {
    name: 'mainnet',
  },
}

const developmentChains = ['hardhat', 'localhost']

module.exports = {
  networkConfig,
  developmentChains,
}
