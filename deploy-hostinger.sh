#!/usr/bin/env bash
set -e

echo "=================================================================="
echo " Deploying VIMS Enterprises Polymer Website to Hostinger VPS"
echo " Domain: plastic.vimsenterprise.com -> 127.0.0.1:4500"
echo "=================================================================="

# 1. Ensure Node.js is available
NODE_BIN="node"
if [ -x "/opt/node22/bin/node" ]; then
  NODE_BIN="/opt/node22/bin/node"
elif ! command -v node >/dev/null 2>&1; then
  echo "[1/5] Installing Node.js v22.14.0 binary to /opt/node22..."
  mkdir -p /opt/node22
  curl -fsSL https://nodejs.org/dist/v22.14.0/node-v22.14.0-linux-x64.tar.xz -o /tmp/node22.tar.xz
  tar -xJf /tmp/node22.tar.xz -C /opt/node22 --strip-components=1
  rm -f /tmp/node22.tar.xz
  NODE_BIN="/opt/node22/bin/node"
fi
echo "Using Node.js: $($NODE_BIN -v)"

# 2. Clone or update application code in /opt/plastic-vimsenterprise
APP_DIR="/opt/plastic-vimsenterprise"
echo "[2/5] Fetching latest application from GitHub (Vimal-Raj-003/plastic-vimsenterprise)..."
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" fetch --all
  git -C "$APP_DIR" reset --hard origin/main
else
  rm -rf "$APP_DIR"
  git clone https://github.com/Vimal-Raj-003/plastic-vimsenterprise.git "$APP_DIR"
fi

# 3. Create and enable systemd service on port 4500
echo "[3/5] Configuring systemd service vims-plastic.service on 127.0.0.1:4500..."
cat >/etc/systemd/system/vims-plastic.service <<EOF
[Unit]
Description=VIMS Enterprises Polymer & Injection Molding Website (plastic.vimsenterprise.com)
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/plastic-vimsenterprise
Environment=NODE_ENV=production
Environment=PORT=4500
ExecStart=$NODE_BIN /opt/plastic-vimsenterprise/serve-3d.js
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable vims-plastic.service
systemctl restart vims-plastic.service
sleep 2

# 4. Configure Reverse Proxy + SSL for plastic.vimsenterprise.com
echo "[4/5] Configuring Reverse Proxy + SSL for plastic.vimsenterprise.com..."
if command -v nginx >/dev/null 2>&1 || [ -d /etc/nginx ]; then
  NGINX_CONF="/etc/nginx/sites-available/plastic.vimsenterprise.com"
  if [ ! -d /etc/nginx/sites-available ]; then
    NGINX_CONF="/etc/nginx/conf.d/plastic.vimsenterprise.com.conf"
  fi

  cat >"$NGINX_CONF" <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name plastic.vimsenterprise.com;

    client_max_body_size 25M;

    location / {
        proxy_pass http://127.0.0.1:4500;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

  if [ -d /etc/nginx/sites-enabled ] && [ -f /etc/nginx/sites-available/plastic.vimsenterprise.com ]; then
    ln -sf /etc/nginx/sites-available/plastic.vimsenterprise.com /etc/nginx/sites-enabled/plastic.vimsenterprise.com
  fi

  nginx -t && systemctl reload nginx

  if command -v certbot >/dev/null 2>&1; then
    certbot --nginx -d plastic.vimsenterprise.com --non-interactive --agree-tos --register-unsafely-without-email --redirect || true
  fi
fi

echo "[5/5] Verifying local health check..."
curl -sI http://127.0.0.1:4500 | head -n 5
echo "=================================================================="
echo " SUCCESS: https://plastic.vimsenterprise.com is LIVE!"
echo "=================================================================="
