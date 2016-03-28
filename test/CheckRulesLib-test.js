import chai from 'chai'
import esprima from 'esprima'

import {
    checkRulesObject,
    findNodeWithType
} from '../src/CheckRulesLib'

const assert = chai.assert


describe('CheckRulesLib', () => {
    const testCode = 'function foo () { let i = 0; return true }' +
                 'for (;;) { if (true) {} } '

    describe('findNodeWithType', () => {
        let estree
        beforeEach(() => {
            estree = esprima.parse(testCode)
        })

        it('Should return false if estree node is not defined', () => {
            const result = findNodeWithType(null, 'whatever')
            assert.isFalse(result)
        })

        it('Should return false if requested node type does not exist in estree', () => {
            const result = findNodeWithType(estree, 'WhileStatement')
            assert.isFalse(result)
        })

        it('Should find and return top level node type', () => {
            const nodeType = 'ForStatement'
            const result = findNodeWithType(estree, nodeType)
            assert.strictEqual(result.type, nodeType)
        })

        it('Should find and return inner node type', () => {
            const nodeType = 'IfStatement'
            const result = findNodeWithType(estree, nodeType)
            assert.strictEqual(result.type, nodeType)
        })
    })

    describe('checkRulesObject', () => {
        let estree
        beforeEach(() => {
            estree = esprima.parse(testCode)
        })

        it('It can check a MUST exist node type', () => {
            let rulesObject = {
                FunctionDeclaration: true
            }
            assert.isTrue(checkRulesObject(estree, rulesObject))

            rulesObject = {
                WhileStatement: true
            }
            assert.isFalse(checkRulesObject(estree, rulesObject))
        })

        it('It can check a MUST NOT exist node type', () => {
            let rulesObject = {
                FunctionDeclaration: false
            }
            assert.isFalse(checkRulesObject(estree, rulesObject))

            rulesObject = {
                WhileStatement: false
            }
            assert.isTrue(checkRulesObject(estree, rulesObject))
        })

        it('It can check MUST exist of nested structure', () => {
            let rulesObject = {
                ForStatement: {IfStatement: true}
            }
            assert.isTrue(checkRulesObject(estree, rulesObject))

            rulesObject = {
                ForStatement: {IfStatement: {WhileStatement: true}}
            }
            assert.isFalse(checkRulesObject(estree, rulesObject))
        })

        it.skip('It can find the correct nested structure if multiple candidate nodes exist', () => {
            const rulesObject = {
                ForStatement: {IfStatement: true}
            }
            const code = 'for (;;) {} for (;;) { if (true) {} }'
            const estree = esprima.parse(code)
            assert.isTrue(checkRulesObject(estree, rulesObject))
        })

        it('It can check that all requirements must be satisfied', () => {
            let rulesObject = {
                relation: 'and',
                rules: [
                    {ForStatement: {IfStatement: true}},
                    {FunctionDeclaration: true}
                ]
            }
            assert.isTrue(checkRulesObject(estree, rulesObject))

            rulesObject = {
                relation: 'and',
                rules: [
                    {ForStatement: {IfStatement: true}},
                    {FunctionDeclaration: false}
                ]
            }
            assert.isFalse(checkRulesObject(estree, rulesObject))
        })

        it('It can check that any of multiple requirements must be satisfied', () => {
            const rulesObject = {
                relation: 'or',
                rules: [
                    {ForStatement: {IfStatement: true}},
                    {FunctionDeclaration: false}
                ]
            }
            assert.isTrue(checkRulesObject(estree, rulesObject))
        })
    })

    describe('Rules Object format validation', () => {
        const estreeNode = {}

        it('Should throw an error if object is empty', () => {
            const rulesObject = {}
            const functionClosure = () => {
                checkRulesObject(estreeNode, rulesObject)
            }
            assert.throws(functionClosure, Error, 'Invalid rules syntax: empty object')
        })

        it('Should not throw an error if object has one key', () => {
            const rulesObject = {test: true}
            const functionClosure = () => {
                checkRulesObject(estreeNode, rulesObject)
            }
            assert.doesNotThrow(functionClosure)
        })

        it('Should throw an error if relation field is not "and" or "or"', () => {
            const rulesObject = {
                relation: 'xor',
                rules: []
            }
            const functionClosure = () => {
                checkRulesObject(estreeNode, rulesObject)
            }
            assert.throws(functionClosure, Error, 'Invalid rules syntax: invalid array relation')
        })

        it('Should throw an error if rules field is not an array', () => {
            const rulesObject = {
                relation: 'and',
                rules: {}
            }
            const functionClosure = () => {
                checkRulesObject(estreeNode, rulesObject)
            }
            assert.throws(functionClosure, Error, 'Invalid rules syntax: invalid rules array')
        })
    })
})
