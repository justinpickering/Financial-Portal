# Generated by Django 3.2.7 on 2022-06-04 23:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finance_portal', '0006_rename_other_networth_other_crypto'),
    ]

    operations = [
        migrations.AddField(
            model_name='networth',
            name='total_networth',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=15),
        ),
    ]
