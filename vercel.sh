#!/bin/bash

if [[ $VERCEL_ENV == "production"  ]] ; then
  npx convex deploy --cmd 'next build'
else
  npm run build
fi
