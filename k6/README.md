# K6s

## Installation

```bash
sudo dnf install https://dl.k6.io/rpm/repo.rpm
sudo dnf install k6
```

## Running k6

k6 supports three execution modes to run a k6 test: local, distributed, and cloud. We will focus on **local mode**

```bash
# Make sure you change the FRONT
k6 run -e FRONT=http://frontend-external-west.apps.ocp-skupper-acm.r7b7x.azure.redhatworkshops.io script.js

```

NOTE: This test is built having [Scenarios/Executors](https://k6.io/docs/using-k6/scenarios/executors/) in mind. Please refer to the official documentation for further details.


