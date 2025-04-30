# k8s-clam

Kubernetes cluster but secure™

This repository contains the configuration files for securing a Kubernetes cluster using various tools and practices. The focus is on implementing security measures to protect the cluster from potential threats.

Also, this repository contains tools to help you break a kubernetes cluster. This is not a guide to break a kubernetes cluster, but a collection of tools that can be used to break a kubernetes cluster.

## Repository Structure

```plaintext
k8s-clam/
├── .github/
│   ├── workflows/              # Contains GitHub Actions workflows for CI/CD automation.
├── blue/
│   ├── pipeline/               # Resources related to the pipeline for the "blue" environment.
│   ├── rbac/                   # Role-Based Access Control (RBAC) configurations for "blue".
│   ├── simple_app/             # A simple application deployed in the "blue" environment.
├── manifests/
│   ├── kubewarden/             # Configuration files for Kubewarden policies.
│   ├── policies/               # Custom Kubernetes policies.
│   ├── kata-runtimeclass.yaml  # RuntimeClass configuration for Kata Containers.
│   ├── kubearmor-config.yaml   # Configuration for KubeArmor security policies.
│   ├── limitrange.yaml         # LimitRange configuration for resource constraints.
├── openstack/                  # Placeholder for OpenStack-related resources.
├── red/
│   ├── api/                    # API-related resources for the "red" environment.
│   ├── client/                 # Client-related resources for the "red" environment.
│   ├── k8s/                    # Kubernetes configurations for the "red" environment.
│   ├── manual_attacks/         # Resources for simulating manual attack scenarios.
├── helmfile.yaml               # Helmfile for managing Helm charts.
├── justfile                    # Justfile for task automation using `just`.
├── README.md
```

## "Blue" Environment

The "blue" environment is designed to be a secure and controlled environment for deploying applications. It includes various security measures and configurations to ensure the safety of the deployed applications.

Here are the components deployed in the "blue" environment:

- **Talos**: A secure operating system designed for Kubernetes clusters. It provides a minimal and immutable OS that is optimized for running Kubernetes.
- **Cilium**: A networking and security solution for Kubernetes that provides advanced networking features and security policies.
- **KubeArmor**: A security enforcement tool that provides runtime protection for Kubernetes workloads.
- **Kubewarden**: A policy engine for Kubernetes that allows you to enforce security policies on your cluster.
- **Kata Containers**: A lightweight virtual machine (VM) runtime for Kubernetes that provides enhanced isolation for workloads.
- **Kyverno**: A policy engine for Kubernetes that allows you to enforce security policies on your cluster.

We also used rbac to limit access to the cluster. The RBAC configuration is located in the `blue/rbac` directory. The manifests are located in the `manifests` directory.

## "Red" Environment

The "red" environment is providing a set of resources and configurations for simulating attack scenarios and testing the security measures in place. It includes various components that can be used to simulate attacks and test the security of the Kubernetes cluster.

You can find the following components in the "red" environment:

- **API**: An API server that i meant to replace the target system. It can be used to execute commands directly on the pod using the API.
- **Client**: A client application that interacts with the API server. It can be used to execute commands and perform actions on the target system.
- **manual_attacks**: A collection of resources and scripts for simulating manual attack scenarios. This includes various deployments, tools and techniques that can be used to test the security of the Kubernetes cluster.
