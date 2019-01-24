# Factom Dev Stack

## Install

```bash
$ npm install -g factom-dev-stack
```

Factom Dev Stack requires `docker` to be installed.

## Commands

### Start

```bash
$ factom-dev-stack start -c examples/.factomd-ds.json
```

### Stop

```bash
$ factom-dev-stack stop
```

## Configuration file

```json
{
    "factomdImage": "factominc/factomd:v6.1.0-alpine",
    "walletdImage": "factominc/factom-walletd:v2.2.14-alpine",
    "factomdConf": "factomd.conf",
    "bootstrap": {
        "script": "my-bootstrap-script.sh",
        "scriptjs": "my-bootstrap-script.js",
        "chains": "",
        "entries": "",
        "transactions": ""
    }
}
```