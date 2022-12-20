function adjustResourceInventory(resourceInventory, oreAdjustment, clayAdjustment, obsidianAdjustment, geodeAdjustment) {
    return {
        ore: resourceInventory.ore + oreAdjustment,
        clay: resourceInventory.clay + clayAdjustment,
        obsidian: resourceInventory.obsidian + obsidianAdjustment,
        geodes: resourceInventory.geodes + geodeAdjustment
    }
}

function adjustRobotInventory(robotInventory, oreBotsAdjustment, clayBotsAdjustment, obsidianBotsAdjustment, geodeBotsAdjustment) {
    return {
        oreBots: robotInventory.oreBots + oreBotsAdjustment,
        clayBots: robotInventory.clayBots + clayBotsAdjustment,
        obsidianBots: robotInventory.obsidianBots + obsidianBotsAdjustment,
        geodeBots: robotInventory.geodeBots + geodeBotsAdjustment
    }
}

function explorePossibility(blueprint, minutesRemaining, resourceInventory, robotInventory, maxGeodes = 0) {
    if (minutesRemaining <= 0) return maxGeodes

    // can I build a geode bot?
    if (robotInventory.obsidianBots > 0) {
        // can I build a geode bot right now?
        let minutesUntilGeodeBot = 1
        if (resourceInventory.obsidian < blueprint.geodeBotObsidianCost || resourceInventory.ore < blueprint.geodeBotOreCost) {
            // how long until I can build a geode bot?
            minutesUntilGeodeBot = Math.max(
                Math.ceil((blueprint.geodeBotObsidianCost - resourceInventory.obsidian) / robotInventory.obsidianBots),
                Math.ceil((blueprint.geodeBotOreCost - resourceInventory.ore) / robotInventory.oreBots)
            ) + 1
        }
        // explore the possibility of building a geode bot
        let newResourceInventory = adjustResourceInventory(resourceInventory,
            (minutesUntilGeodeBot * robotInventory.oreBots) - blueprint.geodeBotOreCost,
            (minutesUntilGeodeBot * robotInventory.clayBots),
            (minutesUntilGeodeBot * robotInventory.obsidianBots) - blueprint.geodeBotObsidianCost,
            minutesRemaining - minutesUntilGeodeBot)
        let newRobotInventory = adjustRobotInventory(robotInventory, 0, 0, 0, 1)
        maxGeodes = Math.max(maxGeodes, newResourceInventory.geodes)

        maxGeodes = explorePossibility(blueprint, minutesRemaining - minutesUntilGeodeBot, newResourceInventory, newRobotInventory, maxGeodes)
    }

    // can I build an obsidian bot?
    if (robotInventory.clayBots > 0) {
        // can I build an obsidian bot right now?
        let minutesUntilObsidianBot = 1
        if (resourceInventory.clay < blueprint.obsidianBotClayCost || resourceInventory.ore < blueprint.obsidianBotOreCost) {
            // how long until I can build an obsidian bot?
            minutesUntilObsidianBot = Math.max(
                Math.ceil((blueprint.obsidianBotClayCost - resourceInventory.clay) / robotInventory.clayBots),
                Math.ceil((blueprint.obsidianBotOreCost - resourceInventory.ore) / robotInventory.oreBots)
            ) + 1
        }
        // explore the possibility of building an obsidian bot
        let newResourceInventory = adjustResourceInventory(resourceInventory,
            (minutesUntilObsidianBot * robotInventory.oreBots) - blueprint.obsidianBotOreCost,
            (minutesUntilObsidianBot * robotInventory.clayBots) - blueprint.obsidianBotClayCost,
            (minutesUntilObsidianBot * robotInventory.obsidianBots),
            0)
        let newRobotInventory = adjustRobotInventory(robotInventory, 0, 0, 1, 0)

        maxGeodes = explorePossibility(blueprint, minutesRemaining - minutesUntilObsidianBot, newResourceInventory, newRobotInventory, maxGeodes)
    }

    // can I build a clay bot? // 17 on 1st try with 5 minutes to build
    if (robotInventory.clayBots < blueprint.mostExpensiveClay) {
        // can I build a clay bot right now?
        let minutesUntilClayBot = 1
        if (resourceInventory.ore < blueprint.clayBotOreCost) {
            // how long until I can build a clay bot?            
            minutesUntilClayBot = Math.ceil((blueprint.clayBotOreCost - resourceInventory.ore) / robotInventory.oreBots) + 1
        }
        // explore the possibility of building a clay bot
        let newResourceInventory = adjustResourceInventory(resourceInventory,
            (minutesUntilClayBot * robotInventory.oreBots) - blueprint.clayBotOreCost,
            (minutesUntilClayBot * robotInventory.clayBots),
            (minutesUntilClayBot * robotInventory.obsidianBots),
            0)
        let newRobotInventory = adjustRobotInventory(robotInventory, 0, 1, 0, 0)

        maxGeodes = explorePossibility(blueprint, minutesRemaining - minutesUntilClayBot, newResourceInventory, newRobotInventory, maxGeodes)
    }

    // build ore bots
    if (robotInventory.oreBots < blueprint.mostExpensiveOre) {
        let minutesUntilOreBot = 1
        if (resourceInventory.ore < blueprint.oreBotCost) {
            minutesUntilOreBot = Math.ceil((blueprint.oreBotCost - resourceInventory.ore) / robotInventory.oreBots) + 1
        }
        // explore the possibility of building an ore bot
        let newResourceInventory = adjustResourceInventory(resourceInventory,
            (minutesUntilOreBot * robotInventory.oreBots) - blueprint.oreBotCost,
            (minutesUntilOreBot * robotInventory.clayBots),
            (minutesUntilOreBot * robotInventory.obsidianBots),
            0)
        let newRobotInventory = adjustRobotInventory(robotInventory, 1, 0, 0, 0)

        maxGeodes = explorePossibility(blueprint, minutesRemaining - minutesUntilOreBot, newResourceInventory, newRobotInventory, maxGeodes)
    }

    return maxGeodes
}

function getMostGeodesForBlueprint(blueprint, minutesRemaining) {
    return explorePossibility(blueprint, minutesRemaining, {
        ore: 0,
        clay: 0,
        obsidian: 0,
        geodes: 0
    }, {
        oreBots: 1,
        clayBots: 0,
        obsidianBots: 0,
        geodeBots: 0
    }, 0)
}

const fs = require('fs')
const pattern = /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./
const blueprints = fs.readFileSync(`${__dirname}/input.txt`, 'utf8')
    .split(/\r?\n/)
    .map(line => pattern.exec(line))
    .map(([, id, oreBotCost, clayBotOreCost, obsidianBotOreCost, obsidianBotClayCost, geodeBotOreCost, geodeBotObsidianCost]) => {
        return {
            id: parseInt(id),
            oreBotCost: parseInt(oreBotCost),
            clayBotOreCost: parseInt(clayBotOreCost),
            obsidianBotOreCost: parseInt(obsidianBotOreCost),
            obsidianBotClayCost: parseInt(obsidianBotClayCost),
            geodeBotOreCost: parseInt(geodeBotOreCost),
            geodeBotObsidianCost: parseInt(geodeBotObsidianCost),
            mostExpensiveOre: Math.max(clayBotOreCost, obsidianBotOreCost, geodeBotOreCost),
            mostExpensiveClay: Math.max(obsidianBotClayCost),
        }
    })

const totalQualityLevels = blueprints.reduce((total, blueprint) => total + (blueprint.id * getMostGeodesForBlueprint(blueprint, 24)), 0)
console.log(`Answer part 1: ${totalQualityLevels}`)
const firstThreeProduct = blueprints.slice(0, 3).reduce((total, blueprint) => total * getMostGeodesForBlueprint(blueprint, 32), 1)
console.log(`Answer part 2: ${firstThreeProduct}`)
