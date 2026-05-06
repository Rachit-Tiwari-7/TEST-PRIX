# Core Architecture V2

## Overview
This document outlines the design decisions for the 2026 Core Engine refactor.

### Key Changes
1. **Multi-threaded Workers**: Leveraging Node.js worker_threads for heavy CPU tasks.
2. **Abstract Storage Layer**: Decoupled engine from specific database implementations.
3. **Reactive Task Queue**: Event-driven task distribution.

### Sequence Diagram
1. Client -> Engine: Start
2. Engine -> Storage: Load Snapshot
3. Engine -> Workers: Initialize
4. Workers -> Queue: Pull Task
5. Workers -> Storage: Commit Result

### Scalability Notes
- Max worker threads: 16
- Max queue depth: 10,000
- Throughput: ~5,000 events/sec
