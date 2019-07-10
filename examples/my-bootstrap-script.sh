#!/usr/bin/env bash
curl -X POST --data-binary '{"jsonrpc": "2.0", "id": 0, "method": "heights"}' -H 'content-type:text/plain;' http://localhost:5088/v2
echo ''
curl  -X GET --data-binary '{"jsonrpc": "2.0", "id": 0, "method": "all-addresses"}' -H 'content-type:text/plain;' http://localhost:5089/v2