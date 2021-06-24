# Oracle
Lightweight Discord bot designed to interface with [AniList](https://anilist.co/) to provide basic show tracking and airing reminders.

## Table of Contents
- [Setup](#setup)
- [Commands](#commands)
    - [Track](#track)
    - [Untrack](#untrack)
    - [List](#list)
    - [Airing Today](#airing-today)
    - [Cron](#cron)
    - [Leskinen](#leskinen)

## Setup
After adding Oracle to your Discord server, enter a channel you want the bot to push daily reports to and use the `.cron enable` command. Henceforth, Oracle will push summaries of shows airing that day to this channel. \

To select a different channel use the `.cron disable` command and repeat the process described above.

## Commands
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
