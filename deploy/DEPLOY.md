# Despliegue de ÑañoClean Web en el servidor (Docker + Nginx + Certbot)

Guía específica para publicar **`nanoclean.uidehub.tech`** en el VPS de la
universidad. La app es **Next.js** (no es un sitio estático como Vite), por eso
corre como un **contenedor Docker** en `127.0.0.1:3001` y **Nginx** hace de
reverse proxy con SSL, igual que el patrón del backend del instructivo
(`Internet → Nginx 443/80 → 127.0.0.1:PUERTO`).

- **Subdominio:** `nanoclean.uidehub.tech` (el DNS ya tiene wildcard `*`, así que
  ya resuelve al VPS — no hay que crear registro).
- **Carpeta de deploy:** `/srv/apps/nanoclean_frontend`
- **Puerto interno:** `127.0.0.1:3001` (el backend usa el 3000; por eso 3001).
- **Repo:** `https://github.com/gabriiel23/nanoclean-dashboard.git`

---

## 0) Entrar y REVISAR qué tiene el servidor (solo lectura, no cambia nada)

```bash
ssh deploy@68.183.174.210          # clave: Duide2026$#

# ¿Qué hay instalado?
. /etc/os-release; echo "$PRETTY_NAME"
node -v; npm -v
docker --version || echo "NO DOCKER"
docker compose version || echo "NO COMPOSE"
nginx -v
certbot --version

# ¿Qué proyectos y subdominios ya existen? (para no chocar)
ls -la /srv/apps
ls -1 /etc/nginx/sites-enabled
sudo nginx -T | grep server_name | sort -u        # que NO aparezca nanoclean aún

# ¿El puerto 3001 está libre?
sudo ss -tlnp | grep :3001 || echo "3001 libre"
```

> **Decisión:** si `docker --version` responde, sigue con la **Opción A (Docker)**.
> Si dice *NO DOCKER* y no quieres/puedes instalarlo, salta a la **Opción B
> (systemd, sin Docker)** al final — el resultado para Nginx es idéntico.

---

## 1) Clonar el repo en `/srv/apps`

```bash
cd /srv/apps
git clone https://github.com/gabriiel23/nanoclean-dashboard.git nanoclean_frontend
cd nanoclean_frontend
```

---

## Opción A · Desplegar con Docker (recomendada)

### A.1 Instalar Docker (SOLO si el paso 0 dijo "NO DOCKER")

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker deploy        # para usar docker sin sudo
# cierra sesión y vuelve a entrar para que el grupo tome efecto:
exit
ssh deploy@68.183.174.210
cd /srv/apps/nanoclean_frontend
```

### A.2 Construir y levantar el contenedor

```bash
docker compose up -d --build
docker compose ps                # debe verse "running"
docker compose logs -f           # Ctrl-C para salir; espera "Ready in ..."
```

### A.3 Probar que responde en local (dentro del VPS)

```bash
curl -I http://127.0.0.1:3001    # debe dar HTTP/1.1 200 OK
```

Si da 200, el contenedor está bien. Sigue con **Nginx** (paso 2).

---

## 2) Configurar Nginx (reverse proxy en HTTP)

```bash
# El repo trae el bloque listo en deploy/nginx/
sudo cp /srv/apps/nanoclean_frontend/deploy/nginx/nanoclean.uidehub.tech.conf \
        /etc/nginx/sites-available/nanoclean

# Activar
sudo ln -s /etc/nginx/sites-available/nanoclean /etc/nginx/sites-enabled/nanoclean

# Verificar que no exista un server_name duplicado
sudo grep -R "server_name nanoclean.uidehub.tech" /etc/nginx/sites-enabled /etc/nginx/sites-available

# Probar sintaxis y recargar
sudo nginx -t
sudo systemctl reload nginx

# Probar por HTTP (todavía sin candado)
curl -I -H "Host: nanoclean.uidehub.tech" http://127.0.0.1
```

Debe devolver `200 OK` sirviendo la landing.

---

## 3) Activar HTTPS con Certbot (certificado propio del subdominio)

```bash
sudo certbot --nginx -d nanoclean.uidehub.tech
```

- Certbot pide un correo (si es la primera vez) y modifica el bloque para añadir
  `listen 443 ssl` + la redirección 80→443 automáticamente.
- **Importante:** este comando crea un certificado **solo para nanoclean**, sin
  tocar el certificado compartido de los otros sitios. Es la opción segura.

```bash
sudo nginx -t && sudo systemctl reload nginx
```

Abre en el navegador: **https://nanoclean.uidehub.tech** — debe salir con candado.

### Verificar renovación automática

```bash
sudo systemctl status certbot.timer --no-pager
```

---

## 4) Cómo actualizar el sitio más adelante

```bash
cd /srv/apps/nanoclean_frontend
git pull
docker compose up -d --build      # reconstruye con los cambios
docker compose logs -f
```

(No hace falta tocar Nginx salvo que cambies su configuración.)

---

## Opción B · Sin Docker (systemd + `next start`)

Si prefieres no usar Docker, corre la app como servicio, igual que el backend.

```bash
cd /srv/apps/nanoclean_frontend
npm ci
npm run build

# Servicio systemd
sudo tee /etc/systemd/system/nanoclean-web.service >/dev/null <<'EOF'
[Unit]
Description=NanoClean Web (Next.js)
After=network.target

[Service]
Type=simple
WorkingDirectory=/srv/apps/nanoclean_frontend
Environment=NODE_ENV=production
Environment=PORT=3001
Environment=HOSTNAME=127.0.0.1
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=3
User=deploy
Group=deploy

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable nanoclean-web
sudo systemctl restart nanoclean-web
sudo systemctl status nanoclean-web --no-pager
curl -I http://127.0.0.1:3001     # 200 OK
```

Luego sigue **igual** desde el paso **2) Nginx** y **3) Certbot**. Para
actualizar: `git pull && npm ci && npm run build && sudo systemctl restart nanoclean-web`.

---

## Troubleshooting rápido

| Síntoma | Causa probable |
|---|---|
| `curl 127.0.0.1:3001` no responde | El contenedor/servicio no arrancó → `docker compose logs -f` |
| Nginx muestra OTRO proyecto | `server_name` duplicado o symlink mal → revisar paso 2 |
| Certbot falla al validar | El DNS/HTTP no llega: prueba `curl -I http://nanoclean.uidehub.tech` desde fuera |
| Puerto 3001 ocupado | Cambia el mapeo en `docker-compose.yml` (`3002:3000`) y el `proxy_pass` del `.conf` |

> Nota: el **dashboard** (`/dashboard`) intenta conectarse a un backend en
> `http://10.115.178.214:3000` (IP de desarrollo). En producción mostrará "error
> de conexión" hasta que apunten a la API real — no afecta a la **landing**, que
> es autónoma y es lo que se evalúa en esta entrega.
