const Provider = require("../../core/provider");

class LexerProvider extends Provider {

    constructor() {
        super("lexer");
    }

    async lex(lines) {
        throw new Error("lex() must be implemented.");
    }

}

module.exports = LexerProvider;
