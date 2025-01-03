# Generated by Django 4.2.17 on 2024-12-26 02:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("experiences", "0003_alter_experience_address_alter_experience_city_and_more"),
        ("wishlists", "0002_alter_wishlist_experiences_alter_wishlist_rooms_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="wishlist",
            name="experiences",
            field=models.ManyToManyField(to="experiences.experience"),
        ),
    ]
