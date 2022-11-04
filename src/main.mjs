#!/usr/bin/env zx
// import * as zx from 'zx'
import 'zx/globals'

const { ahead, behind, changes } = await getGitStatuses()
console.dir({ ahead, behind, changes }, { depth: null })

if (ahead > 0) {

  if (behind > 0) {
    console.log('Behind, pulling...')
    // await $`gps pull`
  }

  console.log('Integrating...')
  // await $`gps int 0 -f`

  console.log('Pulling...')
  // await $`gps pull`

  console.log('Current Patches...')
  // await $`gps ls`
}

async function getGitStatuses() {
  const gitStatus = await $`git fetch && git status -sb`.quiet()
  const aheadMatches = gitStatus.toString().match(/ahead (\d+)/)
  const behindMatches = gitStatus.toString().match(/behind (\d+)/)

  const [_, aheadStr] = aheadMatches || [null, '0']
  const [__, behindStr] = behindMatches || [null, '0']
  const ahead = parseInt(aheadStr)
  const behind = parseInt(behindStr)
  const changes = Boolean(gitStatus.toString().split("\n").length - 1)

  return { ahead, behind, changes }
}