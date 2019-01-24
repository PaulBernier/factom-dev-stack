# Factom Dev Stack

## Install

```bash
$ npm install -g factom-dev-stack
```

Factom Dev Stack requires `docker` to be installed.

## Commands

### start

```bash
$ factom-dev-stack start -c examples/.factomd-ds.json
```

### stop

```bash
$ factom-dev-stack stop
```

### wrap

```bash
$ factom-dev-stack wrap -c examples/.factomd-ds.json "factom-cli balance FA2jK2HcLnRdS94dEcU27rF3meoJfpUcZPSinpb7AwQvPRY6RL1Q"
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