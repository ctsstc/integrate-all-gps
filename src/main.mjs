#!/usr/bin/env zx
// import * as zx from 'zx'
import 'zx/globals'
import { getGitStatuses, integrate, popStash, stashChanges } from './helpers.mjs'

// Maintain color for subprocess output
process.env.FORCE_COLOR = 3

await $`git fetch`
const { ahead, behind, changes } = await getGitStatuses()
const handleStash = ahead & changes

console.dir({ ahead, behind, changes }, { depth: null })

if (handleStash) stashChanges()

await integrate()

if (handleStash) popStash()
