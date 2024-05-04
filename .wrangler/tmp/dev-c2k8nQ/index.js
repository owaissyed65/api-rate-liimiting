var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __require = /* @__PURE__ */ ((x2) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x2, {
  get: (a2, b2) => (typeof require !== "undefined" ? require : a2)[b2]
}) : x2)(function(x2) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x2 + '" is not supported');
});
var __esm = (fn2, res) => function __init() {
  return fn2 && (res = (0, fn2[__getOwnPropNames(fn2)[0]])(fn2 = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// .wrangler/tmp/bundle-lfPU2l/checked-fetch.js
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
var urls;
var init_checked_fetch = __esm({
  ".wrangler/tmp/bundle-lfPU2l/checked-fetch.js"() {
    "use strict";
    urls = /* @__PURE__ */ new Set();
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        const [request, init] = argArray;
        checkURL(request, init);
        return Reflect.apply(target, thisArg, argArray);
      }
    });
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// node_modules/@upstash/core-analytics/dist/index.js
var require_dist = __commonJS({
  "node_modules/@upstash/core-analytics/dist/index.js"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var g2 = Object.defineProperty;
    var k2 = Object.getOwnPropertyDescriptor;
    var _2 = Object.getOwnPropertyNames;
    var w2 = Object.prototype.hasOwnProperty;
    var y2 = (l2, e2) => {
      for (var t2 in e2)
        g2(l2, t2, { get: e2[t2], enumerable: true });
    };
    var A2 = (l2, e2, t2, n) => {
      if (e2 && typeof e2 == "object" || typeof e2 == "function")
        for (let r of _2(e2))
          !w2.call(l2, r) && r !== t2 && g2(l2, r, { get: () => e2[r], enumerable: !(n = k2(e2, r)) || n.enumerable });
      return l2;
    };
    var v2 = (l2) => A2(g2({}, "__esModule", { value: true }), l2);
    var x2 = {};
    y2(x2, { Analytics: () => p });
    module.exports = v2(x2);
    var b2 = `
local key = KEYS[1]
local field = ARGV[1]

local data = redis.call("ZRANGE", key, 0, -1, "WITHSCORES")
local count = {}

for i = 1, #data, 2 do
  local json_str = data[i]
  local score = tonumber(data[i + 1])
  local obj = cjson.decode(json_str)

  local fieldValue = obj[field]

  if count[fieldValue] == nil then
    count[fieldValue] = score
  else
    count[fieldValue] = count[fieldValue] + score
  end
end

local result = {}
for k, v in pairs(count) do
  table.insert(result, {k, v})
end

return result
`;
    var f2 = `
local prefix = KEYS[1]
local first_timestamp = tonumber(ARGV[1])
local increment = tonumber(ARGV[2])
local num_timestamps = tonumber(ARGV[3])
local num_elements = tonumber(ARGV[4])

local keys = {}
for i = 1, num_timestamps do
  local timestamp = first_timestamp - (i - 1) * increment
  table.insert(keys, prefix .. ":" .. timestamp)
end

-- get the union of the groups
local zunion_params = {"ZUNION", num_timestamps, unpack(keys)}
table.insert(zunion_params, "WITHSCORES")
local result = redis.call(unpack(zunion_params))

-- select num_elements many items
local true_group = {}
local false_group = {}
local true_count = 0
local false_count = 0
local i = #result - 1

-- iterate over the results
while (true_count + false_count) < (num_elements * 2) and 1 <= i do
  local score = tonumber(result[i + 1])
  if score > 0 then
    local element = result[i]
    if string.find(element, "success\\":true") and true_count < num_elements then
      table.insert(true_group, {score, element})
      true_count = true_count + 1
    elseif string.find(element, "success\\":false") and false_count < num_elements then
      table.insert(false_group, {score, element})
      false_count = false_count + 1
    end
  end
  i = i - 2
end

return {true_group, false_group}
`;
    var h2 = `
local prefix = KEYS[1]
local first_timestamp = tonumber(ARGV[1])
local increment = tonumber(ARGV[2])
local num_timestamps = tonumber(ARGV[3])

local keys = {}
for i = 1, num_timestamps do
  local timestamp = first_timestamp - (i - 1) * increment
  table.insert(keys, prefix .. ":" .. timestamp)
end

-- get the union of the groups
local zunion_params = {"ZUNION", num_timestamps, unpack(keys)}
table.insert(zunion_params, "WITHSCORES")
local result = redis.call(unpack(zunion_params))

return result
`;
    var p = class {
      redis;
      prefix;
      bucketSize;
      retention;
      constructor(e2) {
        this.redis = e2.redis, this.prefix = e2.prefix ?? "@upstash/analytics", this.bucketSize = this.parseWindow(e2.window), this.retention = e2.retention ? this.parseWindow(e2.retention) : void 0;
      }
      validateTableName(e2) {
        if (!/^[a-zA-Z0-9_-]+$/.test(e2))
          throw new Error(`Invalid table name: ${e2}. Table names can only contain letters, numbers, dashes and underscores.`);
      }
      parseWindow(e2) {
        if (typeof e2 == "number") {
          if (e2 <= 0)
            throw new Error(`Invalid window: ${e2}`);
          return e2;
        }
        let t2 = /^(\d+)([smhd])$/;
        if (!t2.test(e2))
          throw new Error(`Invalid window: ${e2}`);
        let [, n, r] = e2.match(t2), i = parseInt(n);
        switch (r) {
          case "s":
            return i * 1e3;
          case "m":
            return i * 1e3 * 60;
          case "h":
            return i * 1e3 * 60 * 60;
          case "d":
            return i * 1e3 * 60 * 60 * 24;
          default:
            throw new Error(`Invalid window unit: ${r}`);
        }
      }
      getBucket(e2) {
        let t2 = e2 ?? Date.now();
        return Math.floor(t2 / this.bucketSize) * this.bucketSize;
      }
      async ingest(e2, ...t2) {
        this.validateTableName(e2), await Promise.all(t2.map(async (n) => {
          let r = this.getBucket(n.time), i = [this.prefix, e2, r].join(":");
          await this.redis.zincrby(i, 1, JSON.stringify({ ...n, time: void 0 }));
        }));
      }
      formatBucketAggregate(e2, t2, n) {
        let r = {};
        return e2.forEach(([i, s]) => {
          t2 == "success" && (i = i == "1" ? "true" : "false"), r[t2] = r[t2] || {}, r[t2][i] = s;
        }), { time: n, ...r };
      }
      async aggregateBucket(e2, t2, n) {
        this.validateTableName(e2);
        let r = this.getBucket(n), i = [this.prefix, e2, r].join(":"), s = await this.redis.eval(b2, [i], [t2]);
        return this.formatBucketAggregate(s, t2, r);
      }
      async aggregateBuckets(e2, t2, n, r) {
        this.validateTableName(e2);
        let i = this.getBucket(r), s = [];
        for (let o = 0; o < n; o += 1)
          s.push(this.aggregateBucket(e2, t2, i)), i = i - this.bucketSize;
        return Promise.all(s);
      }
      async aggregateBucketsWithPipeline(e2, t2, n, r, i) {
        this.validateTableName(e2), i = i ?? 48;
        let s = this.getBucket(r), o = [], a2 = this.redis.pipeline(), u2 = [];
        for (let c = 1; c <= n; c += 1) {
          let d = [this.prefix, e2, s].join(":");
          a2.eval(b2, [d], [t2]), o.push(s), s = s - this.bucketSize, (c % i == 0 || c == n) && (u2.push(a2.exec()), a2 = this.redis.pipeline());
        }
        return (await Promise.all(u2)).flat().map((c, d) => this.formatBucketAggregate(c, t2, o[d]));
      }
      async getAllowedBlocked(e2, t2, n) {
        this.validateTableName(e2);
        let r = [this.prefix, e2].join(":"), i = this.getBucket(n), s = await this.redis.eval(h2, [r], [i, this.bucketSize, t2]), o = {};
        for (let a2 = 0; a2 < s.length; a2 += 2) {
          let u2 = s[a2], m = u2.identifier, c = +s[a2 + 1];
          o[m] || (o[m] = { success: 0, blocked: 0 }), o[m][u2.success ? "success" : "blocked"] = c;
        }
        return o;
      }
      async getMostAllowedBlocked(e2, t2, n, r) {
        this.validateTableName(e2);
        let i = [this.prefix, e2].join(":"), s = this.getBucket(r), [o, a2] = await this.redis.eval(f2, [i], [s, this.bucketSize, t2, n]);
        return { allowed: this.toDicts(o), blocked: this.toDicts(a2) };
      }
      toDicts(e2) {
        let t2 = [];
        for (let n = 0; n < e2.length; n += 1) {
          let r = +e2[n][0], i = e2[n][1];
          t2.push({ identifier: i.identifier, count: r });
        }
        return t2;
      }
    };
  }
});

// node_modules/@upstash/ratelimit/dist/index.js
var require_dist2 = __commonJS({
  "node_modules/@upstash/ratelimit/dist/index.js"(exports, module) {
    "use strict";
    init_checked_fetch();
    init_modules_watch_stub();
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var src_exports = {};
    __export(src_exports, {
      Analytics: () => Analytics2,
      MultiRegionRatelimit: () => MultiRegionRatelimit,
      Ratelimit: () => RegionRatelimit
    });
    module.exports = __toCommonJS(src_exports);
    var import_core_analytics = require_dist();
    var Analytics2 = class {
      analytics;
      table = "events";
      constructor(config) {
        this.analytics = new import_core_analytics.Analytics({
          // @ts-expect-error we need to fix the types in core-analytics, it should only require the methods it needs, not the whole sdk
          redis: config.redis,
          window: "1h",
          prefix: config.prefix ?? "@upstash/ratelimit",
          retention: "90d"
        });
      }
      /**
       * Try to extract the geo information from the request
       *
       * This handles Vercel's `req.geo` and  and Cloudflare's `request.cf` properties
       * @param req
       * @returns
       */
      extractGeo(req) {
        if (typeof req.geo !== "undefined") {
          return req.geo;
        }
        if (typeof req.cf !== "undefined") {
          return req.cf;
        }
        return {};
      }
      async record(event) {
        await this.analytics.ingest(this.table, event);
      }
      async series(filter, cutoff) {
        const timestampCount = Math.min(
          (this.analytics.getBucket(Date.now()) - this.analytics.getBucket(cutoff)) / (60 * 60 * 1e3),
          256
        );
        return this.analytics.aggregateBucketsWithPipeline(this.table, filter, timestampCount);
      }
      async getUsage(cutoff = 0) {
        const timestampCount = Math.min(
          (this.analytics.getBucket(Date.now()) - this.analytics.getBucket(cutoff)) / (60 * 60 * 1e3),
          256
        );
        const records = await this.analytics.getAllowedBlocked(this.table, timestampCount);
        return records;
      }
      async getUsageOverTime(timestampCount, groupby) {
        const result = await this.analytics.aggregateBucketsWithPipeline(this.table, groupby, timestampCount);
        return result;
      }
      async getMostAllowedBlocked(timestampCount, getTop) {
        getTop = getTop ?? 5;
        return this.analytics.getMostAllowedBlocked(this.table, timestampCount, getTop);
      }
    };
    var Cache = class {
      /**
       * Stores identifier -> reset (in milliseconds)
       */
      cache;
      constructor(cache2) {
        this.cache = cache2;
      }
      isBlocked(identifier) {
        if (!this.cache.has(identifier)) {
          return { blocked: false, reset: 0 };
        }
        const reset = this.cache.get(identifier);
        if (reset < Date.now()) {
          this.cache.delete(identifier);
          return { blocked: false, reset: 0 };
        }
        return { blocked: true, reset };
      }
      blockUntil(identifier, reset) {
        this.cache.set(identifier, reset);
      }
      set(key, value) {
        this.cache.set(key, value);
      }
      get(key) {
        return this.cache.get(key) || null;
      }
      incr(key) {
        let value = this.cache.get(key) ?? 0;
        value += 1;
        this.cache.set(key, value);
        return value;
      }
      pop(key) {
        this.cache.delete(key);
      }
      empty() {
        this.cache.clear();
      }
    };
    function ms(d) {
      const match = d.match(/^(\d+)\s?(ms|s|m|h|d)$/);
      if (!match) {
        throw new Error(`Unable to parse window size: ${d}`);
      }
      const time = Number.parseInt(match[1]);
      const unit = match[2];
      switch (unit) {
        case "ms":
          return time;
        case "s":
          return time * 1e3;
        case "m":
          return time * 1e3 * 60;
        case "h":
          return time * 1e3 * 60 * 60;
        case "d":
          return time * 1e3 * 60 * 60 * 24;
        default:
          throw new Error(`Unable to parse window size: ${d}`);
      }
    }
    var fixedWindowLimitScript = `
	local key           = KEYS[1]
	local id            = ARGV[1]
	local window        = ARGV[2]
	local incrementBy   = tonumber(ARGV[3])

	redis.call("HSET", key, id, incrementBy)
	local fields = redis.call("HGETALL", key)
	if #fields == 2 and tonumber(fields[2])==incrementBy then
	-- The first time this key is set, and the value will be equal to incrementBy.
	-- So we only need the expire command once
	  redis.call("PEXPIRE", key, window)
	end

	return fields
`;
    var fixedWindowRemainingTokensScript = `
      local key = KEYS[1]
      local tokens = 0

      local fields = redis.call("HGETALL", key)

      return fields
    `;
    var slidingWindowLimitScript = `
	local currentKey    = KEYS[1]           -- identifier including prefixes
	local previousKey   = KEYS[2]           -- key of the previous bucket
	local tokens        = tonumber(ARGV[1]) -- tokens per window
	local now           = ARGV[2]           -- current timestamp in milliseconds
	local window        = ARGV[3]           -- interval in milliseconds
	local requestId     = ARGV[4]           -- uuid for this request
	local incrementBy   = tonumber(ARGV[5]) -- custom rate, default is  1

	local currentFields = redis.call("HGETALL", currentKey)
	local requestsInCurrentWindow = 0
	for i = 2, #currentFields, 2 do
	requestsInCurrentWindow = requestsInCurrentWindow + tonumber(currentFields[i])
	end

	local previousFields = redis.call("HGETALL", previousKey)
	local requestsInPreviousWindow = 0
	for i = 2, #previousFields, 2 do
	requestsInPreviousWindow = requestsInPreviousWindow + tonumber(previousFields[i])
	end

	local percentageInCurrent = ( now % window) / window
	if requestsInPreviousWindow * (1 - percentageInCurrent ) + requestsInCurrentWindow >= tokens then
	  return {currentFields, previousFields, false}
	end

	redis.call("HSET", currentKey, requestId, incrementBy)

	if requestsInCurrentWindow == 0 then 
	  -- The first time this key is set, the value will be equal to incrementBy.
	  -- So we only need the expire command once
	  redis.call("PEXPIRE", currentKey, window * 2 + 1000) -- Enough time to overlap with a new window + 1 second
	end
	return {currentFields, previousFields, true}
`;
    var slidingWindowRemainingTokensScript = `
	local currentKey    = KEYS[1]           -- identifier including prefixes
	local previousKey   = KEYS[2]           -- key of the previous bucket
	local now         	= ARGV[1]           -- current timestamp in milliseconds
  	local window      	= ARGV[2]           -- interval in milliseconds

	local currentFields = redis.call("HGETALL", currentKey)
	local requestsInCurrentWindow = 0
	for i = 2, #currentFields, 2 do
	requestsInCurrentWindow = requestsInCurrentWindow + tonumber(currentFields[i])
	end

	local previousFields = redis.call("HGETALL", previousKey)
	local requestsInPreviousWindow = 0
	for i = 2, #previousFields, 2 do
	requestsInPreviousWindow = requestsInPreviousWindow + tonumber(previousFields[i])
	end

	local percentageInCurrent = ( now % window) / window
  	requestsInPreviousWindow = math.floor(( 1 - percentageInCurrent ) * requestsInPreviousWindow)
	
	return requestsInCurrentWindow + requestsInPreviousWindow
`;
    var resetScript = `
      local pattern = KEYS[1]

      -- Initialize cursor to start from 0
      local cursor = "0"

      repeat
          -- Scan for keys matching the pattern
          local scan_result = redis.call('SCAN', cursor, 'MATCH', pattern)

          -- Extract cursor for the next iteration
          cursor = scan_result[1]

          -- Extract keys from the scan result
          local keys = scan_result[2]

          for i=1, #keys do
          redis.call('DEL', keys[i])
          end

      -- Continue scanning until cursor is 0 (end of keyspace)
      until cursor == "0"
    `;
    var Ratelimit2 = class {
      limiter;
      ctx;
      prefix;
      timeout;
      analytics;
      constructor(config) {
        this.ctx = config.ctx;
        this.limiter = config.limiter;
        this.timeout = config.timeout ?? 5e3;
        this.prefix = config.prefix ?? "@upstash/ratelimit";
        this.analytics = config.analytics ? new Analytics2({
          redis: Array.isArray(this.ctx.redis) ? this.ctx.redis[0] : this.ctx.redis,
          prefix: this.prefix
        }) : void 0;
        if (config.ephemeralCache instanceof Map) {
          this.ctx.cache = new Cache(config.ephemeralCache);
        } else if (typeof config.ephemeralCache === "undefined") {
          this.ctx.cache = new Cache(/* @__PURE__ */ new Map());
        }
      }
      /**
       * Determine if a request should pass or be rejected based on the identifier and previously chosen ratelimit.
       *
       * Use this if you want to reject all requests that you can not handle right now.
       *
       * @example
       * ```ts
       *  const ratelimit = new Ratelimit({
       *    redis: Redis.fromEnv(),
       *    limiter: Ratelimit.slidingWindow(10, "10 s")
       *  })
       *
       *  const { success } = await ratelimit.limit(id)
       *  if (!success){
       *    return "Nope"
       *  }
       *  return "Yes"
       * ```
       *
       * @param req.rate - The rate at which tokens will be added or consumed from the token bucket. A higher rate allows for more requests to be processed. Defaults to 1 token per interval if not specified.
       *
       * Usage with `req.rate`
       * @example
       * ```ts
       *  const ratelimit = new Ratelimit({
       *    redis: Redis.fromEnv(),
       *    limiter: Ratelimit.slidingWindow(100, "10 s")
       *  })
       *
       *  const { success } = await ratelimit.limit(id, {rate: 10})
       *  if (!success){
       *    return "Nope"
       *  }
       *  return "Yes"
       * ```
       */
      limit = async (identifier, req) => {
        const key = [this.prefix, identifier].join(":");
        let timeoutId = null;
        try {
          const arr = [this.limiter().limit(this.ctx, key, req?.rate)];
          if (this.timeout > 0) {
            arr.push(
              new Promise((resolve) => {
                timeoutId = setTimeout(() => {
                  resolve({
                    success: true,
                    limit: 0,
                    remaining: 0,
                    reset: 0,
                    pending: Promise.resolve()
                  });
                }, this.timeout);
              })
            );
          }
          const res = await Promise.race(arr);
          if (this.analytics) {
            try {
              const geo = req ? this.analytics.extractGeo(req) : void 0;
              const analyticsP = this.analytics.record({
                identifier,
                time: Date.now(),
                success: res.success,
                ...geo
              }).catch((err) => {
                let errorMessage = "Failed to record analytics";
                if (`${err}`.includes("WRONGTYPE")) {
                  errorMessage = `
Failed to record analytics. See the information below:

This can occur when you uprade to Ratelimit version 1.1.2
or later from an earlier version.

This occurs simply because the way we store analytics data
has changed. To avoid getting this error, disable analytics
for *an hour*, then simply enable it back.

`;
                }
                console.warn(errorMessage, err);
              });
              res.pending = Promise.all([res.pending, analyticsP]);
            } catch (err) {
              console.warn("Failed to record analytics", err);
            }
          }
          return res;
        } finally {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
        }
      };
      /**
       * Block until the request may pass or timeout is reached.
       *
       * This method returns a promise that resolves as soon as the request may be processed
       * or after the timeout has been reached.
       *
       * Use this if you want to delay the request until it is ready to get processed.
       *
       * @example
       * ```ts
       *  const ratelimit = new Ratelimit({
       *    redis: Redis.fromEnv(),
       *    limiter: Ratelimit.slidingWindow(10, "10 s")
       *  })
       *
       *  const { success } = await ratelimit.blockUntilReady(id, 60_000)
       *  if (!success){
       *    return "Nope"
       *  }
       *  return "Yes"
       * ```
       */
      blockUntilReady = async (identifier, timeout) => {
        if (timeout <= 0) {
          throw new Error("timeout must be positive");
        }
        let res;
        const deadline = Date.now() + timeout;
        while (true) {
          res = await this.limit(identifier);
          if (res.success) {
            break;
          }
          if (res.reset === 0) {
            throw new Error("This should not happen");
          }
          const wait = Math.min(res.reset, deadline) - Date.now();
          await new Promise((r) => setTimeout(r, wait));
          if (Date.now() > deadline) {
            break;
          }
        }
        return res;
      };
      resetUsedTokens = async (identifier) => {
        const pattern = [this.prefix, identifier].join(":");
        await this.limiter().resetTokens(this.ctx, pattern);
      };
      getRemaining = async (identifier) => {
        const pattern = [this.prefix, identifier].join(":");
        return await this.limiter().getRemaining(this.ctx, pattern);
      };
    };
    function randomId() {
      let result = "";
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      for (let i = 0; i < 16; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
    var MultiRegionRatelimit = class extends Ratelimit2 {
      /**
       * Create a new Ratelimit instance by providing a `@upstash/redis` instance and the algorithn of your choice.
       */
      constructor(config) {
        super({
          prefix: config.prefix,
          limiter: config.limiter,
          timeout: config.timeout,
          analytics: config.analytics,
          ctx: {
            redis: config.redis,
            cache: config.ephemeralCache ? new Cache(config.ephemeralCache) : void 0
          }
        });
      }
      /**
       * Each request inside a fixed time increases a counter.
       * Once the counter reaches the maximum allowed number, all further requests are
       * rejected.
       *
       * **Pro:**
       *
       * - Newer requests are not starved by old ones.
       * - Low storage cost.
       *
       * **Con:**
       *
       * A burst of requests near the boundary of a window can result in a very
       * high request rate because two windows will be filled with requests quickly.
       *
       * @param tokens - How many requests a user can make in each time window.
       * @param window - A fixed timeframe
       */
      static fixedWindow(tokens, window2) {
        const windowDuration = ms(window2);
        return () => ({
          async limit(ctx, identifier, rate) {
            if (ctx.cache) {
              const { blocked, reset: reset2 } = ctx.cache.isBlocked(identifier);
              if (blocked) {
                return {
                  success: false,
                  limit: tokens,
                  remaining: 0,
                  reset: reset2,
                  pending: Promise.resolve()
                };
              }
            }
            const requestId = randomId();
            const bucket = Math.floor(Date.now() / windowDuration);
            const key = [identifier, bucket].join(":");
            const incrementBy = rate ? Math.max(1, rate) : 1;
            const dbs = ctx.redis.map((redis) => ({
              redis,
              request: redis.eval(
                fixedWindowLimitScript,
                [key],
                [requestId, windowDuration, incrementBy]
              )
            }));
            const firstResponse = await Promise.any(dbs.map((s) => s.request));
            const usedTokens = firstResponse.reduce((accTokens, usedToken, index) => {
              let parsedToken = 0;
              if (index % 2) {
                parsedToken = Number.parseInt(usedToken);
              }
              return accTokens + parsedToken;
            }, 0);
            const remaining = tokens - usedTokens;
            async function sync() {
              const individualIDs = await Promise.all(dbs.map((s) => s.request));
              const allIDs = Array.from(
                new Set(
                  individualIDs.flatMap((_2) => _2).reduce((acc, curr, index) => {
                    if (index % 2 === 0) {
                      acc.push(curr);
                    }
                    return acc;
                  }, [])
                ).values()
              );
              for (const db of dbs) {
                const usedDbTokens = (await db.request).reduce(
                  (accTokens, usedToken, index) => {
                    let parsedToken = 0;
                    if (index % 2) {
                      parsedToken = Number.parseInt(usedToken);
                    }
                    return accTokens + parsedToken;
                  },
                  0
                );
                const dbIds = (await db.request).reduce((ids, currentId, index) => {
                  if (index % 2 === 0) {
                    ids.push(currentId);
                  }
                  return ids;
                }, []);
                if (usedDbTokens >= tokens) {
                  continue;
                }
                const diff = allIDs.filter((id) => !dbIds.includes(id));
                if (diff.length === 0) {
                  continue;
                }
                for (const requestId2 of diff) {
                  await db.redis.hset(key, { [requestId2]: incrementBy });
                }
              }
            }
            const success = remaining > 0;
            const reset = (bucket + 1) * windowDuration;
            if (ctx.cache && !success) {
              ctx.cache.blockUntil(identifier, reset);
            }
            return {
              success,
              limit: tokens,
              remaining,
              reset,
              pending: sync()
            };
          },
          async getRemaining(ctx, identifier) {
            const bucket = Math.floor(Date.now() / windowDuration);
            const key = [identifier, bucket].join(":");
            const dbs = ctx.redis.map((redis) => ({
              redis,
              request: redis.eval(fixedWindowRemainingTokensScript, [key], [null])
            }));
            const firstResponse = await Promise.any(dbs.map((s) => s.request));
            const usedTokens = firstResponse.reduce((accTokens, usedToken, index) => {
              let parsedToken = 0;
              if (index % 2) {
                parsedToken = Number.parseInt(usedToken);
              }
              return accTokens + parsedToken;
            }, 0);
            return Math.max(0, tokens - usedTokens);
          },
          async resetTokens(ctx, identifier) {
            const pattern = [identifier, "*"].join(":");
            if (ctx.cache) {
              ctx.cache.pop(identifier);
            }
            for (const db of ctx.redis) {
              await db.eval(resetScript, [pattern], [null]);
            }
          }
        });
      }
      /**
       * Combined approach of `slidingLogs` and `fixedWindow` with lower storage
       * costs than `slidingLogs` and improved boundary behavior by calculating a
       * weighted score between two windows.
       *
       * **Pro:**
       *
       * Good performance allows this to scale to very high loads.
       *
       * **Con:**
       *
       * Nothing major.
       *
       * @param tokens - How many requests a user can make in each time window.
       * @param window - The duration in which the user can max X requests.
       */
      static slidingWindow(tokens, window2) {
        const windowSize = ms(window2);
        const windowDuration = ms(window2);
        return () => ({
          async limit(ctx, identifier, rate) {
            const requestId = randomId();
            const now = Date.now();
            const currentWindow = Math.floor(now / windowSize);
            const currentKey = [identifier, currentWindow].join(":");
            const previousWindow = currentWindow - 1;
            const previousKey = [identifier, previousWindow].join(":");
            const incrementBy = rate ? Math.max(1, rate) : 1;
            const dbs = ctx.redis.map((redis) => ({
              redis,
              request: redis.eval(
                slidingWindowLimitScript,
                [currentKey, previousKey],
                [tokens, now, windowDuration, requestId, incrementBy]
                // lua seems to return `1` for true and `null` for false
              )
            }));
            const percentageInCurrent = now % windowDuration / windowDuration;
            const [current, previous, success] = await Promise.any(dbs.map((s) => s.request));
            if (success) {
              current.push(requestId, incrementBy.toString());
            }
            const previousUsedTokens = previous.reduce((accTokens, usedToken, index) => {
              let parsedToken = 0;
              if (index % 2) {
                parsedToken = Number.parseInt(usedToken);
              }
              return accTokens + parsedToken;
            }, 0);
            const currentUsedTokens = current.reduce((accTokens, usedToken, index) => {
              let parsedToken = 0;
              if (index % 2) {
                parsedToken = Number.parseInt(usedToken);
              }
              return accTokens + parsedToken;
            }, 0);
            const previousPartialUsed = Math.ceil(previousUsedTokens * (1 - percentageInCurrent));
            const usedTokens = previousPartialUsed + currentUsedTokens;
            const remaining = tokens - usedTokens;
            async function sync() {
              const res = await Promise.all(dbs.map((s) => s.request));
              const allCurrentIds = Array.from(
                new Set(
                  res.flatMap(([current2]) => current2).reduce((acc, curr, index) => {
                    if (index % 2 === 0) {
                      acc.push(curr);
                    }
                    return acc;
                  }, [])
                ).values()
              );
              for (const db of dbs) {
                const [current2, _previous, _success] = await db.request;
                const dbIds = current2.reduce((ids, currentId, index) => {
                  if (index % 2 === 0) {
                    ids.push(currentId);
                  }
                  return ids;
                }, []);
                const usedDbTokens = current2.reduce((accTokens, usedToken, index) => {
                  let parsedToken = 0;
                  if (index % 2) {
                    parsedToken = Number.parseInt(usedToken);
                  }
                  return accTokens + parsedToken;
                }, 0);
                if (usedDbTokens >= tokens) {
                  continue;
                }
                const diff = allCurrentIds.filter((id) => !dbIds.includes(id));
                if (diff.length === 0) {
                  continue;
                }
                for (const requestId2 of diff) {
                  await db.redis.hset(currentKey, { [requestId2]: incrementBy });
                }
              }
            }
            const reset = (currentWindow + 1) * windowDuration;
            if (ctx.cache && !success) {
              ctx.cache.blockUntil(identifier, reset);
            }
            return {
              success: Boolean(success),
              limit: tokens,
              remaining: Math.max(0, remaining),
              reset,
              pending: sync()
            };
          },
          async getRemaining(ctx, identifier) {
            const now = Date.now();
            const currentWindow = Math.floor(now / windowSize);
            const currentKey = [identifier, currentWindow].join(":");
            const previousWindow = currentWindow - 1;
            const previousKey = [identifier, previousWindow].join(":");
            const dbs = ctx.redis.map((redis) => ({
              redis,
              request: redis.eval(
                slidingWindowRemainingTokensScript,
                [currentKey, previousKey],
                [now, windowSize]
                // lua seems to return `1` for true and `null` for false
              )
            }));
            const usedTokens = await Promise.any(dbs.map((s) => s.request));
            return Math.max(0, tokens - usedTokens);
          },
          async resetTokens(ctx, identifier) {
            const pattern = [identifier, "*"].join(":");
            if (ctx.cache) {
              ctx.cache.pop(identifier);
            }
            for (const db of ctx.redis) {
              await db.eval(resetScript, [pattern], [null]);
            }
          }
        });
      }
    };
    var fixedWindowLimitScript2 = `
  local key           = KEYS[1]
  local window        = ARGV[1]
  local incrementBy   = ARGV[2] -- increment rate per request at a given value, default is 1

  local r = redis.call("INCRBY", key, incrementBy)
  if r == tonumber(incrementBy) then
  -- The first time this key is set, the value will be equal to incrementBy.
  -- So we only need the expire command once
  redis.call("PEXPIRE", key, window)
  end

  return r
`;
    var fixedWindowRemainingTokensScript2 = `
      local key = KEYS[1]
      local tokens = 0

      local value = redis.call('GET', key)
      if value then
          tokens = value
      end
      return tokens
    `;
    var slidingWindowLimitScript2 = `
  local currentKey  = KEYS[1]           -- identifier including prefixes
  local previousKey = KEYS[2]           -- key of the previous bucket
  local tokens      = tonumber(ARGV[1]) -- tokens per window
  local now         = ARGV[2]           -- current timestamp in milliseconds
  local window      = ARGV[3]           -- interval in milliseconds
  local incrementBy = ARGV[4]           -- increment rate per request at a given value, default is 1

  local requestsInCurrentWindow = redis.call("GET", currentKey)
  if requestsInCurrentWindow == false then
    requestsInCurrentWindow = 0
  end

  local requestsInPreviousWindow = redis.call("GET", previousKey)
  if requestsInPreviousWindow == false then
    requestsInPreviousWindow = 0
  end
  local percentageInCurrent = ( now % window ) / window
  -- weighted requests to consider from the previous window
  requestsInPreviousWindow = math.floor(( 1 - percentageInCurrent ) * requestsInPreviousWindow)
  if requestsInPreviousWindow + requestsInCurrentWindow >= tokens then
    return -1
  end

  local newValue = redis.call("INCRBY", currentKey, incrementBy)
  if newValue == tonumber(incrementBy) then
    -- The first time this key is set, the value will be equal to incrementBy.
    -- So we only need the expire command once
    redis.call("PEXPIRE", currentKey, window * 2 + 1000) -- Enough time to overlap with a new window + 1 second
  end
  return tokens - ( newValue + requestsInPreviousWindow )
`;
    var slidingWindowRemainingTokensScript2 = `
  local currentKey  = KEYS[1]           -- identifier including prefixes
  local previousKey = KEYS[2]           -- key of the previous bucket
  local now         = ARGV[1]           -- current timestamp in milliseconds
  local window      = ARGV[2]           -- interval in milliseconds

  local requestsInCurrentWindow = redis.call("GET", currentKey)
  if requestsInCurrentWindow == false then
    requestsInCurrentWindow = 0
  end

  local requestsInPreviousWindow = redis.call("GET", previousKey)
  if requestsInPreviousWindow == false then
    requestsInPreviousWindow = 0
  end

  local percentageInCurrent = ( now % window ) / window
  -- weighted requests to consider from the previous window
  requestsInPreviousWindow = math.floor(( 1 - percentageInCurrent ) * requestsInPreviousWindow)

  return requestsInPreviousWindow + requestsInCurrentWindow
`;
    var tokenBucketLimitScript = `
  local key         = KEYS[1]           -- identifier including prefixes
  local maxTokens   = tonumber(ARGV[1]) -- maximum number of tokens
  local interval    = tonumber(ARGV[2]) -- size of the window in milliseconds
  local refillRate  = tonumber(ARGV[3]) -- how many tokens are refilled after each interval
  local now         = tonumber(ARGV[4]) -- current timestamp in milliseconds
  local incrementBy = tonumber(ARGV[5]) -- how many tokens to consume, default is 1
        
  local bucket = redis.call("HMGET", key, "refilledAt", "tokens")
        
  local refilledAt
  local tokens

  if bucket[1] == false then
    refilledAt = now
    tokens = maxTokens
  else
    refilledAt = tonumber(bucket[1])
    tokens = tonumber(bucket[2])
  end
        
  if now >= refilledAt + interval then
    local numRefills = math.floor((now - refilledAt) / interval)
    tokens = math.min(maxTokens, tokens + numRefills * refillRate)

    refilledAt = refilledAt + numRefills * interval
  end

  if tokens == 0 then
    return {-1, refilledAt + interval}
  end

  local remaining = tokens - incrementBy
  local expireAt = math.ceil(((maxTokens - remaining) / refillRate)) * interval
        
  redis.call("HSET", key, "refilledAt", refilledAt, "tokens", remaining)
  redis.call("PEXPIRE", key, expireAt)
  return {remaining, refilledAt + interval}
`;
    var tokenBucketRemainingTokensScript = `
  local key         = KEYS[1]
  local maxTokens   = tonumber(ARGV[1])
        
  local bucket = redis.call("HMGET", key, "tokens")

  if bucket[1] == false then
    return maxTokens
  end
        
  return tonumber(bucket[1])
`;
    var cachedFixedWindowLimitScript = `
  local key     = KEYS[1]
  local window  = ARGV[1]
  local incrementBy   = ARGV[2] -- increment rate per request at a given value, default is 1

  local r = redis.call("INCRBY", key, incrementBy)
  if r == incrementBy then
  -- The first time this key is set, the value will be equal to incrementBy.
  -- So we only need the expire command once
  redis.call("PEXPIRE", key, window)
  end
      
  return r
`;
    var cachedFixedWindowRemainingTokenScript = `
  local key = KEYS[1]
  local tokens = 0

  local value = redis.call('GET', key)
  if value then
      tokens = value
  end
  return tokens
`;
    var RegionRatelimit = class extends Ratelimit2 {
      /**
       * Create a new Ratelimit instance by providing a `@upstash/redis` instance and the algorithm of your choice.
       */
      constructor(config) {
        super({
          prefix: config.prefix,
          limiter: config.limiter,
          timeout: config.timeout,
          analytics: config.analytics,
          ctx: {
            redis: config.redis
          },
          ephemeralCache: config.ephemeralCache
        });
      }
      /**
       * Each request inside a fixed time increases a counter.
       * Once the counter reaches the maximum allowed number, all further requests are
       * rejected.
       *
       * **Pro:**
       *
       * - Newer requests are not starved by old ones.
       * - Low storage cost.
       *
       * **Con:**
       *
       * A burst of requests near the boundary of a window can result in a very
       * high request rate because two windows will be filled with requests quickly.
       *
       * @param tokens - How many requests a user can make in each time window.
       * @param window - A fixed timeframe
       */
      static fixedWindow(tokens, window2) {
        const windowDuration = ms(window2);
        return () => ({
          async limit(ctx, identifier, rate) {
            const bucket = Math.floor(Date.now() / windowDuration);
            const key = [identifier, bucket].join(":");
            if (ctx.cache) {
              const { blocked, reset: reset2 } = ctx.cache.isBlocked(identifier);
              if (blocked) {
                return {
                  success: false,
                  limit: tokens,
                  remaining: 0,
                  reset: reset2,
                  pending: Promise.resolve()
                };
              }
            }
            const incrementBy = rate ? Math.max(1, rate) : 1;
            const usedTokensAfterUpdate = await ctx.redis.eval(
              fixedWindowLimitScript2,
              [key],
              [windowDuration, incrementBy]
            );
            const success = usedTokensAfterUpdate <= tokens;
            const remainingTokens = Math.max(0, tokens - usedTokensAfterUpdate);
            const reset = (bucket + 1) * windowDuration;
            if (ctx.cache && !success) {
              ctx.cache.blockUntil(identifier, reset);
            }
            return {
              success,
              limit: tokens,
              remaining: remainingTokens,
              reset,
              pending: Promise.resolve()
            };
          },
          async getRemaining(ctx, identifier) {
            const bucket = Math.floor(Date.now() / windowDuration);
            const key = [identifier, bucket].join(":");
            const usedTokens = await ctx.redis.eval(
              fixedWindowRemainingTokensScript2,
              [key],
              [null]
            );
            return Math.max(0, tokens - usedTokens);
          },
          async resetTokens(ctx, identifier) {
            const pattern = [identifier, "*"].join(":");
            if (ctx.cache) {
              ctx.cache.pop(identifier);
            }
            await ctx.redis.eval(resetScript, [pattern], [null]);
          }
        });
      }
      /**
       * Combined approach of `slidingLogs` and `fixedWindow` with lower storage
       * costs than `slidingLogs` and improved boundary behavior by calculating a
       * weighted score between two windows.
       *
       * **Pro:**
       *
       * Good performance allows this to scale to very high loads.
       *
       * **Con:**
       *
       * Nothing major.
       *
       * @param tokens - How many requests a user can make in each time window.
       * @param window - The duration in which the user can max X requests.
       */
      static slidingWindow(tokens, window2) {
        const windowSize = ms(window2);
        return () => ({
          async limit(ctx, identifier, rate) {
            const now = Date.now();
            const currentWindow = Math.floor(now / windowSize);
            const currentKey = [identifier, currentWindow].join(":");
            const previousWindow = currentWindow - 1;
            const previousKey = [identifier, previousWindow].join(":");
            if (ctx.cache) {
              const { blocked, reset: reset2 } = ctx.cache.isBlocked(identifier);
              if (blocked) {
                return {
                  success: false,
                  limit: tokens,
                  remaining: 0,
                  reset: reset2,
                  pending: Promise.resolve()
                };
              }
            }
            const incrementBy = rate ? Math.max(1, rate) : 1;
            const remainingTokens = await ctx.redis.eval(
              slidingWindowLimitScript2,
              [currentKey, previousKey],
              [tokens, now, windowSize, incrementBy]
            );
            const success = remainingTokens >= 0;
            const reset = (currentWindow + 1) * windowSize;
            if (ctx.cache && !success) {
              ctx.cache.blockUntil(identifier, reset);
            }
            return {
              success,
              limit: tokens,
              remaining: Math.max(0, remainingTokens),
              reset,
              pending: Promise.resolve()
            };
          },
          async getRemaining(ctx, identifier) {
            const now = Date.now();
            const currentWindow = Math.floor(now / windowSize);
            const currentKey = [identifier, currentWindow].join(":");
            const previousWindow = currentWindow - 1;
            const previousKey = [identifier, previousWindow].join(":");
            const usedTokens = await ctx.redis.eval(
              slidingWindowRemainingTokensScript2,
              [currentKey, previousKey],
              [now, windowSize]
            );
            return Math.max(0, tokens - usedTokens);
          },
          async resetTokens(ctx, identifier) {
            const pattern = [identifier, "*"].join(":");
            if (ctx.cache) {
              ctx.cache.pop(identifier);
            }
            await ctx.redis.eval(resetScript, [pattern], [null]);
          }
        });
      }
      /**
       * You have a bucket filled with `{maxTokens}` tokens that refills constantly
       * at `{refillRate}` per `{interval}`.
       * Every request will remove one token from the bucket and if there is no
       * token to take, the request is rejected.
       *
       * **Pro:**
       *
       * - Bursts of requests are smoothed out and you can process them at a constant
       * rate.
       * - Allows to set a higher initial burst limit by setting `maxTokens` higher
       * than `refillRate`
       */
      static tokenBucket(refillRate, interval, maxTokens) {
        const intervalDuration = ms(interval);
        return () => ({
          async limit(ctx, identifier, rate) {
            if (ctx.cache) {
              const { blocked, reset: reset2 } = ctx.cache.isBlocked(identifier);
              if (blocked) {
                return {
                  success: false,
                  limit: maxTokens,
                  remaining: 0,
                  reset: reset2,
                  pending: Promise.resolve()
                };
              }
            }
            const now = Date.now();
            const incrementBy = rate ? Math.max(1, rate) : 1;
            const [remaining, reset] = await ctx.redis.eval(
              tokenBucketLimitScript,
              [identifier],
              [maxTokens, intervalDuration, refillRate, now, incrementBy]
            );
            const success = remaining >= 0;
            if (ctx.cache && !success) {
              ctx.cache.blockUntil(identifier, reset);
            }
            return {
              success,
              limit: maxTokens,
              remaining,
              reset,
              pending: Promise.resolve()
            };
          },
          async getRemaining(ctx, identifier) {
            const remainingTokens = await ctx.redis.eval(
              tokenBucketRemainingTokensScript,
              [identifier],
              [maxTokens]
            );
            return remainingTokens;
          },
          async resetTokens(ctx, identifier) {
            const pattern = identifier;
            if (ctx.cache) {
              ctx.cache.pop(identifier);
            }
            await ctx.redis.eval(resetScript, [pattern], [null]);
          }
        });
      }
      /**
       * cachedFixedWindow first uses the local cache to decide if a request may pass and then updates
       * it asynchronously.
       * This is experimental and not yet recommended for production use.
       *
       * @experimental
       *
       * Each request inside a fixed time increases a counter.
       * Once the counter reaches the maximum allowed number, all further requests are
       * rejected.
       *
       * **Pro:**
       *
       * - Newer requests are not starved by old ones.
       * - Low storage cost.
       *
       * **Con:**
       *
       * A burst of requests near the boundary of a window can result in a very
       * high request rate because two windows will be filled with requests quickly.
       *
       * @param tokens - How many requests a user can make in each time window.
       * @param window - A fixed timeframe
       */
      static cachedFixedWindow(tokens, window2) {
        const windowDuration = ms(window2);
        return () => ({
          async limit(ctx, identifier, rate) {
            if (!ctx.cache) {
              throw new Error("This algorithm requires a cache");
            }
            const bucket = Math.floor(Date.now() / windowDuration);
            const key = [identifier, bucket].join(":");
            const reset = (bucket + 1) * windowDuration;
            const incrementBy = rate ? Math.max(1, rate) : 1;
            const hit = typeof ctx.cache.get(key) === "number";
            if (hit) {
              const cachedTokensAfterUpdate = ctx.cache.incr(key);
              const success = cachedTokensAfterUpdate < tokens;
              const pending = success ? ctx.redis.eval(cachedFixedWindowLimitScript, [key], [windowDuration, incrementBy]).then((t2) => {
                ctx.cache.set(key, t2);
              }) : Promise.resolve();
              return {
                success,
                limit: tokens,
                remaining: tokens - cachedTokensAfterUpdate,
                reset,
                pending
              };
            }
            const usedTokensAfterUpdate = await ctx.redis.eval(
              cachedFixedWindowLimitScript,
              [key],
              [windowDuration, incrementBy]
            );
            ctx.cache.set(key, usedTokensAfterUpdate);
            const remaining = tokens - usedTokensAfterUpdate;
            return {
              success: remaining >= 0,
              limit: tokens,
              remaining,
              reset,
              pending: Promise.resolve()
            };
          },
          async getRemaining(ctx, identifier) {
            if (!ctx.cache) {
              throw new Error("This algorithm requires a cache");
            }
            const bucket = Math.floor(Date.now() / windowDuration);
            const key = [identifier, bucket].join(":");
            const hit = typeof ctx.cache.get(key) === "number";
            if (hit) {
              const cachedUsedTokens = ctx.cache.get(key) ?? 0;
              return Math.max(0, tokens - cachedUsedTokens);
            }
            const usedTokens = await ctx.redis.eval(
              cachedFixedWindowRemainingTokenScript,
              [key],
              [null]
            );
            return Math.max(0, tokens - usedTokens);
          },
          async resetTokens(ctx, identifier) {
            if (!ctx.cache) {
              throw new Error("This algorithm requires a cache");
            }
            const bucket = Math.floor(Date.now() / windowDuration);
            const key = [identifier, bucket].join(":");
            ctx.cache.pop(key);
            const pattern = [identifier, "*"].join(":");
            await ctx.redis.eval(resetScript, [pattern], [null]);
          }
        });
      }
    };
  }
});

// (disabled):crypto
var require_crypto = __commonJS({
  "(disabled):crypto"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// node_modules/crypto-js/core.js
var require_core = __commonJS({
  "node_modules/crypto-js/core.js"(exports, module) {
    init_checked_fetch();
    init_modules_watch_stub();
    (function(root, factory) {
      if (typeof exports === "object") {
        module.exports = exports = factory();
      } else if (typeof define === "function" && define.amd) {
        define([], factory);
      } else {
        root.CryptoJS = factory();
      }
    })(exports, function() {
      var CryptoJS = CryptoJS || function(Math2, undefined2) {
        var crypto;
        if (typeof window !== "undefined" && window.crypto) {
          crypto = window.crypto;
        }
        if (typeof self !== "undefined" && self.crypto) {
          crypto = self.crypto;
        }
        if (typeof globalThis !== "undefined" && globalThis.crypto) {
          crypto = globalThis.crypto;
        }
        if (!crypto && typeof window !== "undefined" && window.msCrypto) {
          crypto = window.msCrypto;
        }
        if (!crypto && typeof global !== "undefined" && global.crypto) {
          crypto = global.crypto;
        }
        if (!crypto && typeof __require === "function") {
          try {
            crypto = require_crypto();
          } catch (err) {
          }
        }
        var cryptoSecureRandomInt = function() {
          if (crypto) {
            if (typeof crypto.getRandomValues === "function") {
              try {
                return crypto.getRandomValues(new Uint32Array(1))[0];
              } catch (err) {
              }
            }
            if (typeof crypto.randomBytes === "function") {
              try {
                return crypto.randomBytes(4).readInt32LE();
              } catch (err) {
              }
            }
          }
          throw new Error("Native crypto module could not be used to get secure random number.");
        };
        var create = Object.create || function() {
          function F2() {
          }
          return function(obj) {
            var subtype;
            F2.prototype = obj;
            subtype = new F2();
            F2.prototype = null;
            return subtype;
          };
        }();
        var C = {};
        var C_lib = C.lib = {};
        var Base = C_lib.Base = function() {
          return {
            /**
             * Creates a new object that inherits from this object.
             *
             * @param {Object} overrides Properties to copy into the new object.
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         field: 'value',
             *
             *         method: function () {
             *         }
             *     });
             */
            extend: function(overrides) {
              var subtype = create(this);
              if (overrides) {
                subtype.mixIn(overrides);
              }
              if (!subtype.hasOwnProperty("init") || this.init === subtype.init) {
                subtype.init = function() {
                  subtype.$super.init.apply(this, arguments);
                };
              }
              subtype.init.prototype = subtype;
              subtype.$super = this;
              return subtype;
            },
            /**
             * Extends this object and runs the init method.
             * Arguments to create() will be passed to init().
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var instance = MyType.create();
             */
            create: function() {
              var instance = this.extend();
              instance.init.apply(instance, arguments);
              return instance;
            },
            /**
             * Initializes a newly created object.
             * Override this method to add some logic when your objects are created.
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         init: function () {
             *             // ...
             *         }
             *     });
             */
            init: function() {
            },
            /**
             * Copies properties into this object.
             *
             * @param {Object} properties The properties to mix in.
             *
             * @example
             *
             *     MyType.mixIn({
             *         field: 'value'
             *     });
             */
            mixIn: function(properties) {
              for (var propertyName in properties) {
                if (properties.hasOwnProperty(propertyName)) {
                  this[propertyName] = properties[propertyName];
                }
              }
              if (properties.hasOwnProperty("toString")) {
                this.toString = properties.toString;
              }
            },
            /**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = instance.clone();
             */
            clone: function() {
              return this.init.prototype.extend(this);
            }
          };
        }();
        var WordArray = C_lib.WordArray = Base.extend({
          /**
           * Initializes a newly created word array.
           *
           * @param {Array} words (Optional) An array of 32-bit words.
           * @param {number} sigBytes (Optional) The number of significant bytes in the words.
           *
           * @example
           *
           *     var wordArray = CryptoJS.lib.WordArray.create();
           *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
           *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
           */
          init: function(words, sigBytes) {
            words = this.words = words || [];
            if (sigBytes != undefined2) {
              this.sigBytes = sigBytes;
            } else {
              this.sigBytes = words.length * 4;
            }
          },
          /**
           * Converts this word array to a string.
           *
           * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
           *
           * @return {string} The stringified word array.
           *
           * @example
           *
           *     var string = wordArray + '';
           *     var string = wordArray.toString();
           *     var string = wordArray.toString(CryptoJS.enc.Utf8);
           */
          toString: function(encoder) {
            return (encoder || Hex).stringify(this);
          },
          /**
           * Concatenates a word array to this word array.
           *
           * @param {WordArray} wordArray The word array to append.
           *
           * @return {WordArray} This word array.
           *
           * @example
           *
           *     wordArray1.concat(wordArray2);
           */
          concat: function(wordArray) {
            var thisWords = this.words;
            var thatWords = wordArray.words;
            var thisSigBytes = this.sigBytes;
            var thatSigBytes = wordArray.sigBytes;
            this.clamp();
            if (thisSigBytes % 4) {
              for (var i = 0; i < thatSigBytes; i++) {
                var thatByte = thatWords[i >>> 2] >>> 24 - i % 4 * 8 & 255;
                thisWords[thisSigBytes + i >>> 2] |= thatByte << 24 - (thisSigBytes + i) % 4 * 8;
              }
            } else {
              for (var j2 = 0; j2 < thatSigBytes; j2 += 4) {
                thisWords[thisSigBytes + j2 >>> 2] = thatWords[j2 >>> 2];
              }
            }
            this.sigBytes += thatSigBytes;
            return this;
          },
          /**
           * Removes insignificant bits.
           *
           * @example
           *
           *     wordArray.clamp();
           */
          clamp: function() {
            var words = this.words;
            var sigBytes = this.sigBytes;
            words[sigBytes >>> 2] &= 4294967295 << 32 - sigBytes % 4 * 8;
            words.length = Math2.ceil(sigBytes / 4);
          },
          /**
           * Creates a copy of this word array.
           *
           * @return {WordArray} The clone.
           *
           * @example
           *
           *     var clone = wordArray.clone();
           */
          clone: function() {
            var clone = Base.clone.call(this);
            clone.words = this.words.slice(0);
            return clone;
          },
          /**
           * Creates a word array filled with random bytes.
           *
           * @param {number} nBytes The number of random bytes to generate.
           *
           * @return {WordArray} The random word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.lib.WordArray.random(16);
           */
          random: function(nBytes) {
            var words = [];
            for (var i = 0; i < nBytes; i += 4) {
              words.push(cryptoSecureRandomInt());
            }
            return new WordArray.init(words, nBytes);
          }
        });
        var C_enc = C.enc = {};
        var Hex = C_enc.Hex = {
          /**
           * Converts a word array to a hex string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The hex string.
           *
           * @static
           *
           * @example
           *
           *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
           */
          stringify: function(wordArray) {
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var hexChars = [];
            for (var i = 0; i < sigBytes; i++) {
              var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
              hexChars.push((bite >>> 4).toString(16));
              hexChars.push((bite & 15).toString(16));
            }
            return hexChars.join("");
          },
          /**
           * Converts a hex string to a word array.
           *
           * @param {string} hexStr The hex string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
           */
          parse: function(hexStr) {
            var hexStrLength = hexStr.length;
            var words = [];
            for (var i = 0; i < hexStrLength; i += 2) {
              words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << 24 - i % 8 * 4;
            }
            return new WordArray.init(words, hexStrLength / 2);
          }
        };
        var Latin1 = C_enc.Latin1 = {
          /**
           * Converts a word array to a Latin1 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The Latin1 string.
           *
           * @static
           *
           * @example
           *
           *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
           */
          stringify: function(wordArray) {
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var latin1Chars = [];
            for (var i = 0; i < sigBytes; i++) {
              var bite = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
              latin1Chars.push(String.fromCharCode(bite));
            }
            return latin1Chars.join("");
          },
          /**
           * Converts a Latin1 string to a word array.
           *
           * @param {string} latin1Str The Latin1 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
           */
          parse: function(latin1Str) {
            var latin1StrLength = latin1Str.length;
            var words = [];
            for (var i = 0; i < latin1StrLength; i++) {
              words[i >>> 2] |= (latin1Str.charCodeAt(i) & 255) << 24 - i % 4 * 8;
            }
            return new WordArray.init(words, latin1StrLength);
          }
        };
        var Utf8 = C_enc.Utf8 = {
          /**
           * Converts a word array to a UTF-8 string.
           *
           * @param {WordArray} wordArray The word array.
           *
           * @return {string} The UTF-8 string.
           *
           * @static
           *
           * @example
           *
           *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
           */
          stringify: function(wordArray) {
            try {
              return decodeURIComponent(escape(Latin1.stringify(wordArray)));
            } catch (e2) {
              throw new Error("Malformed UTF-8 data");
            }
          },
          /**
           * Converts a UTF-8 string to a word array.
           *
           * @param {string} utf8Str The UTF-8 string.
           *
           * @return {WordArray} The word array.
           *
           * @static
           *
           * @example
           *
           *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
           */
          parse: function(utf8Str) {
            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
          }
        };
        var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
          /**
           * Resets this block algorithm's data buffer to its initial state.
           *
           * @example
           *
           *     bufferedBlockAlgorithm.reset();
           */
          reset: function() {
            this._data = new WordArray.init();
            this._nDataBytes = 0;
          },
          /**
           * Adds new data to this block algorithm's buffer.
           *
           * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
           *
           * @example
           *
           *     bufferedBlockAlgorithm._append('data');
           *     bufferedBlockAlgorithm._append(wordArray);
           */
          _append: function(data) {
            if (typeof data == "string") {
              data = Utf8.parse(data);
            }
            this._data.concat(data);
            this._nDataBytes += data.sigBytes;
          },
          /**
           * Processes available data blocks.
           *
           * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
           *
           * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
           *
           * @return {WordArray} The processed data.
           *
           * @example
           *
           *     var processedData = bufferedBlockAlgorithm._process();
           *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
           */
          _process: function(doFlush) {
            var processedWords;
            var data = this._data;
            var dataWords = data.words;
            var dataSigBytes = data.sigBytes;
            var blockSize = this.blockSize;
            var blockSizeBytes = blockSize * 4;
            var nBlocksReady = dataSigBytes / blockSizeBytes;
            if (doFlush) {
              nBlocksReady = Math2.ceil(nBlocksReady);
            } else {
              nBlocksReady = Math2.max((nBlocksReady | 0) - this._minBufferSize, 0);
            }
            var nWordsReady = nBlocksReady * blockSize;
            var nBytesReady = Math2.min(nWordsReady * 4, dataSigBytes);
            if (nWordsReady) {
              for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                this._doProcessBlock(dataWords, offset);
              }
              processedWords = dataWords.splice(0, nWordsReady);
              data.sigBytes -= nBytesReady;
            }
            return new WordArray.init(processedWords, nBytesReady);
          },
          /**
           * Creates a copy of this object.
           *
           * @return {Object} The clone.
           *
           * @example
           *
           *     var clone = bufferedBlockAlgorithm.clone();
           */
          clone: function() {
            var clone = Base.clone.call(this);
            clone._data = this._data.clone();
            return clone;
          },
          _minBufferSize: 0
        });
        var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
          /**
           * Configuration options.
           */
          cfg: Base.extend(),
          /**
           * Initializes a newly created hasher.
           *
           * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
           *
           * @example
           *
           *     var hasher = CryptoJS.algo.SHA256.create();
           */
          init: function(cfg) {
            this.cfg = this.cfg.extend(cfg);
            this.reset();
          },
          /**
           * Resets this hasher to its initial state.
           *
           * @example
           *
           *     hasher.reset();
           */
          reset: function() {
            BufferedBlockAlgorithm.reset.call(this);
            this._doReset();
          },
          /**
           * Updates this hasher with a message.
           *
           * @param {WordArray|string} messageUpdate The message to append.
           *
           * @return {Hasher} This hasher.
           *
           * @example
           *
           *     hasher.update('message');
           *     hasher.update(wordArray);
           */
          update: function(messageUpdate) {
            this._append(messageUpdate);
            this._process();
            return this;
          },
          /**
           * Finalizes the hash computation.
           * Note that the finalize operation is effectively a destructive, read-once operation.
           *
           * @param {WordArray|string} messageUpdate (Optional) A final message update.
           *
           * @return {WordArray} The hash.
           *
           * @example
           *
           *     var hash = hasher.finalize();
           *     var hash = hasher.finalize('message');
           *     var hash = hasher.finalize(wordArray);
           */
          finalize: function(messageUpdate) {
            if (messageUpdate) {
              this._append(messageUpdate);
            }
            var hash = this._doFinalize();
            return hash;
          },
          blockSize: 512 / 32,
          /**
           * Creates a shortcut function to a hasher's object interface.
           *
           * @param {Hasher} hasher The hasher to create a helper for.
           *
           * @return {Function} The shortcut function.
           *
           * @static
           *
           * @example
           *
           *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
           */
          _createHelper: function(hasher) {
            return function(message, cfg) {
              return new hasher.init(cfg).finalize(message);
            };
          },
          /**
           * Creates a shortcut function to the HMAC's object interface.
           *
           * @param {Hasher} hasher The hasher to use in this HMAC helper.
           *
           * @return {Function} The shortcut function.
           *
           * @static
           *
           * @example
           *
           *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
           */
          _createHmacHelper: function(hasher) {
            return function(message, key) {
              return new C_algo.HMAC.init(hasher, key).finalize(message);
            };
          }
        });
        var C_algo = C.algo = {};
        return C;
      }(Math);
      return CryptoJS;
    });
  }
});

// node_modules/crypto-js/enc-hex.js
var require_enc_hex = __commonJS({
  "node_modules/crypto-js/enc-hex.js"(exports, module) {
    init_checked_fetch();
    init_modules_watch_stub();
    (function(root, factory) {
      if (typeof exports === "object") {
        module.exports = exports = factory(require_core());
      } else if (typeof define === "function" && define.amd) {
        define(["./core"], factory);
      } else {
        factory(root.CryptoJS);
      }
    })(exports, function(CryptoJS) {
      return CryptoJS.enc.Hex;
    });
  }
});

// node_modules/crypto-js/sha1.js
var require_sha1 = __commonJS({
  "node_modules/crypto-js/sha1.js"(exports, module) {
    init_checked_fetch();
    init_modules_watch_stub();
    (function(root, factory) {
      if (typeof exports === "object") {
        module.exports = exports = factory(require_core());
      } else if (typeof define === "function" && define.amd) {
        define(["./core"], factory);
      } else {
        factory(root.CryptoJS);
      }
    })(exports, function(CryptoJS) {
      (function() {
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var Hasher = C_lib.Hasher;
        var C_algo = C.algo;
        var W2 = [];
        var SHA1 = C_algo.SHA1 = Hasher.extend({
          _doReset: function() {
            this._hash = new WordArray.init([
              1732584193,
              4023233417,
              2562383102,
              271733878,
              3285377520
            ]);
          },
          _doProcessBlock: function(M2, offset) {
            var H2 = this._hash.words;
            var a2 = H2[0];
            var b2 = H2[1];
            var c = H2[2];
            var d = H2[3];
            var e2 = H2[4];
            for (var i = 0; i < 80; i++) {
              if (i < 16) {
                W2[i] = M2[offset + i] | 0;
              } else {
                var n = W2[i - 3] ^ W2[i - 8] ^ W2[i - 14] ^ W2[i - 16];
                W2[i] = n << 1 | n >>> 31;
              }
              var t2 = (a2 << 5 | a2 >>> 27) + e2 + W2[i];
              if (i < 20) {
                t2 += (b2 & c | ~b2 & d) + 1518500249;
              } else if (i < 40) {
                t2 += (b2 ^ c ^ d) + 1859775393;
              } else if (i < 60) {
                t2 += (b2 & c | b2 & d | c & d) - 1894007588;
              } else {
                t2 += (b2 ^ c ^ d) - 899497514;
              }
              e2 = d;
              d = c;
              c = b2 << 30 | b2 >>> 2;
              b2 = a2;
              a2 = t2;
            }
            H2[0] = H2[0] + a2 | 0;
            H2[1] = H2[1] + b2 | 0;
            H2[2] = H2[2] + c | 0;
            H2[3] = H2[3] + d | 0;
            H2[4] = H2[4] + e2 | 0;
          },
          _doFinalize: function() {
            var data = this._data;
            var dataWords = data.words;
            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;
            dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
            dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 4294967296);
            dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
            data.sigBytes = dataWords.length * 4;
            this._process();
            return this._hash;
          },
          clone: function() {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();
            return clone;
          }
        });
        C.SHA1 = Hasher._createHelper(SHA1);
        C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
      })();
      return CryptoJS.SHA1;
    });
  }
});

// .wrangler/tmp/bundle-lfPU2l/middleware-loader.entry.ts
init_checked_fetch();
init_modules_watch_stub();

// .wrangler/tmp/bundle-lfPU2l/middleware-insertion-facade.js
init_checked_fetch();
init_modules_watch_stub();

// index.ts
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/hono.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/hono-base.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/compose.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/context.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/utils/html.js
init_checked_fetch();
init_modules_watch_stub();
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = (value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
};

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setHeaders = (headers, map = {}) => {
  Object.entries(map).forEach(([key, value]) => headers.set(key, value));
  return headers;
};
var Context = class {
  req;
  env = {};
  _var = {};
  finalized = false;
  error = void 0;
  #status = 200;
  #executionCtx;
  #headers = void 0;
  #preparedHeaders = void 0;
  #res;
  #isFresh = true;
  layout = void 0;
  renderer = (content) => this.html(content);
  notFoundHandler = () => new Response();
  constructor(req, options) {
    this.req = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      if (options.notFoundHandler) {
        this.notFoundHandler = options.notFoundHandler;
      }
    }
  }
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  get res() {
    this.#isFresh = false;
    return this.#res ||= new Response("404 Not Found", { status: 404 });
  }
  set res(_res) {
    this.#isFresh = false;
    if (this.#res && _res) {
      this.#res.headers.delete("content-type");
      for (const [k2, v2] of this.#res.headers.entries()) {
        if (k2 === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k2, v2);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  render = (...args) => this.renderer(...args);
  setLayout = (layout) => this.layout = layout;
  getLayout = () => this.layout;
  setRenderer = (renderer) => {
    this.renderer = renderer;
  };
  header = (name, value, options) => {
    if (value === void 0) {
      if (this.#headers) {
        this.#headers.delete(name);
      } else if (this.#preparedHeaders) {
        delete this.#preparedHeaders[name.toLocaleLowerCase()];
      }
      if (this.finalized) {
        this.res.headers.delete(name);
      }
      return;
    }
    if (options?.append) {
      if (!this.#headers) {
        this.#isFresh = false;
        this.#headers = new Headers(this.#preparedHeaders);
        this.#preparedHeaders = {};
      }
      this.#headers.append(name, value);
    } else {
      if (this.#headers) {
        this.#headers.set(name, value);
      } else {
        this.#preparedHeaders ??= {};
        this.#preparedHeaders[name.toLowerCase()] = value;
      }
    }
    if (this.finalized) {
      if (options?.append) {
        this.res.headers.append(name, value);
      } else {
        this.res.headers.set(name, value);
      }
    }
  };
  status = (status) => {
    this.#isFresh = false;
    this.#status = status;
  };
  set = (key, value) => {
    this._var ??= {};
    this._var[key] = value;
  };
  get = (key) => {
    return this._var ? this._var[key] : void 0;
  };
  get var() {
    return { ...this._var };
  }
  newResponse = (data, arg, headers) => {
    if (this.#isFresh && !headers && !arg && this.#status === 200) {
      return new Response(data, {
        headers: this.#preparedHeaders
      });
    }
    if (arg && typeof arg !== "number") {
      const header = new Headers(arg.headers);
      if (this.#headers) {
        this.#headers.forEach((v2, k2) => {
          header.set(k2, v2);
        });
      }
      const headers2 = setHeaders(header, this.#preparedHeaders);
      return new Response(data, {
        headers: headers2,
        status: arg.status ?? this.#status
      });
    }
    const status = typeof arg === "number" ? arg : this.#status;
    this.#preparedHeaders ??= {};
    this.#headers ??= new Headers();
    setHeaders(this.#headers, this.#preparedHeaders);
    if (this.#res) {
      this.#res.headers.forEach((v2, k2) => {
        if (k2 === "set-cookie") {
          this.#headers?.append(k2, v2);
        } else {
          this.#headers?.set(k2, v2);
        }
      });
      setHeaders(this.#headers, this.#preparedHeaders);
    }
    headers ??= {};
    for (const [k2, v2] of Object.entries(headers)) {
      if (typeof v2 === "string") {
        this.#headers.set(k2, v2);
      } else {
        this.#headers.delete(k2);
        for (const v22 of v2) {
          this.#headers.append(k2, v22);
        }
      }
    }
    return new Response(data, {
      status,
      headers: this.#headers
    });
  };
  body = (data, arg, headers) => {
    return typeof arg === "number" ? this.newResponse(data, arg, headers) : this.newResponse(data, arg);
  };
  text = (text, arg, headers) => {
    if (!this.#preparedHeaders) {
      if (this.#isFresh && !headers && !arg) {
        return new Response(text);
      }
      this.#preparedHeaders = {};
    }
    this.#preparedHeaders["content-type"] = TEXT_PLAIN;
    return typeof arg === "number" ? this.newResponse(text, arg, headers) : this.newResponse(text, arg);
  };
  json = (object, arg, headers) => {
    const body = JSON.stringify(object);
    this.#preparedHeaders ??= {};
    this.#preparedHeaders["content-type"] = "application/json; charset=UTF-8";
    return typeof arg === "number" ? this.newResponse(body, arg, headers) : this.newResponse(body, arg);
  };
  html = (html, arg, headers) => {
    this.#preparedHeaders ??= {};
    this.#preparedHeaders["content-type"] = "text/html; charset=UTF-8";
    if (typeof html === "object") {
      if (!(html instanceof Promise)) {
        html = html.toString();
      }
      if (html instanceof Promise) {
        return html.then((html2) => resolveCallback(html2, HtmlEscapedCallbackPhase.Stringify, false, {})).then((html2) => {
          return typeof arg === "number" ? this.newResponse(html2, arg, headers) : this.newResponse(html2, arg);
        });
      }
    }
    return typeof arg === "number" ? this.newResponse(html, arg, headers) : this.newResponse(html, arg);
  };
  redirect = (location, status = 302) => {
    this.#headers ??= new Headers();
    this.#headers.set("Location", location);
    return this.newResponse(null, status);
  };
  notFound = () => {
    return this.notFoundHandler(this);
  };
};

// node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        if (context instanceof Context) {
          context.req.routeIndex = i;
        }
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (!handler) {
        if (context instanceof Context && context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      } else {
        try {
          res = await handler(context, () => {
            return dispatch(i + 1);
          });
        } catch (err) {
          if (err instanceof Error && context instanceof Context && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
  };
};

// node_modules/hono/dist/http-exception.js
init_checked_fetch();
init_modules_watch_stub();
var HTTPException = class extends Error {
  res;
  status;
  constructor(status = 500, options) {
    super(options?.message, { cause: options?.cause });
    this.res = options?.res;
    this.status = status;
  }
  getResponse() {
    if (this.res) {
      return this.res;
    }
    return new Response(this.message, {
      status: this.status
    });
  }
};

// node_modules/hono/dist/request.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/utils/body.js
init_checked_fetch();
init_modules_watch_stub();
var parseBody = async (request, options = { all: false }) => {
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (isFormDataContent(contentType)) {
    return parseFormData(request, options);
  }
  return {};
};
function isFormDataContent(contentType) {
  if (contentType === null) {
    return false;
  }
  return contentType.startsWith("multipart/form-data") || contentType.startsWith("application/x-www-form-urlencoded");
}
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = {};
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  return form;
}
var handleParsingAllValues = (form, key, value) => {
  if (form[key] && isArrayField(form[key])) {
    appendToExistingArray(form[key], value);
  } else if (form[key]) {
    convertToNewArray(form, key, value);
  } else {
    form[key] = value;
  }
};
function isArrayField(field) {
  return Array.isArray(field);
}
var appendToExistingArray = (arr, value) => {
  arr.push(value);
};
var convertToNewArray = (form, key, value) => {
  form[key] = [form[key], value];
};

// node_modules/hono/dist/utils/url.js
init_checked_fetch();
init_modules_watch_stub();
var splitPath = (path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match, index) => {
    const mark = `@${index}`;
    groups.push([mark, match]);
    return mark;
  });
  return { groups, path };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j2 = paths.length - 1; j2 >= 0; j2--) {
      if (paths[j2].includes(mark)) {
        paths[j2] = paths[j2].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label) => {
  if (label === "*") {
    return "*";
  }
  const match = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match) {
    if (!patternCache[label]) {
      if (match[2]) {
        patternCache[label] = [label, match[1], new RegExp("^" + match[2] + "$")];
      } else {
        patternCache[label] = [label, match[1], true];
      }
    }
    return patternCache[label];
  }
  return null;
};
var getPath = (request) => {
  const url = request.url;
  const queryIndex = url.indexOf("?", 8);
  return url.slice(url.indexOf("/", 8), queryIndex === -1 ? void 0 : queryIndex);
};
var getQueryStrings = (url) => {
  const queryIndex = url.indexOf("?", 8);
  return queryIndex === -1 ? "" : "?" + url.slice(queryIndex + 1);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result[result.length - 1] === "/" ? result.slice(0, -1) : result;
};
var mergePath = (...paths) => {
  let p = "";
  let endsWithSlash = false;
  for (let path of paths) {
    if (p[p.length - 1] === "/") {
      p = p.slice(0, -1);
      endsWithSlash = true;
    }
    if (path[0] !== "/") {
      path = `/${path}`;
    }
    if (path === "/" && endsWithSlash) {
      p = `${p}/`;
    } else if (path !== "/") {
      p = `${p}${path}`;
    }
    if (path === "/" && p === "") {
      p = "/";
    }
  }
  return p;
};
var checkOptionalParameter = (path) => {
  if (!path.match(/\:.+\?$/)) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v2, i, a2) => a2.indexOf(v2) === i);
};
var _decodeURI = (value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return /%/.test(value) ? decodeURIComponent_(value) : value;
};
var _getQueryParam = (url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf(`?${key}`, 8);
    if (keyIndex2 === -1) {
      keyIndex2 = url.indexOf(`&${key}`, 8);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var HonoRequest = class {
  raw;
  #validatedData;
  #matchResult;
  routeIndex = 0;
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.getDecodedParam(key) : this.getAllDecodedParams();
  }
  getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.getParamValue(paramKey);
    return param ? /\%/.test(param) ? decodeURIComponent_(param) : param : void 0;
  }
  getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value && typeof value === "string") {
        decoded[key] = /\%/.test(value) ? decodeURIComponent_(value) : value;
      }
    }
    return decoded;
  }
  getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name.toLowerCase()) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    if (this.bodyCache.parsedBody) {
      return this.bodyCache.parsedBody;
    }
    const parsedBody = await parseBody(this, options);
    this.bodyCache.parsedBody = parsedBody;
    return parsedBody;
  }
  cachedBody = (key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    if (!bodyCache[key]) {
      for (const keyOfBodyCache of Object.keys(bodyCache)) {
        if (keyOfBodyCache === "parsedBody") {
          continue;
        }
        return (async () => {
          let body = await bodyCache[keyOfBodyCache];
          if (keyOfBodyCache === "json") {
            body = JSON.stringify(body);
          }
          return await new Response(body)[key]();
        })();
      }
    }
    return bodyCache[key] = raw2[key]();
  };
  json() {
    return this.cachedBody("json");
  }
  text() {
    return this.cachedBody("text");
  }
  arrayBuffer() {
    return this.cachedBody("arrayBuffer");
  }
  blob() {
    return this.cachedBody("blob");
  }
  formData() {
    return this.cachedBody("formData");
  }
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/router.js
init_checked_fetch();
init_modules_watch_stub();
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// node_modules/hono/dist/hono-base.js
var COMPOSED_HANDLER = Symbol("composedHandler");
function defineDynamicClass() {
  return class {
  };
}
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var Hono = class extends defineDynamicClass() {
  router;
  getPath;
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    super();
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          if (typeof handler !== "string") {
            this.addRoute(method, this.#path, handler);
          }
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      if (!method) {
        return this;
      }
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const strict = options.strict ?? true;
    delete options.strict;
    Object.assign(this, options);
    this.getPath = strict ? options.getPath ?? getPath : getPathNoStrict;
  }
  clone() {
    const clone = new Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.routes = this.routes;
    return clone;
  }
  notFoundHandler = notFoundHandler;
  errorHandler = errorHandler;
  route(path, app2) {
    const subApp = this.basePath(path);
    if (!app2) {
      return subApp;
    }
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res;
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.addRoute(r.method, r.path, handler);
    });
    return this;
  }
  basePath(path) {
    const subApp = this.clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  onError = (handler) => {
    this.errorHandler = handler;
    return this;
  };
  notFound = (handler) => {
    this.notFoundHandler = handler;
    return this;
  };
  mount(path, applicationHandler, optionHandler) {
    const mergedPath = mergePath(this._basePath, path);
    const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
    const handler = async (c, next) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      const options = optionHandler ? optionHandler(c) : [c.env, executionContext];
      const optionsArray = Array.isArray(options) ? options : [options];
      const queryStrings = getQueryStrings(c.req.url);
      const res = await applicationHandler(
        new Request(
          new URL((c.req.path.slice(pathPrefixLength) || "/") + queryStrings, c.req.url),
          c.req.raw
        ),
        ...optionsArray
      );
      if (res) {
        return res;
      }
      await next();
    };
    this.addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  addRoute(method, path, handler) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { path, method, handler };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  matchRoute(method, path) {
    return this.router.match(method, path);
  }
  handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  dispatch(request, executionCtx, env2, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.dispatch(request, executionCtx, env2, "GET")))();
    }
    const path = this.getPath(request, { env: env2 });
    const matchResult = this.matchRoute(method, path);
    const c = new Context(new HonoRequest(request, path, matchResult), {
      env: env2,
      executionCtx,
      notFoundHandler: this.notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.notFoundHandler(c);
        });
      } catch (err) {
        return this.handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.notFoundHandler(c))
      ).catch((err) => this.handleError(err, c)) : res;
    }
    const composed = compose(matchResult[0], this.errorHandler, this.notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. You may forget returning Response object or `await next()`"
          );
        }
        return context.res;
      } catch (err) {
        return this.handleError(err, c);
      }
    })();
  }
  fetch = (request, Env2, executionCtx) => {
    return this.dispatch(request, executionCtx, Env2, request.method);
  };
  request = (input, requestInit, Env2, executionCtx) => {
    if (input instanceof Request) {
      if (requestInit !== void 0) {
        input = new Request(input, requestInit);
      }
      return this.fetch(input, Env2, executionCtx);
    }
    input = input.toString();
    const path = /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`;
    const req = new Request(path, requestInit);
    return this.fetch(req, Env2, executionCtx);
  };
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.dispatch(event.request, event, void 0, event.request.method));
    });
  };
};

// node_modules/hono/dist/router/reg-exp-router/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/router/reg-exp-router/router.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/router/reg-exp-router/node.js
init_checked_fetch();
init_modules_watch_stub();
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a2, b2) {
  if (a2.length === 1) {
    return b2.length === 1 ? a2 < b2 ? -1 : 1 : -1;
  }
  if (b2.length === 1) {
    return 1;
  }
  if (a2 === ONLY_WILDCARD_REG_EXP_STR || a2 === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b2 === ONLY_WILDCARD_REG_EXP_STR || b2 === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a2 === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b2 === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a2.length === b2.length ? a2 < b2 ? -1 : 1 : b2.length - a2.length;
}
var Node = class {
  index;
  varIndex;
  children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.children[regexpStr];
      if (!node) {
        if (Object.keys(this.children).some(
          (k2) => k2 !== ONLY_WILDCARD_REG_EXP_STR && k2 !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.children[regexpStr] = new Node();
        if (name !== "") {
          node.varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.varIndex]);
      }
    } else {
      node = this.children[token];
      if (!node) {
        if (Object.keys(this.children).some(
          (k2) => k2.length > 1 && k2 !== ONLY_WILDCARD_REG_EXP_STR && k2 !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.children[token] = new Node();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.children).sort(compareKey);
    const strList = childKeys.map((k2) => {
      const c = this.children[k2];
      return (typeof c.varIndex === "number" ? `(${k2})@${c.varIndex}` : regExpMetaChars.has(k2) ? `\\${k2}` : k2) + c.buildRegExpStr();
    });
    if (typeof this.index === "number") {
      strList.unshift(`#${this.index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
init_checked_fetch();
init_modules_watch_stub();
var Trie = class {
  context = { varIndex: 0 };
  root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j2 = tokens.length - 1; j2 >= 0; j2--) {
        if (tokens[j2].indexOf(mark) !== -1) {
          tokens[j2] = tokens[j2].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.root.insert(tokens, index, paramAssoc, this.context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_2, handlerIndex, paramIndex) => {
      if (typeof handlerIndex !== "undefined") {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (typeof paramIndex !== "undefined") {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var emptyParam = [];
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_2, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j2 = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h2]) => [h2, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j2++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j2, pathErrorCheckOnly);
    } catch (e2) {
      throw e2 === PATH_ERROR ? new UnsupportedPathError(path) : e2;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j2] = handlers.map(([h2, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h2, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j2 = 0, len2 = handlerData[i].length; j2 < len2; j2++) {
      const map = handlerData[i][j2]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k2 = 0, len3 = keys.length; k2 < len3; k2++) {
        map[keys[k2]] = paramReplacementMap[map[keys[k2]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k2 of Object.keys(middleware).sort((a2, b2) => b2.length - a2.length)) {
    if (buildWildcardRegExp(k2).test(path)) {
      return [...middleware[k2]];
    }
  }
  return void 0;
}
var RegExpRouter = class {
  name = "RegExpRouter";
  middleware;
  routes;
  constructor() {
    this.middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const { middleware, routes } = this;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re2 = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re2.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re2.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match(method, path) {
    clearWildcardRegExpCache();
    const matchers = this.buildAllMatchers();
    this.match = (method2, path2) => {
      const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
      const staticMatch = matcher[2][path2];
      if (staticMatch) {
        return staticMatch;
      }
      const match = path2.match(matcher[0]);
      if (!match) {
        return [[], emptyParam];
      }
      const index = match.indexOf("", 1);
      return [matcher[1][index], match];
    };
    return this.match(method, path);
  }
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    [...Object.keys(this.routes), ...Object.keys(this.middleware)].forEach((method) => {
      matchers[method] ||= this.buildMatcher(method);
    });
    this.middleware = this.routes = void 0;
    return matchers;
  }
  buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.middleware, this.routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// node_modules/hono/dist/router/smart-router/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/router/smart-router/router.js
init_checked_fetch();
init_modules_watch_stub();
var SmartRouter = class {
  name = "SmartRouter";
  routers = [];
  routes = [];
  constructor(init) {
    Object.assign(this, init);
  }
  add(method, path, handler) {
    if (!this.routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.routes) {
      throw new Error("Fatal error");
    }
    const { routers, routes } = this;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        routes.forEach((args) => {
          router.add(...args);
        });
        res = router.match(method, path);
      } catch (e2) {
        if (e2 instanceof UnsupportedPathError) {
          continue;
        }
        throw e2;
      }
      this.match = router.match.bind(router);
      this.routers = [router];
      this.routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.routes || this.routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/index.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/router/trie-router/router.js
init_checked_fetch();
init_modules_watch_stub();

// node_modules/hono/dist/router/trie-router/node.js
init_checked_fetch();
init_modules_watch_stub();
var Node2 = class {
  methods;
  children;
  patterns;
  order = 0;
  name;
  params = /* @__PURE__ */ Object.create(null);
  constructor(method, handler, children) {
    this.children = children || /* @__PURE__ */ Object.create(null);
    this.methods = [];
    this.name = "";
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0, name: this.name };
      this.methods = [m];
    }
    this.patterns = [];
  }
  insert(method, path, handler) {
    this.name = `${method} ${path}`;
    this.order = ++this.order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      if (Object.keys(curNode.children).includes(p)) {
        curNode = curNode.children[p];
        const pattern2 = getPattern(p);
        if (pattern2) {
          possibleKeys.push(pattern2[1]);
        }
        continue;
      }
      curNode.children[p] = new Node2();
      const pattern = getPattern(p);
      if (pattern) {
        curNode.patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.children[p];
    }
    if (!curNode.methods.length) {
      curNode.methods = [];
    }
    const m = /* @__PURE__ */ Object.create(null);
    const handlerSet = {
      handler,
      possibleKeys: possibleKeys.filter((v2, i, a2) => a2.indexOf(v2) === i),
      name: this.name,
      score: this.order
    };
    m[method] = handlerSet;
    curNode.methods.push(m);
    return curNode;
  }
  gHSets(node, method, nodeParams, params) {
    const handlerSets = [];
    for (let i = 0, len = node.methods.length; i < len; i++) {
      const m = node.methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = /* @__PURE__ */ Object.create(null);
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSet.possibleKeys.forEach((key) => {
          const processed = processedSet[handlerSet.name];
          handlerSet.params[key] = params[key] && !processed ? params[key] : nodeParams[key] ?? params[key];
          processedSet[handlerSet.name] = true;
        });
        handlerSets.push(handlerSet);
      }
    }
    return handlerSets;
  }
  search(method, path) {
    const handlerSets = [];
    this.params = /* @__PURE__ */ Object.create(null);
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    for (let i = 0, len = parts.length; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j2 = 0, len2 = curNodes.length; j2 < len2; j2++) {
        const node = curNodes[j2];
        const nextNode = node.children[part];
        if (nextNode) {
          nextNode.params = node.params;
          if (isLast === true) {
            if (nextNode.children["*"]) {
              handlerSets.push(
                ...this.gHSets(nextNode.children["*"], method, node.params, /* @__PURE__ */ Object.create(null))
              );
            }
            handlerSets.push(...this.gHSets(nextNode, method, node.params, /* @__PURE__ */ Object.create(null)));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k2 = 0, len3 = node.patterns.length; k2 < len3; k2++) {
          const pattern = node.patterns[k2];
          const params = { ...node.params };
          if (pattern === "*") {
            const astNode = node.children["*"];
            if (astNode) {
              handlerSets.push(...this.gHSets(astNode, method, node.params, /* @__PURE__ */ Object.create(null)));
              tempNodes.push(astNode);
            }
            continue;
          }
          if (part === "") {
            continue;
          }
          const [key, name, matcher] = pattern;
          const child = node.children[key];
          const restPathString = parts.slice(i).join("/");
          if (matcher instanceof RegExp && matcher.test(restPathString)) {
            params[name] = restPathString;
            handlerSets.push(...this.gHSets(child, method, node.params, params));
            continue;
          }
          if (matcher === true || matcher instanceof RegExp && matcher.test(part)) {
            if (typeof key === "string") {
              params[name] = part;
              if (isLast === true) {
                handlerSets.push(...this.gHSets(child, method, params, node.params));
                if (child.children["*"]) {
                  handlerSets.push(...this.gHSets(child.children["*"], method, params, node.params));
                }
              } else {
                child.params = params;
                tempNodes.push(child);
              }
            }
          }
        }
      }
      curNodes = tempNodes;
    }
    const results = handlerSets.sort((a2, b2) => {
      return a2.score - b2.score;
    });
    return [results.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  name = "TrieRouter";
  node;
  constructor() {
    this.node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (const p of results) {
        this.node.insert(method, p, handler);
      }
      return;
    }
    this.node.insert(method, path, handler);
  }
  match(method, path) {
    return this.node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// data.json
var data_default = [
  {
    userId: 1,
    id: 1,
    title: "delectus aut autem",
    completed: false
  },
  {
    userId: 1,
    id: 2,
    title: "quis ut nam facilis et officia qui",
    completed: false
  },
  {
    userId: 1,
    id: 3,
    title: "fugiat veniam minus",
    completed: false
  },
  {
    userId: 1,
    id: 4,
    title: "et porro tempora",
    completed: true
  },
  {
    userId: 1,
    id: 5,
    title: "laboriosam mollitia et enim quasi adipisci quia provident illum",
    completed: false
  },
  {
    userId: 1,
    id: 6,
    title: "qui ullam ratione quibusdam voluptatem quia omnis",
    completed: false
  },
  {
    userId: 1,
    id: 7,
    title: "illo expedita consequatur quia in",
    completed: false
  },
  {
    userId: 1,
    id: 8,
    title: "quo adipisci enim quam ut ab",
    completed: true
  },
  {
    userId: 1,
    id: 9,
    title: "molestiae perspiciatis ipsa",
    completed: false
  },
  {
    userId: 1,
    id: 10,
    title: "illo est ratione doloremque quia maiores aut",
    completed: true
  },
  {
    userId: 1,
    id: 11,
    title: "vero rerum temporibus dolor",
    completed: true
  },
  {
    userId: 1,
    id: 12,
    title: "ipsa repellendus fugit nisi",
    completed: true
  },
  {
    userId: 1,
    id: 13,
    title: "et doloremque nulla",
    completed: false
  },
  {
    userId: 1,
    id: 14,
    title: "repellendus sunt dolores architecto voluptatum",
    completed: true
  },
  {
    userId: 1,
    id: 15,
    title: "ab voluptatum amet voluptas",
    completed: true
  },
  {
    userId: 1,
    id: 16,
    title: "accusamus eos facilis sint et aut voluptatem",
    completed: true
  },
  {
    userId: 1,
    id: 17,
    title: "quo laboriosam deleniti aut qui",
    completed: true
  },
  {
    userId: 1,
    id: 18,
    title: "dolorum est consequatur ea mollitia in culpa",
    completed: false
  },
  {
    userId: 1,
    id: 19,
    title: "molestiae ipsa aut voluptatibus pariatur dolor nihil",
    completed: true
  },
  {
    userId: 1,
    id: 20,
    title: "ullam nobis libero sapiente ad optio sint",
    completed: true
  },
  {
    userId: 2,
    id: 21,
    title: "suscipit repellat esse quibusdam voluptatem incidunt",
    completed: false
  },
  {
    userId: 2,
    id: 22,
    title: "distinctio vitae autem nihil ut molestias quo",
    completed: true
  },
  {
    userId: 2,
    id: 23,
    title: "et itaque necessitatibus maxime molestiae qui quas velit",
    completed: false
  },
  {
    userId: 2,
    id: 24,
    title: "adipisci non ad dicta qui amet quaerat doloribus ea",
    completed: false
  },
  {
    userId: 2,
    id: 25,
    title: "voluptas quo tenetur perspiciatis explicabo natus",
    completed: true
  },
  {
    userId: 2,
    id: 26,
    title: "aliquam aut quasi",
    completed: true
  },
  {
    userId: 2,
    id: 27,
    title: "veritatis pariatur delectus",
    completed: true
  },
  {
    userId: 2,
    id: 28,
    title: "nesciunt totam sit blanditiis sit",
    completed: false
  },
  {
    userId: 2,
    id: 29,
    title: "laborum aut in quam",
    completed: false
  },
  {
    userId: 2,
    id: 30,
    title: "nemo perspiciatis repellat ut dolor libero commodi blanditiis omnis",
    completed: true
  },
  {
    userId: 2,
    id: 31,
    title: "repudiandae totam in est sint facere fuga",
    completed: false
  },
  {
    userId: 2,
    id: 32,
    title: "earum doloribus ea doloremque quis",
    completed: false
  },
  {
    userId: 2,
    id: 33,
    title: "sint sit aut vero",
    completed: false
  },
  {
    userId: 2,
    id: 34,
    title: "porro aut necessitatibus eaque distinctio",
    completed: false
  },
  {
    userId: 2,
    id: 35,
    title: "repellendus veritatis molestias dicta incidunt",
    completed: true
  },
  {
    userId: 2,
    id: 36,
    title: "excepturi deleniti adipisci voluptatem et neque optio illum ad",
    completed: true
  },
  {
    userId: 2,
    id: 37,
    title: "sunt cum tempora",
    completed: false
  },
  {
    userId: 2,
    id: 38,
    title: "totam quia non",
    completed: false
  },
  {
    userId: 2,
    id: 39,
    title: "doloremque quibusdam asperiores libero corrupti illum qui omnis",
    completed: false
  },
  {
    userId: 2,
    id: 40,
    title: "totam atque quo nesciunt",
    completed: true
  },
  {
    userId: 3,
    id: 41,
    title: "aliquid amet impedit consequatur aspernatur placeat eaque fugiat suscipit",
    completed: false
  },
  {
    userId: 3,
    id: 42,
    title: "rerum perferendis error quia ut eveniet",
    completed: false
  },
  {
    userId: 3,
    id: 43,
    title: "tempore ut sint quis recusandae",
    completed: true
  },
  {
    userId: 3,
    id: 44,
    title: "cum debitis quis accusamus doloremque ipsa natus sapiente omnis",
    completed: true
  },
  {
    userId: 3,
    id: 45,
    title: "velit soluta adipisci molestias reiciendis harum",
    completed: false
  },
  {
    userId: 3,
    id: 46,
    title: "vel voluptatem repellat nihil placeat corporis",
    completed: false
  },
  {
    userId: 3,
    id: 47,
    title: "nam qui rerum fugiat accusamus",
    completed: false
  },
  {
    userId: 3,
    id: 48,
    title: "sit reprehenderit omnis quia",
    completed: false
  },
  {
    userId: 3,
    id: 49,
    title: "ut necessitatibus aut maiores debitis officia blanditiis velit et",
    completed: false
  },
  {
    userId: 3,
    id: 50,
    title: "cupiditate necessitatibus ullam aut quis dolor voluptate",
    completed: true
  },
  {
    userId: 3,
    id: 51,
    title: "distinctio exercitationem ab doloribus",
    completed: false
  },
  {
    userId: 3,
    id: 52,
    title: "nesciunt dolorum quis recusandae ad pariatur ratione",
    completed: false
  },
  {
    userId: 3,
    id: 53,
    title: "qui labore est occaecati recusandae aliquid quam",
    completed: false
  },
  {
    userId: 3,
    id: 54,
    title: "quis et est ut voluptate quam dolor",
    completed: true
  },
  {
    userId: 3,
    id: 55,
    title: "voluptatum omnis minima qui occaecati provident nulla voluptatem ratione",
    completed: true
  },
  {
    userId: 3,
    id: 56,
    title: "deleniti ea temporibus enim",
    completed: true
  },
  {
    userId: 3,
    id: 57,
    title: "pariatur et magnam ea doloribus similique voluptatem rerum quia",
    completed: false
  },
  {
    userId: 3,
    id: 58,
    title: "est dicta totam qui explicabo doloribus qui dignissimos",
    completed: false
  },
  {
    userId: 3,
    id: 59,
    title: "perspiciatis velit id laborum placeat iusto et aliquam odio",
    completed: false
  },
  {
    userId: 3,
    id: 60,
    title: "et sequi qui architecto ut adipisci",
    completed: true
  },
  {
    userId: 4,
    id: 61,
    title: "odit optio omnis qui sunt",
    completed: true
  },
  {
    userId: 4,
    id: 62,
    title: "et placeat et tempore aspernatur sint numquam",
    completed: false
  },
  {
    userId: 4,
    id: 63,
    title: "doloremque aut dolores quidem fuga qui nulla",
    completed: true
  },
  {
    userId: 4,
    id: 64,
    title: "voluptas consequatur qui ut quia magnam nemo esse",
    completed: false
  },
  {
    userId: 4,
    id: 65,
    title: "fugiat pariatur ratione ut asperiores necessitatibus magni",
    completed: false
  },
  {
    userId: 4,
    id: 66,
    title: "rerum eum molestias autem voluptatum sit optio",
    completed: false
  },
  {
    userId: 4,
    id: 67,
    title: "quia voluptatibus voluptatem quos similique maiores repellat",
    completed: false
  },
  {
    userId: 4,
    id: 68,
    title: "aut id perspiciatis voluptatem iusto",
    completed: false
  },
  {
    userId: 4,
    id: 69,
    title: "doloribus sint dolorum ab adipisci itaque dignissimos aliquam suscipit",
    completed: false
  },
  {
    userId: 4,
    id: 70,
    title: "ut sequi accusantium et mollitia delectus sunt",
    completed: false
  },
  {
    userId: 4,
    id: 71,
    title: "aut velit saepe ullam",
    completed: false
  },
  {
    userId: 4,
    id: 72,
    title: "praesentium facilis facere quis harum voluptatibus voluptatem eum",
    completed: false
  },
  {
    userId: 4,
    id: 73,
    title: "sint amet quia totam corporis qui exercitationem commodi",
    completed: true
  },
  {
    userId: 4,
    id: 74,
    title: "expedita tempore nobis eveniet laborum maiores",
    completed: false
  },
  {
    userId: 4,
    id: 75,
    title: "occaecati adipisci est possimus totam",
    completed: false
  },
  {
    userId: 4,
    id: 76,
    title: "sequi dolorem sed",
    completed: true
  },
  {
    userId: 4,
    id: 77,
    title: "maiores aut nesciunt delectus exercitationem vel assumenda eligendi at",
    completed: false
  },
  {
    userId: 4,
    id: 78,
    title: "reiciendis est magnam amet nemo iste recusandae impedit quaerat",
    completed: false
  },
  {
    userId: 4,
    id: 79,
    title: "eum ipsa maxime ut",
    completed: true
  },
  {
    userId: 4,
    id: 80,
    title: "tempore molestias dolores rerum sequi voluptates ipsum consequatur",
    completed: true
  },
  {
    userId: 5,
    id: 81,
    title: "suscipit qui totam",
    completed: true
  },
  {
    userId: 5,
    id: 82,
    title: "voluptates eum voluptas et dicta",
    completed: false
  },
  {
    userId: 5,
    id: 83,
    title: "quidem at rerum quis ex aut sit quam",
    completed: true
  },
  {
    userId: 5,
    id: 84,
    title: "sunt veritatis ut voluptate",
    completed: false
  },
  {
    userId: 5,
    id: 85,
    title: "et quia ad iste a",
    completed: true
  },
  {
    userId: 5,
    id: 86,
    title: "incidunt ut saepe autem",
    completed: true
  },
  {
    userId: 5,
    id: 87,
    title: "laudantium quae eligendi consequatur quia et vero autem",
    completed: true
  },
  {
    userId: 5,
    id: 88,
    title: "vitae aut excepturi laboriosam sint aliquam et et accusantium",
    completed: false
  },
  {
    userId: 5,
    id: 89,
    title: "sequi ut omnis et",
    completed: true
  },
  {
    userId: 5,
    id: 90,
    title: "molestiae nisi accusantium tenetur dolorem et",
    completed: true
  },
  {
    userId: 5,
    id: 91,
    title: "nulla quis consequatur saepe qui id expedita",
    completed: true
  },
  {
    userId: 5,
    id: 92,
    title: "in omnis laboriosam",
    completed: true
  },
  {
    userId: 5,
    id: 93,
    title: "odio iure consequatur molestiae quibusdam necessitatibus quia sint",
    completed: true
  },
  {
    userId: 5,
    id: 94,
    title: "facilis modi saepe mollitia",
    completed: false
  },
  {
    userId: 5,
    id: 95,
    title: "vel nihil et molestiae iusto assumenda nemo quo ut",
    completed: true
  },
  {
    userId: 5,
    id: 96,
    title: "nobis suscipit ducimus enim asperiores voluptas",
    completed: false
  },
  {
    userId: 5,
    id: 97,
    title: "dolorum laboriosam eos qui iure aliquam",
    completed: false
  },
  {
    userId: 5,
    id: 98,
    title: "debitis accusantium ut quo facilis nihil quis sapiente necessitatibus",
    completed: true
  },
  {
    userId: 5,
    id: 99,
    title: "neque voluptates ratione",
    completed: false
  },
  {
    userId: 5,
    id: 100,
    title: "excepturi a et neque qui expedita vel voluptate",
    completed: false
  },
  {
    userId: 6,
    id: 101,
    title: "explicabo enim cumque porro aperiam occaecati minima",
    completed: false
  },
  {
    userId: 6,
    id: 102,
    title: "sed ab consequatur",
    completed: false
  },
  {
    userId: 6,
    id: 103,
    title: "non sunt delectus illo nulla tenetur enim omnis",
    completed: false
  },
  {
    userId: 6,
    id: 104,
    title: "excepturi non laudantium quo",
    completed: false
  },
  {
    userId: 6,
    id: 105,
    title: "totam quia dolorem et illum repellat voluptas optio",
    completed: true
  },
  {
    userId: 6,
    id: 106,
    title: "ad illo quis voluptatem temporibus",
    completed: true
  },
  {
    userId: 6,
    id: 107,
    title: "praesentium facilis omnis laudantium fugit ad iusto nihil nesciunt",
    completed: false
  },
  {
    userId: 6,
    id: 108,
    title: "a eos eaque nihil et exercitationem incidunt delectus",
    completed: true
  },
  {
    userId: 6,
    id: 109,
    title: "autem temporibus harum quisquam in culpa",
    completed: true
  },
  {
    userId: 6,
    id: 110,
    title: "aut aut ea corporis",
    completed: true
  },
  {
    userId: 6,
    id: 111,
    title: "magni accusantium labore et id quis provident",
    completed: false
  },
  {
    userId: 6,
    id: 112,
    title: "consectetur impedit quisquam qui deserunt non rerum consequuntur eius",
    completed: false
  },
  {
    userId: 6,
    id: 113,
    title: "quia atque aliquam sunt impedit voluptatum rerum assumenda nisi",
    completed: false
  },
  {
    userId: 6,
    id: 114,
    title: "cupiditate quos possimus corporis quisquam exercitationem beatae",
    completed: false
  },
  {
    userId: 6,
    id: 115,
    title: "sed et ea eum",
    completed: false
  },
  {
    userId: 6,
    id: 116,
    title: "ipsa dolores vel facilis ut",
    completed: true
  },
  {
    userId: 6,
    id: 117,
    title: "sequi quae est et qui qui eveniet asperiores",
    completed: false
  },
  {
    userId: 6,
    id: 118,
    title: "quia modi consequatur vero fugiat",
    completed: false
  },
  {
    userId: 6,
    id: 119,
    title: "corporis ducimus ea perspiciatis iste",
    completed: false
  },
  {
    userId: 6,
    id: 120,
    title: "dolorem laboriosam vel voluptas et aliquam quasi",
    completed: false
  },
  {
    userId: 7,
    id: 121,
    title: "inventore aut nihil minima laudantium hic qui omnis",
    completed: true
  },
  {
    userId: 7,
    id: 122,
    title: "provident aut nobis culpa",
    completed: true
  },
  {
    userId: 7,
    id: 123,
    title: "esse et quis iste est earum aut impedit",
    completed: false
  },
  {
    userId: 7,
    id: 124,
    title: "qui consectetur id",
    completed: false
  },
  {
    userId: 7,
    id: 125,
    title: "aut quasi autem iste tempore illum possimus",
    completed: false
  },
  {
    userId: 7,
    id: 126,
    title: "ut asperiores perspiciatis veniam ipsum rerum saepe",
    completed: true
  },
  {
    userId: 7,
    id: 127,
    title: "voluptatem libero consectetur rerum ut",
    completed: true
  },
  {
    userId: 7,
    id: 128,
    title: "eius omnis est qui voluptatem autem",
    completed: false
  },
  {
    userId: 7,
    id: 129,
    title: "rerum culpa quis harum",
    completed: false
  },
  {
    userId: 7,
    id: 130,
    title: "nulla aliquid eveniet harum laborum libero alias ut unde",
    completed: true
  },
  {
    userId: 7,
    id: 131,
    title: "qui ea incidunt quis",
    completed: false
  },
  {
    userId: 7,
    id: 132,
    title: "qui molestiae voluptatibus velit iure harum quisquam",
    completed: true
  },
  {
    userId: 7,
    id: 133,
    title: "et labore eos enim rerum consequatur sunt",
    completed: true
  },
  {
    userId: 7,
    id: 134,
    title: "molestiae doloribus et laborum quod ea",
    completed: false
  },
  {
    userId: 7,
    id: 135,
    title: "facere ipsa nam eum voluptates reiciendis vero qui",
    completed: false
  },
  {
    userId: 7,
    id: 136,
    title: "asperiores illo tempora fuga sed ut quasi adipisci",
    completed: false
  },
  {
    userId: 7,
    id: 137,
    title: "qui sit non",
    completed: false
  },
  {
    userId: 7,
    id: 138,
    title: "placeat minima consequatur rem qui ut",
    completed: true
  },
  {
    userId: 7,
    id: 139,
    title: "consequatur doloribus id possimus voluptas a voluptatem",
    completed: false
  },
  {
    userId: 7,
    id: 140,
    title: "aut consectetur in blanditiis deserunt quia sed laboriosam",
    completed: true
  },
  {
    userId: 8,
    id: 141,
    title: "explicabo consectetur debitis voluptates quas quae culpa rerum non",
    completed: true
  },
  {
    userId: 8,
    id: 142,
    title: "maiores accusantium architecto necessitatibus reiciendis ea aut",
    completed: true
  },
  {
    userId: 8,
    id: 143,
    title: "eum non recusandae cupiditate animi",
    completed: false
  },
  {
    userId: 8,
    id: 144,
    title: "ut eum exercitationem sint",
    completed: false
  },
  {
    userId: 8,
    id: 145,
    title: "beatae qui ullam incidunt voluptatem non nisi aliquam",
    completed: false
  },
  {
    userId: 8,
    id: 146,
    title: "molestiae suscipit ratione nihil odio libero impedit vero totam",
    completed: true
  },
  {
    userId: 8,
    id: 147,
    title: "eum itaque quod reprehenderit et facilis dolor autem ut",
    completed: true
  },
  {
    userId: 8,
    id: 148,
    title: "esse quas et quo quasi exercitationem",
    completed: false
  },
  {
    userId: 8,
    id: 149,
    title: "animi voluptas quod perferendis est",
    completed: false
  },
  {
    userId: 8,
    id: 150,
    title: "eos amet tempore laudantium fugit a",
    completed: false
  },
  {
    userId: 8,
    id: 151,
    title: "accusamus adipisci dicta qui quo ea explicabo sed vero",
    completed: true
  },
  {
    userId: 8,
    id: 152,
    title: "odit eligendi recusandae doloremque cumque non",
    completed: false
  },
  {
    userId: 8,
    id: 153,
    title: "ea aperiam consequatur qui repellat eos",
    completed: false
  },
  {
    userId: 8,
    id: 154,
    title: "rerum non ex sapiente",
    completed: true
  },
  {
    userId: 8,
    id: 155,
    title: "voluptatem nobis consequatur et assumenda magnam",
    completed: true
  },
  {
    userId: 8,
    id: 156,
    title: "nam quia quia nulla repellat assumenda quibusdam sit nobis",
    completed: true
  },
  {
    userId: 8,
    id: 157,
    title: "dolorem veniam quisquam deserunt repellendus",
    completed: true
  },
  {
    userId: 8,
    id: 158,
    title: "debitis vitae delectus et harum accusamus aut deleniti a",
    completed: true
  },
  {
    userId: 8,
    id: 159,
    title: "debitis adipisci quibusdam aliquam sed dolore ea praesentium nobis",
    completed: true
  },
  {
    userId: 8,
    id: 160,
    title: "et praesentium aliquam est",
    completed: false
  },
  {
    userId: 9,
    id: 161,
    title: "ex hic consequuntur earum omnis alias ut occaecati culpa",
    completed: true
  },
  {
    userId: 9,
    id: 162,
    title: "omnis laboriosam molestias animi sunt dolore",
    completed: true
  },
  {
    userId: 9,
    id: 163,
    title: "natus corrupti maxime laudantium et voluptatem laboriosam odit",
    completed: false
  },
  {
    userId: 9,
    id: 164,
    title: "reprehenderit quos aut aut consequatur est sed",
    completed: false
  },
  {
    userId: 9,
    id: 165,
    title: "fugiat perferendis sed aut quidem",
    completed: false
  },
  {
    userId: 9,
    id: 166,
    title: "quos quo possimus suscipit minima ut",
    completed: false
  },
  {
    userId: 9,
    id: 167,
    title: "et quis minus quo a asperiores molestiae",
    completed: false
  },
  {
    userId: 9,
    id: 168,
    title: "recusandae quia qui sunt libero",
    completed: false
  },
  {
    userId: 9,
    id: 169,
    title: "ea odio perferendis officiis",
    completed: true
  },
  {
    userId: 9,
    id: 170,
    title: "quisquam aliquam quia doloribus aut",
    completed: false
  },
  {
    userId: 9,
    id: 171,
    title: "fugiat aut voluptatibus corrupti deleniti velit iste odio",
    completed: true
  },
  {
    userId: 9,
    id: 172,
    title: "et provident amet rerum consectetur et voluptatum",
    completed: false
  },
  {
    userId: 9,
    id: 173,
    title: "harum ad aperiam quis",
    completed: false
  },
  {
    userId: 9,
    id: 174,
    title: "similique aut quo",
    completed: false
  },
  {
    userId: 9,
    id: 175,
    title: "laudantium eius officia perferendis provident perspiciatis asperiores",
    completed: true
  },
  {
    userId: 9,
    id: 176,
    title: "magni soluta corrupti ut maiores rem quidem",
    completed: false
  },
  {
    userId: 9,
    id: 177,
    title: "et placeat temporibus voluptas est tempora quos quibusdam",
    completed: false
  },
  {
    userId: 9,
    id: 178,
    title: "nesciunt itaque commodi tempore",
    completed: true
  },
  {
    userId: 9,
    id: 179,
    title: "omnis consequuntur cupiditate impedit itaque ipsam quo",
    completed: true
  },
  {
    userId: 9,
    id: 180,
    title: "debitis nisi et dolorem repellat et",
    completed: true
  },
  {
    userId: 10,
    id: 181,
    title: "ut cupiditate sequi aliquam fuga maiores",
    completed: false
  },
  {
    userId: 10,
    id: 182,
    title: "inventore saepe cumque et aut illum enim",
    completed: true
  },
  {
    userId: 10,
    id: 183,
    title: "omnis nulla eum aliquam distinctio",
    completed: true
  },
  {
    userId: 10,
    id: 184,
    title: "molestias modi perferendis perspiciatis",
    completed: false
  },
  {
    userId: 10,
    id: 185,
    title: "voluptates dignissimos sed doloribus animi quaerat aut",
    completed: false
  },
  {
    userId: 10,
    id: 186,
    title: "explicabo odio est et",
    completed: false
  },
  {
    userId: 10,
    id: 187,
    title: "consequuntur animi possimus",
    completed: false
  },
  {
    userId: 10,
    id: 188,
    title: "vel non beatae est",
    completed: true
  },
  {
    userId: 10,
    id: 189,
    title: "culpa eius et voluptatem et",
    completed: true
  },
  {
    userId: 10,
    id: 190,
    title: "accusamus sint iusto et voluptatem exercitationem",
    completed: true
  },
  {
    userId: 10,
    id: 191,
    title: "temporibus atque distinctio omnis eius impedit tempore molestias pariatur",
    completed: true
  },
  {
    userId: 10,
    id: 192,
    title: "ut quas possimus exercitationem sint voluptates",
    completed: false
  },
  {
    userId: 10,
    id: 193,
    title: "rerum debitis voluptatem qui eveniet tempora distinctio a",
    completed: true
  },
  {
    userId: 10,
    id: 194,
    title: "sed ut vero sit molestiae",
    completed: false
  },
  {
    userId: 10,
    id: 195,
    title: "rerum ex veniam mollitia voluptatibus pariatur",
    completed: true
  },
  {
    userId: 10,
    id: 196,
    title: "consequuntur aut ut fugit similique",
    completed: true
  },
  {
    userId: 10,
    id: 197,
    title: "dignissimos quo nobis earum saepe",
    completed: true
  },
  {
    userId: 10,
    id: 198,
    title: "quis eius est sint explicabo",
    completed: true
  },
  {
    userId: 10,
    id: 199,
    title: "numquam repellendus a magnam",
    completed: true
  },
  {
    userId: 10,
    id: 200,
    title: "ipsam aperiam voluptates qui",
    completed: false
  }
];

// index.ts
var import_ratelimit = __toESM(require_dist2());

// node_modules/hono/dist/helper/adapter/index.js
init_checked_fetch();
init_modules_watch_stub();
var env = (c, runtime) => {
  const global2 = globalThis;
  const globalEnv = global2?.process?.env;
  runtime ??= getRuntimeKey();
  const runtimeEnvHandlers = {
    bun: () => globalEnv,
    node: () => globalEnv,
    "edge-light": () => globalEnv,
    deno: () => {
      return Deno.env.toObject();
    },
    workerd: () => c.env,
    fastly: () => ({}),
    other: () => ({})
  };
  return runtimeEnvHandlers[runtime]();
};
var getRuntimeKey = () => {
  const global2 = globalThis;
  if (global2?.Deno !== void 0) {
    return "deno";
  }
  if (global2?.Bun !== void 0) {
    return "bun";
  }
  if (typeof global2?.WebSocketPair === "function") {
    return "workerd";
  }
  if (typeof global2?.EdgeRuntime === "string") {
    return "edge-light";
  }
  if (global2?.fastly !== void 0) {
    return "fastly";
  }
  if (global2?.process?.release?.name === "node") {
    return "node";
  }
  return "other";
};

// node_modules/@upstash/redis/nodejs.mjs
init_checked_fetch();
init_modules_watch_stub();

// node_modules/@upstash/redis/chunk-DKKYFKP2.mjs
init_checked_fetch();
init_modules_watch_stub();
var import_enc_hex = __toESM(require_enc_hex(), 1);
var import_sha1 = __toESM(require_sha1(), 1);
var u = class extends Error {
  constructor(n) {
    super(n), this.name = "UpstashError";
  }
};
var De = class {
  baseUrl;
  headers;
  options;
  retry;
  constructor(n) {
    this.options = { backend: n.options?.backend, agent: n.agent, responseEncoding: n.responseEncoding ?? "base64", cache: n.cache, signal: n.signal }, this.baseUrl = n.baseUrl.replace(/\/$/, ""), this.headers = { "Content-Type": "application/json", ...n.headers }, this.options.responseEncoding === "base64" && (this.headers["Upstash-Encoding"] = "base64"), typeof n?.retry == "boolean" && n?.retry === false ? this.retry = { attempts: 1, backoff: () => 0 } : this.retry = { attempts: n?.retry?.retries ?? 5, backoff: n?.retry?.backoff ?? ((t2) => Math.exp(t2) * 50) };
  }
  mergeTelemetry(n) {
    function t2(o, m, r) {
      return r && (o[m] ? o[m] = [o[m], r].join(",") : o[m] = r), o;
    }
    this.headers = t2(this.headers, "Upstash-Telemetry-Runtime", n.runtime), this.headers = t2(this.headers, "Upstash-Telemetry-Platform", n.platform), this.headers = t2(this.headers, "Upstash-Telemetry-Sdk", n.sdk);
  }
  async request(n) {
    let t2 = { cache: this.options.cache, method: "POST", headers: this.headers, body: JSON.stringify(n.body), keepalive: true, agent: this.options?.agent, signal: this.options.signal, backend: this.options?.backend }, o = null, m = null;
    for (let a2 = 0; a2 <= this.retry.attempts; a2++)
      try {
        o = await fetch([this.baseUrl, ...n.path ?? []].join("/"), t2);
        break;
      } catch (i) {
        if (this.options.signal?.aborted) {
          let p = new Blob([JSON.stringify({ result: this.options.signal.reason ?? "Aborted" })]), d = { status: 200, statusText: this.options.signal.reason ?? "Aborted" };
          o = new Response(p, d);
          break;
        }
        m = i, await new Promise((p) => setTimeout(p, this.retry.backoff(a2)));
      }
    if (!o)
      throw m ?? new Error("Exhausted all retries");
    let r = await o.json();
    if (!o.ok)
      throw new u(`${r.error}, command was: ${JSON.stringify(n.body)}`);
    return this.options?.responseEncoding === "base64" ? Array.isArray(r) ? r.map(({ result: i, error: p }) => ({ result: Te(i), error: p })) : { result: Te(r.result), error: r.error } : r;
  }
};
function we(s) {
  let n = "";
  try {
    let t2 = atob(s), o = t2.length, m = new Uint8Array(o);
    for (let r = 0; r < o; r++)
      m[r] = t2.charCodeAt(r);
    n = new TextDecoder().decode(m);
  } catch {
    n = s;
  }
  return n;
}
function Te(s) {
  let n;
  switch (typeof s) {
    case "undefined":
      return s;
    case "number": {
      n = s;
      break;
    }
    case "object": {
      Array.isArray(s) ? n = s.map((t2) => typeof t2 == "string" ? we(t2) : Array.isArray(t2) ? t2.map(Te) : t2) : n = null;
      break;
    }
    case "string": {
      n = s === "OK" ? "OK" : we(s);
      break;
    }
    default:
      break;
  }
  return n;
}
function Ae(s) {
  let n = Array.isArray(s) ? s.map((t2) => {
    try {
      return Ae(t2);
    } catch {
      return t2;
    }
  }) : JSON.parse(s);
  return typeof n == "number" && n.toString() !== s ? s : n;
}
function ke(s) {
  try {
    return Ae(s);
  } catch {
    return s;
  }
}
var Se = (s) => {
  switch (typeof s) {
    case "string":
    case "number":
    case "boolean":
      return s;
    default:
      return JSON.stringify(s);
  }
};
var e = class {
  command;
  serialize;
  deserialize;
  constructor(n, t2) {
    if (this.serialize = Se, this.deserialize = typeof t2?.automaticDeserialization > "u" || t2.automaticDeserialization ? t2?.deserialize ?? ke : (o) => o, this.command = n.map((o) => this.serialize(o)), t2?.latencyLogging) {
      let o = this.exec.bind(this);
      this.exec = async (m) => {
        let r = performance.now(), a2 = await o(m), p = (performance.now() - r).toFixed(2);
        return console.log(`Latency for \x1B[38;2;19;185;39m${this.command[0].toString().toUpperCase()}\x1B[0m: \x1B[38;2;0;255;255m${p} ms\x1B[0m`), a2;
      };
    }
  }
  async exec(n) {
    let { result: t2, error: o } = await n.request({ body: this.command });
    if (o)
      throw new u(o);
    if (typeof t2 > "u")
      throw new Error("Request did not return a result");
    return this.deserialize(t2);
  }
};
var l = class extends e {
  constructor(n, t2) {
    super(["append", ...n], t2);
  }
};
var g = class extends e {
  constructor([n, t2, o], m) {
    let r = ["bitcount", n];
    typeof t2 == "number" && r.push(t2), typeof o == "number" && r.push(o), super(r, m);
  }
};
var x = class extends e {
  constructor(n, t2) {
    super(["bitop", ...n], t2);
  }
};
var f = class extends e {
  constructor(n, t2) {
    super(["bitpos", ...n], t2);
  }
};
var y = class extends e {
  constructor([n, t2, o], m) {
    super(["COPY", n, t2, ...o?.replace ? ["REPLACE"] : []], { ...m, deserialize(r) {
      return r > 0 ? "COPIED" : "NOT_COPIED";
    } });
  }
};
var b = class extends e {
  constructor(n) {
    super(["dbsize"], n);
  }
};
var O = class extends e {
  constructor(n, t2) {
    super(["decr", ...n], t2);
  }
};
var T = class extends e {
  constructor(n, t2) {
    super(["decrby", ...n], t2);
  }
};
var D = class extends e {
  constructor(n, t2) {
    super(["del", ...n], t2);
  }
};
var w = class extends e {
  constructor(n, t2) {
    super(["echo", ...n], t2);
  }
};
var A = class extends e {
  constructor([n, t2, o], m) {
    super(["eval", n, t2.length, ...t2, ...o ?? []], m);
  }
};
var k = class extends e {
  constructor([n, t2, o], m) {
    super(["evalsha", n, t2.length, ...t2, ...o ?? []], m);
  }
};
var R = class extends e {
  constructor(n, t2) {
    super(["exists", ...n], t2);
  }
};
var S = class extends e {
  constructor(n, t2) {
    super(["expire", ...n], t2);
  }
};
var E = class extends e {
  constructor(n, t2) {
    super(["expireat", ...n], t2);
  }
};
var M = class extends e {
  constructor(n, t2) {
    let o = ["flushall"];
    n && n.length > 0 && n[0].async && o.push("async"), super(o, t2);
  }
};
var v = class extends e {
  constructor([n], t2) {
    let o = ["flushdb"];
    n?.async && o.push("async"), super(o, t2);
  }
};
var I = class extends e {
  constructor([n, t2, ...o], m) {
    let r = ["geoadd", n];
    "nx" in t2 && t2.nx ? r.push("nx") : "xx" in t2 && t2.xx && r.push("xx"), "ch" in t2 && t2.ch && r.push("ch"), "latitude" in t2 && t2.latitude && r.push(t2.longitude, t2.latitude, t2.member), r.push(...o.flatMap(({ latitude: a2, longitude: i, member: p }) => [i, a2, p])), super(r, m);
  }
};
var N = class extends e {
  constructor([n, t2, o, m = "M"], r) {
    super(["GEODIST", n, t2, o, m], r);
  }
};
var L = class extends e {
  constructor(n, t2) {
    let [o] = n, m = Array.isArray(n[1]) ? n[1] : n.slice(1);
    super(["GEOHASH", o, ...m], t2);
  }
};
var P = class extends e {
  constructor(n, t2) {
    let [o] = n, m = Array.isArray(n[1]) ? n[1] : n.slice(1);
    super(["GEOPOS", o, ...m], { deserialize: (r) => Ee(r), ...t2 });
  }
};
function Ee(s) {
  let n = [];
  for (let t2 of s)
    !t2?.[0] || !t2?.[1] || n.push({ lng: parseFloat(t2[0]), lat: parseFloat(t2[1]) });
  return n;
}
var K = class extends e {
  constructor([n, t2, o, m, r], a2) {
    let i = ["GEOSEARCH", n];
    (t2.type === "FROMMEMBER" || t2.type === "frommember") && i.push(t2.type, t2.member), (t2.type === "FROMLONLAT" || t2.type === "fromlonlat") && i.push(t2.type, t2.coordinate.lon, t2.coordinate.lat), (o.type === "BYRADIUS" || o.type === "byradius") && i.push(o.type, o.radius, o.radiusType), (o.type === "BYBOX" || o.type === "bybox") && i.push(o.type, o.rect.width, o.rect.height, o.rectType), i.push(m), r?.count && i.push("COUNT", r.count.limit, ...r.count.any ? ["ANY"] : []);
    let p = (d) => !r?.withCoord && !r?.withDist && !r?.withHash ? d.map((c) => {
      try {
        return { member: JSON.parse(c) };
      } catch {
        return { member: c };
      }
    }) : d.map((c) => {
      let be = 1, C = {};
      try {
        C.member = JSON.parse(c[0]);
      } catch {
        C.member = c[0];
      }
      return r.withDist && (C.dist = parseFloat(c[be++])), r.withHash && (C.hash = c[be++].toString()), r.withCoord && (C.coord = { long: parseFloat(c[be][0]), lat: parseFloat(c[be][1]) }), C;
    });
    super([...i, ...r?.withCoord ? ["WITHCOORD"] : [], ...r?.withDist ? ["WITHDIST"] : [], ...r?.withHash ? ["WITHHASH"] : []], { ...a2, deserialize: p });
  }
};
var G = class extends e {
  constructor([n, t2, o, m, r, a2], i) {
    let p = ["GEOSEARCHSTORE", n, t2];
    (o.type === "FROMMEMBER" || o.type === "frommember") && p.push(o.type, o.member), (o.type === "FROMLONLAT" || o.type === "fromlonlat") && p.push(o.type, o.coordinate.lon, o.coordinate.lat), (m.type === "BYRADIUS" || m.type === "byradius") && p.push(m.type, m.radius, m.radiusType), (m.type === "BYBOX" || m.type === "bybox") && p.push(m.type, m.rect.width, m.rect.height, m.rectType), p.push(r), a2?.count && p.push("COUNT", a2.count.limit, ...a2.count.any ? ["ANY"] : []), super([...p, ...a2?.storeDist ? ["STOREDIST"] : []], i);
  }
};
var X = class extends e {
  constructor(n, t2) {
    super(["get", ...n], t2);
  }
};
var z = class extends e {
  constructor(n, t2) {
    super(["getbit", ...n], t2);
  }
};
var J = class extends e {
  constructor(n, t2) {
    super(["getdel", ...n], t2);
  }
};
var U = class extends e {
  constructor(n, t2) {
    super(["getrange", ...n], t2);
  }
};
var Z = class extends e {
  constructor(n, t2) {
    super(["getset", ...n], t2);
  }
};
var B = class extends e {
  constructor(n, t2) {
    super(["hdel", ...n], t2);
  }
};
var H = class extends e {
  constructor(n, t2) {
    super(["hexists", ...n], t2);
  }
};
var F = class extends e {
  constructor(n, t2) {
    super(["hget", ...n], t2);
  }
};
function Me(s) {
  if (s.length === 0)
    return null;
  let n = {};
  for (; s.length >= 2; ) {
    let t2 = s.shift(), o = s.shift();
    try {
      !Number.isNaN(Number(o)) && !Number.isSafeInteger(o) ? n[t2] = o : n[t2] = JSON.parse(o);
    } catch {
      n[t2] = o;
    }
  }
  return n;
}
var $ = class extends e {
  constructor(n, t2) {
    super(["hgetall", ...n], { deserialize: (o) => Me(o), ...t2 });
  }
};
var q = class extends e {
  constructor(n, t2) {
    super(["hincrby", ...n], t2);
  }
};
var j = class extends e {
  constructor(n, t2) {
    super(["hincrbyfloat", ...n], t2);
  }
};
var Y = class extends e {
  constructor([n], t2) {
    super(["hkeys", n], t2);
  }
};
var V = class extends e {
  constructor(n, t2) {
    super(["hlen", ...n], t2);
  }
};
function ve(s, n) {
  if (n.length === 0 || n.every((o) => o === null))
    return null;
  let t2 = {};
  for (let o = 0; o < s.length; o++)
    try {
      t2[s[o]] = JSON.parse(n[o]);
    } catch {
      t2[s[o]] = n[o];
    }
  return t2;
}
var _ = class extends e {
  constructor([n, ...t2], o) {
    super(["hmget", n, ...t2], { deserialize: (m) => ve(t2, m), ...o });
  }
};
var W = class extends e {
  constructor([n, t2], o) {
    super(["hmset", n, ...Object.entries(t2).flatMap(([m, r]) => [m, r])], o);
  }
};
function Ie(s) {
  if (s.length === 0)
    return null;
  let n = {};
  for (; s.length >= 2; ) {
    let t2 = s.shift(), o = s.shift();
    try {
      n[t2] = JSON.parse(o);
    } catch {
      n[t2] = o;
    }
  }
  return n;
}
var Q = class extends e {
  constructor(n, t2) {
    let o = ["hrandfield", n[0]];
    typeof n[1] == "number" && o.push(n[1]), n[2] && o.push("WITHVALUES"), super(o, { deserialize: n[2] ? (m) => Ie(m) : t2?.deserialize, ...t2 });
  }
};
var nn = class extends e {
  constructor([n, t2, o], m) {
    let r = ["hscan", n, t2];
    o?.match && r.push("match", o.match), typeof o?.count == "number" && r.push("count", o.count), super(r, m);
  }
};
var tn = class extends e {
  constructor([n, t2], o) {
    super(["hset", n, ...Object.entries(t2).flatMap(([m, r]) => [m, r])], o);
  }
};
var en = class extends e {
  constructor(n, t2) {
    super(["hsetnx", ...n], t2);
  }
};
var on = class extends e {
  constructor(n, t2) {
    super(["hstrlen", ...n], t2);
  }
};
var sn = class extends e {
  constructor(n, t2) {
    super(["hvals", ...n], t2);
  }
};
var mn = class extends e {
  constructor(n, t2) {
    super(["incr", ...n], t2);
  }
};
var rn = class extends e {
  constructor(n, t2) {
    super(["incrby", ...n], t2);
  }
};
var an = class extends e {
  constructor(n, t2) {
    super(["incrbyfloat", ...n], t2);
  }
};
var pn = class extends e {
  constructor(n, t2) {
    super(["JSON.ARRAPPEND", ...n], t2);
  }
};
var dn = class extends e {
  constructor(n, t2) {
    super(["JSON.ARRINDEX", ...n], t2);
  }
};
var cn = class extends e {
  constructor(n, t2) {
    super(["JSON.ARRINSERT", ...n], t2);
  }
};
var un = class extends e {
  constructor(n, t2) {
    super(["JSON.ARRLEN", n[0], n[1] ?? "$"], t2);
  }
};
var hn = class extends e {
  constructor(n, t2) {
    super(["JSON.ARRPOP", ...n], t2);
  }
};
var Cn = class extends e {
  constructor(n, t2) {
    let o = n[1] ?? "$", m = n[2] ?? 0, r = n[3] ?? 0;
    super(["JSON.ARRTRIM", n[0], o, m, r], t2);
  }
};
var ln = class extends e {
  constructor(n, t2) {
    super(["JSON.CLEAR", ...n], t2);
  }
};
var gn = class extends e {
  constructor(n, t2) {
    super(["JSON.DEL", ...n], t2);
  }
};
var xn = class extends e {
  constructor(n, t2) {
    super(["JSON.FORGET", ...n], t2);
  }
};
var fn = class extends e {
  constructor(n, t2) {
    let o = ["JSON.GET"];
    typeof n[1] == "string" ? o.push(...n) : (o.push(n[0]), n[1] && (n[1].indent && o.push("INDENT", n[1].indent), n[1].newline && o.push("NEWLINE", n[1].newline), n[1].space && o.push("SPACE", n[1].space)), o.push(...n.slice(2))), super(o, t2);
  }
};
var yn = class extends e {
  constructor(n, t2) {
    super(["JSON.MGET", ...n[0], n[1]], t2);
  }
};
var bn = class extends e {
  constructor(n, t2) {
    super(["JSON.NUMINCRBY", ...n], t2);
  }
};
var On = class extends e {
  constructor(n, t2) {
    super(["JSON.NUMMULTBY", ...n], t2);
  }
};
var Tn = class extends e {
  constructor(n, t2) {
    super(["JSON.OBJKEYS", ...n], t2);
  }
};
var Dn = class extends e {
  constructor(n, t2) {
    super(["JSON.OBJLEN", ...n], t2);
  }
};
var wn = class extends e {
  constructor(n, t2) {
    super(["JSON.RESP", ...n], t2);
  }
};
var An = class extends e {
  constructor(n, t2) {
    let o = ["JSON.SET", n[0], n[1], n[2]];
    n[3] && (n[3].nx ? o.push("NX") : n[3].xx && o.push("XX")), super(o, t2);
  }
};
var kn = class extends e {
  constructor(n, t2) {
    super(["JSON.STRAPPEND", ...n], t2);
  }
};
var Rn = class extends e {
  constructor(n, t2) {
    super(["JSON.STRLEN", ...n], t2);
  }
};
var Sn = class extends e {
  constructor(n, t2) {
    super(["JSON.TOGGLE", ...n], t2);
  }
};
var En = class extends e {
  constructor(n, t2) {
    super(["JSON.TYPE", ...n], t2);
  }
};
var Mn = class extends e {
  constructor(n, t2) {
    super(["keys", ...n], t2);
  }
};
var vn = class extends e {
  constructor(n, t2) {
    super(["lindex", ...n], t2);
  }
};
var In = class extends e {
  constructor(n, t2) {
    super(["linsert", ...n], t2);
  }
};
var Nn = class extends e {
  constructor(n, t2) {
    super(["llen", ...n], t2);
  }
};
var Ln = class extends e {
  constructor(n, t2) {
    super(["lmove", ...n], t2);
  }
};
var Pn = class extends e {
  constructor(n, t2) {
    super(["lpop", ...n], t2);
  }
};
var Kn = class extends e {
  constructor(n, t2) {
    let o = ["lpos", n[0], n[1]];
    typeof n[2]?.rank == "number" && o.push("rank", n[2].rank), typeof n[2]?.count == "number" && o.push("count", n[2].count), typeof n[2]?.maxLen == "number" && o.push("maxLen", n[2].maxLen), super(o, t2);
  }
};
var Gn = class extends e {
  constructor(n, t2) {
    super(["lpush", ...n], t2);
  }
};
var Xn = class extends e {
  constructor(n, t2) {
    super(["lpushx", ...n], t2);
  }
};
var zn = class extends e {
  constructor(n, t2) {
    super(["lrange", ...n], t2);
  }
};
var Jn = class extends e {
  constructor(n, t2) {
    super(["lrem", ...n], t2);
  }
};
var Un = class extends e {
  constructor(n, t2) {
    super(["lset", ...n], t2);
  }
};
var Zn = class extends e {
  constructor(n, t2) {
    super(["ltrim", ...n], t2);
  }
};
var Bn = class extends e {
  constructor(n, t2) {
    let o = Array.isArray(n[0]) ? n[0] : n;
    super(["mget", ...o], t2);
  }
};
var Hn = class extends e {
  constructor([n], t2) {
    super(["mset", ...Object.entries(n).flatMap(([o, m]) => [o, m])], t2);
  }
};
var Fn = class extends e {
  constructor([n], t2) {
    super(["msetnx", ...Object.entries(n).flatMap((o) => o)], t2);
  }
};
var $n = class extends e {
  constructor(n, t2) {
    super(["persist", ...n], t2);
  }
};
var qn = class extends e {
  constructor(n, t2) {
    super(["pexpire", ...n], t2);
  }
};
var jn = class extends e {
  constructor(n, t2) {
    super(["pexpireat", ...n], t2);
  }
};
var Yn = class extends e {
  constructor(n, t2) {
    super(["pfadd", ...n], t2);
  }
};
var Vn = class extends e {
  constructor(n, t2) {
    super(["pfcount", ...n], t2);
  }
};
var _n = class extends e {
  constructor(n, t2) {
    super(["pfmerge", ...n], t2);
  }
};
var Wn = class extends e {
  constructor(n, t2) {
    let o = ["ping"];
    typeof n < "u" && typeof n[0] < "u" && o.push(n[0]), super(o, t2);
  }
};
var Qn = class extends e {
  constructor(n, t2) {
    super(["psetex", ...n], t2);
  }
};
var nt = class extends e {
  constructor(n, t2) {
    super(["pttl", ...n], t2);
  }
};
var tt = class extends e {
  constructor(n, t2) {
    super(["publish", ...n], t2);
  }
};
var et = class extends e {
  constructor(n) {
    super(["randomkey"], n);
  }
};
var ot = class extends e {
  constructor(n, t2) {
    super(["rename", ...n], t2);
  }
};
var st = class extends e {
  constructor(n, t2) {
    super(["renamenx", ...n], t2);
  }
};
var mt = class extends e {
  constructor(n, t2) {
    super(["rpop", ...n], t2);
  }
};
var rt = class extends e {
  constructor(n, t2) {
    super(["rpush", ...n], t2);
  }
};
var at = class extends e {
  constructor(n, t2) {
    super(["rpushx", ...n], t2);
  }
};
var it = class extends e {
  constructor(n, t2) {
    super(["sadd", ...n], t2);
  }
};
var pt = class extends e {
  constructor([n, t2], o) {
    let m = ["scan", n];
    t2?.match && m.push("match", t2.match), typeof t2?.count == "number" && m.push("count", t2.count), t2?.type && t2.type.length > 0 && m.push("type", t2.type), super(m, o);
  }
};
var dt = class extends e {
  constructor(n, t2) {
    super(["scard", ...n], t2);
  }
};
var ct = class extends e {
  constructor(n, t2) {
    super(["script", "exists", ...n], { deserialize: (o) => o, ...t2 });
  }
};
var ut = class extends e {
  constructor([n], t2) {
    let o = ["script", "flush"];
    n?.sync ? o.push("sync") : n?.async && o.push("async"), super(o, t2);
  }
};
var ht = class extends e {
  constructor(n, t2) {
    super(["script", "load", ...n], t2);
  }
};
var Ct = class extends e {
  constructor(n, t2) {
    super(["sdiff", ...n], t2);
  }
};
var lt = class extends e {
  constructor(n, t2) {
    super(["sdiffstore", ...n], t2);
  }
};
var gt = class extends e {
  constructor([n, t2, o], m) {
    let r = ["set", n, t2];
    o && ("nx" in o && o.nx ? r.push("nx") : "xx" in o && o.xx && r.push("xx"), "get" in o && o.get && r.push("get"), "ex" in o && typeof o.ex == "number" ? r.push("ex", o.ex) : "px" in o && typeof o.px == "number" ? r.push("px", o.px) : "exat" in o && typeof o.exat == "number" ? r.push("exat", o.exat) : "pxat" in o && typeof o.pxat == "number" ? r.push("pxat", o.pxat) : "keepTtl" in o && o.keepTtl && r.push("keepTtl")), super(r, m);
  }
};
var xt = class extends e {
  constructor(n, t2) {
    super(["setbit", ...n], t2);
  }
};
var ft = class extends e {
  constructor(n, t2) {
    super(["setex", ...n], t2);
  }
};
var yt = class extends e {
  constructor(n, t2) {
    super(["setnx", ...n], t2);
  }
};
var bt = class extends e {
  constructor(n, t2) {
    super(["setrange", ...n], t2);
  }
};
var Ot = class extends e {
  constructor(n, t2) {
    super(["sinter", ...n], t2);
  }
};
var Tt = class extends e {
  constructor(n, t2) {
    super(["sinterstore", ...n], t2);
  }
};
var Dt = class extends e {
  constructor(n, t2) {
    super(["sismember", ...n], t2);
  }
};
var wt = class extends e {
  constructor(n, t2) {
    super(["smembers", ...n], t2);
  }
};
var At = class extends e {
  constructor(n, t2) {
    super(["smismember", n[0], ...n[1]], t2);
  }
};
var kt = class extends e {
  constructor(n, t2) {
    super(["smove", ...n], t2);
  }
};
var Rt = class extends e {
  constructor([n, t2], o) {
    let m = ["spop", n];
    typeof t2 == "number" && m.push(t2), super(m, o);
  }
};
var St = class extends e {
  constructor([n, t2], o) {
    let m = ["srandmember", n];
    typeof t2 == "number" && m.push(t2), super(m, o);
  }
};
var Et = class extends e {
  constructor(n, t2) {
    super(["srem", ...n], t2);
  }
};
var Mt = class extends e {
  constructor([n, t2, o], m) {
    let r = ["sscan", n, t2];
    o?.match && r.push("match", o.match), typeof o?.count == "number" && r.push("count", o.count), super(r, m);
  }
};
var vt = class extends e {
  constructor(n, t2) {
    super(["strlen", ...n], t2);
  }
};
var It = class extends e {
  constructor(n, t2) {
    super(["sunion", ...n], t2);
  }
};
var Nt = class extends e {
  constructor(n, t2) {
    super(["sunionstore", ...n], t2);
  }
};
var Lt = class extends e {
  constructor(n) {
    super(["time"], n);
  }
};
var Pt = class extends e {
  constructor(n, t2) {
    super(["touch", ...n], t2);
  }
};
var Kt = class extends e {
  constructor(n, t2) {
    super(["ttl", ...n], t2);
  }
};
var Gt = class extends e {
  constructor(n, t2) {
    super(["type", ...n], t2);
  }
};
var Xt = class extends e {
  constructor(n, t2) {
    super(["unlink", ...n], t2);
  }
};
var zt = class extends e {
  constructor([n, t2, o], m) {
    let r = Array.isArray(o) ? [...o] : [o];
    super(["XACK", n, t2, ...r], m);
  }
};
var Jt = class extends e {
  constructor([n, t2, o, m], r) {
    let a2 = ["XADD", n];
    m && (m.nomkStream && a2.push("NOMKSTREAM"), m.trim && (a2.push(m.trim.type, m.trim.comparison, m.trim.threshold), typeof m.trim.limit < "u" && a2.push("LIMIT", m.trim.limit))), a2.push(t2);
    for (let [i, p] of Object.entries(o))
      a2.push(i, p);
    super(a2, r);
  }
};
var Ut = class extends e {
  constructor([n, t2, o, m, r, a2], i) {
    let p = [];
    a2?.count && p.push("COUNT", a2.count), a2?.justId && p.push("JUSTID"), super(["XAUTOCLAIM", n, t2, o, m, r, ...p], i);
  }
};
var Zt = class extends e {
  constructor([n, t2, o, m, r, a2], i) {
    let p = Array.isArray(r) ? [...r] : [r], d = [];
    a2?.idleMS && d.push("IDLE", a2.idleMS), a2?.idleMS && d.push("TIME", a2.timeMS), a2?.retryCount && d.push("RETRYCOUNT", a2?.retryCount), a2?.force && d.push("FORCE"), a2?.justId && d.push("JUSTID"), a2?.lastId && d.push("LASTID", a2.lastId), super(["XCLAIM", n, t2, o, m, ...p, ...d], i);
  }
};
var Bt = class extends e {
  constructor([n, t2], o) {
    let m = Array.isArray(t2) ? [...t2] : [t2];
    super(["XDEL", n, ...m], o);
  }
};
var Ht = class extends e {
  constructor([n, t2], o) {
    let m = ["XGROUP"];
    switch (t2.type) {
      case "CREATE":
        m.push("CREATE", n, t2.group, t2.id), t2.options && (t2.options.MKSTREAM && m.push("MKSTREAM"), t2.options.ENTRIESREAD !== void 0 && m.push("ENTRIESREAD", t2.options.ENTRIESREAD.toString()));
        break;
      case "CREATECONSUMER":
        m.push("CREATECONSUMER", n, t2.group, t2.consumer);
        break;
      case "DELCONSUMER":
        m.push("DELCONSUMER", n, t2.group, t2.consumer);
        break;
      case "DESTROY":
        m.push("DESTROY", n, t2.group);
        break;
      case "SETID":
        m.push("SETID", n, t2.group, t2.id), t2.options && t2.options.ENTRIESREAD !== void 0 && m.push("ENTRIESREAD", t2.options.ENTRIESREAD.toString());
        break;
      default:
        throw new Error("Invalid XGROUP");
    }
    super(m, o);
  }
};
var Ft = class extends e {
  constructor([n, t2], o) {
    let m = [];
    t2.type === "CONSUMERS" ? m.push("CONSUMERS", n, t2.group) : m.push("GROUPS", n), super(["XINFO", ...m], o);
  }
};
var $t = class extends e {
  constructor(n, t2) {
    super(["XLEN", ...n], t2);
  }
};
var qt = class extends e {
  constructor([n, t2, o, m, r, a2], i) {
    let p = typeof a2?.consumer < "u" ? Array.isArray(a2.consumer) ? [...a2.consumer] : [a2.consumer] : [];
    super(["XPENDING", n, t2, ...a2?.idleTime ? ["IDLE", a2.idleTime] : [], o, m, r, ...p], i);
  }
};
function Ne(s) {
  let n = {};
  for (let t2 of s)
    for (; t2.length >= 2; ) {
      let o = t2.shift(), m = t2.shift();
      for ((o in n) || (n[o] = {}); m.length >= 2; ) {
        let r = m.shift(), a2 = m.shift();
        try {
          n[o][r] = JSON.parse(a2);
        } catch {
          n[o][r] = a2;
        }
      }
    }
  return n;
}
var jt = class extends e {
  constructor([n, t2, o, m], r) {
    let a2 = ["XRANGE", n, t2, o];
    typeof m == "number" && a2.push("COUNT", m), super(a2, { deserialize: (i) => Ne(i), ...r });
  }
};
var Le = "ERR Unbalanced XREAD list of streams: for each stream key an ID or '$' must be specified";
var Yt = class extends e {
  constructor([n, t2, o], m) {
    if (Array.isArray(n) && Array.isArray(t2) && n.length !== t2.length)
      throw new Error(Le);
    let r = [];
    typeof o?.count == "number" && r.push("COUNT", o.count), typeof o?.blockMS == "number" && r.push("BLOCK", o.blockMS), r.push("STREAMS", ...Array.isArray(n) ? [...n] : [n], ...Array.isArray(t2) ? [...t2] : [t2]), super(["XREAD", ...r], m);
  }
};
var Pe = "ERR Unbalanced XREADGROUP list of streams: for each stream key an ID or '$' must be specified";
var Vt = class extends e {
  constructor([n, t2, o, m, r], a2) {
    if (Array.isArray(o) && Array.isArray(m) && o.length !== m.length)
      throw new Error(Pe);
    let i = [];
    typeof r?.count == "number" && i.push("COUNT", r.count), typeof r?.blockMS == "number" && i.push("BLOCK", r.blockMS), typeof r?.NOACK == "boolean" && r?.NOACK && i.push("NOACK"), i.push("STREAMS", ...Array.isArray(o) ? [...o] : [o], ...Array.isArray(m) ? [...m] : [m]), super(["XREADGROUP", "GROUP", n, t2, ...i], a2);
  }
};
var _t = class extends e {
  constructor([n, t2, o, m], r) {
    let a2 = ["XREVRANGE", n, t2, o];
    typeof m == "number" && a2.push("COUNT", m), super(a2, { deserialize: (i) => Ke(i), ...r });
  }
};
function Ke(s) {
  let n = {};
  for (let t2 of s)
    for (; t2.length >= 2; ) {
      let o = t2.shift(), m = t2.shift();
      for ((o in n) || (n[o] = {}); m.length >= 2; ) {
        let r = m.shift(), a2 = m.shift();
        try {
          n[o][r] = JSON.parse(a2);
        } catch {
          n[o][r] = a2;
        }
      }
    }
  return n;
}
var Wt = class extends e {
  constructor([n, t2], o) {
    let { limit: m, strategy: r, threshold: a2, exactness: i = "~" } = t2;
    super(["XTRIM", n, r, i, a2, ...m ? ["LIMIT", m] : []], o);
  }
};
var h = class extends e {
  constructor([n, t2, ...o], m) {
    let r = ["zadd", n];
    "nx" in t2 && t2.nx ? r.push("nx") : "xx" in t2 && t2.xx && r.push("xx"), "ch" in t2 && t2.ch && r.push("ch"), "incr" in t2 && t2.incr && r.push("incr"), "lt" in t2 && t2.lt ? r.push("lt") : "gt" in t2 && t2.gt && r.push("gt"), "score" in t2 && "member" in t2 && r.push(t2.score, t2.member), r.push(...o.flatMap(({ score: a2, member: i }) => [a2, i])), super(r, m);
  }
};
var Qt = class extends e {
  constructor(n, t2) {
    super(["zcard", ...n], t2);
  }
};
var ne = class extends e {
  constructor(n, t2) {
    super(["zcount", ...n], t2);
  }
};
var te = class extends e {
  constructor(n, t2) {
    super(["zincrby", ...n], t2);
  }
};
var ee = class extends e {
  constructor([n, t2, o, m], r) {
    let a2 = ["zinterstore", n, t2];
    Array.isArray(o) ? a2.push(...o) : a2.push(o), m && ("weights" in m && m.weights ? a2.push("weights", ...m.weights) : "weight" in m && typeof m.weight == "number" && a2.push("weights", m.weight), "aggregate" in m && a2.push("aggregate", m.aggregate)), super(a2, r);
  }
};
var oe = class extends e {
  constructor(n, t2) {
    super(["zlexcount", ...n], t2);
  }
};
var se = class extends e {
  constructor([n, t2], o) {
    let m = ["zpopmax", n];
    typeof t2 == "number" && m.push(t2), super(m, o);
  }
};
var me = class extends e {
  constructor([n, t2], o) {
    let m = ["zpopmin", n];
    typeof t2 == "number" && m.push(t2), super(m, o);
  }
};
var re = class extends e {
  constructor([n, t2, o, m], r) {
    let a2 = ["zrange", n, t2, o];
    m?.byScore && a2.push("byscore"), m?.byLex && a2.push("bylex"), m?.rev && a2.push("rev"), typeof m?.count < "u" && typeof m?.offset < "u" && a2.push("limit", m.offset, m.count), m?.withScores && a2.push("withscores"), super(a2, r);
  }
};
var ae = class extends e {
  constructor(n, t2) {
    super(["zrank", ...n], t2);
  }
};
var ie = class extends e {
  constructor(n, t2) {
    super(["zrem", ...n], t2);
  }
};
var pe = class extends e {
  constructor(n, t2) {
    super(["zremrangebylex", ...n], t2);
  }
};
var de = class extends e {
  constructor(n, t2) {
    super(["zremrangebyrank", ...n], t2);
  }
};
var ce = class extends e {
  constructor(n, t2) {
    super(["zremrangebyscore", ...n], t2);
  }
};
var ue = class extends e {
  constructor(n, t2) {
    super(["zrevrank", ...n], t2);
  }
};
var he = class extends e {
  constructor([n, t2, o], m) {
    let r = ["zscan", n, t2];
    o?.match && r.push("match", o.match), typeof o?.count == "number" && r.push("count", o.count), super(r, m);
  }
};
var Ce = class extends e {
  constructor(n, t2) {
    super(["zscore", ...n], t2);
  }
};
var le = class extends e {
  constructor([n, t2, o], m) {
    let r = ["zunion", n];
    Array.isArray(t2) ? r.push(...t2) : r.push(t2), o && ("weights" in o && o.weights ? r.push("weights", ...o.weights) : "weight" in o && typeof o.weight == "number" && r.push("weights", o.weight), "aggregate" in o && r.push("aggregate", o.aggregate), o?.withScores && r.push("withscores")), super(r, m);
  }
};
var ge = class extends e {
  constructor([n, t2, o, m], r) {
    let a2 = ["zunionstore", n, t2];
    Array.isArray(o) ? a2.push(...o) : a2.push(o), m && ("weights" in m && m.weights ? a2.push("weights", ...m.weights) : "weight" in m && typeof m.weight == "number" && a2.push("weights", m.weight), "aggregate" in m && a2.push("aggregate", m.aggregate)), super(a2, r);
  }
};
var xe = class extends e {
  constructor(n, t2) {
    super(["zdiffstore", ...n], t2);
  }
};
var fe = class extends e {
  constructor(n, t2) {
    let [o, m] = n;
    super(["zmscore", o, ...m], t2);
  }
};
var ye = class {
  client;
  commands;
  commandOptions;
  multiExec;
  constructor(n) {
    this.client = n.client, this.commands = [], this.commandOptions = n.commandOptions, this.multiExec = n.multiExec ?? false;
  }
  exec = async () => {
    if (this.commands.length === 0)
      throw new Error("Pipeline is empty");
    let n = this.multiExec ? ["multi-exec"] : ["pipeline"];
    return (await this.client.request({ path: n, body: Object.values(this.commands).map((o) => o.command) })).map(({ error: o, result: m }, r) => {
      if (o)
        throw new u(`Command ${r + 1} [ ${this.commands[r].command[0]} ] failed: ${o}`);
      return this.commands[r].deserialize(m);
    });
  };
  length() {
    return this.commands.length;
  }
  chain(n) {
    return this.commands.push(n), this;
  }
  append = (...n) => this.chain(new l(n, this.commandOptions));
  bitcount = (...n) => this.chain(new g(n, this.commandOptions));
  bitop = (n, t2, o, ...m) => this.chain(new x([n, t2, o, ...m], this.commandOptions));
  bitpos = (...n) => this.chain(new f(n, this.commandOptions));
  copy = (...n) => this.chain(new y(n, this.commandOptions));
  zdiffstore = (...n) => this.chain(new xe(n, this.commandOptions));
  dbsize = () => this.chain(new b(this.commandOptions));
  decr = (...n) => this.chain(new O(n, this.commandOptions));
  decrby = (...n) => this.chain(new T(n, this.commandOptions));
  del = (...n) => this.chain(new D(n, this.commandOptions));
  echo = (...n) => this.chain(new w(n, this.commandOptions));
  eval = (...n) => this.chain(new A(n, this.commandOptions));
  evalsha = (...n) => this.chain(new k(n, this.commandOptions));
  exists = (...n) => this.chain(new R(n, this.commandOptions));
  expire = (...n) => this.chain(new S(n, this.commandOptions));
  expireat = (...n) => this.chain(new E(n, this.commandOptions));
  flushall = (n) => this.chain(new M(n, this.commandOptions));
  flushdb = (...n) => this.chain(new v(n, this.commandOptions));
  geoadd = (...n) => this.chain(new I(n, this.commandOptions));
  geodist = (...n) => this.chain(new N(n, this.commandOptions));
  geopos = (...n) => this.chain(new P(n, this.commandOptions));
  geohash = (...n) => this.chain(new L(n, this.commandOptions));
  geosearch = (...n) => this.chain(new K(n, this.commandOptions));
  geosearchstore = (...n) => this.chain(new G(n, this.commandOptions));
  get = (...n) => this.chain(new X(n, this.commandOptions));
  getbit = (...n) => this.chain(new z(n, this.commandOptions));
  getdel = (...n) => this.chain(new J(n, this.commandOptions));
  getrange = (...n) => this.chain(new U(n, this.commandOptions));
  getset = (n, t2) => this.chain(new Z([n, t2], this.commandOptions));
  hdel = (...n) => this.chain(new B(n, this.commandOptions));
  hexists = (...n) => this.chain(new H(n, this.commandOptions));
  hget = (...n) => this.chain(new F(n, this.commandOptions));
  hgetall = (...n) => this.chain(new $(n, this.commandOptions));
  hincrby = (...n) => this.chain(new q(n, this.commandOptions));
  hincrbyfloat = (...n) => this.chain(new j(n, this.commandOptions));
  hkeys = (...n) => this.chain(new Y(n, this.commandOptions));
  hlen = (...n) => this.chain(new V(n, this.commandOptions));
  hmget = (...n) => this.chain(new _(n, this.commandOptions));
  hmset = (n, t2) => this.chain(new W([n, t2], this.commandOptions));
  hrandfield = (n, t2, o) => this.chain(new Q([n, t2, o], this.commandOptions));
  hscan = (...n) => this.chain(new nn(n, this.commandOptions));
  hset = (n, t2) => this.chain(new tn([n, t2], this.commandOptions));
  hsetnx = (n, t2, o) => this.chain(new en([n, t2, o], this.commandOptions));
  hstrlen = (...n) => this.chain(new on(n, this.commandOptions));
  hvals = (...n) => this.chain(new sn(n, this.commandOptions));
  incr = (...n) => this.chain(new mn(n, this.commandOptions));
  incrby = (...n) => this.chain(new rn(n, this.commandOptions));
  incrbyfloat = (...n) => this.chain(new an(n, this.commandOptions));
  keys = (...n) => this.chain(new Mn(n, this.commandOptions));
  lindex = (...n) => this.chain(new vn(n, this.commandOptions));
  linsert = (n, t2, o, m) => this.chain(new In([n, t2, o, m], this.commandOptions));
  llen = (...n) => this.chain(new Nn(n, this.commandOptions));
  lmove = (...n) => this.chain(new Ln(n, this.commandOptions));
  lpop = (...n) => this.chain(new Pn(n, this.commandOptions));
  lpos = (...n) => this.chain(new Kn(n, this.commandOptions));
  lpush = (n, ...t2) => this.chain(new Gn([n, ...t2], this.commandOptions));
  lpushx = (n, ...t2) => this.chain(new Xn([n, ...t2], this.commandOptions));
  lrange = (...n) => this.chain(new zn(n, this.commandOptions));
  lrem = (n, t2, o) => this.chain(new Jn([n, t2, o], this.commandOptions));
  lset = (n, t2, o) => this.chain(new Un([n, t2, o], this.commandOptions));
  ltrim = (...n) => this.chain(new Zn(n, this.commandOptions));
  mget = (...n) => this.chain(new Bn(n, this.commandOptions));
  mset = (n) => this.chain(new Hn([n], this.commandOptions));
  msetnx = (n) => this.chain(new Fn([n], this.commandOptions));
  persist = (...n) => this.chain(new $n(n, this.commandOptions));
  pexpire = (...n) => this.chain(new qn(n, this.commandOptions));
  pexpireat = (...n) => this.chain(new jn(n, this.commandOptions));
  pfadd = (...n) => this.chain(new Yn(n, this.commandOptions));
  pfcount = (...n) => this.chain(new Vn(n, this.commandOptions));
  pfmerge = (...n) => this.chain(new _n(n, this.commandOptions));
  ping = (n) => this.chain(new Wn(n, this.commandOptions));
  psetex = (n, t2, o) => this.chain(new Qn([n, t2, o], this.commandOptions));
  pttl = (...n) => this.chain(new nt(n, this.commandOptions));
  publish = (...n) => this.chain(new tt(n, this.commandOptions));
  randomkey = () => this.chain(new et(this.commandOptions));
  rename = (...n) => this.chain(new ot(n, this.commandOptions));
  renamenx = (...n) => this.chain(new st(n, this.commandOptions));
  rpop = (...n) => this.chain(new mt(n, this.commandOptions));
  rpush = (n, ...t2) => this.chain(new rt([n, ...t2], this.commandOptions));
  rpushx = (n, ...t2) => this.chain(new at([n, ...t2], this.commandOptions));
  sadd = (n, ...t2) => this.chain(new it([n, ...t2], this.commandOptions));
  scan = (...n) => this.chain(new pt(n, this.commandOptions));
  scard = (...n) => this.chain(new dt(n, this.commandOptions));
  scriptExists = (...n) => this.chain(new ct(n, this.commandOptions));
  scriptFlush = (...n) => this.chain(new ut(n, this.commandOptions));
  scriptLoad = (...n) => this.chain(new ht(n, this.commandOptions));
  sdiff = (...n) => this.chain(new Ct(n, this.commandOptions));
  sdiffstore = (...n) => this.chain(new lt(n, this.commandOptions));
  set = (n, t2, o) => this.chain(new gt([n, t2, o], this.commandOptions));
  setbit = (...n) => this.chain(new xt(n, this.commandOptions));
  setex = (n, t2, o) => this.chain(new ft([n, t2, o], this.commandOptions));
  setnx = (n, t2) => this.chain(new yt([n, t2], this.commandOptions));
  setrange = (...n) => this.chain(new bt(n, this.commandOptions));
  sinter = (...n) => this.chain(new Ot(n, this.commandOptions));
  sinterstore = (...n) => this.chain(new Tt(n, this.commandOptions));
  sismember = (n, t2) => this.chain(new Dt([n, t2], this.commandOptions));
  smembers = (...n) => this.chain(new wt(n, this.commandOptions));
  smismember = (n, t2) => this.chain(new At([n, t2], this.commandOptions));
  smove = (n, t2, o) => this.chain(new kt([n, t2, o], this.commandOptions));
  spop = (...n) => this.chain(new Rt(n, this.commandOptions));
  srandmember = (...n) => this.chain(new St(n, this.commandOptions));
  srem = (n, ...t2) => this.chain(new Et([n, ...t2], this.commandOptions));
  sscan = (...n) => this.chain(new Mt(n, this.commandOptions));
  strlen = (...n) => this.chain(new vt(n, this.commandOptions));
  sunion = (...n) => this.chain(new It(n, this.commandOptions));
  sunionstore = (...n) => this.chain(new Nt(n, this.commandOptions));
  time = () => this.chain(new Lt(this.commandOptions));
  touch = (...n) => this.chain(new Pt(n, this.commandOptions));
  ttl = (...n) => this.chain(new Kt(n, this.commandOptions));
  type = (...n) => this.chain(new Gt(n, this.commandOptions));
  unlink = (...n) => this.chain(new Xt(n, this.commandOptions));
  zadd = (...n) => "score" in n[1] ? this.chain(new h([n[0], n[1], ...n.slice(2)], this.commandOptions)) : this.chain(new h([n[0], n[1], ...n.slice(2)], this.commandOptions));
  xadd = (...n) => this.chain(new Jt(n, this.commandOptions));
  xack = (...n) => this.chain(new zt(n, this.commandOptions));
  xdel = (...n) => this.chain(new Bt(n, this.commandOptions));
  xgroup = (...n) => this.chain(new Ht(n, this.commandOptions));
  xread = (...n) => this.chain(new Yt(n, this.commandOptions));
  xreadgroup = (...n) => this.chain(new Vt(n, this.commandOptions));
  xinfo = (...n) => this.chain(new Ft(n, this.commandOptions));
  xlen = (...n) => this.chain(new $t(n, this.commandOptions));
  xpending = (...n) => this.chain(new qt(n, this.commandOptions));
  xclaim = (...n) => this.chain(new Zt(n, this.commandOptions));
  xautoclaim = (...n) => this.chain(new Ut(n, this.commandOptions));
  xtrim = (...n) => this.chain(new Wt(n, this.commandOptions));
  xrange = (...n) => this.chain(new jt(n, this.commandOptions));
  xrevrange = (...n) => this.chain(new _t(n, this.commandOptions));
  zcard = (...n) => this.chain(new Qt(n, this.commandOptions));
  zcount = (...n) => this.chain(new ne(n, this.commandOptions));
  zincrby = (n, t2, o) => this.chain(new te([n, t2, o], this.commandOptions));
  zinterstore = (...n) => this.chain(new ee(n, this.commandOptions));
  zlexcount = (...n) => this.chain(new oe(n, this.commandOptions));
  zmscore = (...n) => this.chain(new fe(n, this.commandOptions));
  zpopmax = (...n) => this.chain(new se(n, this.commandOptions));
  zpopmin = (...n) => this.chain(new me(n, this.commandOptions));
  zrange = (...n) => this.chain(new re(n, this.commandOptions));
  zrank = (n, t2) => this.chain(new ae([n, t2], this.commandOptions));
  zrem = (n, ...t2) => this.chain(new ie([n, ...t2], this.commandOptions));
  zremrangebylex = (...n) => this.chain(new pe(n, this.commandOptions));
  zremrangebyrank = (...n) => this.chain(new de(n, this.commandOptions));
  zremrangebyscore = (...n) => this.chain(new ce(n, this.commandOptions));
  zrevrank = (n, t2) => this.chain(new ue([n, t2], this.commandOptions));
  zscan = (...n) => this.chain(new he(n, this.commandOptions));
  zscore = (n, t2) => this.chain(new Ce([n, t2], this.commandOptions));
  zunionstore = (...n) => this.chain(new ge(n, this.commandOptions));
  zunion = (...n) => this.chain(new le(n, this.commandOptions));
  get json() {
    return { arrappend: (...n) => this.chain(new pn(n, this.commandOptions)), arrindex: (...n) => this.chain(new dn(n, this.commandOptions)), arrinsert: (...n) => this.chain(new cn(n, this.commandOptions)), arrlen: (...n) => this.chain(new un(n, this.commandOptions)), arrpop: (...n) => this.chain(new hn(n, this.commandOptions)), arrtrim: (...n) => this.chain(new Cn(n, this.commandOptions)), clear: (...n) => this.chain(new ln(n, this.commandOptions)), del: (...n) => this.chain(new gn(n, this.commandOptions)), forget: (...n) => this.chain(new xn(n, this.commandOptions)), get: (...n) => this.chain(new fn(n, this.commandOptions)), mget: (...n) => this.chain(new yn(n, this.commandOptions)), numincrby: (...n) => this.chain(new bn(n, this.commandOptions)), nummultby: (...n) => this.chain(new On(n, this.commandOptions)), objkeys: (...n) => this.chain(new Tn(n, this.commandOptions)), objlen: (...n) => this.chain(new Dn(n, this.commandOptions)), resp: (...n) => this.chain(new wn(n, this.commandOptions)), set: (...n) => this.chain(new An(n, this.commandOptions)), strappend: (...n) => this.chain(new kn(n, this.commandOptions)), strlen: (...n) => this.chain(new Rn(n, this.commandOptions)), toggle: (...n) => this.chain(new Sn(n, this.commandOptions)), type: (...n) => this.chain(new En(n, this.commandOptions)) };
  }
};
var Oe = class {
  script;
  sha1;
  redis;
  constructor(n, t2) {
    this.redis = n, this.sha1 = this.digest(t2), this.script = t2;
  }
  async eval(n, t2) {
    return await this.redis.eval(this.script, n, t2);
  }
  async evalsha(n, t2) {
    return await this.redis.evalsha(this.sha1, n, t2);
  }
  async exec(n, t2) {
    return await this.redis.evalsha(this.sha1, n, t2).catch(async (m) => {
      if (m instanceof Error && m.message.toLowerCase().includes("noscript"))
        return await this.redis.eval(this.script, n, t2);
      throw m;
    });
  }
  digest(n) {
    return import_enc_hex.default.stringify((0, import_sha1.default)(n));
  }
};
var Re = class {
  client;
  opts;
  enableTelemetry;
  constructor(n, t2) {
    this.client = n, this.opts = t2, this.enableTelemetry = t2?.enableTelemetry ?? true;
  }
  get json() {
    return { arrappend: (...n) => new pn(n, this.opts).exec(this.client), arrindex: (...n) => new dn(n, this.opts).exec(this.client), arrinsert: (...n) => new cn(n, this.opts).exec(this.client), arrlen: (...n) => new un(n, this.opts).exec(this.client), arrpop: (...n) => new hn(n, this.opts).exec(this.client), arrtrim: (...n) => new Cn(n, this.opts).exec(this.client), clear: (...n) => new ln(n, this.opts).exec(this.client), del: (...n) => new gn(n, this.opts).exec(this.client), forget: (...n) => new xn(n, this.opts).exec(this.client), get: (...n) => new fn(n, this.opts).exec(this.client), mget: (...n) => new yn(n, this.opts).exec(this.client), numincrby: (...n) => new bn(n, this.opts).exec(this.client), nummultby: (...n) => new On(n, this.opts).exec(this.client), objkeys: (...n) => new Tn(n, this.opts).exec(this.client), objlen: (...n) => new Dn(n, this.opts).exec(this.client), resp: (...n) => new wn(n, this.opts).exec(this.client), set: (...n) => new An(n, this.opts).exec(this.client), strappend: (...n) => new kn(n, this.opts).exec(this.client), strlen: (...n) => new Rn(n, this.opts).exec(this.client), toggle: (...n) => new Sn(n, this.opts).exec(this.client), type: (...n) => new En(n, this.opts).exec(this.client) };
  }
  use = (n) => {
    let t2 = this.client.request.bind(this.client);
    this.client.request = (o) => n(o, t2);
  };
  addTelemetry = (n) => {
    if (this.enableTelemetry)
      try {
        this.client.mergeTelemetry(n);
      } catch {
      }
  };
  createScript(n) {
    return new Oe(this, n);
  }
  pipeline = () => new ye({ client: this.client, commandOptions: this.opts, multiExec: false });
  multi = () => new ye({ client: this.client, commandOptions: this.opts, multiExec: true });
  append = (...n) => new l(n, this.opts).exec(this.client);
  bitcount = (...n) => new g(n, this.opts).exec(this.client);
  bitop = (n, t2, o, ...m) => new x([n, t2, o, ...m], this.opts).exec(this.client);
  bitpos = (...n) => new f(n, this.opts).exec(this.client);
  copy = (...n) => new y(n, this.opts).exec(this.client);
  dbsize = () => new b(this.opts).exec(this.client);
  decr = (...n) => new O(n, this.opts).exec(this.client);
  decrby = (...n) => new T(n, this.opts).exec(this.client);
  del = (...n) => new D(n, this.opts).exec(this.client);
  echo = (...n) => new w(n, this.opts).exec(this.client);
  eval = (...n) => new A(n, this.opts).exec(this.client);
  evalsha = (...n) => new k(n, this.opts).exec(this.client);
  exists = (...n) => new R(n, this.opts).exec(this.client);
  expire = (...n) => new S(n, this.opts).exec(this.client);
  expireat = (...n) => new E(n, this.opts).exec(this.client);
  flushall = (n) => new M(n, this.opts).exec(this.client);
  flushdb = (...n) => new v(n, this.opts).exec(this.client);
  geoadd = (...n) => new I(n, this.opts).exec(this.client);
  geopos = (...n) => new P(n, this.opts).exec(this.client);
  geodist = (...n) => new N(n, this.opts).exec(this.client);
  geohash = (...n) => new L(n, this.opts).exec(this.client);
  geosearch = (...n) => new K(n, this.opts).exec(this.client);
  geosearchstore = (...n) => new G(n, this.opts).exec(this.client);
  get = (...n) => new X(n, this.opts).exec(this.client);
  getbit = (...n) => new z(n, this.opts).exec(this.client);
  getdel = (...n) => new J(n, this.opts).exec(this.client);
  getrange = (...n) => new U(n, this.opts).exec(this.client);
  getset = (n, t2) => new Z([n, t2], this.opts).exec(this.client);
  hdel = (...n) => new B(n, this.opts).exec(this.client);
  hexists = (...n) => new H(n, this.opts).exec(this.client);
  hget = (...n) => new F(n, this.opts).exec(this.client);
  hgetall = (...n) => new $(n, this.opts).exec(this.client);
  hincrby = (...n) => new q(n, this.opts).exec(this.client);
  hincrbyfloat = (...n) => new j(n, this.opts).exec(this.client);
  hkeys = (...n) => new Y(n, this.opts).exec(this.client);
  hlen = (...n) => new V(n, this.opts).exec(this.client);
  hmget = (...n) => new _(n, this.opts).exec(this.client);
  hmset = (n, t2) => new W([n, t2], this.opts).exec(this.client);
  hrandfield = (n, t2, o) => new Q([n, t2, o], this.opts).exec(this.client);
  hscan = (...n) => new nn(n, this.opts).exec(this.client);
  hset = (n, t2) => new tn([n, t2], this.opts).exec(this.client);
  hsetnx = (n, t2, o) => new en([n, t2, o], this.opts).exec(this.client);
  hstrlen = (...n) => new on(n, this.opts).exec(this.client);
  hvals = (...n) => new sn(n, this.opts).exec(this.client);
  incr = (...n) => new mn(n, this.opts).exec(this.client);
  incrby = (...n) => new rn(n, this.opts).exec(this.client);
  incrbyfloat = (...n) => new an(n, this.opts).exec(this.client);
  keys = (...n) => new Mn(n, this.opts).exec(this.client);
  lindex = (...n) => new vn(n, this.opts).exec(this.client);
  linsert = (n, t2, o, m) => new In([n, t2, o, m], this.opts).exec(this.client);
  llen = (...n) => new Nn(n, this.opts).exec(this.client);
  lmove = (...n) => new Ln(n, this.opts).exec(this.client);
  lpop = (...n) => new Pn(n, this.opts).exec(this.client);
  lpos = (...n) => new Kn(n, this.opts).exec(this.client);
  lpush = (n, ...t2) => new Gn([n, ...t2], this.opts).exec(this.client);
  lpushx = (n, ...t2) => new Xn([n, ...t2], this.opts).exec(this.client);
  lrange = (...n) => new zn(n, this.opts).exec(this.client);
  lrem = (n, t2, o) => new Jn([n, t2, o], this.opts).exec(this.client);
  lset = (n, t2, o) => new Un([n, t2, o], this.opts).exec(this.client);
  ltrim = (...n) => new Zn(n, this.opts).exec(this.client);
  mget = (...n) => new Bn(n, this.opts).exec(this.client);
  mset = (n) => new Hn([n], this.opts).exec(this.client);
  msetnx = (n) => new Fn([n], this.opts).exec(this.client);
  persist = (...n) => new $n(n, this.opts).exec(this.client);
  pexpire = (...n) => new qn(n, this.opts).exec(this.client);
  pexpireat = (...n) => new jn(n, this.opts).exec(this.client);
  pfadd = (...n) => new Yn(n, this.opts).exec(this.client);
  pfcount = (...n) => new Vn(n, this.opts).exec(this.client);
  pfmerge = (...n) => new _n(n, this.opts).exec(this.client);
  ping = (n) => new Wn(n, this.opts).exec(this.client);
  psetex = (n, t2, o) => new Qn([n, t2, o], this.opts).exec(this.client);
  pttl = (...n) => new nt(n, this.opts).exec(this.client);
  publish = (...n) => new tt(n, this.opts).exec(this.client);
  randomkey = () => new et().exec(this.client);
  rename = (...n) => new ot(n, this.opts).exec(this.client);
  renamenx = (...n) => new st(n, this.opts).exec(this.client);
  rpop = (...n) => new mt(n, this.opts).exec(this.client);
  rpush = (n, ...t2) => new rt([n, ...t2], this.opts).exec(this.client);
  rpushx = (n, ...t2) => new at([n, ...t2], this.opts).exec(this.client);
  sadd = (n, ...t2) => new it([n, ...t2], this.opts).exec(this.client);
  scan = (...n) => new pt(n, this.opts).exec(this.client);
  scard = (...n) => new dt(n, this.opts).exec(this.client);
  scriptExists = (...n) => new ct(n, this.opts).exec(this.client);
  scriptFlush = (...n) => new ut(n, this.opts).exec(this.client);
  scriptLoad = (...n) => new ht(n, this.opts).exec(this.client);
  sdiff = (...n) => new Ct(n, this.opts).exec(this.client);
  sdiffstore = (...n) => new lt(n, this.opts).exec(this.client);
  set = (n, t2, o) => new gt([n, t2, o], this.opts).exec(this.client);
  setbit = (...n) => new xt(n, this.opts).exec(this.client);
  setex = (n, t2, o) => new ft([n, t2, o], this.opts).exec(this.client);
  setnx = (n, t2) => new yt([n, t2], this.opts).exec(this.client);
  setrange = (...n) => new bt(n, this.opts).exec(this.client);
  sinter = (...n) => new Ot(n, this.opts).exec(this.client);
  sinterstore = (...n) => new Tt(n, this.opts).exec(this.client);
  sismember = (n, t2) => new Dt([n, t2], this.opts).exec(this.client);
  smismember = (n, t2) => new At([n, t2], this.opts).exec(this.client);
  smembers = (...n) => new wt(n, this.opts).exec(this.client);
  smove = (n, t2, o) => new kt([n, t2, o], this.opts).exec(this.client);
  spop = (...n) => new Rt(n, this.opts).exec(this.client);
  srandmember = (...n) => new St(n, this.opts).exec(this.client);
  srem = (n, ...t2) => new Et([n, ...t2], this.opts).exec(this.client);
  sscan = (...n) => new Mt(n, this.opts).exec(this.client);
  strlen = (...n) => new vt(n, this.opts).exec(this.client);
  sunion = (...n) => new It(n, this.opts).exec(this.client);
  sunionstore = (...n) => new Nt(n, this.opts).exec(this.client);
  time = () => new Lt().exec(this.client);
  touch = (...n) => new Pt(n, this.opts).exec(this.client);
  ttl = (...n) => new Kt(n, this.opts).exec(this.client);
  type = (...n) => new Gt(n, this.opts).exec(this.client);
  unlink = (...n) => new Xt(n, this.opts).exec(this.client);
  xadd = (...n) => new Jt(n, this.opts).exec(this.client);
  xack = (...n) => new zt(n, this.opts).exec(this.client);
  xdel = (...n) => new Bt(n, this.opts).exec(this.client);
  xgroup = (...n) => new Ht(n, this.opts).exec(this.client);
  xread = (...n) => new Yt(n, this.opts).exec(this.client);
  xreadgroup = (...n) => new Vt(n, this.opts).exec(this.client);
  xinfo = (...n) => new Ft(n, this.opts).exec(this.client);
  xlen = (...n) => new $t(n, this.opts).exec(this.client);
  xpending = (...n) => new qt(n, this.opts).exec(this.client);
  xclaim = (...n) => new Zt(n, this.opts).exec(this.client);
  xautoclaim = (...n) => new Ut(n, this.opts).exec(this.client);
  xtrim = (...n) => new Wt(n, this.opts).exec(this.client);
  xrange = (...n) => new jt(n, this.opts).exec(this.client);
  xrevrange = (...n) => new _t(n, this.opts).exec(this.client);
  zadd = (...n) => "score" in n[1] ? new h([n[0], n[1], ...n.slice(2)], this.opts).exec(this.client) : new h([n[0], n[1], ...n.slice(2)], this.opts).exec(this.client);
  zcard = (...n) => new Qt(n, this.opts).exec(this.client);
  zcount = (...n) => new ne(n, this.opts).exec(this.client);
  zdiffstore = (...n) => new xe(n, this.opts).exec(this.client);
  zincrby = (n, t2, o) => new te([n, t2, o], this.opts).exec(this.client);
  zinterstore = (...n) => new ee(n, this.opts).exec(this.client);
  zlexcount = (...n) => new oe(n, this.opts).exec(this.client);
  zmscore = (...n) => new fe(n, this.opts).exec(this.client);
  zpopmax = (...n) => new se(n, this.opts).exec(this.client);
  zpopmin = (...n) => new me(n, this.opts).exec(this.client);
  zrange = (...n) => new re(n, this.opts).exec(this.client);
  zrank = (n, t2) => new ae([n, t2], this.opts).exec(this.client);
  zrem = (n, ...t2) => new ie([n, ...t2], this.opts).exec(this.client);
  zremrangebylex = (...n) => new pe(n, this.opts).exec(this.client);
  zremrangebyrank = (...n) => new de(n, this.opts).exec(this.client);
  zremrangebyscore = (...n) => new ce(n, this.opts).exec(this.client);
  zrevrank = (n, t2) => new ue([n, t2], this.opts).exec(this.client);
  zscan = (...n) => new he(n, this.opts).exec(this.client);
  zscore = (n, t2) => new Ce([n, t2], this.opts).exec(this.client);
  zunion = (...n) => new le(n, this.opts).exec(this.client);
  zunionstore = (...n) => new ge(n, this.opts).exec(this.client);
};
var Nl = "v1.30.0";

// node_modules/@upstash/redis/nodejs.mjs
typeof atob > "u" && (global.atob = (t2) => Buffer.from(t2, "base64").toString("utf-8"));
var a = class t extends Re {
  constructor(e2) {
    if ("request" in e2) {
      super(e2);
      return;
    }
    (e2.url.startsWith(" ") || e2.url.endsWith(" ") || /\r|\n/.test(e2.url)) && console.warn("The redis url contains whitespace or newline, which can cause errors!"), (e2.token.startsWith(" ") || e2.token.endsWith(" ") || /\r|\n/.test(e2.token)) && console.warn("The redis token contains whitespace or newline, which can cause errors!");
    let n = new De({ baseUrl: e2.url, retry: e2.retry, headers: { authorization: `Bearer ${e2.token}` }, agent: e2.agent, responseEncoding: e2.responseEncoding, cache: e2.cache || "no-store", signal: e2.signal });
    super(n, { automaticDeserialization: e2.automaticDeserialization, enableTelemetry: !process.env.UPSTASH_DISABLE_TELEMETRY, latencyLogging: e2.latencyLogging }), this.addTelemetry({ runtime: typeof EdgeRuntime == "string" ? "edge-light" : `node@${process.version}`, platform: process.env.VERCEL ? "vercel" : process.env.AWS_REGION ? "aws" : "unknown", sdk: `@upstash/redis@${Nl}` });
  }
  static fromEnv(e2) {
    if (typeof process?.env > "u")
      throw new Error('Unable to get environment variables, `process.env` is undefined. If you are deploying to cloudflare, please import from "@upstash/redis/cloudflare" instead');
    let n = process?.env.UPSTASH_REDIS_REST_URL;
    if (!n)
      throw new Error("Unable to find environment variable: `UPSTASH_REDIS_REST_URL`");
    let s = process?.env.UPSTASH_REDIS_REST_TOKEN;
    if (!s)
      throw new Error("Unable to find environment variable: `UPSTASH_REDIS_REST_TOKEN`");
    return new t({ ...e2, url: n, token: s });
  }
};

// index.ts
var app = new Hono2();
var cache = /* @__PURE__ */ new Map();
var RedisRateLimiter = class {
  static getInstance(c) {
    if (!this.Instance) {
      const { REST_URL, REST_TOKEN } = env(c);
      const redisClient = new a({
        token: REST_TOKEN,
        url: REST_URL
      });
      const ratelimit = new import_ratelimit.Ratelimit({
        redis: redisClient,
        limiter: import_ratelimit.Ratelimit.slidingWindow(10, "10 s"),
        ephemeralCache: cache
      });
      this.Instance = ratelimit;
      return ratelimit;
    } else {
      return this.Instance;
    }
  }
};
__publicField(RedisRateLimiter, "Instance");
app.use(async (c, next) => {
  const ratelimit = RedisRateLimiter.getInstance(c);
  c.set("ratelimit", ratelimit);
  return await next();
});
app.get("/todos/:id", async (c) => {
  const ratelimit = c.get("ratelimit");
  const ip = c.req.raw.headers.get("CF-CONNECTING-IP");
  const { success } = await ratelimit.limit(ip ?? "anonymous");
  if (success) {
    const params = c.req.param("id");
    const id = Number(params);
    const todo = data_default.find((todo2) => todo2.id === id);
    return c.json(todo);
  } else {
    return c.json({ message: "Rate limit exceeded" }, 429);
  }
});
var rate_limit_api_default = app;

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_checked_fetch();
init_modules_watch_stub();
var drainBody = async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e2) {
      console.error("Failed to drain the unused request body.", e2);
    }
  }
};
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_checked_fetch();
init_modules_watch_stub();
function reduceError(e2) {
  return {
    name: e2?.name,
    message: e2?.message ?? String(e2),
    stack: e2?.stack,
    cause: e2?.cause === void 0 ? void 0 : reduceError(e2.cause)
  };
}
var jsonError = async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e2) {
    const error = reduceError(e2);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
};
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-lfPU2l/middleware-insertion-facade.js
rate_limit_api_default.middleware = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default,
  ...rate_limit_api_default.middleware ?? []
].filter(Boolean);
var middleware_insertion_facade_default = rate_limit_api_default;

// node_modules/wrangler/templates/middleware/common.ts
init_checked_fetch();
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}

// .wrangler/tmp/bundle-lfPU2l/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (worker.middleware === void 0 || worker.middleware.length === 0) {
    return worker;
  }
  for (const middleware of worker.middleware) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  };
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      };
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
function wrapWorkerEntrypoint(klass) {
  if (klass.middleware === void 0 || klass.middleware.length === 0) {
    return klass;
  }
  for (const middleware of klass.middleware) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
