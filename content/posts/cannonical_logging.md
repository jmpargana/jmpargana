+++
title = 'Canonical Logging'
date = 2026-03-20T22:03:54+01:00
draft = false
tags = ["Go", "Backend", "Observability", "Monitoring", "Logging", "Context", "On-Call", "Operations", "Costs"]
+++

Ever since I've read [loggingsucks](https://loggingsucks.com/), I've been focused on implementing canonical logging across my applications. 

If you're new to the concept, I really really recommend you reading the whole article there. It's a great read, interactive, complete and makes a compeling case on why you should prefer it. I will try to give a very simple explanation so the code examples below make more sense.

Imagine each server call, whatever happens has a single, context-rich log with all the information that pertains to that one request. No complex [loki](https://grafana.com/oss/loki/) queries. No guessing what _ERROR: something went wrong_ means. No looking for timestamps between different microservices to figure out what triggered the failure. That's what canonical logging is. That one single log. The log you've longed for. 

In microservices and large scale systems, canonical logging is a must. You simply add all the context you need there.

## Setting up in go

Fortunately for any go developer, there's a great library: [ucarion/log](https://github.com/ucarion/log). It's compatible with any logging library you use, like [uber-go/zap](https://github.com/uber-go/zap).

The way it works is by leveraging go's `context.Context`. You pass along all the key-value you want to include in your logs and once you're done, you call `log.Log`. 

Here's a simple example on how you can use the standard library to create a middleware that sets up the logger.

```go
package main

import (
    _ "github.com/ucarion/log/loggers/zap"
	"go.uber.org/zap"
)

func init() {
    zap.ReplaceGlobals(zap.NewExample())
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /endpoint", handler)
    loggedAppHandler := logger(mux)
    
    // ...
}

func logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := log.NewContext(r.Context())
		log.Set(ctx, "start_time", time.Now())
		
		correlationID := r.Header.Get("X-Correlation-Id")
		log.Set(ctx, "correlationId", correlationID)

		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)

		log.Set(ctx, "end_time", time.Now())
		if r.Method == http.MethodOptions {
			return
		}
		log.Log(ctx, "request")
	})
}

func handler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	log.Set(ctx, "handler", "handler")
    
    // ...

	log.Set(ctx, "status_code", 200)
	w.WriteHeader(200)
}
```

## Keep in mind

While canonical logging is extremely useful, adding all context to a single log can result in very large log entries. If you've used a service like Grafana Cloud, you know it can incur significant costs. Heavy logging, even with low retention periods, can become expensive.

My recommendation is to have someone review the code and help determine whether the extra context provides real value. It's easy to add everything (for example, _metadata columns_). In practice, you'll likely only need core fields that should always be included:
- correlationId
- error code (if you keep efficient representations of long string explanations)
- trace and span ids (to match with traces)
- result
- userId (if GDPR compliant)
- sessionId
- essential business context