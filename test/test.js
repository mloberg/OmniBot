var should = require("should"),
	OmniBot = require('../lib/robot');

describe("Bot", function() {
	var bot;
	beforeEach(function(done) {
		bot = new OmniBot.Bot("TestingBot", "irc", {});
		done();
	});
	afterEach(function(done) {
		done();
	});

	// tests

	it("throws an error for unknown connectors", function(done) {
		(function() {
			new OmniBot.Bot("NoBot", "no_connector", {});
		}).should.throw();
		done();
	});
	it("has the same name", function(done) {
		bot.name.should.equal("TestingBot");
		done();
	});

});

describe("IRC Bot", function() {
	var bot;
	beforeEach(function(done) {
		bot = new OmniBot.Bot("TestingBot", "irc", { server: 'irc.freenode.net', channels: [ '#omnibot_tests' ] });
		done();
	});
	afterEach(function(done) {
		done();
	});

	// tests

	it("boots up", function(done) {
		bot.boot(function() {
			done();
		});
	});
});
