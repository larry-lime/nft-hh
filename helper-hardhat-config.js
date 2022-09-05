const { ethers } = require('hardhat')

const networkConfig = {
  default: {
    name: 'hardhat',
    subscriptionId: '10473',
    gasLane:
      '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc',
    ethUsdPriceFeed: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e',
    vrfCoordinatorV2: '0x6168499c0cFfCaCD319c818142124B7A15E857ab',
    callbackGasLimit: '500000', // 500,000 gas
    mintFee: ethers.utils.parseEther('0.01'), // 0.01 ETH
  },
  31337: {
    name: 'hardhat',
    subscriptionId: '10473',
    gasLane:
      '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc',
    ethUsdPriceFeed: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e',
    vrfCoordinatorV2: '0x6168499c0cFfCaCD319c818142124B7A15E857ab',
    callbackGasLimit: '500000', // 500,000 gas
    mintFee: ethers.utils.parseEther('0.01'), // 0.01 ETH
  },
  4: {
    name: 'rinkeby',
    subscriptionId: '10473', // add your ID here!
    gasLane:
      '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc',
    ethUsdPriceFeed: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e',
    vrfCoordinatorV2: '0x6168499c0cFfCaCD319c818142124B7A15E857ab',
    callbackGasLimit: '500000', // 500,000 gas
    mintFee: ethers.utils.parseEther('0.01'), // 0.01 ETH
  },
}

const DECIMALS = '18'
const INITIAL_PRICE = '200000000000000000000'
const developmentChains = ['hardhat', 'localhost']

module.exports = {
  networkConfig,
  developmentChains,
  DECIMALS,
  INITIAL_PRICE,
}
