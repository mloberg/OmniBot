var should = require("should"),
	settings = require('./settings'),
	OmniBot = require('../lib/robot'),
	irc = require("irc");

function testConfigAccess(bot) {
	if (bot.config.moduleConfigOpt === "some config option") return true;
	return false;
}

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

describe("Helpers", function() {
	var helpers = OmniBot.helpers;
	it("should make GET request", function(done) {
		helpers.request({
			url: 'http://google.com/',
			onSuccess: function(resp) {
				resp.should.not.be.empty;
				done();
			}
		});
	});

	it("should make secure GET request", function(done) {
		helpers.get({
			url: "https://github.com/mloberg/OmniBot",
			onSuccess: function(resp) {
				resp.should.not.be.empty;
				done();
			}
		});
	});

	it("should request json", function(done) {
		helpers.getJSON({
			url: 'https://api.github.com/repos/mloberg/OmniBot',
			onSuccess: function(resp) {
				resp.name.should.equal("OmniBot");
				done();
			}
		});
	});
});

describe("IRC Bot", function() {
	var bot = new OmniBot.Bot("OmniBotTester", "irc", { server: settings.server, channels: ['#omnibot'] });
		listener = new irc.Client(settings.server, "OmniBotListener", { channels: [ '#omnibot' ] });

	// tests

	it("can boot up", function(done) {
		bot.boot(function() {
			done();
		});
	});

	it("can talk", function(done) {
		listener.addListener('message#omnibot', function(from, text, msg) {
			if (from === "OmniBotTester" && text === "Test from OmniBot") {
				done();
			}
		});
		bot.say('#omnibot', "Test from OmniBot");
	});

	it("can send private messages", function(done) {
		listener.addListener('pm', function(from, text, msg) {
			if (from == "OmniBotTester" && text === "Private message test") {
				done();
			}
		});
		bot.say('OmniBotListener', 'Private message test');
	});

	it("can access connection class", function(done) {
		bot.connection.client.should.be.an.instanceOf(irc.Client);
		done();
	});

	it("can access config options", function(done) {
		bot.config.test = true;
		bot.config.test.should.be.true;
		bot.config.moduleConfigOpt = "some config option";
		testConfigAccess(bot).should.be.true;
		done();
	});

	describe("Modules", function() {
		it("shouldn't respond to anything", function() {
			bot.respondsTo('module test').should.be.false;
			bot.respondsTo('foo').should.be.false;
		});

		it("loads one module", function(done) {
			var module = bot.loadModule('test/module');
			bot.respondsTo('module test').should.be.true;
			done();
		});

		it("loads directory of modules", function(done) {
			bot.loadModules('test/modules');
			bot.respondsTo('foo').should.be.true;
			done();
		});

		it("should listen and respond", function(done) {
			listener.addListener('message#omnibot', function(from, text, msg) {
				if (from === "OmniBotTester" && text === "bar") {
					done();
				}
			});
			bot.listen();
			listener.say('#omnibot', 'foo');
		});

		it("should display help", function(done) {
			listener.addListener('message#omnibot', function(from, text, msg) {
				if (from === "OmniBotTester" && text.match(/I respond to the following commands/)) {
					done();
				}
			});
			listener.say('#omnibot', 'OmniBotTester: help');
		});

		it("should display detailed help", function(done) {
			listener.addListener('message#omnibot', function(from, text, msg) {
				if (from === "OmniBotTester" && text === "test: Help description.") {
					done();
				}
			});
			listener.say('#omnibot', 'OmniBotTester: help test');
		});
	});

});
