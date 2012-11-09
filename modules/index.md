---
layout: default
title: Modules
---
This is a list of official [OmniBot modules](https://github.com/mloberg/OmniBot-Modules). If you have written a module and feel it should be included in the official list, please open a [pull request](https://github.com/mloberg/OmniBot-Modules/pull/new/master).

#### [aws](https://github.com/mloberg/OmniBot-Modules/blob/master/src/modules/aws.coffee)

Retrieve the status of AWS services.

##### Dependencies

* "yql": "0.4.7"

##### Configuration

* **aws_services** - Array of service names

##### Commands

* omnibot aws status

##### Author

* [mloberg](http://mlo.io/)

#### [hackernews](https://github.com/mloberg/OmniBot-Modules/blob/master/src/modules/hackernews.coffee)

Retrieve the top stories from Hacker News.

##### Dependencies

* "sax": "0.4.2"

##### Configuration

* none

##### Commands

* omnibot HN [&lt;count>]

##### Author

* [mloberg](http://mlo.io/)

#### [join](https://github.com/mloberg/OmniBot-Modules/blob/master/src/modules/join.coffee)

Say hello to users as they join.

##### Dependencies

* none

##### Configuration

* none

##### Commands

* none

##### Author

* [mloberg](http://mlo.io/)

#### [joke](https://github.com/mloberg/OmniBot-Modules/blob/master/src/modules/joke.coffee)

Tell some jokes.

##### Dependencies

* none

##### Configuration

* none

##### Commands

* omnibot joke

##### Author

* [mloberg](http://mlo.io/)

#### [weather](https://github.com/mloberg/OmniBot-Modules/blob/master/src/modules/weather.coffee)

Retrieve the weather.

##### Dependencies

* none

##### Configuration

* **weather_zip** - Zip code to get weather for

##### Commands

* omnibot forecast [&lt;city>] - Get the Forecast
* omnibot weather [&lt;city>] - Get the current conditions

##### Author

* [mloberg](http://mlo.io/)

