# Generated by Django 4.2.17 on 2024-12-21 01:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0003_alter_user_avatar"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="avatar",
            field=models.URLField(blank=True),
        ),
    ]
