#!/bin/bash

# If the strapi config mount is empty, populate it from the backup
if [ -d "/opt/app/launchpad/strapi/config" ] && [ -z "$(ls -A /opt/app/launchpad/strapi/config)" ]; then
  echo "Strapi config mount is empty. Populating with initial configuration..."
  if [ -d "/opt/app/launchpad/strapi/config-backup" ] && [ "$(ls -A /opt/app/launchpad/strapi/config-backup 2>/dev/null)" ]; then
    cp -r /opt/app/launchpad/strapi/config-backup/* /opt/app/launchpad/strapi/config/
  fi
fi

# Execute the original command
exec "$@"
