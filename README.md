## A web application implementing a Javascript challenge framework

- Set challenge rules for required JS syntax that must (or must not) be used in the code
- Then you can write JS code in the embedded editor, and the code is checked against the challenge rules.
- To pass a challenge you must write valid JS code that satisifes the specified requirements

### Installation
```
npm install
npm run dev
```
then go to http://localhost:8080/ in your browser of choice


### Setting challenge rules
- The framework provides a declarative way of setting challenge rules, using a rules object
- The rules object is input to the application as a standard JSON string
- The following rules can be specified:
   - Must exist:  `{ForStatement: true}`
   - Must not exist:  `{IfStatement: false}`
   - Nested program structure:  `{WhileStatement: {IfStatement: true} }`
   - Compounding multiple rules with "and" or "or" relations:
   ```
   {
     relation: 'and',
     rules: [
       {ForStatement: true},
       {WhileStatement: {IfStatement: false} },
       {
         relation: 'or',
         rules: [{CallExpression: true}]
       }
     ]
   }
   ```
   - And any nested combination of these rules as desired
   - Note: you can find a list of all supported syntax expression element names at https://github.com/jquery/esprima/blob/2.7/esprima.js#L106
