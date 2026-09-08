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
        Sid      = "Ec2Provisioning"
        Effect   = "Allow"
        Action   = ["ec2:*"]
        Resource = "*"
        Condition = {
          StringEquals = { "aws:RequestedRegion" = var.aws_region }
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
