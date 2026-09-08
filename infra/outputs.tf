output "instance_id" {
  description = "ID de la instancia EC2 (usado por deploy.yml para el ssm send-command)."
  value       = aws_instance.app.id
}

output "public_ip" {
  value = aws_eip.app.public_ip
}

output "url" {
  value = "https://${var.domain_name}"
}

output "ssm_session_command" {
  description = "Comando para conectarse a la instancia sin SSH."
  value       = "aws ssm start-session --target ${aws_instance.app.id} --region ${var.aws_region}"
}
