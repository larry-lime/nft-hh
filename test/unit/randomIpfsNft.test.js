const { assert, expect } = require('chai') // Check if the test works or not
const { deployments, ethers, network } = require('hardhat')
const {
  developmentChains,
  networkConfig,
} = require('../../helper-hardhat-config')

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Random IpfsNft', () => {
      let nftContract, mintFee, vrfCoordinatorV2Mock
      const chainId = network.config.chainId

      beforeEach(async function () {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        await deployments.fixture(['randomipfs', 'mocks'])
        nftContract = await ethers.getContract('RandomIpfsNft')
        vrfCoordinatorV2Mock = await ethers.getContract('VRFCoordinatorV2Mock')
        mintFee = (await nftContract.getMintFee()).toString()
      })

      describe('constructor', () => {
        it('sets the mint fee correctly', async () => {
          assert.equal(mintFee, networkConfig[chainId]['mintFee'])
        })
      })

      describe('requestNFT', () => {
        it('emits NftRequested event when called', async () => {
          await expect(nftContract.requestNft({ value: mintFee })).to.emit(
            nftContract,
            'NftRequested'
          )
        })
        it('reverts if not enough ETH is sent', async () => {
          await expect(nftContract.requestNft()).to.be.revertedWith(
            'RandomIpfsNft__NeedMoreETHSent'
          )
        })
      })
      describe('fulfillRandomWords', () => {
        it('mints NFT after random number is generated', async () => {
          console.log('starting event listener')
          await new Promise(async (resolve, reject) => {
            nftContract.once('NftMinted', async () => {
              console.log('Found the event!')
              try {
                const tokenUri = await nftContract.getDogTokenUris('0')
                const tokenCounter = await nftContract.getTokenCounter()
                assert.equal(tokenUri.toString().includes('ipfs://'), true)
                assert.equal(tokenCounter.toString(), '1')
              } catch (e) {
                console.log(e)
                reject(e)
              }
            })
            consolg.log('listening for event!')
            try {
              const requestNftResponse = await nftContract.requestNft({
                value: mintFee,
              })
              const requestNftReceipt = await requestNftResponse.wait(1)
              await vrfCoordinatorV2Mock.fulfillRandomWords(
                requestNftReceipt.events[1].args.requestId,
                nftContract.address
              )
            } catch (e) {
              console.log(e)
              reject(e)
            }
          })
        })
      })
    })
