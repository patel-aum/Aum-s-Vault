output "cluster_name" {
  description = "Name of the EKS cluster"
  value       = aws_eks_cluster.cluster1.name
}

output "node_group_name" {
  description = "Name of the EKS node group"
  value       = aws_eks_node_group.node01.node_group_name
}

output "cluster_endpoint" {
  description = "EKS cluster endpoint"
  value       = aws_eks_cluster.cluster1.endpoint
}

