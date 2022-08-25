const { assert, expect } = require('chai') // Check if the test works or not
const { deployments, ethers } = require('hardhat')
const {
  developmentChains,
  networkConfig,
} = require('../../helper-hardhat-config')

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Random IpfsNft', () => {
      let nftContract, mintFee, vrfCoordinatorV2Mock
      beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        await deployments.fixture(['randomipfs', 'mocks'])
        // NFT Contract
        nftContract = await ethers.getContract('RandomIpfsNft')
        // VRF Coordinator Contract
        vrfCoordinatorV2Mock = await ethers.getContract('VRFCoordinatorV2Mock')
        mintFee = await nftContract.getMintFee()
      })
      describe('requestNFT', () => {
        it('emits NftRequested event when called', async () => {
          await expect(nftContract.requestNft({ value: mintFee })).to.emit(
            nftContract,
            'NftRequested'
          )
        })
      })
    })
