#!/usr/bin/env zx
// import * as zx from 'zx'
import 'zx/globals'

const gitStatus = await $`git status -sb`.quiet()
const matches = gitStatus.toString().match(/ahead (\d+), behind (\d+)/)

if (matches) {
  const [_, ahead, behind] = matches
  console.log(ahead, behind)
}
else {
  console.log('no match')
}
