# Amplía el rol OIDC que ya usa deploy.yml (github-actions-pedidos-almuerzo-deploy)
# con los permisos que necesita Terraform y el paso de redeploy por SSM.
# No se toca la trust policy existente ni la política inline "ecr-pedidos-almuerzo-frontend-deploy".

data "aws_iam_role" "github_actions" {
  name = var.github_actions_role_name
}

data "aws_region" "current" {}

resource "aws_iam_policy" "cicd_infra" {
  name        = "pedidos-almuerzo-terraform-cicd"
  description = "Permisos para que el workflow de infra corra terraform y para que deploy.yml redespliegue vía SSM."

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "TerraformStateBackend"
        Effect   = "Allow"
        Action   = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"]
        Resource = "arn:aws:s3:::terraform-tfstate-nasini/pedidos-almuerzo/*"
      },
      {
        Sid      = "TerraformStateBucketList"
        Effect   = "Allow"
        Action   = ["s3:ListBucket"]
        Resource = "arn:aws:s3:::terraform-tfstate-nasini"
        Condition = {
          StringLike = { "s3:prefix" = ["pedidos-almuerzo/*"] }
        }
      },
      {
        Sid      = "TerraformStateLock"
        Effect   = "Allow"
        Action   = ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:DeleteItem"]
        Resource = "arn:aws:dynamodb:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:table/terraform-locks"
      },
      {
        # EC2 no soporta scoping por ARN para la mayoría de las acciones de
        # creación/lectura (CreateVpc, RunInstances, Describe*, etc.), así que
        # quedan abiertas a nivel cuenta/región. El riesgo real es que este rol
        # borre o apague recursos de OTROS proyectos: eso se restringe aparte
        # en "Ec2ManageOwnResources", exigiendo el tag Project=pedidos-almuerzo.
        Sid      = "Ec2ReadAndCreate"
        Effect   = "Allow"
        Action   = ["ec2:Describe*", "ec2:Get*", "ec2:Create*", "ec2:Run*", "ec2:Allocate*", "ec2:Authorize*", "ec2:Attach*", "ec2:Associate*", "ec2:ModifyInstanceMetadataOptions"]
        Resource = "*"
        Condition = {
          StringEquals = { "aws:RequestedRegion" = var.aws_region }
        }
      },
      {
        Sid    = "Ec2ManageOwnResources"
        Effect = "Allow"
        Action = [
          "ec2:TerminateInstances", "ec2:StopInstances", "ec2:StartInstances", "ec2:RebootInstances",
          "ec2:ModifyInstanceAttribute",
          "ec2:DeleteVpc", "ec2:DeleteSubnet", "ec2:DeleteSecurityGroup",
          "ec2:DeleteRouteTable", "ec2:DeleteRoute", "ec2:DeleteInternetGateway", "ec2:DetachInternetGateway",
          "ec2:DisassociateRouteTable", "ec2:DisassociateAddress", "ec2:ReleaseAddress",
          "ec2:RevokeSecurityGroupIngress", "ec2:RevokeSecurityGroupEgress", "ec2:DeleteTags"
        ]
        Resource = "*"
        Condition = {
          StringEquals = {
            "aws:RequestedRegion"     = var.aws_region
            "aws:ResourceTag/Project" = "pedidos-almuerzo"
          }
        }
      },
      {
        Sid    = "IamForInstanceRole"
        Effect = "Allow"
        Action = [
          "iam:CreateRole", "iam:DeleteRole", "iam:GetRole", "iam:TagRole",
          "iam:PutRolePolicy", "iam:DeleteRolePolicy", "iam:GetRolePolicy",
          "iam:AttachRolePolicy", "iam:DetachRolePolicy", "iam:ListAttachedRolePolicies", "iam:ListRolePolicies",
          "iam:CreateInstanceProfile", "iam:DeleteInstanceProfile", "iam:GetInstanceProfile",
          "iam:AddRoleToInstanceProfile", "iam:RemoveRoleFromInstanceProfile", "iam:ListInstanceProfilesForRole"
        ]
        Resource = [
          "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/pedidos-almuerzo-*",
          "arn:aws:iam::${data.aws_caller_identity.current.account_id}:instance-profile/pedidos-almuerzo-*"
        ]
      },
      {
        Sid      = "IamPassRoleToEc2"
        Effect   = "Allow"
        Action   = "iam:PassRole"
        Resource = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/pedidos-almuerzo-*"
        Condition = {
          StringEquals = { "iam:PassedToService" = "ec2.amazonaws.com" }
        }
      },
      {
        Sid      = "Route53Record"
        Effect   = "Allow"
        Action   = ["route53:ChangeResourceRecordSets", "route53:GetHostedZone", "route53:ListResourceRecordSets"]
        Resource = "arn:aws:route53:::hostedzone/${data.aws_route53_zone.root.zone_id}"
      },
      {
        Sid      = "Route53GetChange"
        Effect   = "Allow"
        Action   = ["route53:GetChange"]
        Resource = "*"
      },
      {
        Sid      = "SecretsManagerOwn"
        Effect   = "Allow"
        Action   = ["secretsmanager:*"]
        Resource = "arn:aws:secretsmanager:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:secret:pedidos-almuerzo/*"
      },
      {
        Sid    = "SsmRedeploy"
        Effect = "Allow"
        Action = ["ssm:SendCommand"]
        Resource = [
          aws_instance.app.arn,
          "arn:aws:ssm:${data.aws_region.current.name}::document/AWS-RunShellScript"
        ]
      },
      {
        Sid      = "SsmRedeployStatus"
        Effect   = "Allow"
        Action   = ["ssm:GetCommandInvocation", "ssm:ListCommandInvocations"]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "cicd_infra" {
  role       = data.aws_iam_role.github_actions.name
  policy_arn = aws_iam_policy.cicd_infra.arn
}
