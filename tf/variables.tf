variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
  default     = "cluster1"
}

variable "node_group_name" {
  description = "Name of the EKS node group"
  type        = string
  default     = "node01"
}

variable "instance_type" {
  description = "Instance type for worker nodes"
  type        = string
  default     = "t2.medium"
}

variable "node_desired" {
  description = "Desired number of nodes"
  type        = number
  default     = 1
}

variable "node_max" {
  description = "Maximum number of nodes"
  type        = number
  default     = 1
}

variable "subnet_ids" {
  description = "List of subnet IDs for the cluster"
  type        = list(string)
}

variable "admin_user" {
  description = "Username for cluster admin"
  type        = string
  default     = "admin"
}

