#!/bin/sh
set -euxo pipefail

# Migrations
ts-node ./node_modules/typeorm/cli migration:run -d ./migrations/typeOrm.config.ts

# Gateway App / Default Project
node dist/apps/nest-monorepo/main
