cluster_name := "k8s-clam-dev"

init:
  just --justfile {{justfile()}} helmfile-sync
  # waiting for services to start (can add others)
  kubectl wait --for=jsonpath='{.status.readyReplicas}'=1 deploy/kubearmor-operator --namespace kubearmor
  # applying custom manifests
  kubectl apply -f ./manifests/kubearmor-config.yaml
  # applying kata runtimeclass
  kubectl apply -f ./manifests/kata-runtimeclass.yaml

helmfile-sync:
  #!/bin/bash
  # set -a; source .env; set +a;
  helmfile sync

dev:
  kind create cluster --name {{ cluster_name }}
  just --justfile {{justfile()}} init

delete-dev:
  kind delete cluster --name {{ cluster_name }}

recreate-dev: delete-dev dev
