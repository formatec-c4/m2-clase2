from diagrams import Cluster, Diagram, Edge
from diagrams.generic.blank import Blank
from diagrams.onprem.client import Client
from diagrams.onprem.container import Docker
from diagrams.onprem.database import Mysql
from diagrams.onprem.monitoring import Grafana, Prometheus
from diagrams.onprem.network import Nginx
from diagrams.programming.framework import Flask


graph_attr = {
    "fontsize": "20",
    "pad": "0.5",
    "splines": "ortho",
    "nodesep": "0.8",
    "ranksep": "0.9",
}

with Diagram(
    "Firulais - Carga y observabilidad",
    filename="docs/diagrams/firulais-observabilidad",
    show=False,
    direction="LR",
    graph_attr=graph_attr,
):
    k6 = Client("k6\nprueba de carga")

    with Cluster("Aplicacion"):
        nginx = Nginx("NGINX\nLoad Balancer")
        app = Flask("Flask app\nx N replicas")
        mysql = Mysql("MySQL")

    with Cluster("Metricas de contenedores"):
        docker = Docker("Docker Engine")
        cadvisor = Docker("cAdvisor")

    with Cluster("Metricas de base de datos"):
        exporter = Blank("mysqld-exporter")

    with Cluster("Observabilidad"):
        prometheus = Prometheus("Prometheus")
        grafana = Grafana("Grafana")

    k6 >> Edge(label="requests HTTP") >> nginx >> app >> mysql

    k6 >> Edge(label="metricas k6", color="darkgreen") >> prometheus

    docker >> Edge(label="uso CPU/mem") >> cadvisor
    prometheus >> Edge(label="scrape") >> cadvisor

    mysql >> Edge(label="estado DB") >> exporter
    prometheus >> Edge(label="scrape") >> exporter

    grafana >> Edge(label="consulta PromQL") >> prometheus
