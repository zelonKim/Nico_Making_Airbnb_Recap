# Generated by Django 4.2.17 on 2024-12-14 08:50

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ("rooms", "0002_remove_amenity_created_at_remove_amenity_updated_at_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="amenity",
            name="created_at",
            field=models.DateTimeField(
                auto_now_add=True, default=django.utils.timezone.now
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="amenity",
            name="updated_at",
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name="room",
            name="created_at",
            field=models.DateTimeField(
                auto_now_add=True, default=django.utils.timezone.now
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="room",
            name="updated_at",
            field=models.DateTimeField(auto_now=True),
        ),
    ]
