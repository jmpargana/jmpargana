# Terraform 

This folder contains the code to provision all infrastructure related to the project:
- DynamoDB (newsletter subscribers)
- Lambda Functions
- API Gateway
- Route53 (domain delegation)
- Remote Backend setup (not being used)

For full automation some steps are still missing:
- [ ] github actions to update infra on pushes to `main`
- [ ] secrets on github to run actions
- [ ] domain delegation setup
- [ ] delegate subdomain `api.jmpargana.com` to aws and associate with api gw
- [ ] setup mail subdomain `mail.jmpargana.com` records to validate sender
