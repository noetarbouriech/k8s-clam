// output ips of control plane
output "control_plane_ips" {
  value = openstack_networking_floatingip_v2.control_plane_fips[*].address
}
