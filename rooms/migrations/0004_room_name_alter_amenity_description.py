# Generated by Django 4.2.17 on 2024-12-14 09:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("rooms", "0003_amenity_created_at_amenity_updated_at_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="room",
            name="name",
            field=models.CharField(default="", max_length=180),
        ),
        migrations.AlterField(
            model_name="amenity",
            name="description",
            field=models.CharField(blank=True, max_length=150, null=True),
        ),
    ]
