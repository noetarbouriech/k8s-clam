for i in {1..500}; do
  kubectl get pods --watch --all-namespaces > /dev/null &
done