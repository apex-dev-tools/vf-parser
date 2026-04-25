parser grammar VFParser;
options { tokenVocab = VFLexer; }

@parser::members {
public void clearCache() { _interp.clearDFA(); }
}

import BaseVFParser;
