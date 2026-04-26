/*
 Copyright (c) 2022 Kevin Jones, All rights reserved.
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions
 are met:
 1. Redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer.
 2. Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.
 3. The name of the author may not be used to endorse or promote products
    derived from this software without specific prior written permission.
 */

/*
 * These are just smoke tests.
 */
import { CharStream, CommonTokenStream } from "antlr4";
import VFLexer from "../src/antlr/VFLexer.js";
import VFParser, {
  ElementContext,
  VfUnitContext,
} from "../src/antlr/VFParser.js";
import {
  SyntaxException,
  ThrowingErrorListener,
} from "../src/ThrowingErrorListener.js";

test("Single element page", () => {
  const lexer = new VFLexer(new CharStream("<apex:page/>"));
  const tokens = new CommonTokenStream(lexer);

  const parser = new VFParser(tokens);
  const context = parser.vfUnit();

  expect(context).toBeInstanceOf(VfUnitContext);
  expect(context.element()).toBeInstanceOf(ElementContext);
});

test("Broken page", () => {
  const lexer = new VFLexer(new CharStream("<apex:page"));
  const tokens = new CommonTokenStream(lexer);

  const parser = new VFParser(tokens);
  parser.removeErrorListeners();
  parser.addErrorListener(new ThrowingErrorListener());
  try {
    parser.vfUnit();
    expect(true).toBe(false);
  } catch (ex) {
    expect(ex).toBeInstanceOf(SyntaxException);
    const err = ex as SyntaxException;
    expect(err.message).toEqual("no viable alternative at input '<apex:page'");
    expect(err.line).toEqual(1);
    expect(err.column).toEqual(10);
  }
});
