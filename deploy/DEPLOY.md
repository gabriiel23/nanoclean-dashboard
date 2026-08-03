# Despliegue de ÑañoClean Web (estático + Nginx + Certbot)

Guía específica para publicar **`nanoclean.uidehub.tech`** en el VPS de la
universidad.

La app Next.js está configurada con **`output: "export"`**, así que al compilar
genera una carpeta **`out/`** con HTML/CSS/JS puro. **Nginx la sirve directamente**
(`root` + `try_files`), **sin puerto ni proceso corriendo** — exactamente igual
que el resto de frontends del servidor.

- **Subdominio:** `nanoclean.uidehub.tech` (el DNS ya tiene wildcard `*`, ya
  resuelve al VPS; no hay que crear registro). Está libre: solo existe
  `api-nano-clean.uidehub.tech`, que es el **backend**, no la landing.
- **Carpeta de deploy:** `/srv/apps/nanoclean_frontend`
- **Repo:** `https://github.com/gabriiel23/nanoclean-dashboard.git`
- **Build:** `npm run build` → carpeta `out/`
- **Sin puerto, sin Docker.**

> **Estado del servidor (verificado):** Ubuntu 24.04, Node v24, Nginx 1.24,
> Certbot 2.9 — todo lo necesario ya está instalado.
>
> **⚠️ Coordinar con el equipo:** en `/srv/apps` ya existen `backend-nanoclean`
> y una carpeta `frontend_nanoclean` (creada por *root* el 14-jul, posible intento
> previo de un compañero). Esta guía usa un nombre distinto
> (`nanoclean_frontend`) para no pisarla, pero confirmen entre ustedes cuál queda
> como la oficial para no terminar con dos.

---

## 0) Entrar y revisar (solo lectura)

```bash
ssh deploy@68.183.174.210          # clave: Duide2026$#

node -v; npm -v; nginx -v; certbot --version
ls -la /srv/apps
# Que NO exista aún el subdominio de la landing:
sudo nginx -T | grep "server_name nanoclean.uidehub.tech" || echo "libre"
```

---

## 1) Clonar el repo

```bash
cd /srv/apps
git clone https://github.com/gabriiel23/nanoclean-dashboard.git nanoclean_frontend
cd nanoclean_frontend
```

## 2) Instalar y compilar (genera `out/`)

```bash
npm ci            # instala según package-lock.json
npm run build     # crea la carpeta out/

ls out            # debe verse: index.html, dashboard.html, clasificacion, _next, 404.html ...
```

## 3) Permisos para que Nginx pueda leer

```bash
sudo chown -R deploy:www-data /srv/apps/nanoclean_frontend
sudo find /srv/apps/nanoclean_frontend/out -type d -exec chmod 755 {} \;
sudo find /srv/apps/nanoclean_frontend/out -type f -exec chmod 644 {} \;
```

## 4) Configurar Nginx (HTTP primero)

```bash
# El repo ya trae el bloque listo:
sudo cp /srv/apps/nanoclean_frontend/deploy/nginx/nanoclean.uidehub.tech.conf \
        /etc/nginx/sites-available/nanoclean

sudo ln -s /etc/nginx/sites-available/nanoclean /etc/nginx/sites-enabled/nanoclean

# Verificar que no haya server_name duplicado
sudo grep -R "server_name nanoclean.uidehub.tech" /etc/nginx/sites-available /etc/nginx/sites-enabled

sudo nginx -t
sudo systemctl reload nginx

# Probar por HTTP (todavía sin candado)
curl -I -H "Host: nanoclean.uidehub.tech" http://127.0.0.1     # -> 200 OK
```

## 5) Activar HTTPS con Certbot (certificado propio, no toca el compartido)

```bash
sudo certbot --nginx -d nanoclean.uidehub.tech
sudo nginx -t && sudo systemctl reload nginx
```

Certbot añade el bloque `443 ssl` y la redirección 80→443 automáticamente.
Abre: **https://nanoclean.uidehub.tech** → debe salir con **candado**.

```bash
sudo systemctl status certbot.timer --no-pager     # renovación automática
```

## 6) Actualizar el sitio más adelante

```bash
cd /srv/apps/nanoclean_frontend
git pull
npm ci
npm run build
# Nginx sirve el nuevo out/ al instante. Solo recargar Nginx si cambiaste su .conf.
```

---

## Troubleshooting

| Síntoma | Causa probable |
|---|---|
| `/dashboard` muestra la landing | Falta `$uri.html` en el `try_files` (usa el `.conf` del repo, no el genérico) |
| Nginx muestra OTRO proyecto | `server_name` duplicado o symlink mal → revisar paso 4 |
| `403 Forbidden` | Permisos: repetir paso 3 (`chown deploy:www-data`, chmod 755/644) |
| Certbot falla al validar | Prueba `curl -I http://nanoclean.uidehub.tech` desde fuera del VPS |
| Cambié algo y no se ve | ¿Recompilaste? `npm run build` regenera `out/` |

> El **dashboard** (`/dashboard`) intenta conectarse a un backend en
> `http://10.115.178.214:3000` (IP de desarrollo). En producción mostrará "error
> de conexión" hasta apuntarlo a la API real (`api-nano-clean.uidehub.tech`). No
> afecta a la **landing**, que es 100% estática y es lo que se evalúa.
