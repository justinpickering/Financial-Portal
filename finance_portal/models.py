from socket import TCP_FASTOPEN
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.deletion import CASCADE
from django.forms import DecimalField
from django.utils.timezone import now
from datetime import date, datetime

# Create your models here.

class User(AbstractUser):
    pass

class Networth(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    date.editable = True

    taxable = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    tfsa = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    rrsp = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    other_investable = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    bitcoin = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    ethereum = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    other_crypto = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    hard_cash = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    checkings = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    savings = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    other_cash = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    principal_residence = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    auto = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    other_properties = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    goods = models.DecimalField(max_digits=15, decimal_places=2, default=0)


    mortgages = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    consumer_debt = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    loans = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    other_debt = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    total_networth = models.DecimalField(max_digits=15, decimal_places=2, default=0)

#.strftime("%d %B, %Y")
    def serialize(self):
        return {
            "date": self.date.strftime('%Y-%m-%d'),
            "taxable": self.taxable,
            "tfsa": self.tfsa,
            "rrsp": self.rrsp,
            "other_investable": self.other_investable,

            "bitcoin": self.bitcoin,
            "ethereum": self.ethereum,
            "other_crypto": self.other_crypto,

            "hard_cash": self.hard_cash,
            "checkings":self.checkings,
            "savings":self.savings,
            "other_cash":self.other_cash,

            "principal_residence":self.principal_residence,
            "auto":self.auto,
            "other_properties":self.other_properties,
            "goods":self.goods,

            "mortgages":self.mortgages,
            "consumer_debt":self.consumer_debt,
            "loans":self.loans,
            "other_debt":self.other_debt,

            "total_networth": self.total_networth
        }
