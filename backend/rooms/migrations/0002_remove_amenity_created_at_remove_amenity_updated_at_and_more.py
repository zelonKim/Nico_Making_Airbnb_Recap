# Generated by Django 4.2.17 on 2024-12-14 08:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("rooms", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="amenity",
            name="created_at",
        ),
        migrations.RemoveField(
            model_name="amenity",
            name="updated_at",
        ),
        migrations.RemoveField(
            model_name="room",
            name="created_at",
        ),
        migrations.RemoveField(
            model_name="room",
            name="updated_at",
        ),
    ]
