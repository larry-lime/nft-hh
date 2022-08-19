const { network, ethers } = require('hardhat')
const { networkConfig, developmentChains } = require('../helper-hardhat-config')
const { verify } = require('../utils/verify')
const {
  storeImages,
  storeTokenUriMetadata,
} = require('../utils/uploadToPinata')

const imagesLocation = './images/randomNft/'
const metadataTemplate = {
  name: '',
  description: '',
  image: '',
  attributes: [
    {
      trait_type: 'Cuteness',
      value: 100,
    },
  ],
}

let tokenUris = [
  'ipfs://QmNNs1BYet3YbB1fJ87FaWNAvASc9xMYi8ko9WTUXjdRQH',
  'ipfs://QmPK1wuu4PrAMdeLAJmjiAa7ngx3DWQevRDiAaWXJVBRm9',
  'ipfs://QmcRBSYHBPyoWmZa8sDs9NRkYZZ3KrZtYok3zvxBCsRmzE',
]

const FUND_AMOUNT = ethers.utils.parseUnits("10")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  // get the IPFS hashes of our images
  if (process.env.UPLOAD_TO_PINATA == 'true') {
    console.log('Not working?')
    tokenUris = await handleTokenUris()
  }

  let vrfCoordinatorV2Address, subscriptionId

  if (!developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContract(
      'VRFCoordinatorV2Mock'
    )
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
    const tx = await vrfCoordinatorV2Mock.createSubscription()
    const txReceipt = await tx.wait(1)
    subscriptionId = txReceipt.events[0].args.subId
    await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
    subscriptionId = networkConfig[chainId].subscriptionId
  }
  log('---------------------------')

  const args = [
    vrfCoordinatorV2Address,
    networkConfig[chainId].gasLane,
    subscriptionId,
    networkConfig[chainId].callbackGasLimit,
    tokenUris,
    networkConfig[chainId].mintFee,
  ]

  const randomIpfsNft = await deploy('RandomIpfsNft', {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })
  log('---------------------------')
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log('Verifying...')
    await verify(randomIpfsNft.address, args)
  }
}
async function handleTokenUris() {
  tokenUris = []
  // store the Image in IPFS
  // store the metadata in IPFS
  const { responses: imagesUploadResponses, files } = await storeImages(
    imagesLocation
  )
  for (imagesUploadResponseIndex in imagesUploadResponses) {
    let tokenUriMetadata = { ...metadataTemplate }
    tokenUriMetadata.name = files[imagesUploadResponseIndex].replace('.png', '')
    tokenUriMetadata.description = `Adorable ${tokenUriMetadata.name} pup!`
    tokenUriMetadata.image = `ipfs://${imagesUploadResponses[imagesUploadResponseIndex].IpfsHash}`
    console.log(`Uploading ${tokenUriMetadata.name}...`)
    // store the JSON to pinata / ipfs
    const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata)
    tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
  }
  console.log('Token URIs uploaded! They are:')
  console.log(tokenUris)

  return tokenUris
}

module.exports.tags = ['all', 'randomipfs', 'main']
