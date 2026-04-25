/*
 [The "BSD licence"]
 Copyright (c) 2020 Kevin Jones
 All rights reserved.

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

 THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
 IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import { readdir } from "node:fs/promises";
import { lstatSync, readFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { CharStream, CommonTokenStream } from "antlr4";
import VFLexer from "./antlr/VFLexer.js";
import VFParser from "./antlr/VFParser.js";
import { ThrowingErrorListener } from "./ThrowingErrorListener.js";

export * from "./ThrowingErrorListener.js";
export * from "./antlr/VFParser.js";
export { default as VFLexer } from "./antlr/VFLexer.js";
export { default as VFParser } from "./antlr/VFParser.js";
export { default as VFParserListener } from "./antlr/VFParserListener.js";
export { default as VFParserVisitor } from "./antlr/VFParserVisitor.js";

export async function check(): Promise<void> {
  const path = resolve(process.argv[1] || process.cwd());

  const files = await listFiles(path);
  let parsedCount = 0;
  files
    .filter(name => name.endsWith(".page"))
    .forEach(file => {
      if (lstatSync(file).isFile()) {
        const content = readFileSync(file).toString();
        const lexer = new VFLexer(new CharStream(content));
        const tokens = new CommonTokenStream(lexer);

        const parser = new VFParser(tokens);
        parser.removeErrorListeners();
        parser.addErrorListener(new ThrowingErrorListener());
        try {
          parser.vfUnit();
        } catch (err) {
          console.log(`Error parsing ${file}`);
          console.log(err);
        }
        parsedCount += 1;
      }
    });
  console.log(`Parsed ${parsedCount} files`);
}

async function listFiles(path: string): Promise<string[]> {
  const dirent = await readdir(path, {
    withFileTypes: true,
    recursive: true,
  });
  return dirent.reduce<string[]>((files, ent) => {
    if (ent.isFile() && extname(ent.name) === ".page") {
      files.push(join(ent.parentPath, ent.name));
    }
    return files;
  }, []);
}
