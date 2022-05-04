from socket import TCP_FASTOPEN
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.deletion import CASCADE
from django.forms import DecimalField
from django.utils.timezone import now

# Create your models here.

class User(AbstractUser):
    pass

class Networth(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

    taxable = models.DecimalField(max_digits=15, decimal_places=2)
    tfsa = models.DecimalField(max_digits=15, decimal_places=2)
    rrsp = models.DecimalField(max_digits=15, decimal_places=2)
    other_investable = models.DecimalField(max_digits=15, decimal_places=2)

    hard_cash = models.DecimalField(max_digits=15, decimal_places=2)
    checkings = models.DecimalField(max_digits=15, decimal_places=2)
    savings = models.DecimalField(max_digits=15, decimal_places=2)
    other_cash = models.DecimalField(max_digits=15, decimal_places=2)

    principal_residence = models.DecimalField(max_digits=15, decimal_places=2)
    auto = models.DecimalField(max_digits=15, decimal_places=2)
    goods = models.DecimalField(max_digits=15, decimal_places=2)
    other_personal = models.DecimalField(max_digits=15, decimal_places=2)

    mortgages = models.DecimalField(max_digits=15, decimal_places=2)
    consumer_debt = models.DecimalField(max_digits=15, decimal_places=2)
    loans = models.DecimalField(max_digits=15, decimal_places=2)
    other_debt = models.DecimalField(max_digits=15, decimal_places=2)

