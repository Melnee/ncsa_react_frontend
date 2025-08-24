set -euo pipefail

: "${IMAGE:?missing}"
: "${DOCR_USERNAME:?missing}"
: "${DOCR_PASSWORD:?missing}"

COMPOSE="docker-compose.production.yml"
NGX_SNIPPET="/etc/nginx/snippets/frontend_upstream.conf"

ACTIVE_PORT=`docker ps --filter "publish=5173" --format "{{.Ports}}" \
  | awk -F'[:>-]' '{print $(NF-2)}'`

NEW_PORT=$([ "$ACTIVE_PORT" = "5173" ] && echo 5174 || echo 5173)
NEW_STACK=$([ "$NEW_PORT" = "5173" ] && echo blue || echo green)
OLD_STACK=$([ "$NEW_STACK" = "blue" ] && echo green || echo blue)

echo "Active:$ACTIVE_PORT → New:$NEW_PORT ($NEW_STACK)"

docker login registry.digitalocean.com -u "$DOCR_USERNAME" -p "$DOCR_PASSWORD"

PORT="$NEW_PORT" IMAGE="$IMAGE" docker compose -p "$NEW_STACK" -f "$COMPOSE" pull
PORT="$NEW_PORT" IMAGE="$IMAGE" docker compose -p "$NEW_STACK" -f "$COMPOSE" up -d

CONTAINER_ID=$(docker compose -p "$NEW_STACK" -f "$COMPOSE" ps -q web)

until [ "$(docker inspect -f '{{.State.Health.Status}}' "$CONTAINER_ID")" = "healthy" ]; do
  sleep 2
done

# flip nginx to NEW_PORT
sudo sed -i -E \
  "s@(^[[:space:]]*)server 127\.0\.0\.1:$ACTIVE_PORT;@\1# server 127.0.0.1:$ACTIVE_PORT;@; \
   s@(^[[:space:]]*)#[[:space:]]*server 127\.0\.0\.1:$NEW_PORT;@\1server 127.0.0.1:$NEW_PORT;@" \
  "$NGX_SNIPPET"
sudo nginx -t && sudo systemctl reload nginx

docker compose -p "$OLD_STACK" -f "$COMPOSE" down || true

echo "Switched to $NEW_STACK:$NEW_PORT ✅"
