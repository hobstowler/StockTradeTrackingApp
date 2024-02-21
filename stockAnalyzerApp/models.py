from django.db import models

# Create your models here.
class WatchGroup(models.Model):
    name = models.CharField(max_length=100)

class WatchItem(models.Model):
    pass