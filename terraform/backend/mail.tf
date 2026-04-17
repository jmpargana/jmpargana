variable "aws_region" {
  default = "eu-west-1"
}

variable "domain" {
  default = "mail.jmpargana.com" 
}

resource "aws_ses_domain_identity" "mail" {
  domain = var.domain
}

resource "aws_route53_record" "ses_verification" {
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = "_amazonses.${var.domain}"
  type    = "TXT"
  ttl     = 600

  records = [aws_ses_domain_identity.mail.verification_token]
}

resource "aws_ses_domain_identity_verification" "mail_verification" {
  domain = aws_ses_domain_identity.mail.domain

  depends_on = [aws_route53_record.ses_verification]
}

resource "aws_ses_domain_dkim" "mail_dkim" {
  domain = aws_ses_domain_identity.mail.domain
}

resource "aws_route53_record" "dkim_records" {
  count   = 3
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = "${aws_ses_domain_dkim.mail_dkim.dkim_tokens[count.index]}._domainkey.${var.domain}"
  type    = "CNAME"
  ttl     = 600

  records = ["${aws_ses_domain_dkim.mail_dkim.dkim_tokens[count.index]}.dkim.amazonses.com"]
}

resource "aws_ses_domain_mail_from" "mail_from" {
  domain           = aws_ses_domain_identity.mail.domain
  mail_from_domain = "bounce.${var.domain}"
}

resource "aws_route53_record" "mail_from_mx" {
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = "bounce.${var.domain}"
  type    = "MX"
  ttl     = 600

  records = ["10 feedback-smtp.${var.aws_region}.amazonses.com"]
}

resource "aws_route53_record" "mail_from_spf" {
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = "bounce.${var.domain}"
  type    = "TXT"
  ttl     = 600

  records = ["v=spf1 include:amazonses.com -all"]
}

resource "aws_route53_record" "dmarc" {
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = "_dmarc.${var.domain}"
  type    = "TXT"
  ttl     = 600

  records = ["v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com"]
}

data "aws_route53_zone" "primary" {
  name         = "example.com"
  private_zone = false
}
