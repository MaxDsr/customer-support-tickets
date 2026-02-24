# Status filter variable behavior
_Exported on 2/24/2026 at 15:10:06 GMT+1 from Cursor (2.5.20)_

---

**User**

@frontend/src/App.tsx:37-38 

How does this usually works? does it mean that if a statusFilter var changes, new request will be made?

---

**Cursor**


Yes. Changing `statusFilter` (or `sortOrder`) causes a new request because of how the query is set up.

**What actually drives refetches**

The important part is the `useQuery` call (lines 39–42):

```39:42:frontend/src/App.tsx
  const { data: tickets = [], isLoading, isError } = useQuery({
    queryKey: ['tickets', statusFilter, sortOrder],
    queryFn: () => api.tickets.list(statusFilter, sortOrder),
  })
```

In TanStack Query (React Query), the **query key** defines the identity of the query. Whenever the key changes, React Query treats it as a different query and:

1. Runs `queryFn` again (so `api.tickets.list(statusFilter, sortOrder)` is called again).
2. That triggers a new network request with the new `statusFilter` and/or `sortOrder`.

So:

- Changing `statusFilter` (e.g. from `'all'` to `'open'`) changes the key from `['tickets', 'all', 'desc']` to `['tickets', 'open', 'desc']` → new request.
- Changing `sortOrder` does the same → new request.

**What line 38 is for**

`queryClient` from `useQueryClient()` is not what causes refetches when the filter/sort change. It’s used for **manual invalidation** after mutations:

- After updating a ticket (line 47): `queryClient.invalidateQueries({ queryKey: ['tickets'] })` marks all ticket queries as stale so they refetch (e.g. to show updated status).
- After deleting a ticket (line 56): same idea, so the list updates.

**Summary**

- **New request when filter/sort change:** Yes — because `statusFilter` and `sortOrder` are in `queryKey`, so changing either one changes the key and triggers a new fetch.
- **`queryClient`:** Used to invalidate ticket queries after update/delete so the list refetches; it doesn’t control the refetch that happens when you change `statusFilter` or `sortOrder`.

---

**User**

So by default tanstack tries 3 repeated requests if FE gets an error, right?

---

**Cursor**


TanStack Query does retry failed queries by default. The default is **3 retries** after the first failure, so you get **up to 4 attempts** in total (1 initial + 3 retries).

Details:

- **What gets retried:** Only queries that throw an error (e.g. network failure, 5xx). By default, **4xx responses** (e.g. 404, 401) are **not** retried; only errors that don’t return a response or are considered retryable trigger retries.
- **Delay:** Retries use exponential backoff: the delay before each retry increases (e.g. 1s, 2s, 4s).
- **Override:** You can turn it off with `retry: false`, set a number (e.g. `retry: 5`), or use a function to decide per attempt/error:

  ```ts
  useQuery({
    queryKey: ['tickets', statusFilter, sortOrder],
    queryFn: () => api.tickets.list(statusFilter, sortOrder),
    retry: false,           // no retries
    // or retry: 5,         // 5 retries
    // or retry: (failureCount, error) => ...  // custom logic
  })
  ```

So yes: by default TanStack Query will retry up to 3 times (3 extra requests after the first error) for errors it considers retryable.

