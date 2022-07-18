# Oracle
Lightweight Discord bot designed to interface with [AniList](https://anilist.co/) to provide basic show tracking and airing reminders.

## Table of Contents
- [Setup](#setup)
- [Customization](#customization)
- [Commands](#commands)
    - [Help](#help)
    - [Track](#track)
    - [Untrack](#untrack)
    - [List](#list)
    - [Airing Today](#airing-today)
    - [Cron](#cron)
    - [Leskinen](#leskinen)
    - [Save](#save)
    - [Load](#load)

## Setup
After adding Oracle to your Discord server, enter a channel you want the bot to push daily reports to and use the `.cron enable` command. Henceforth, Oracle will push summaries of shows airing that day to this channel.

To select a different channel use the `.cron disable` command and repeat the process described above.

## Customization
1. Copy the format of an arbitrary `command block` inside the `commands/` directory. 
    - Make sure to follow the file name guidelines `nameCmd.js`. 
2. Write custom functionality inside the `command block's execute() field`.
3. Add new `command block` to the list of imports at the top of the `CommandClient.js` class.
4. Update the `_commandMap` Map object inside of `CommandClient` with the `key` set to `command.name` and the `value` set to the `command block`.

**E.g. Command Block:** `customCmd.js`
```
const { prefix } = require('../config.json');

module.exports = {
    name: 'custom',
    desc: "Performs a custom function",
    syntax: `${prefix}custom [optional_args]`,
    execute(message, args, tracker){
        // Write custom logic here!
        // TODO
    },
}
```

**E.g. Updating Command Client**
```
// Constants
...
const customCmd = require('./commands/customCmd');
...
// Local command map
const _commandMap = new Map([
    ...,
    [`${customCmd.name}`, customCmd]
]);
```

## Commands
**Syntax Legend:**
- `[ ... ]`: denotes an optional argument. 
- `< ... >`: denotes a mandatory argument.
- `A | ... | Z`: denotes a set of potential arguments. Provide one.
- `A, ..., Z`: denotes a list of 1+ arguments. Provide multiple.

### Help
- **Syntax:** `.help [command_name]` 
- **Description:** Track up to N shows their respective AniList IDs.
- **Ex:** `.track 1 --> "Now Tracking (1/N): 1: Cowboy Beebop"`

### Track
- **Syntax:** `.track <integer_anilist_id>` 
- **Description:** Track up to N shows their respective AniList IDs.
- **Ex:** `.track 1 --> "Now Tracking (1/N): 1: Cowboy Beebop"`

### Untrack
- **Syntax:** `.untrack <integer_anilist_id>` 
- **Description:** Untrack a show using its AniList ID.
- **Ex:** `.untrack 1 --> "Untracked (0/N): 1: Cowboy Beebop"`

### List
- **Syntax:** `.list` 
- **Description:** List all shows currently being tracked.
- **Ex:** `.list --> "Currently Tracking: 1 - Cowboy Beebop; 21355 - ReZero; ..."`

### Airing Today
- **Syntax:** `.airtoday` 
- **Description:** List all shows that air today.
- **Ex:** `.airtoday --> "Airing Today: 1 - Cowboy Beebop; 21355 - ReZero; ..."`

### Cron
- **Syntax:** `.cron <enable | disable>` 
- **Description:** Toggle scheduled printout of shows airing that day.
- **Ex:** `.cron enable --> "Cron job enabled." || .cron disable --> "Cron job disabled."` 

### Leskinen
- **Syntax:** `.leskinen` 
- **Description:** Ask Professor Leskinen what's on his mind.
- **Ex:** `.leskinen --> "..."`

### Save
- **Syntax:** `.save` 
- **Description:** Backup a tracker's list of shows. Click [this](./json_files/backups/README.md) for more info.
- **Ex:** `.save --> "SUCCESS: Saved tracked show list."`

### Load
- **Syntax:** `.load` 
- **Description:** Load the tracker's backup list of shows. Click [this](./json_files/backups/README.md) for more info.
- **Ex:** `.load --> "SUCCESS: loaded tracked show list."`