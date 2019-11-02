from django.db import migrations

from ...core.utils import slugify

_ = lambda s: s


def create_default_categories_tree(apps, schema_editor):
    Category = apps.get_model("misago_categories", "Category")

    Category.objects.create(
        special_role="private_threads",
        name="Private",
        slug="private",
        lft=1,
        rght=2,
        tree_id=0,
        level=0,
    )

    root = Category.objects.create(
        special_role="root_category",
        name="Root",
        slug="root",
        lft=3,
        rght=20, # Need to increment by two for each new category created
        tree_id=1,
        level=0,
    )

    category_names = [
        "Αρχιτεκτονικά",
        "Στατικά",
        "Αποτυπώσεις - Επιμετρήσεις",
        "Μέτρα Ασφαλείας",
        "Μηχανολογικά",
        "Ενεργειακά (ΠΕΑ)",
        "Συμβουλευτική Ακινήτου - Ανάπτυξη",
        "Πληροφορική (Υπολογιστές, Λογισμικό, Εφαρμογές)",
        "Διάφορα"
    ]

    starting_node_left = 4

    for category_name in category_names:
        Category.objects.create(
            parent=root,
            lft=starting_node_left,
            rght=starting_node_left + 1,
            tree_id=1,
            level=1,
            name=category_name,
            slug=slugify(category_name),
        )
        starting_node_left += 2
    

class Migration(migrations.Migration):

    dependencies = [("misago_categories", "0001_initial")]

    operations = [migrations.RunPython(create_default_categories_tree)]
