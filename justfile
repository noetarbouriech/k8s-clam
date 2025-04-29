cluster_name := "k8s-clam-dev"

init:
  kind create cluster --name {{ cluster_name }}
  just --justfile {{justfile()}} helmfile-sync
  # waiting for services to start (can add others)
  kubectl wait --for=jsonpath='{.status.readyReplicas}'=1 deploy/kubearmor-operator --namespace kubearmor
  # applying custom manifests
  kubectl apply -f ./manifests/kubearmor-config.yaml

helmfile-sync:
  #!/bin/bash
  # set -a; source .env; set +a;
  helmfile sync

delete:
  kind delete cluster --name {{ cluster_name }}

recreate: delete init
