variable "hosted_zone_id" {
  type = string
}

variable "public_key" {
  type = string
}

variable "base_domain" {
  type = string
}

variable "domain" {
  type = string
}

variable "instance_type" {
  type = string
}

variable "sandbox" {
  type = string
}

variable "jwt_secret" {
  type = string
}

variable "services_domain_names" {
  type = map(string)
}

variable "assets_domain" {
  type = string
}

variable "shopify_admin_app_api_key" {
  type = string
}
variable "shopify_admin_app_api_secret_key" {
  type = string
}

variable "event_bus_arn" {
  type = string
}

variable "redis_app_password" {
  type = string
}
