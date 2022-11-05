#!/usr/bin/env zx
// import * as zx from 'zx'
import 'zx/globals'
import { getGitStatuses, integrate } from './helpers.mjs'

// Maintain color for subprocess output
process.env.FORCE_COLOR = 3

await $`git fetch`
const { ahead, behind, changes } = await getGitStatuses()
const handleStash = ahead & changes

console.dir({ ahead, behind, changes }, { depth: null })

if (handleStash) {
  console.log('↘️ Changes found, stashing changes...')
  await $`git stash --include-untracked`.quiet()
}

await integrate()

if (handleStash) {
  console.log('↗️ Restoring stash...')
  await $`git stash pop`.quiet()
}
