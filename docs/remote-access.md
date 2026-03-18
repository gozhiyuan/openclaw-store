# Remote Access — malaclaw Dashboard

The dashboard binds to `0.0.0.0:3456` by default. To access it from another machine, use one of these methods.

## Option 1: Cloudflare Tunnel (recommended)

Zero-config public URL with automatic HTTPS.

```bash
# Install cloudflared (macOS)
brew install cloudflare/cloudflare/cloudflared

# Start a quick tunnel
cloudflared tunnel --url http://localhost:3456
```

Cloudflare prints a public `*.trycloudflare.com` URL you can open from any device.

## Option 2: Tailscale

Access via your Tailscale network (private, no public exposure).

```bash
# Install Tailscale and authenticate
# Then access the dashboard at your Tailscale IP:
http://<tailscale-ip>:3456
```

No extra config needed — the dashboard already binds to `0.0.0.0`.

## Option 3: SSH Tunnel

Forward the port over SSH from a remote machine.

```bash
# On the remote machine:
ssh -L 3456:localhost:3456 user@server-with-dashboard

# Then open http://localhost:3456 on the remote machine
```

## Custom Port and Host

```bash
malaclaw dashboard --port 8080 --host 127.0.0.1
```

Use `--host 127.0.0.1` to restrict access to localhost only.
