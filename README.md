# Integrate All GPS

This is a remote command line tool to help integrate all your local patches from [Git Patch Stack](https://git-ps.sh/) assuming you're a patch hoarder like too many of us are.

As long as your integrations keep passing this will keep merging them until they're all handled.

## How to Run

```bash
npx github:ctsstc/integrate-all-gps
```

## Ideas

- If running against a merge war throttle.
  - Maybe so multiple people utilizing the tool don't throttle at the same limit, go off of email, name, or something?
  - Maybe implement a checkout mode via git ref storage.
  - Maybe there should be a max/round robin available?
