var Assert = Y.Assert,

    suite = new Y.Test.Suite("Plugin.DataSourceCache Test Suite");


suite.add(new Y.Test.Case({
    name: "DataSource Caching Tests",

    setUp: function () {
        this.ds = new Y.DataSource.Local({ source: ["a","b","c","d"] });
    },

    testCacheDefaultMax: function() {
        this.ds.plug(Y.Plugin.DataSourceCache);
        Assert.isInstanceOf(Y.Cache, this.ds.cache, "Expected Cache instance.");
        Assert.areSame(0, this.ds.cache.get("max"), "Expected 0 max in Cache.");
    },

    testCacheInitMax: function() {
        this.ds.plug(Y.Plugin.DataSourceCache, { max: 3 });
        Assert.isInstanceOf(Y.Cache, this.ds.cache, "Expected Cache instance.");
        Assert.areSame(3, this.ds.cache.get("max"), "Expected 3 max in Cache.");
    },

    testCacheSetMax: function() {
        this.ds.plug(Y.Plugin.DataSourceCache);
        this.ds.cache.set("max", 5);
        Assert.isInstanceOf(Y.Cache, this.ds.cache, "Expected Cache instance.");
        Assert.areSame(5, this.ds.cache.get("max"), "Expected 5 max in Cache.");
    },
    
    testLocalCache: function() {
        var cached;

        this.ds.plug(Y.Plugin.DataSourceCache, { max: 3 });

        this.ds.sendRequest({ request: "a" });

        this.ds.sendRequest({
            request: "a",
            callback: {
                success: function (e) {
                    cached = e.cached;
                }
            }
        });

        Assert.isInstanceOf(Date, cached);
    },

    testLocalCacheUnplug: function() {
        var cached;

        this.ds.plug(Y.Plugin.DataSourceCache, { max: 3 });

        this.ds.sendRequest({ request: "a" });

        this.ds.sendRequest({
            request: "a",
            callback: {
                success: function (e) {
                    cached = e.cached;
                }
            }
        });

        Assert.isInstanceOf(Date, cached);

        this.ds.unplug(Y.Plugin.DataSourceCache);

        Assert.isUndefined(this.ds.cache);

        this.ds.sendRequest({
            request: "a",
            callback: {
                success: function (e) {
                    cached = e.cached;
                }
            }
        });

        Assert.isUndefined(cached);
    }
}));

Y.Test.Runner.add(suite);
