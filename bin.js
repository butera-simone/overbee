#!/usr/bin/env node

const overbee = require('./index.js')

const corePath = process.argv[2] || process.cwd()

overbee(corePath).then(
  (beeData) => {
    console.log(`Total size of the HyperBee is ${beeData.totalSize} kb`)
    console.log(`Keys are ${beeData.keysPerc} %`)
    console.log(`Values are ${beeData.valuePerc} %`)
    console.log(`Everything else is ${beeData.restPerc} %`)
  }
)
