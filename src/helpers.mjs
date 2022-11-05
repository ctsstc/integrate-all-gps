#!/usr/bin/env zx
// import * as zx from 'zx'
import 'zx/globals'

export async function integrate() {
  const { ahead, behind } = await getGitStatuses()

  if (await isAhead()) {
    console.log(`${ahead} commits ahead`)

    if (behind > 0) {
      console.log('Behind, pulling...')
      await $`gps pull`
    }

    console.log('Integrating...')
    const integrateResult = await $`gps int 0 -f`
    if (integrateResult.exitCode !== 0) {
      // TODO: determine failure reason
      // Checkout stdout stderr and combined
      // If remote changes now exist we've entered a merge war
      // If there's an issue passing tests, etc; stop trying
      console.log(`Integration failed with exit code: ${integrateResult.exitCode}, aborting...`)
      // console.dir(integrateResult, { depth: null })
      await fs.writeJSON(`./integrate-errors-${Date.now()}.json`, integrateResult)
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

export async function getGitStatuses() {
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

export async function stashChanges() {
  console.log('↘️ Changes found, stashing changes...')
  await $`git stash --include-untracked`.quiet()
}

export async function popStash() {
  console.log('↗️ Restoring stash...')
  await $`git stash pop`.quiet()
}

async function isAhead() {
  const { ahead } = await getGitStatuses()
  return ahead > 0
}