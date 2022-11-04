#!/usr/bin/env zx
// import * as zx from 'zx'
import 'zx/globals'

await $`git fetch`
const { ahead, behind, changes } = await getGitStatuses()
const originalAhead = ahead
const originalChanges = changes

console.dir({ ahead, behind, changes }, { depth: null })

if (originalAhead && originalChanges) {
  console.log('↘️ Changes found, stashing changes...')
  await $`git stash --include-untracked`.quiet()
}

await integrate()

if (originalAhead && originalChanges) {
  console.log('↗️ Restoring stash...')
  await $`git stash pop`.quiet()
}

async function getGitStatuses() {
  const gitStatus = await $`git status -sb`.quiet()
  const aheadMatches = gitStatus.toString().match(/ahead (\d+)/)
  const behindMatches = gitStatus.toString().match(/behind (\d+)/)

  const [_, aheadStr] = aheadMatches || [null, '0']
  const [__, behindStr] = behindMatches || [null, '0']
  const ahead = parseInt(aheadStr)
  const behind = parseInt(behindStr)
  const changes = Boolean(gitStatus.toString().split("\n").length - 2)

  return { ahead, behind, changes }
}

async function integrate() {
  const { ahead, behind } = await getGitStatuses()

  if (await isAhead()) {
    console.log(`${ahead} commits ahead`)

    if (behind > 0) {
      console.log('Behind, pulling...')
      await $`gps pull`
    }

    console.log('Integrating...')
    const integrateResult = await $`gps int 0 -f`
    if (integrateResult.code !== 0) {
      // TODO: determine failure reason
      // If remote changes now exist we've entered a merge war
      // If there's an issue passing tests, etc; stop trying
      console.log('Integration failed, aborting...')
      console.dir(integrateResult, { depth: null })
      return
    }

    console.log('Pulling...')
    await $`gps pull`

    console.log('Current Patches...')
    await $`gps ls`

    if (await isAhead()) {
      console.log('Still ahead, integrating...\n')
      await integrate()
    }
  }
}

async function isAhead() {
  const { ahead } = await getGitStatuses()
  return ahead > 0
}