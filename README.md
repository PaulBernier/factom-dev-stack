# Factom Dev Stack

Factom Dev Stack (FDS) is a simple tool to improve the speed and ease of developement of applications on Factom. One of its main use case (and the reason it was created) is integration testing.

Currently Factom Dev Stack offers two main servives:
* A way to start new *local* `factomd` and `factom-walletd` instances with a clean state.
* A set of blockchain and wallet bootstrapping mechanisms.

## Installation

### Global

Factom Dev Stack requires [`docker`](https://docs.docker.com/install/) to be installed.

```bash
$ npm install -g factom-dev-stack
```

We recommend creating a shorter alias such as:
```bash
alias fds='factom-dev-stack'
```

### For JavaScript integration tests

To use for integration testing in a JavaScript project using NPM:
```
$ npm install -D factom-dev-stack
```
You can then use `factom-dev-stack` in your NPM test command for instance:
```javascript
{
    ...
    "test": "factom-dev-stack wrap \"mocha 'test/'\"",
    ...
}
```

## Commands

### start

Start all instances then run the bootstrapping.

```bash
$ factom-dev-stack start -c examples/.factomds.json
```

### stop

Stop all instances.

```bash
$ factom-dev-stack stop
```

### wrap

Start the instances then bootstrap then run the user command then stop the instances. Intended to use for convenient integration testing.

```bash
$ factom-dev-stack wrap -c examples/.factomds.json "factom-cli get chainhead 954d5a49fd70d9b8bcdb35d252267829957f7ef7fa6c74f88419bdc5e82209f4"
```

## Configuration file format

```javascript
{
    "persist": "my-project",
    "factomd": {
        "image": "factominc/factomd:v6.1.0-alpine",
        "conf": "factomd.conf",
        "blockTime": 4
    },
    "walletd": {
        "image": "factominc/factom-walletd:v2.2.14-alpine"
    },
    "bootstrap": {
        "wallet": "wallet.json" OR ["Es4D1XXGBBJcWea54xDLMVYgobHzciXKfPSxoZNdsbdjxJftPM6Y"],
        "script": "my-bootstrap-script.sh",
        "scriptjs": "my-bootstrap-script.js",
        "waitNewBlock": true
    }
}
```

You can select any specific docker image of factomd or walletd. By default FDS will pick the latest stable alpine release from [Factom Inc. docker repository](https://hub.docker.com/r/factominc/factomd/tags).

You can also provide your own `factomd.conf` configuration file to customize your set up (block time for instance). Note that you cannot change the network your are on though, it will be a LOCAL network.

See the `examples` folder for a complete example of configuration.

## Bootstrapping mechanisms

After launching an instance of `factomd` and `factom-walletd` FDS offers some mechanisms to bootstrap the blockchain and the wallet with your own data.

Bootstrapping mechanisms are executed in the following order:
* `wallet`: import the array of keys into walletd.
* `script`: any executable script. If you want to use your existing Python script to bootstrap for instance.
* `scriptjs`: a JavaScript script (see section below).

The option `waitNewBlock` allows you to specify if, after bootstrapping, `factom-dev-stack` should directly return or wait for a new block to happen before returning. There are many cases when you would want your bootstrapped data to be confirmed in a block before starting your own processing. 

### JavaScript bootstrapping script

The JavaScript bootstrapping script is the most powerful and flexible option to use. The script must export a function with this signature:
```javascript
module.exports = function(cli, factomjs) {
...
}
```

The first argument injected is an instance of `FactomCli` that connects to local `factomd` and `factom-walletd` instances. The second argument injected is the [`factom`](https://www.npmjs.com/package/factom) NPM module. Thanks to object destructuring you can get directly what you need from the `factom` module, for instance:

```javascript
module.exports = async function (cli, { Chain, Entry }) {
    const entry = Entry.builder()
        .extId('test', 'utf8')
        .content('hello', 'utf8')
        .build();

    const c = new Chain(entry);
    await cli.add(c, 'EC3b6ph71PXiXorFnStNNPNP8mF4YkZMQwQxH4oNs52HvXiXgjar');
};
```

The JS bootstrapping script has an other benefit when using the `wrap` command: the JS script can return an object of key-value pairs that will be passed as environment variables to the wrapped command. It is an effective way to communicate data that was bootstrapped to your own command.

## Blockchain and wallet persistence

By default FDS creates ephemeral Factom blockchains and wallets: they will be thrown away after calling `factom-dev-stack stop`. As the first use case for FDS was integration testing this is a desirable behavior to always start with a fresh setup at every run. This can also help to not fill your disk space over time by re-using an ever growing blockchain.

There are still cases a developer would want to re-use the same blockchain over time. FDS offers a *persist* option that allows to persist both the Factom blockchain and the walletd storage in a Docker volume. You can do so by using the `-p` flag of the CLI or by adding a `persist` key in your config JSON. The option takes a tag name that identifies a specific persisting volume. For instance you could have one persistence tag name per project, effectively having separate blockchains and wallets for each of your projects.

**When using the persistence mode the bootstrapping step will only occur during the first run for a given tag name.**

To get the list of Docker volumes created by FDS: `docker volume ls --filter label=factom-dev-stack=true`