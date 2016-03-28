import 'babel-polyfill'

function isArray(node) {
    return !!node && node.constructor === Array
}

function isObject(node) {
    return !!node && node.constructor === Object
}

export function *findNodeWithType(estreeNode, nodeType) {
    if (!estreeNode) {
        return false
    }

    let nodesQueue = [estreeNode]
    while (nodesQueue.length > 0) {
        const node = nodesQueue.shift()
        if (!node) {
            continue
        }
        if (node.type === nodeType) {
            yield node
        }

        const children = Object.keys(node).reduce(
            (prevChildren, key) => {
                const element = node[key]
                if (!isObject(element) && !isArray(element)) {
                    return prevChildren
                }
                return prevChildren.concat(element)
            },
            [ ]
        )
        nodesQueue = nodesQueue.concat(children)
    }

    return false
}

export function checkHasNodeWithType(estreeNode, nodeType) {
    const generator = findNodeWithType(estreeNode, nodeType)
    return !!generator.next().value
}

export function checkNotHasNodeWithType(estreeNode, nodeType) {
    const generator = findNodeWithType(estreeNode, nodeType)
    return !generator.next().value
}

export function checkHasNodeWithNestedRules(estreeNode, nodeType, nestedRules) {
    const generator = findNodeWithType(estreeNode, nodeType)
    let nextNode = generator.next()
    while (!nextNode.done) {
        const topNode = nextNode.value
        if (checkRulesObject(topNode, nestedRules)) {
            return true
        }
        nextNode = generator.next()
    }
    return nextNode.value
}

export function checkIndividualRule(estreeNode, nodeType, rule) {
    if (rule === true) {
        return checkHasNodeWithType(estreeNode, nodeType)
    } else if (rule === false) {
        return checkNotHasNodeWithType(estreeNode, nodeType)
    } else {
        return checkHasNodeWithNestedRules(estreeNode, nodeType, rule)
    }
}

export function checkRulesObject(estreeNode, rulesObject) {
    const keys = Object.keys(rulesObject)

    if (keys.length === 0) {
        throw new Error('Invalid rules syntax: empty object')
    } else if (keys.length === 1) {
        const nodeType = keys[0]
        const rule = rulesObject[nodeType]
        return checkIndividualRule(estreeNode, nodeType, rule)
    } else {
        const relation = rulesObject.relation
        const rulesArray = rulesObject.rules
        if (!isArray(rulesArray)) {
            throw new Error('Invalid rules syntax: invalid rules array')
        }

        if (relation === 'and') {
            return rulesArray.every(
                (rule) => checkRulesObject(estreeNode, rule)
            )
        } else if (relation === 'or') {
            return rulesArray.some(
                (rule) => checkRulesObject(estreeNode, rule)
            )
        } else {
            throw new Error('Invalid rules syntax: invalid array relation')
        }
    }
}

function checkRules(estreeNode, rulesObject) {
    try {
        return checkRulesObject(estreeNode, rulesObject)
    }
    catch (e) {
        return {error: e.message}
    }
}

export function getRulesObject(rulesJSON) {
    try {
        return JSON.parse(rulesJSON)
    }
    catch (err) {
        return {error: 'Invalid Rules JSON string'}
    }
}

export default checkRules
