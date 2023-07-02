# Grafana

k6 runs the test script and sends the k6 metrics in real-time to the InfluxDB instance.
This folder contains the ansible automation to deploy:

* Grafana Operator
* Grafana Instace+Datasource+k6 dashboards
* InfluxDB

## Requirements
* ansible 2.14.6+

## Deploy Stack
```sh
$ ansible-playbook openshift_grafana_influxdb_deploy.yml
# retrieve influxdb service route to configure k6 output
```
## Delete Stack
```sh
$ ansible-playbook openshift_grafana_influxdb_delete.yml
```

## References:

* [k6 Grafana Dashboards](https://k6.io/docs/results-output/real-time/influxdb/#grafana-dashboards)
* [Grafana Datasource variable](https://grafana-operator.github.io/grafana-operator/docs/examples/datasource_variables/readme/)
* [Dashboard from grafana.com/dashboards](https://grafana-operator.github.io/grafana-operator/docs/examples/dashboard_from_grafana_com/readme/)
