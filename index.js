#!/usr/bin/env node

const { Node } = require('./node_modules/hyperbee/lib/messages')
const Hypercore = require('hypercore')
const path = require('path')

let corePath = process.argv[2] || process.cwd()

corePath = path.resolve(corePath)

async function main () {
  const core = new Hypercore(corePath, { createIfMissing: false })
  await core.ready().catch(() => {
    console.log(`Found no Hypercore at ${corePath}`)
    process.exit(1)
  })
  const fullStream = core.createReadStream()
  const totalSize = (await core.info()).byteLength
  let totalKeys = 0
  let totalValues = 0
  let a = 0
  for await (const data of fullStream) {
    if (a > 0) {
      const obj = Node.decode(data)
      totalKeys += obj.key.length
      totalValues += obj.value.length
    }
    a++
  }
  const keysPerc = percentage(totalKeys, totalSize)
  const valuePerc = percentage(totalValues, totalSize)
  const rest = totalSize - (totalKeys + totalValues)
  const restPerc = percentage(rest, totalSize)
  console.log(`Total size of the HyperBee is ${totalSize} kb`)
  console.log(`Keys are ${keysPerc} %`)
  console.log(`Values are ${valuePerc} %`)
  console.log(`Everything else is ${restPerc} %`)
}

function percentage (part, whole) {
  return ((part / whole) * 100).toFixed(2)
}

main()
