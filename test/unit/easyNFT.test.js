const { assert, expect } = require('chai') // Check if the test works or not
const { deployments, ethers } = require('hardhat')
const { developmentChains } = require('../../helper-hardhat-config')

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('BasicNFT', () => {
      let basicNft, deployer

      beforeEach(async () => {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        await deployments.fixture(['basicNft'])
        basicNft = await ethers.getContract('BasicNft')
      })

      describe('mintNFT', () => {
        it('correctly increments the token counter', async () => {
          const initialTokenCount = await basicNft.getTokenCounter()
          const txResponse = await basicNft.mintNFT()
          txResponse.wait(1)
          assert.equal(
            initialTokenCount.add('1').toString(),
            await basicNft.getTokenCounter()
          )
        })
      })
      describe('tokenURI', () => {
        it('returns the correct token uri', async () => {
          const txResponse = await basicNft.tokenURI(0)
          assert.equal(txResponse, await basicNft.TOKEN_URI())
          // Test that s_tokenCounter is implemented correctly
        })
      })
    })
