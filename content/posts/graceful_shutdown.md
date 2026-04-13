+++
title = 'Graceful Shutdown'
date = 2026-03-05T22:03:54+01:00
draft = false
tags = ["go", "backend", "fault tolerance", "error handling", "concurrency"]
+++

Graceful shutdown is critical for production readiness. It ensures that in-flight requests complete or are properly handled, and that dependent services can cleanly release resources during rolling updates or maintenance windows.

In a distributed, multi-instance system, instances go up and down continuously. Starting up is straightforward: configure health probes and optimize startup time. Shutting down gracefully is more complex. 

At scale, when your system processes multiple concurrent requests, you must ensure work either completes or is properly delegated before shutdown.

## Go

The following examples use Go and its concurrency-first design. However, these principles apply equally to Spring Boot, Node.js, and other platforms.

## Waiting

The idea is simple. You have a process running and you need to leverage the underlying operating system to coordinate signaling to actual stopping.

Your flow diagram will look something like this:
1. Event triggers stopping sequence against supervisor (we'll get to that later)
2. Operating system emits signal to process
3. Your process delays stopping until confirmation

### Signals

Let's start the signals. Assuming you're running your application on a Linux system, you will have two types of signals:
- Catchable: `SIGTERM`, `SIGINT`, `SIGHUP`
- Non-catchable: `SIGKILL`, `SIGSTOP`

### Delaying

The flow in your application usually involves subscribing to these signals, wiring them up with shared concurrency-friendly global data (usually `context.Context`) and defining closing routines.

```go
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()
    
    go func(){
        // ... your logic
    }()
    
    <-ctx.Done()
    
    // cleanup work
    server.Shutdown()
    dependencyA.Cleanup()
```

You'll want to either wire up your clean up to be handled by the caller in your `main` function, or simply accept `context.Context` as an argument. 


#### Delaying

##### Server handlers

When using `http.Server` you must execute `server.Shutdown()` manually. That means you must add that
call after receiving the signal.

```go
    server := &http.Server{
		Addr:    port,
		Handler: mux,
	}
    go func() {
        if err := server.ListenAndServe(); err != nil {
            // ... handle error
            done()
        }
    }()
    
    <-ctx.Done()
    server.Shutdown()
```

##### Worker pool

Depending on whether you implement your own worker pool or use an existing library, in a well designed library, passing `ctx` is enough. Using `ctx` should have you regularly read `ctx.Done()` and handle closing routines accordingly. 

Here's an example of such a library:

```go
    // caller
    go worker.Start(ctx)
    
    // worker
    func Start(ctx context.Context) {
        select {
            // ...
            case <-ctx.Done()
                // or other Shutdown methods
                close(jobs)
                return
        }
    }
```

### Tradeoffs

You might have noticed that the worker pool not only stops receiving work but also orchestrates the cancellation of ongoing. 

This comes at a cost. You might want to split it into two phases, as the two are different and you might want to distinguish waiting for a signal vs setting a clear deadline to stop work. 

Here's how a better design would look like and more idiomatic Go would look like:

```go
func (wp *WorkerPool) Start(ctx context.Context) {
    for i := 0; i < p.workers; i++ {
		p.wg.Add(1)
		go func(ctx context.Context) {
            defer p.wg.Done()

            for {
                select {
                    case <-ctx.Done():
                        return
                }    
            }
        }(ctx)
	}
}

// This one is called after you know you want to stop to handle timeouts
func (wp *WorkerPool) Shutdown(ctx context.Context) error {
    close(p)
}
```

This achieves the following:
- context is used for cancellation of in-flight work
- explicit methods handle lifecycle

You see the `http.Server` example above implementing this exact pattern.

### Supervisor

All of this behavior heavily depends on the system where your service runs. If we're talking about an ephemeral container system like Kubernetes, it might not just wait around until you emit an exit code. Which is actually there for your own protection. Imagine a hanging queue or infinite loop?

In Kubernetes the control plane will always escalate from catchable signal `SIGTERM` to non-catchable `SIGKILL`. You can only influence how look you expect your service to wait. 

To do so, you can use:

```sh
> kubectl explain pod.spec.terminationGracePeriodSeconds
KIND:       Pod
VERSION:    v1

FIELD: terminationGracePeriodSeconds <integer>


DESCRIPTION:
    Optional duration in seconds the pod needs to terminate gracefully. May be
    decreased in delete request. Value must be non-negative integer. The value
    zero indicates stop immediately via the kill signal (no opportunity to shut
    down). If this value is nil, the default grace period will be used instead.
    The grace period is the duration in seconds after the processes running in
    the pod are sent a termination signal and the time when the processes are
    forcibly halted with a kill signal. Set this value longer than the expected
    cleanup time for your process. Defaults to 30 seconds.
```

## Conclusion

Graceful shutdown comes with some tradeoffs that heavily depend on the sort of system you are running. In some cases you might prefer to simply close all channels instead. Weighing those is essential before deciding how to wire up your application correctly.