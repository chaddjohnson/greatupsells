# Reference: https://alex.dzyoba.com/blog/terraform-ansible/
# Reference: https://getintodevops.com/blog/using-ansible-with-terraform

# Define server specs.
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_security_group" "services_server" {
  name        = "services-server"
  description = "Security group for services server"
  provider    = aws.region

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Commission the server instance.
resource "aws_instance" "services_server" {
  ami               = data.aws_ami.ubuntu.id
  instance_type     = var.instance_type
  availability_zone = "us-east-1a"
  monitoring        = true

  root_block_device {
    delete_on_termination = false
    volume_size           = "64"
    volume_type           = "gp2"
  }

  vpc_security_group_ids  = [aws_security_group.services_server.id]
  tenancy                 = "default"
  disable_api_termination = true
  ebs_optimized           = true
  key_name                = "neatowebsolutions"
  provider                = aws.region

  tags = {
    Name = "services-server"
  }
}

# Set up a public IP address for the server.
resource "aws_eip" "services_server" {
  instance = aws_instance.services_server.id
  provider = aws.region
}

# Create Ansible hosts config.
resource "null_resource" "ansible_host_config" {
  provisioner "local-exec" {
    command = <<EOT
      cat /dev/null > region/services-server/hosts
      echo "[services-server]" >> region/services-server/hosts
      echo "${aws_eip.services_server.public_ip}" >> region/services-server/hosts
      echo "" >> region/services-server/hosts
      echo "[all:vars]" >> region/services-server/hosts
      echo "ansible_user=ubuntu" >> region/services-server/hosts
      echo "ansible_port=22" >> region/services-server/hosts
      echo "ansible_python_interpreter='/usr/bin/env python3'" >> region/services-server/hosts
EOT
  }

  # Force this resource to always execute. Uncomment to re-run.
  triggers = {
    timestamp = "${timestamp()}"
  }

  depends_on = [aws_instance.services_server, aws_eip.services_server]
}

# Run Ansible to set up the server.
resource "null_resource" "services_server_setup" {
  provisioner "local-exec" {
    working_dir = "region/services-server"
    command     = "ansible-playbook --private-key ~/.ssh/neatowebsolutions/id_rsa -b deploy.yml -e 'domain_name=${var.domain_name}'"
  }

  # Force this resource to always execute. Uncomment to re-run.
  triggers = {
    timestamp = "${timestamp()}"
  }

  depends_on = [aws_instance.services_server, aws_eip.services_server]
}

resource "aws_route53_record" "domain_name" {
  zone_id = var.hosted_zone_id
  name    = var.domain_name
  type    = "A"
  ttl     = 86400
  records = [aws_eip.services_server.public_ip]
}
