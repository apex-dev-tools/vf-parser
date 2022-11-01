# vf-parser

Parser for Salesforce Visualforce. This is based on an [ANTLR4](https://www.antlr.org/) grammar, see antlr/ApexParser.g4.

There are two builds of the parser available, a NPM module for use with Node and a Maven package for use on JVMs.

These builds just contain the Parser & Lexer and provides no further support for analysing the generated parse trees beyond what is provided by ANTLR4.

## Example

To parse a page file (NPM version):

    let lexer = new VFLexer(CharStreams.fromString("<apex:page/>"));
    let tokens = new CommonTokenStream(lexer);

    let parser = new VFParser(tokens);
    let context = parser.vfUnit();

The 'context' is a VfUnitContext object which is the root of the parsed representation of the page. You can access the parse tree via functions on it.

## Packages

Maven

    <dependency>
        <groupId>io.github.apex-dev-tools</groupId>
        <artifactId>vf-parser</artifactId>
        <version>1.0.0</version>
    </dependency>

NPM

    "@apexdevtools/vf-parser": "^1.0.0"

## Building

To build both distributions:

    npm run build

## History

    1.0.0 - Initial version, Move to @apexdevtools/vf-parser

## Source & Licenses

All the source code included uses a 3-clause BSD license.
