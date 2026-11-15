import assert from "node:assert/strict"
import test from "node:test"
import { queryFailureDetails } from "./supabase-log.ts"

test("keeps a short message and code", () => {
  const details = queryFailureDetails({
    message: "TypeError: fetch failed",
    code: "ECONNREFUSED",
  })
  assert.equal(details.message, "TypeError: fetch failed")
  assert.equal(details.code, "ECONNREFUSED")
})

test("does not keep a non-string payload", () => {
  const details = queryFailureDetails({ message: { secret: "nope" } })
  assert.equal(details.message, "unknown")
  assert.equal(details.code, "")
})
