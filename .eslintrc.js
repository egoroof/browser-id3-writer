module.exports = {
    "env": {
        "es6": true,
        "browser": true,
        "commonjs": true
    },
    "rules": { // http://eslint.org/docs/rules/

        // possible errors
        "comma-dangle": 2, // disallow or enforce trailing commas
        "no-cond-assign": 2, // disallow assignment in conditional expressions
        "no-console": 2, // disallow use of console in the node environment
        "no-constant-condition": 2, // disallow use of constant expressions in conditions
        "no-control-regex": 2, // disallow control characters in regular expressions
        "no-debugger": 2, // disallow use of debugger
        "no-dupe-args": 2, // disallow duplicate arguments in functions
        "no-dupe-keys": 2, // disallow duplicate keys when creating object literals
        "no-duplicate-case": 2, // disallow a duplicate case label.
        "no-empty-character-class": 2, // disallow the use of empty character classes in regular expressions
        "no-empty": 2, // disallow empty statements
        "no-ex-assign": 2, // disallow assigning to the exception in a catch block
        "no-extra-boolean-cast": 2, // disallow double-negation boolean casts in a boolean context
        "no-extra-parens": 1, // disallow unnecessary parentheses
        "no-extra-semi": 2, // disallow unnecessary semicolons
        "no-func-assign": 2, // disallow overwriting functions written as function declarations
        "no-inner-declarations": 2, // disallow function or variable declarations in nested blocks
        "no-invalid-regexp": 2, // disallow invalid regular expression strings in the RegExp constructor
        "no-irregular-whitespace": 2, // disallow irregular whitespace outside of strings and comments
        "no-negated-in-lhs": 2, // disallow negation of the left operand of an in expression
        "no-obj-calls": 2, // disallow the use of object properties of the global object (Math and JSON) as functions
        "no-regex-spaces": 2, // disallow multiple spaces in a regular expression literal
        "no-sparse-arrays": 2, // disallow sparse arrays
        "no-unexpected-multiline": 2, // Avoid code that looks like two expressions but is actually one
        "no-unreachable": 2, // disallow unreachable statements after a return, throw, continue, or break statement
        "use-isnan": 2, // disallow comparisons with the value NaN
        "valid-jsdoc": 2, // Ensure JSDoc comments are valid
        "valid-typeof": 2, // Ensure that the results of typeof are compared against a valid string

        // best practices
        "accessor-pairs": 2, // Enforces getter/setter pairs in objects
        "array-callback-return": 2, // Enforces return statements in callbacks of array's methods
        "block-scoped-var": 2, // treat var statements as if they were block scoped
        "complexity": 2, // specify the maximum cyclomatic complexity allowed in a program
        "consistent-return": 2, // require return statements to either always or never specify values
        "curly": 2, // specify curly brace conventions for all control statements
        "default-case": 0, // require default case in switch statements
        "dot-location": [2, "property"], // enforces consistent newlines before or after dots
        "dot-notation": 2, // encourages use of dot notation whenever possible
        "eqeqeq": 2, // require the use of === and !==
        "guard-for-in": 2, // make sure for-in loops have an if statement
        "no-alert": 2, // disallow the use of alert, confirm, and prompt
        "no-caller": 2, // disallow use of arguments.caller or arguments.callee
        "no-case-declarations": 2, // disallow lexical declarations in case clauses
        "no-div-regex": 2, // disallow division operators explicitly at beginning of regular expression
        "no-else-return": 2, // disallow else after a return in an if
        "no-empty-function": 0, // disallow use of empty functions
        "no-empty-pattern": 2, // disallow use of empty destructuring patterns
        "no-eq-null": 2, // disallow comparisons to null without a type-checking operator
        "no-eval": 2, // disallow use of eval()
        "no-extend-native": 2, // disallow adding to native types
        "no-extra-bind": 2, // disallow unnecessary function binding
        "no-extra-label": 2, // disallow unnecessary labels
        "no-fallthrough": 2, // disallow fallthrough of case statements
        "no-floating-decimal": 2, // disallow the use of leading or trailing decimal points in numeric literals
        "no-implicit-coercion": 2, // disallow the type conversions with shorter notations
        "no-implicit-globals": 2, // disallow var and named functions in global scope
        "no-implied-eval": 2, // disallow use of eval()-like methods
        "no-invalid-this": 2, // disallow this keywords outside of classes or class-like objects
        "no-iterator": 2, // disallow usage of __iterator__ property
        "no-labels": 2, // disallow use of labeled statements
        "no-lone-blocks": 2, // disallow unnecessary nested blocks
        "no-loop-func": 2, // disallow creation of functions within loops
        "no-magic-numbers": 0, // disallow the use of magic numbers
        "no-multi-spaces": 2, // disallow use of multiple spaces
        "no-multi-str": 2, // disallow use of multiline strings
        "no-native-reassign": 2, // disallow reassignments of native objects
        "no-new-func": 2, // disallow use of new operator for Function object
        "no-new-wrappers": 2, // disallows creating new instances of String,Number, and Boolean
        "no-new": 2, // disallow use of the new operator when not part of an assignment or comparison
        "no-octal-escape": 2, // disallow use of octal escape sequences in string literals, such as var foo = "Copyright \251";
        "no-octal": 2, // disallow use of octal literals
        "no-param-reassign": 2, // disallow reassignment of function parameters
        "no-process-env": 2, // disallow use of process.env
        "no-proto": 2, // disallow usage of __proto__ property
        "no-redeclare": 2, // disallow declaring the same variable more than once
        "no-return-assign": 2, // disallow use of assignment in return statement
        "no-script-url": 2, // disallow use of javascript: urls
        "no-self-assign": 2, // disallow assignments where both sides are exactly the same
        "no-self-compare": 2, // disallow comparisons where both sides are exactly the same
        "no-sequences": 2, // disallow use of the comma operator
        "no-throw-literal": 2, // restrict what can be thrown as an exception
        "no-unmodified-loop-condition": 2, // disallow unmodified conditions of loops
        "no-unused-expressions": 2, // disallow usage of expressions in statement position
        "no-unused-labels": 2, // disallow unused labels
        "no-useless-call": 2, // disallow unnecessary .call() and .apply()
        "no-useless-concat": 2, // disallow unnecessary concatenation of literals or template literals
        "no-void": 2, // disallow use of the void operator
        "no-warning-comments": 1, // disallow usage of configurable warning terms in comments e.g. TODO or FIXME
        "no-with": 2, // disallow use of the with statement
        "radix": 2, // require use of the second argument for parseInt()
        "vars-on-top": 2, // require declaration of all vars at the top of their containing scope
        "wrap-iife": 2, // require immediate function invocation to be wrapped in parentheses
        "yoda": 2, // require or disallow Yoda conditions

        // strict mode
        "strict": 0, // controls location of Use Strict Directives

        // variables
        "init-declarations": 0, // enforce or disallow variable initializations at definition
        "no-catch-shadow": 2, // disallow the catch clause parameter name being the same as a variable in the outer scope
        "no-delete-var": 2, // disallow deletion of variables
        "no-label-var": 2, // disallow labels that share a name with a variable
        "no-shadow-restricted-names": 2, // disallow shadowing of names such as arguments
        "no-shadow": 2, // disallow declaration of variables already declared in the outer scope
        "no-undef-init": 2, // disallow use of undefined when initializing variables
        "no-undef": 2, // disallow use of undeclared variables unless mentioned in a /*global */ block
        "no-undefined": 2, // disallow use of undefined variable
        "no-unused-vars": 2, // disallow declaration of variables that are not used in the code
        "no-use-before-define": 2, // disallow use of variables before they are defined

        // nodejs and commonjs
        "callback-return": 2, // enforce return after a callback
        "global-require": 2, // enforce require() on top-level module scope
        "handle-callback-err": 2, // enforce error handling in callbacks
        "no-mixed-requires": 2, // disallow mixing regular variable and require declarations
        "no-new-require": 2, // disallow use of new operator with the require function
        "no-path-concat": 2, // disallow string concatenation with __dirname and __filename
        "no-process-exit": 2, // disallow process.exit()
        "no-restricted-imports": 0, // restrict usage of specified node imports
        "no-restricted-modules": 0, // restrict usage of specified node modules
        "no-sync": 2, // disallow use of synchronous methods

        // stylictic issues
        "array-bracket-spacing": 2, // enforce spacing inside array brackets
        "block-spacing": 2, // disallow or enforce spaces inside of single line blocks
        "brace-style": 2, // enforce one true brace style
        "camelcase": 2, // require camel case names
        "comma-spacing": 2, // enforce spacing before and after comma
        "comma-style": 2, // enforce one true comma style
        "computed-property-spacing": 2, // require or disallow padding inside computed properties
        "consistent-this": 2, // enforce consistent naming when capturing the current execution context
        "eol-last": 2, // enforce newline at the end of file, with no multiple empty lines
        "func-names": 0, // require function expressions to have a name
        "func-style": [1, "declaration"], // enforce use of function declarations or expressions
        "id-length": 0, // this option enforces minimum and maximum identifier lengths (variable names, property names etc.)
        "id-match": 2, // require identifiers to match the provided regular expression
        "id-blacklist": 0, // blacklist certain identifiers to prevent them being used
        "indent": 0, // specify tab or space width for your code
        "jsx-quotes": 2, // specify whether double or single quotes should be used in JSX attributes
        "key-spacing": 2, // enforce spacing between keys and values in object literal properties
        "keyword-spacing": 2, // enforce spacing before and after keywords
        "linebreak-style": 0, // disallow mixed 'LF' and 'CRLF' as linebreaks
        "lines-around-comment": 2, // enforce empty lines around comments
        "max-depth": 2, // specify the maximum depth that blocks can be nested
        "max-len": [1, 120], // specify the maximum length of a line in your program
        "max-nested-callbacks": 2, // specify the maximum depth callbacks can be nested
        "max-params": [2, 5], // limits the number of parameters that can be used in the function declaration.
        "max-statements": [1, 50], // specify the maximum number of statement allowed in a function
        "new-cap": 2, // require a capital letter for constructors
        "new-parens": 2, // disallow the omission of parentheses when invoking a constructor with no arguments
        "newline-after-var": 2, // require or disallow an empty newline after variable declarations
        "newline-per-chained-call": 0, // enforce newline after each call when chaining the calls
        "no-array-constructor": 2, // disallow use of the Array constructor
        "no-bitwise": 0, // disallow use of bitwise operators
        "no-continue": 2, // disallow use of the continue statement
        "no-inline-comments": 0, // disallow comments inline after code
        "no-lonely-if": 2, // disallow if as the only statement in an else block
        "no-mixed-spaces-and-tabs": 2, // disallow mixed spaces and tabs for indentation
        "no-multiple-empty-lines": 2, // disallow multiple empty lines
        "no-negated-condition": 2, // disallow negated conditions
        "no-nested-ternary": 2, // disallow nested ternary expressions
        "no-new-object": 2, // disallow the use of the Object constructor
        "no-plusplus": 0, // disallow use of unary operators, ++ and --
        "no-restricted-syntax": 2, // disallow use of certain syntax in code
        "no-spaced-func": 2, // disallow space between function identifier and application
        "no-ternary": 0, // disallow the use of ternary operators
        "no-trailing-spaces": 2, // disallow trailing whitespace at the end of lines
        "no-underscore-dangle": 2, // disallow dangling underscores in identifiers
        "no-unneeded-ternary": 2, // disallow the use of ternary operators when a simpler alternative exists
        "object-curly-spacing": 2, // require or disallow padding inside curly braces
        "one-var": 0, // require or disallow one variable declaration per function
        "one-var-declaration-per-line": 2, // require or disallow an newline around variable declarations
        "operator-assignment": 2, // require assignment operator shorthand where possible or prohibit it entirely
        "operator-linebreak": 2, // enforce operators to be placed before or after line breaks
        "padded-blocks": 0, // enforce padding within blocks
        "quote-props": 0, // require quotes around object literal property names
        "quotes": [1, "single"], // specify whether backticks, double or single quotes should be used
        "require-jsdoc": 0, // Require JSDoc comment
        "semi-spacing": 2, // enforce spacing before and after semicolons
        "semi": 2, // require or disallow use of semicolons instead of ASI
        "sort-vars": 2, // sort variables within the same declaration block
        "space-before-blocks": 2, // require or disallow a space before blocks
        "space-before-function-paren": 0, // require or disallow a space before function opening parenthesis
        "space-in-parens": 2, // require or disallow spaces inside parentheses
        "space-infix-ops": 2, // require spaces around operators
        "space-unary-ops": 2, // require or disallow spaces before/after unary operators
        "spaced-comment": 2, // require or disallow a space immediately following the // or /* in a comment
        "wrap-regex": 2, // require regex literals to be wrapped in parentheses

        // ecmascript 6
        "arrow-body-style": 2, // require braces in arrow function body
        "arrow-parens": 2, // require parens in arrow function arguments
        "arrow-spacing": 2, // require space before/after arrow function's arrow 
        "constructor-super": 2, // verify calls of super() in constructors
        "generator-star-spacing": 2, // enforce spacing around the * in generator functions
        "no-class-assign": 2, // disallow modifying variables of class declarations
        "no-confusing-arrow": 2, // disallow arrow functions where they could be confused with comparisons
        "no-const-assign": 2, // disallow modifying variables that are declared using const
        "no-dupe-class-members": 2, // disallow duplicate name in class members
        "no-this-before-super": 2, // disallow use of this/super before calling super() in constructors.
        "no-var": 2, // require let or const instead of var
        "object-shorthand": 2, // require method and property shorthand syntax for object literals
        "prefer-arrow-callback": 2, // suggest using arrow functions as callbacks
        "prefer-const": 2, // suggest using const declaration for variables that are never modified after declared
        "prefer-reflect": 0, // suggest using Reflect methods where applicable
        "prefer-rest-params": 2, // suggest using the rest parameters instead of arguments
        "prefer-spread": 2, // suggest using the spread operator instead of .apply().
        "prefer-template": 2, // suggest using template literals instead of strings concatenation
        "require-yield": 2, // disallow generator functions that do not have yield
        "template-curly-spacing": 2, // enforce spacing around embedded expressions of template strings
        "yield-star-spacing": 2 // enforce spacing around the * in yield* expressions
    }
};
