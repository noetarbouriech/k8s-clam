# k8s-clam
Kubernetes cluster but secure™

## Add gitlab runner to cluster

```bash
# Add the GitLab Helm repository
helm repo add actions-runner-controller https://actions-runner-controller.github.io/actions-runner-controller
```

```bash
helm install actions-runner-controller actions-runner-controller/actions-runner-controller -namespace arc-systems -create-namespace -f runner-controller.yaml
```

Ensure that the controller is running before creating the runner deployment:

```bash
kubectl get pods -n arc-systems
```

```bash
kubectl apply -f ./pipeline/runner-deployment.yaml
```

## Create base64 version of the secret

```bash
base64 -w 0 ~/.kube/config.ci > kubeconfig.b64
```
