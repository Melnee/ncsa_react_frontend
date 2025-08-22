sudo find . -path ./tmp/db -prune -o -print0 | xargs -0 sudo chown "$(whoami):$(id -gn)"
