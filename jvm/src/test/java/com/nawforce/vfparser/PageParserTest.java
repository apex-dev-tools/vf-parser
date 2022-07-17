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
package com.nawforce.vfparser;

import org.antlr.v4.runtime.CharStreams;
import org.antlr.v4.runtime.CommonTokenStream;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class PageParserTest {

    @Test
    void testSingleElementPage() {
        VFLexer lexer = new VFLexer(CharStreams.fromString("<apex:page/>"));
        CommonTokenStream tokens  = new CommonTokenStream(lexer);

        VFParser parser = new VFParser(tokens);
        VFParser.VfUnitContext context = parser.vfUnit();

        assertNotNull(context);
        assertNotNull(context.element());
    }

    @Test
    void testBrokenPage() {
        VFLexer lexer = new VFLexer(CharStreams.fromString("<apex:page"));
        CommonTokenStream tokens = new CommonTokenStream(lexer);

        VFParser parser = new VFParser(tokens);
        parser.removeErrorListeners();
        parser.addErrorListener(new ThrowingErrorListener());
        try {
            parser.vfUnit();
            assert (false);
        } catch (SyntaxException ex) {
            assertEquals(ex.message, "no viable alternative at input '<apex:page'");
            assert(ex.line == 1);
            assert(ex.column == 10);
        }
    }
}
