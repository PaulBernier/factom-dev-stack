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
$ factom-dev-stack wrap -c examples/.factomd-ds.json "factom-cli get chainhead 954d5a49fd70d9b8bcdb35d252267829957f7ef7fa6c74f88419bdc5e82209f4"
```

## Configuration file

```json
{
    "factomdImage": "factominc/factomd:v6.1.0-alpine",
    "walletdImage": "factominc/factom-walletd:v2.2.14-alpine",
    "factomdConf": "factomd.conf",
    "bootstrap": {
        "wallet": "wallet.json" OR ["Es4D1XXGBBJcWea54xDLMVYgobHzciXKfPSxoZNdsbdjxJftPM6Y"],
        "script": "my-bootstrap-script.sh",
        "scriptjs": "my-bootstrap-script.js",
        "waitNewBlock": true
    }
}
```