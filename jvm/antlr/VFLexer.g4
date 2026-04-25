lexer grammar VFLexer;

@lexer::members {
public void clearCache() { _interp.clearDFA(); }
}

import BaseVFLexer;
