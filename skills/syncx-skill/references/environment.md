# Environment Prerequisites

## Minimum Runtime
- Python 3.9+ (recommended 3.10+)
- Local shell access
- Outbound network access to Binance/X/Telegram/Threads APIs

## Quick Checks
```bash
python3 --version
python3 scripts/publish_sync.py --help
```

## If `python3` Is Missing

### macOS (Homebrew)
```bash
brew install python
python3 --version
```

### Ubuntu / Debian
```bash
sudo apt update
sudo apt install -y python3
python3 --version
```

### CentOS / RHEL
```bash
sudo yum install -y python3
python3 --version
```

## If `python` Exists But `python3` Does Not
Use your available interpreter explicitly:
```bash
python scripts/publish_sync.py --help
```

## If Shell Reports "command not found"
1. Confirm current directory:
```bash
pwd
ls -la
```
2. Switch to skill directory:
```bash
cd SyncX/skills/syncx
```
3. Run with explicit path:
```bash
python3 scripts/publish_sync.py --help
```

## Network/Firewall Checklist
If requests fail with network errors:
1. Verify DNS and outbound HTTPS.
2. Test target domains from host:
- `www.binance.com`
- `api.x.com`
- `api.telegram.org`
- `graph.threads.net`
3. Retry using single-platform publish first.

## First-Run Sequence
```bash
python3 scripts/publish_sync.py --init-config
python3 scripts/publish_sync.py --doctor --platforms square,twitter --twitter-mode official
python3 scripts/publish_sync.py --text "test" --platforms square,twitter --twitter-mode official
```
