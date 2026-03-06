---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
tags: []
difficulty: ""           # Easy | Medium | Hard | Insane
platform: ""             # HackTheBox | TryHackMe | HackingClub | CTF
os: ""                   # Linux | Windows | (omit for CTF challenges)
categories: []           # Web | Pwn | Crypto | Misc | Rev | Forensics | Privesc | AD
cover: ""                # optional: /img/covers/machine-name.png
---

> Brief description — main vector without spoiling. One or two lines.

## Recon

### Nmap

```bash
nmap -sC -sV -p- --min-rate 5000 -oN nmap/initial <TARGET_IP>
```

## Foothold

## Privilege Escalation

## Flags

| Flag     | Value      |
|----------|------------|
| user.txt | `<REDACTED>` |
| root.txt | `<REDACTED>` |

## Lessons Learned

-
