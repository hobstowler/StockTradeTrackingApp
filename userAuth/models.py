from django.db import models


class User:
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.CharField(max_length=100)
    username = models.CharField(max_length=50, blank=True)
    password = models.CharField(max_length=50)
    provider = models.CharField(max_length=50, blank=True)
    provider_id = models.CharField(max_length=100, blank=True)


class Provider:
    pass
